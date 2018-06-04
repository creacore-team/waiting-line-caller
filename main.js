import { Server, get } from "http";
import { address } from "ip";
import googleTTS from "google-tts-api";

var app = require('express')();
var server = Server(app);
var io = require('socket.io')(server);

/**
 * Local vars
 */
var speak_lang = 'en';
var sentences_callNext = [
    "Your attention please. The number %counter%, can come to %where%",
    "Thank you for waiting for number %counter%. Please go to %where%"
];

var counter = 0;
var users = [];

/**
 * Initialization
 */
server.listen(8080);
console.log("Client adress: http://"+address()+":8080/client");
console.log("Counter viewer: http://"+address()+":8080/vue");

/**
 * Routes
 */
app.get('/client', function(req, res) {
    res.render('client.ejs', {
        'server_ip': address()
    });
});

app.get('/vue', function(req, res) {
    res.render('vue.ejs', {
        'server_ip': address()
    });
});

/**
 * Event
 */
io.on('connection', function(socket) {

    function sendCounterUpdate(broadcast, username) {
        var data = {
            'user': username,
            'value': counter
        };
        if(broadcast) {
            socket.broadcast.emit('counterUpdated', data);
        }
        socket.emit('counterUpdated', data);
    }

    function sayRandomSentence()
    {
        var randomSentence = sentences_callNext[Math.floor(Math.random() * sentences_callNext.length)];
        randomSentence = randomSentence.replace("%counter%", counter);
        randomSentence = randomSentence.replace("%where%", users[socket.id]);
        googleTTS(randomSentence, speak_lang, 1.2).then(function(url) {
            socket.broadcast.emit('tts', url);
        });
    }

    socket.on('login', function (username) {
        console.log(username + " connected");
        users[socket.id] = username;
        socket.emit('loginOk');
        sendCounterUpdate(false, 0);
    });

    socket.on('callNext', function () {
        counter++;
        sendCounterUpdate(true, users[socket.id]);
        sayRandomSentence();
    });

    socket.on('setCounter', function (value) {
        counter = value;
        sendCounterUpdate(true, users[socket.id]);
        sayRandomSentence();
    });
});