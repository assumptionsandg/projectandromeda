var express = require('express');
var exp = express();
var serv = require('http').Server(exp);

//server

exp.get('/',function(req, res) {
    res.sendFile(__dirname + '/login.html');
});
exp.use(express.static(__dirname));
 
serv.listen(8000);
console.log("Server is running, it's gonna get away!");