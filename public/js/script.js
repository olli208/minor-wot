(function () {
	var socket = io();
	var connectedUser = 'RobNooroel';

    var count = 6;
    var counter = setInterval(timer, 1000);
    function timer() {
        var h3 = document.createElement('h3');
        var timerEl = document.querySelector('#timer');
        h3.className = "countdown";

        if(timerEl) {
			count = count-1;
	        if (count <= 0) {
	            clearInterval(counter);
	            return;
	        }
	        timerEl.innerHTML = count + " secs"; // watch for spelling
        }
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

	function restartGame() {
		socket.on('restart game', function() {
			console.log('client restarttttt')
			window.location.href = '/';
		});
	}

	function questionAnswer() {
		socket.on('question answer', function(data) {
			window.location.href = '/game';
		});
	}


	timer();
	challengeButton();
	restartGame();
	questionAnswer();
})();