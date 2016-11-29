'use strict';

let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let config = {
  onlines: new Map()
};

app.use('/static', express.static('app'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/app/index.html');
});

io.on('connection', function(socket) {
  console.log('user connected');

  socket.on('disconnect', function() {
    config.onlines.delete(socket.id);
    console.log('user disconnected');
  });

  socket.on('new:message', function(message) {
    let data = {
      username: config.onlines.get(socket.id),
      message: message
    }

    io.emit('new:message', data);
  });

  socket.on('register:username', function(username) {
    config.onlines.set(socket.id, username);
    io.to(socket.id).emit('register:username', username);
  });
});

http.listen(3000 , function() {
  console.log('listening on *.3000');
});
