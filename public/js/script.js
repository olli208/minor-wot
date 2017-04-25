// function timer() {
//   count = count-1;
//   if (count <= 0) {
//      clearInterval(counter);
//      return;
//   }
//   document.querySelector("#timer").innerHTML = count + " secs"; // watch for spelling
// }

// http://stackoverflow.com/questions/1191865/code-for-a-simple-javascript-countdown-timer
var socket = io();

socket.on('counter', function(count){
    var h3 = document.createElement('h3');
    h3.className = "countdown";

    document.getElementById("timer").innerHTML = count;
});