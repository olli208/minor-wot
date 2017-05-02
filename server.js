var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var request = require('request');
var toHex = require('colornames');
var htmlColor = require('html-colors');
var io = require('socket.io');
var http = require('http');

// socket.io
http = http.createServer(app);
io = io(http);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Set static files as CSS and JS
app.use(express.static('public'));

var users = [
    {
        name: 'NooroelDylan',
        button1: '8548', // Button id Rob
        button2: 'FFA3' // Button id Nooroel
    },
    {
        name: 'OliverRob',
        button1: '0197', // Button id Oliver
        button2: '04b7' // Button id Dylan
    }
];

// socket.io countdown
var countdown;

var highscores = [
    {
        name: '0197',
        highscore: 29
    },
    {
        name: '04b7',
        highscore: 23    
    },
    {
        name: 'FFA3',
        highscore: 49
    }
];

// route home page
app.get('/', function(req, res) {
    // reset socket.io countdown
    clearInterval(countdown);

    var boxColor = htmlColor.random();  // send to box
    var textColor = htmlColor.random(); // Text color the user sees
    var otherColor = htmlColor.random(); // Send to other box

    if(Math.round(Math.random())) {
        sendColorToButton(users[1].button1, toHex(otherColor));
        sendColorToButton(users[1].button2, toHex(boxColor));
    } else {
        sendColorToButton(users[1].button1, toHex(boxColor));
        sendColorToButton(users[1].button2, toHex(otherColor));
    }

    res.render('index', {
        colors: boxColor,
        textcolor: textColor
    });
});

// Dont know where to put this thing yet..
io.on('connection', function(socket){
    var counter = 5;
    countdown = setInterval(function(){
        counter--;
        io.sockets.emit('counter', counter);
        if (counter === 0) {
            io.sockets.emit('counter', "time's up!");
            clearInterval(countdown);
        }
    }, 1000);

    socket.on('challenge player', function(data) {
        users.forEach(function(user){
            if(user.name == data.challengedUser) {
                console.log(user.button1)
                sendColorToButton(user.button1, '#f4f142');
                sendColorToButton(user.button2, '#f4f142');
            }
        });
    });
});

function sendColorToButton(buttonId, color) {
    request({
        uri: `http://oege.ie.hva.nl/~palr001/icu/api.php`,
        qs: {
            t: 'sdc',
            d: buttonId,
            td: buttonId,
            c: color
        }
    });
}

app.get('/login', function(req, res) {
    res.render('login', {
        users: users
    })
});

app.get('/sendAnswer', function(req, res) {
    console.log(req.query.id)
});

app.get('/highscore', function(req, res) {
    res.render('highscore', {
        highscore: highscores
    })
});

http.listen(process.env.PORT || 5000, function (){
    console.log('server is running: on 5000');
});