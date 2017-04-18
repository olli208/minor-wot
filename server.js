var path = require('path');
var express = require('express');
var request = require('request');

// users
var users = ['','',''];

// set up express
var app = express();

// set up views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Set Static Path
app.use(express.static(path.join(__dirname, './public')));

//
app.get('/', function (req, res) {
  request('http://www.colr.org/json/color/random', function (error, response, body) {
    var data = JSON.parse(body)
    res.render('index.ejs', {color: data})
  });
})

var server = app.listen(3000,function(){
	console.log('Server Started on Port 3000');
});
