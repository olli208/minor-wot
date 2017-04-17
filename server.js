// Deployed on now webpage: https://real-time-web-jvbrypsilf.now.sh !!

var express = require('express');
var app = express();
var path = require('path');

var bodyParser = require('body-parser');
var request = require('request');

var host = 'https://oege.ie.hva.nl/~palr001/icu/';

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.listen(process.env.PORT || 5000, function (){
    console.log('server is running: on 5000');
});

app.use(express.static(path.join(__dirname, 'static')));

app.get('/', function(req, res) {
    request(host +  "api.php?t=sdc&d=T111&td=T222&c=ff0000", function (error, response, body) {
        var id = ['0197'];
        if(!error && response.statusCode === 200) {
            data = JSON.parse(body);
            console.log('hey data' + data);
            // res.render('index', {
            //     data: data
            // });
        }
    });
    res.sendFile(__dirname + '/index.html');
});
