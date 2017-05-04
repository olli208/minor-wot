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

// Require routes
// var users = require('./routes/users');

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
        name: 'RobNooroel',
        button1: '8548', // Button id Rob
        button2: 'FFA3', // Button id Nooroel
        highscore: 23,
        score: 0
    },
    {
        name: 'OliverDylan',
        button1: '0197', // Button id Oliver
        button2: '04b7', // Button id Dylan
        highscore: 33,
        score: 0
    }
];

var countdown;
var rightBox;

// Dont know where to put this thing yet..
io.on('connection', function(socket) {
    var counter = 5;
    countdown = setInterval(function() {
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

// app.use('/users', users);

// route home page
app.get('/', function(req, res) {
    if(req.session.username) {
        res.render('index');
    } else {
        res.redirect('/login');
    }
});

app.get('/game', function(req, res) {
    if(req.query.previousAnswer) {
        console.log('rightrightright', req.session)
    }

    // reset socket.io countdown
    clearInterval(countdown);

    var boxColor = htmlColor.random();  // send to box
    var textColor = htmlColor.random(); // Text color the user sees
    var otherColor = htmlColor.random(); // Send to other box

    if(Math.round(Math.random())) {
        rightBox = users[1].button2;
        sendColorToButton(users[1].button1, toHex(otherColor));
        sendColorToButton(users[1].button2, toHex(boxColor));
    } else {
        rightBox = users[1].button1;
        sendColorToButton(users[1].button1, toHex(boxColor));
        sendColorToButton(users[1].button2, toHex(otherColor));
    }

    if(req.session.username) {
       res.render('game', {
            colors: boxColor,
            textcolor: textColor
        }); 
    } else {
        res.redirect('/login');
    }
    
});

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
            req.session.score = user.score;
        }
    });

    if(!req.session.username) {
        res.send('wrong username')
    } else {
        res.redirect('/');
    }
});

app.get('/sendAnswer', function(req, res) {

    console.log(rightBox.toLowerCase() )
    console.log(req.query.id.toLowerCase()  + ' idd')
    if(req.query.id.toLowerCase() == rightBox.toLowerCase() ) {
        console.log('right')
        // res.redirect(req.get('referer') + '?previousAnswer=right');
    } else {
        console.log('wrong')
        // res.redirect(req.get('referer')  + '?previousAnswer=wrong');
    }
});

app.get('/highscore', function(req, res) {
    res.render('highscore', {
        highscore: users
    })
});

app.get('/users/ranking', function(req, res) {
    if(req.session.username) {
       res.render('ranking'); 
    } else {
        res.redirect('/login');
    }
});

app.get('/logout', function(req, res) {
    res.locals.req = req;

    res.render('login', {
        postUrl: '/login'
    })
});

app.get('/users/controller', function(req, res) {
    if(req.session.username) {
       res.render('controller'); 
    } else {
        res.redirect('/login');
    }
});

// Olivers code toegevoegd:
app.get('/restart', function(req, res) {
    // When sensor/box is put sideways go to this route
    console.log('restarting game...')
    res.redirect('index');
});

http.listen(process.env.PORT || 5000, function (){
    console.log('server is running: on 5000');
});