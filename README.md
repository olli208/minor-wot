# Web Of Things - Minor Webdevelopment
Mindf*ck Colorgame - Dylan van Sprang | Nooroel Imamdi | Oliver Oenang | Rob van der Pas

## Idee

![image](https://s-media-cache-ak0.pinimg.com/564x/b3/e0/5c/b3e05c9a200edac39db36ac45950a73b.jpg)

Webdevelopers kunnen tussen het werk door elkaar onderling uitdagen op de werkvloer met de Mindf*ck colorgame, met als voornaamste doel tussen het werk door ontspanning te zoeken.

De Mindf*ck colorgame betreft een spel waarbij de juiste kleur bij het desbetreffende woord geraden moet worden binnen een x aantal seconden. De gebruiker kan zijn keuze uitbrengen door op één van twee lichtknoppen, die beiden een kleur krijgen, te drukken waarvan hij denkt dat het de bijhorende kleur is. Deze challenge wordt uiteindelijk opgenomen in een ranking onder de werknemers binnen een bedrijf. De resultaten worden uiteindelijk getoond in een klassement onder de werknemers.

- [Eerste uitwerking](http://imamovicdesign.com/minor/wot/red.html)

### Doel
Het doel van de toepassing is om werknemers (developers) op de werkvloer tussendoor een korte break te gunnen om even te ontspannen, zonder dat zij gestoord worden binnen hun werkzaamheden.

## Schema communicatie gebruikers
![image](https://github.com/nooroel-imamdi/minor-wot/blob/master/docs/diagram-stappenplan-gebruikers.png?raw=true)

### Stappen
- Gebruiker A kan een gebruiker uitnodigen voor een challenge via het dashboard.
- Gebruiker B ontvangt uitnodiging via een gele lichtsignaal van de knop.
- Gebruiker B accepteert de challenge door op de knop te drukken en kan weigeren door de knop te schudden.
- Gebruiker A en gebruiker B ontvangen een bevestiging in het dashboard.
- Vervolgens kunnen zij het spel, afzonderlijk van elkaar, starten in het dashboard.
- Na afloop verschijnt een overzicht met de score die behaald is.
- Indien beiden gebruikers het spel hebben gespeeld, worden beiden op de hoogte gesteld van de definitieve uitkomst met een lichtsignaal op de knop en een notificatie vanuit het dashboard.


## Ontwerpproces

### 1. Situatieschets

*Omgeving kantoorruimte (context)*
- Bureau
- Laptop
- Computerscherm
- Toetsenbord
- Muis

![image](https://github.com/nooroel-imamdi/minor-wot/blob/master/docs/desktop-freepik.png?raw=true)

[Freepik](http://www.freepik.com/free-photos-vectors/business)

### 2. Meten is weten / Waarom ontwerpen wij dit

Het *Centraal Bureau voor de Statistiek (CBS)* komt met een rapportage dat “mensen die met stress op het werk te maken hebben, aangeven vaker last te hebben van depressiviteit of angstgevoelens.”

[CBS bron](https://www.cbs.nl/nl-nl/nieuws/2004/04/depressiviteit-en-stress-op-het-werk)

Probleem: Stress zorgt voor depressiviteit en angstgevoelens.
Bijdragende oplossing: Ontspanning tussen het werk door

### 3. Binnen handbereik
Om aan dit spel deel te nemen, moet een gebruiker beschikken over het volgende:
- Webbrowser (dashboard)
- Lichtknoppen

#### Webbrowser (dashboard)
Aangezien webdevelopers op het werk continue achter een computer werken, is een webbrowser voor hen binnen handbereik. Via de webbrowser kunnen ze inloggen op het dashboard van Mindf*ck colorgame. Op het dashboard staan alle leden van het team, een ranking en openstaande uitdagingen. Voor de gebruikers is het mogelijk om vanuit het dashboard een challenge uit te vaardigen naar een collega.

##### Mindf*ck colorgame Dashboard
![image](https://github.com/nooroel-imamdi/minor-wot/blob/master/docs/dashboard-home.jpg?raw=true)
*Home*

![image](https://github.com/nooroel-imamdi/minor-wot/blob/master/docs/dashboard-controller.jpg?raw=true)
*Ranking*

![image](https://github.com/nooroel-imamdi/minor-wot/blob/master/docs/dashboard-ranking.jpg?raw=true)
*Controller*

##### Lichtknoppen
De lichtknop (twee knoppen) wordt gebruikt om de juiste kleur te kiezen. Deze staat op de bureau van de gebruiker en kan elk moment erbij gepakt worden.

### 4. Meldingen
- Lichtsignalen
- Notificaties

#### Lichtsignalen
Door middel van een geel lichtsignaal wordt een challenge gecommuniceerd naar de ontvanger van de uitdaging. Zijn lichtknop zal dan geel kleuren.

#### Notificaties
Uitdagingen zullen ook getoond worden via het dashboard, door middel van push-meldingen. Bovendien zal er ook een pushmelding verschijnen als de uitslag van een bepaalde ‘wedstrijd’ bekend is.

### 5. De knoppen (controllers)
Elke gebruiker krijgt twee knoppen. Deze zullen elk een andere kleur krijgen en is het aan de gebruiker om de juiste kleur te kiezen. Verder kan de gebruiker het spel herstarten door de knop te kantelen. Die mogelijkheid wordt de gebruiker in het dashboard kenbaar gemaakt middels de volgende instructie:

![image](https://github.com/olli208/minor-wot/blob/master/docs/box-tilt.gif?raw=true)

### 6. Styleguide
![image](https://github.com/nooroel-imamdi/minor-wot/blob/master/docs/styleguide.png?raw=true)

## Techniek

![image](https://github.com/nooroel-imamdi/minor-wot/blob/master/docs/schema_werking.png?raw=true)
*Schematische tekening werking*

### Serverside
Colr api wordt gebruikt om random kleuren te genereren en naar de dozen te sturen.

### Feedbackloop
De gebruiker speelt het spel, krijgt een score terug en krijgt vervolgens de optie om zijn score per dag te verbeteren en doorloopt daardoor de feedbackloop

### Sensoren die wij gebruiken
Dit product maakt gebruik van een TiltSensor.

![image](https://github.com/olli208/minor-wot/blob/master/docs/tilt-sensor.jpg?raw=true)

*The tilt sensor is a component that can detect the tilting of an object. However it is only the equivalent to a pushbutton activated through a different physical mechanism. This type of sensor is the environmental-friendly version of a mercury-switch. It contains a metallic ball inside that will commute the two pins of the device from on to off and viceversa if the sensor reaches a certain angle.*

[Arduino](https://www.arduino.cc/en/Tutorial/TiltSensor)

Met de TiltSensor wordt het mogelijk gemaakt om het spel te herstarten. De gebruiker kan dit doen door de knop te kantelen.

## Wishlist
- [ ] Uitbreiden naar andere soortgelijke games voor developers met hetzelfde concept
- [ ] Random een collega uitdagen
- [ ] Knop vormgeven naar interieur kantoor

## Sources
- [colr api](http://www.colr.org/api.html)
