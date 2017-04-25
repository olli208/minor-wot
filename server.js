var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var request = require('request');

// rndom color api
var toHex = require('randomcolor');
var htmlColor = require('html-colors');

// users [Oliver, Dylan, Nooroel]
var users = ['0197', '04b7', 'FFA3'];

var colr = 'http://www.colr.org/json/color/random';
var host = users[1];
var target = users[1];

var randomColors = [];
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
    var random = htmlColor.random();
    console.log(random, toHex(random));
    request({
        uri: `http://oege.ie.hva.nl/~palr001/icu/api.php`,
        qs: {
            t: 'rdc',
            t: 'sdc',
            d: users[1],
            td: users[1],
            c: '#000099'
        }
    });
    newColor(res);
});

function newColor(res) {
    request(colr, function (error, response, data) {
        if(!error && response.statusCode === 200) {
            color = JSON.parse(data);
            randomColors.push(color.new_color);
            res.render('index', {
                colors: randomColors,
                color: color.new_color
            });
        }
    });
    console.log(color);
}

app.get('/begin', function(req, res) {
    request({
        uri: `http://oege.ie.hva.nl/~palr001/icu/api.php`,
        qs: {
            t: 'sqi',
            d: users[1]
        }
    });
});

app.get('/color', function(req, res) {
    console.log(req.query.id)
});

app.get('/highscore', function(req, res) {
    res.render('highscore', {
        highscore: highscores
    })
});

app.listen(process.env.PORT || 5000, function (){
    console.log('server is running: on 5000');
});