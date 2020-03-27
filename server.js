const mongojs = require("mongojs");
const db = mongojs('localhost:27017/andromeda', ['accounts','progress']);

const express = require('express');
const exp = express();
const serv = require('http').Server(exp);

const io = require('socket.io').listen(8080)
const socketioJwt = require("socketio-jwt");

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
        else{
            cb(false);
        }
    });
}

let isUsernameTaken = function(data,cb){
    db.accounts.find({username:data.username},function(err,res){
        if(res.length > 0){
            cb(true);
        }
        else{
            cb(false);
        }
    });
}

let addUser = function(data,cb){
    db.accounts.insert({username:data.username,password:data.password,freesim:false,admin:false},function(err){
        cb();
    });
    db.progress.insert({username:data.username,completed:0},function(err){
        cb();
    });
}

let updateProgress = function(data,cb){
    db.progress.find({username:data.username},function(err,res){
        if(res[0].completed<data.completed){
            db.progress.update({username:data.username},{$set:{completed:data.completed}},{multi:true},function(err){
                cb();
            });
        }
    })
}

let freesimAccess = function(data,cb){
    db.accounts.find({username:data.username},function(err,res){
        if(res[0].freesim==true){
            cb(true)
        }
        else{
            cb(false)
        }
    })
}

let isAdmin = function(data,cb){
    db.accounts.find({username:data.username},function(err,res){
        if(res[0].admin==true){
            cb(true)
        }
        else{
            cb(false)
        }
    })
}

io.use(socketioJwt.authorize({
    secret: 'totally_not_an_unsecure_connection',
    handshake: true,
}));

io.on('connection', function(socket){
    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;
        
    if(socket.decoded_token.signup!=true){
        console.log('authenticated '+socket.decoded_token.username);

        isValidPassword({username:socket.decoded_token.username,password:socket.decoded_token.password},function(res){
            if(res){
                socket.emit('signInResponse',{success:true});
                console.log(socket.decoded_token.username+' connection accepted!')
            }
            else{
                socket.emit('signInResponse',{success:false});
                delete SOCKET_LIST[socket.id]
                console.log(socket.decoded_token.username+' connection rejected!')
            }
        })

      
        
        /*
        socket.on('disconnect',function(){
            delete SOCKET_LIST[socket.id];
        });
    
        socket.on('evalServer',function(data){
            if(!DEBUG)
                return;
            let res = eval(data);
            socket.emit('evalAnswer',res);     
        });
        */
    }

    else{
        isUsernameTaken({username:socket.decoded_token.username,password:socket.decoded_token.password},function(res){
            if(res){
                socket.emit('signUpResponse',{success:false});
            }
            else{
                addUser({username:socket.decoded_token.username,password:socket.decoded_token.password},function(){
                    socket.emit('signUpResponse',{success:true});
                })
            }
        })

    }

    socket.on('checkfreesim',function(){
        freesimAccess({username:socket.decoded_token.username},function(res){
            if(res){
                socket.emit('isfreesim',{isfreesim:true})
            }
            else{
                socket.emit('isfreesim',{isfreesim:false})
            }
        })
    })

    socket.on('checkadmin',function(){
        isAdmin({username:socket.decoded_token.username},function(res){
            if(res){
                socket.emit('isadmin',{isadmin:true})
            }
            else{
                socket.emit('isadmin',{isadmin:false})
            }
        })
    })

    socket.on('tutorial',function(data){
        updateProgress({username:socket.decoded_token.username,completed:data},function(){
            console.log(socket.decoded_token.username+' completed tutorial: '+data)
        })
    })

  
   

     
});

