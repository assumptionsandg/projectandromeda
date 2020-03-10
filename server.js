var mongojs = require("mongojs");
//var db = mongojs('localhost:27017/projectUltra', ['account','progress']);

var express = require('express');
var exp = express();
var serv = require('http').Server(exp);

var io = require('socket.io').listen(8080); 

//server

exp.get('/',function(req, res) {
    res.sendFile(__dirname + '/login.html');
});
exp.use('/client',express.static(__dirname + '/client'));
 
serv.listen(8000);
console.log("Server is running, it's gonna get away!");