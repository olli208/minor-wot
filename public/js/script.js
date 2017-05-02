(function () {
	var socket = io();
	var connectedUser = 'NooroelDylan';

	function counter() {
		socket.on('counter', function(count){
		    var h3 = document.createElement('h3');
		    var timerEl = document.querySelector('#timer');
		    h3.className = "countdown";

		    if(timerEl) {
		    	timerEl.innerHTML = count;
		    }
		});
	}

	function challengeButton() {
		var challengeButtonEl = document.querySelectorAll('.btn-challenge');

		challengeButtonEl.forEach(function(el) {
			el.addEventListener('click', function() {
				var challengedUser = el.getAttribute('data-user');
				socket.emit('challenge player', { challenger: connectedUser, challengedUser: challengedUser});
			});
		});
	}

	counter();
	challengeButton()
})();