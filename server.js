var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var request = require('request');
var session = require('express-session');
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

// use session
app.use(session({
  secret: "sessionsecret",
  resave: false,
  saveUninitialized: true
}));

var users = [
    {
        name: 'NooroelDylan',
        button1: '8548', // Button id Rob
        button2: 'FFA3', // Button id Nooroel
        highscore: 23
    },
    {
        name: 'OliverRob',
        button1: '0197', // Button id Oliver
        button2: '04b7', // Button id Dylan
        highscore: 33
    }
];

var countdown;
var rightBox;

var highscores = [
    {
        name: 'NooroelDylan',
        highscore: 29
    },
    {
        name: 'OliverRob',
        highscore: 23    
    }
];

// route home page
app.get('/', function(req, res) {

    res.render('index');
});

app.get('/game', function(req, res) {
    // reset socket.io countdown
    clearInterval(countdown);

    var boxColor = htmlColor.random();  // send to box
    var textColor = htmlColor.random(); // Text color the user sees
    var otherColor = htmlColor.random(); // Send to other box

    if(Math.round(Math.random())) {
        rightBox = users[0].button2;
        sendColorToButton(users[0].button1, toHex(otherColor));
        sendColorToButton(users[0].button2, toHex(boxColor));
    } else {
        rightBox = users[0].button1;
        sendColorToButton(users[0].button1, toHex(boxColor));
        sendColorToButton(users[0].button2, toHex(otherColor));
    }

    res.render('game', {
        colors: boxColor,
        textcolor: textColor
    });
});

// Dont know where to put this thing yet..
io.on('connection', function(socket) {
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
    res.locals.session = req.session;
    res.locals.req = req;

    res.render('login', {
        postUrl: '/login'
    })
});

app.post('/login', function(req, res) {
    var username = req.body.username;

    users.forEach(function(user) {
        if(user.name == username) {
            req.session.username = user.name;
            req.session.button1 = user.button1;
            req.session.button2 = user.button2;
        }
    });

    if(!req.session.username) {
        res.send('wrong username')
    } else {
        res.redirect('/');
    }
});

app.get('/sendAnswer', function(req, res) {
    console.log('rightbox ' + rightBox)
    console.log('queryid ' + req.query.id)
    if(req.query.id == rightBox) {
        console.log('right')
    } else {
        console.log('wrong')
    }
});

app.get('/highscore', function(req, res) {
    res.render('highscore', {
        highscore: users
    })
});

http.listen(process.env.PORT || 5000, function (){
    console.log('server is running: on 5000');
});