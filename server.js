var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var request = require('request');

// users [Oliver, Dylan, Nooroel]
var users = ['0197', '04b7', 'FFA3'];

var colr = 'http://www.colr.org/json/color/random';
var host = users[1];
var target = users[1];

var randomColors = [];

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));

app.get('/', function(req, res) {
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

    request(colr, function (error, response, data) {
        if(!error && response.statusCode === 200) {
            color = JSON.parse(data);
            randomColors.push(color.new_color);
            res.render('index', {
                colors: randomColors
            });
        }
    })
});

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

app.listen(process.env.PORT || 5000, function (){
    console.log('server is running: on 5000');
});