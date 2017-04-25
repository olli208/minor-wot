var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var request = require('request');
var toHex = require('colornames');
var htmlColor = require('html-colors');

// socket.io things
var http = require('http').createServer(app);
var io = require('socket.io').listen(http);

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

var host = users[3];
var target = users[3];

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

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Set static files as CSS and JS
app.use(express.static('public'));

// route home page
app.get('/', function(req, res) {
    // reset socket.io countdown
    clearInterval(countdown);

    var goodAnswer = htmlColor.random();  // send to box
    var wrongAnswer = htmlColor.random(); // Text color the user sees
    var randomcolor = htmlColor.random(); // Send to other box

    if (!toHex(goodAnswer)) {
        console.log('goodAnswer undefined kleur, dus: '  + htmlColor.random());
        goodAnswer = htmlColor.random();
    }

    if (!toHex(wrongAnswer)) {
        console.log(' wrongAnswer undefined kleur, dus: '  + htmlColor.random());
        wrongAnswer = htmlColor.random();
    }

    if (!toHex(randomcolor)) {
        console.log('randomcolor undefined kleur, dus: '  + htmlColor.random());
        randomcolor = htmlColor.random();
    }

    if(Math.round(Math.random())) {
        sendColorToButton(users[0].button1, toHex(randomcolor));
        sendColorToButton(users[0].button2, toHex(goodAnswer));
    } else {
        sendColorToButton(users[0].button1, toHex(goodAnswer));
        sendColorToButton(users[0].button2, toHex(randomcolor));
    }

    res.render('index', {
        colors: goodAnswer,
        textcolor: wrongAnswer
    });
});

// Dont know where to put this thing yet..
io.on('connection', function(socket){
    var counter = 5;
    countdown = setInterval(function(){
        counter--;
        io.sockets.emit('counter', counter);
        if (counter == 0) {
            io.sockets.emit('counter', "time's up!");
            clearInterval(countdown);
        }
    }, 1000);
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

app.get('/begin', function(req, res) {
    request({
        uri: `http://oege.ie.hva.nl/~palr001/icu/api.php`,
        qs: {
            t: 'rdc',
            d: '8548',
            td: '8548'
        }
    });
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