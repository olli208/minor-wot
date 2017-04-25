var count = 5;
var counter = setInterval(timer, 1000);

function timer() {
  count = count-1;
  if (count <= 0) {
     clearInterval(counter);
     return;
  }
  document.querySelector("#timer").innerHTML = count + " secs"; // watch for spelling
}

// http://stackoverflow.com/questions/1191865/code-for-a-simple-javascript-countdown-timer
