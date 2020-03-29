const mongojs = require("mongojs");
const db = mongojs('localhost:27017/andromeda', ['accounts','progress','questions','answers']);

const express = require('express');
const exp = express();
const serv = require('http').Server(exp);

const io = require('socket.io').listen(8080)
const socketioJwt = require("socketio-jwt");

//server

exp.get('/',function(req, res){
    res.sendFile(__dirname + '/client/html/login.html');
});

exp.use(express.static(__dirname));
 
serv.listen(8000);
console.log("Server is running, it's gonna get away!");


let SOCKET_LIST = []
let questionTransfer;

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
    });
}

let freesimAccess = function(data,cb){
    db.accounts.find({username:data.username},function(err,res){
        if(res[0].freesim==true){
            cb(true)
        }
        else{
            cb(false)
        }
    });
}

let isAdmin = function(data,cb){
    db.accounts.find({username:data.username},function(err,res){
        if(res[0].admin==true){
            cb(true)
        }
        else{
            cb(false)
        }
    });
}

let correctTutorial = function(data,cb){
    db.progress.find({username:data.username},function(err,res){
        if(res[0].completed<=data.completed){
            cb(true)
        }
        else{
            cb(false)
        }
    });
}

let getQuestions = function(){
    db.questions.find(function(res){
        questionTransfer=res
    })
}

let addQuestions = function(data,cb){
    db.questions.insert({question1:data.question1,question2:data.question2,question3:data.question3,question4:data.question4,question5:data.question5,question6:data.question6,question7:data.question7,question8:data.question8,question9:data.question9,question10:data.question10},function(res){
        cb()
    })
    db.answers.insert({question1:data.question1,question2:data.question2,question3:data.question3,question4:data.question4,question5:data.question5,question6:data.question6,question7:data.question7,question8:data.question8,question9:data.question9,question10:data.question10},function(res){
        cb()
    })
}

let submitAnswers = function(data,cb){
    db.answers.find({question1:data.question1,question2:data.question2,question3:data.question3,question4:data.question4,question5:data.question5,question6:data.question6,question7:data.question7,question8:data.question8,question9:data.question9,question10:data.question10},function(res){
        if(res.length > 0){
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

    socket.on('tutorialvalidate',function(data){
        correctTutorial({username:socket.decoded_token.username,completed:data},function(res){
            if(res){
                socket.emit('correcttutorial',{correct:true})
            }
            else{
                socket.emit('correcttutorial',{correct:false})
            }
        })
    })

    socket.on('receivequestions',function(data){
        getQuestions()
        console.log(questionTransfer)
    })

    socket.on('addquestions',function(data){
        addQuestions({question1:data.question1,question2:data.question2,question3:data.question3,question4:data.question4,question5:data.question5,question6:data.question6,question7:data.question7,question8:data.question8,question9:data.question9,question10:data.question10},function(res){
            if(res){
                console.log('Added question set')
            }
            else{
                console.log('Failed to add question set')
            }
        })
    })
  
    socket.on('submitanswers',function(data){
        submitAnswers({question1:data.question1,question2:data.question2,question3:data.question3,question4:data.question4,question5:data.question5,question6:data.question6,question7:data.question7,question8:data.question8,question9:data.question9,question10:data.question10},function(res){
            if(res){
                socket.emit('answerresponse',{correct:true})
            }
            else{
                socket.emit('answerresponse',{correct:false})
            }
        })
    })

     
});
