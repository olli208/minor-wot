#include <OpenWiFi.h>

#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <WiFiManager.h>

#include "SpringyValue.h"
#include "config.h"
#include "WS2812_util.h"

int oldTime = 0;
int oscillationTime = 250;
String chipID;
String serverURL = SERVER_URL;
OpenWiFi hotspot;

void printDebugMessage(String message) {
#ifdef DEBUG_MODE
  Serial.println(String(PROJECT_SHORT_NAME) + ": " + message);
#endif
}

    const int tiltPin = D3; // the number of the tilt switch pin
//const int ledPin = 0; the number of the LED pin
// variables will change:
  int tiltState = 0; // variable for reading the tilt switch status

void setup()
{
  // initialize the LED pin as an output:
//  pinMode(BUTTONLOW_PIN, OUTPUT); 
  // initialize the tilt switch pin as an input:
  pinMode(tiltPin, INPUT);
  
  pinMode(BUTTONLOW_PIN, OUTPUT);

  digitalWrite(BUTTONLOW_PIN, LOW);

  Serial.begin(115200); Serial.println("");
  strip.begin();
  strip.setBrightness(255);
  setAllPixels(0, 255, 255, 1.0);

  WiFiManager wifiManager;
  int counter = 0;

  pinMode(BUTTON_PIN, INPUT_PULLUP);

  while (digitalRead(BUTTON_PIN) == LOW)
  {
    counter++;
    delay(10);

    if (counter > 500)
    {
      wifiManager.resetSettings();
      printDebugMessage("Remove all wifi settings!");
      setAllPixels(255, 0, 0, 1.0);
      fadeBrightness(255, 0, 0, 1.0);
      ESP.reset();
    }
  }
  hotspot.begin(BACKUP_SSID, BACKUP_PASSWORD);

  chipID = generateChipID();
  printDebugMessage(String("Last 2 bytes of chip ID: ") + chipID);
  String configSSID = String(CONFIG_SSID) + "_" + chipID;

  wifiManager.autoConnect(configSSID.c_str());
  fadeBrightness(0, 255, 255, 1.0);
}

//This method starts an oscillation movement in both the LED and servo
void oscillate(float springConstant, float dampConstant, int c)
{
  SpringyValue spring;

  Serial.print(c);
  byte red = (c >> 16) & 0xff;
  byte green = (c >> 8) & 0xff;
  byte blue = c & 0xff;

  spring.c = springConstant;
  spring.k = dampConstant / 100;
  spring.perturb(255);

  //Start oscillating
  for (int i = 0; i < oscillationTime; i++)
  {
    spring.update(0.01);
    setAllPixels(red, green, blue, abs(spring.x) / 255.0);

    //Check for button press
    if (digitalRead(BUTTON_PIN) == LOW)
    {
      //Fade the current color out
      fadeBrightness(red, green, blue, abs(spring.x) / 255.0);
      return;
    }
    delay(50);
  }
  fadeBrightness(red, green, blue, abs(spring.x) / 255.0);
}

void loop()
{
  // read the state of the tilt switch value:
    tiltState = digitalRead(tiltPin);
    if (tiltState == HIGH) { 
    // turn LED on: 
    digitalWrite(BUTTONLOW_PIN, HIGH); 
//      setAllPixels(0, 0, 0, 0);
    } else {
      if (tiltState == 0)
      {
        digitalWrite(BUTTONLOW_PIN, LOW);
        setAllPixels(255, 0, 0, 1.0);
        printDebugMessage("restarting game");
        delay(100);
      // restart game screen for user or direct to home screen
      HTTPClient http;
      http.begin("http://9e36d4d6.ngrok.io/restart");
      uint16_t httpCode = http.GET();
      http.end();
      } 
    }
  
  //Check for button press
  if (digitalRead(BUTTON_PIN) == LOW)
  {
    sendButtonID();
    delay(250);
  }

  //Every requestDelay, send a request to the server
  if (millis() > oldTime + REQUEST_DELAY)
  {
    requestMessage();
    oldTime = millis();
  }
}

void sendButtonID() {
  printDebugMessage("Sending button press to server");
  HTTPClient http;
  http.begin("http://9e36d4d6.ngrok.io/sendAnswer?id=" + chipID);
  uint16_t httpCode = http.GET();
  http.end();  
}

void getColor()
{
  printDebugMessage("get color");
  HTTPClient http;
  http.begin(serverURL + "/api.php?t=sqi&d=" + chipID);
  uint16_t httpCode = http.GET();
  http.end();
}

void displayColor(int color)
{
  byte red = (color >> 16) & 0xff;
  byte green = (color >> 8) & 0xff;
  byte blue = color & 0xff;

  setAllPixels(red, green, blue);
}

void requestMessage()
{
//Serial.print("requestMessageCalled");

  HTTPClient http;
  String requestString = serverURL + "/api.php?t=gqi&d=" + chipID + "&v=2"; // look up api index, action is 
  http.begin(requestString);
  int httpCode = http.GET();
  
  if (httpCode == 200)
  {
    String response;
    response = http.getString();

    if (response == "-1")
    {
      printDebugMessage("There are no messages waiting in the queue");
    }
    else
    {
      //Get the indexes of some commas, will be used to split strings
      int firstComma = response.indexOf(',');
      int secondComma = response.indexOf(',', firstComma + 1);
      int thirdComma = response.indexOf(',', secondComma + 1);

      //Parse data as strings
      String hexColor = response.substring(0, 7);
      String springConstant = response.substring(firstComma + 1, secondComma);
      String dampConstant = response.substring(secondComma + 1, thirdComma);;
      String message = response.substring(thirdComma + 1, response.length());;

      printDebugMessage("Message received from server: \n");
      printDebugMessage("Hex color received: " + hexColor);
      printDebugMessage("Spring constant received: " + springConstant);
      printDebugMessage("Damp constant received: " + dampConstant);
      printDebugMessage("Message received: " + message);

      //Extract the hex color and fade the led strip
      int number = (int) strtol( &response[1], NULL, 16);
    Serial.println(number);
    
      if (number == 16052546) {
        oscillate(springConstant.toFloat(), dampConstant.toFloat(), number);
         printDebugMessage("challenge");
      } else {
        displayColor(number);
      }
      
//      oscillate(springConstant.toFloat(), dampConstant.toFloat(), number);
    }
  }
  else
  {
    ESP.reset();
  }

  http.end();

  getColor();
}

String generateChipID()
{
  String chipIDString = String(ESP.getChipId() & 0xffff, HEX);

  chipIDString.toUpperCase();
  while (chipIDString.length() < 4)
    chipIDString = String("0") + chipIDString;

  return chipIDString;
}

