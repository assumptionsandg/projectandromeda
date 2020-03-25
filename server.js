const mongojs = require("mongojs");
const db = mongojs('localhost:27017/andromeda', ['accounts','progress']);

const express = require('express');
const session = require('express-session')
const exp = express();
const serv = require('http').Server(exp);

const io = require('socket.io').listen(8080)

//server

exp.get('/',function(req, res){
    res.sendFile(__dirname + '/login.html');
});

exp.use(express.static(__dirname));
 
serv.listen(8000);
console.log("Server is running, it's gonna get away!");


let SOCKET_LIST = []

let isValidPassword = function(data,cb){
    db.accounts.find({username:data.username,password:data.password},function(err,res){
        if(res.length > 0){
            cb(true);
        }
        else
            cb(false);
    });
}

let isUsernameTaken = function(data,cb){
    db.accounts.find({username:data.username},function(err,res){
        if(res.length > 0)
            cb(true);
        else
            cb(false);
    });
}

let addUser = function(data,cb){
    db.accounts.insert({username:data.username,password:data.password},function(err){
        cb();
    });
}

io.on('connection', function(socket){
    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;
    console.log('test')
   
    socket.on('signIn',function(data){
        isValidPassword(data,function(res){
            if(res){
                socket.emit('signInResponse',{success:true});
            } else {
                socket.emit('signInResponse',{success:false});         
            }
        });
    });
    
    socket.on('signUp',function(data){
        isUsernameTaken(data,function(res){
            if(res){
                socket.emit('signUpResponse',{success:false});     
            } else {
                addUser(data,function(){
                    socket.emit('signUpResponse',{success:true});                  
                });
            }
        });    
    });
    
    socket.on('disconnect',function(){
        delete SOCKET_LIST[socket.id];
    });
   
    socket.on('evalServer',function(data){
        if(!DEBUG)
            return;
        let res = eval(data);
        socket.emit('evalAnswer',res);     
    });

     
});

