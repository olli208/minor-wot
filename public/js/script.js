(function () {
	var socket = io();
	var connectedUser = 'NooroelDylan';

	function counter() {
		socket.on('counter', function(count){
		    var h3 = document.createElement('h3');
		    h3.className = "countdown";

		    document.getElementById("timer").innerHTML = count;
		});
	}

	function challengeButton() {
		var challengeButtonEl = document.querySelector('.btn-challenge');

		challengeButtonEl.addEventListener('click', sendChallenge);

		function sendChallenge() {
			var challengedUser = challengeButtonEl.getAttribute('data-user');

			console.log(challengedUser)
			socket.emit('challenge player', { challenger: connectedUser, challengedUser: challengedUser});
		}
		
	}

	counter();
	challengeButton()
})();