// Deployed on now webpage:  !!

var express = require('express');
var app = express();
var path = require('path');

var bodyParser = require('body-parser');
var request = require('request');

var oege = 'https://oege.ie.hva.nl/~palr001/icu';
var host = 'https://oege.ie.hva.nl/~palr001/icu/api.php?t=sdc&d=0197';

var colr = 'http://www.colr.org/json/color/random';

var target = 'FFA3';

var randomColors = [];

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.listen(process.env.PORT || 5000, function (){
    console.log('server is running: on 5000');
});

app.use(express.static(path.join(__dirname, 'static')));

app.get('/', function(req, res) {
    // request(host + '&td=' + target + '&c=' + colr + '&m=HOIIIII', function (error, response, body) {
    request(colr, function (error, response, data) {
         if(!error && response.statusCode === 200) {
            color = JSON.parse(data);
            console.log('output: ' + color.new_color);
            randomColors.push(color.new_color);
            console.log(randomColors);
            // res.render('index', {
            //     data: data
            // });
        }
    })
});
