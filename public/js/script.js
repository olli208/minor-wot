var socket = io();

socket.on('counter', function(count){
    var h3 = document.createElement('h3');
    h3.className = "countdown";

    document.getElementById("timer").innerHTML = count;
});