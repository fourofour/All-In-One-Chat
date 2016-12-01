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

    // Need to send socket.id for poke, just for now
    // let list = [...config.onlines];
    
    // list = list.map(function(currentValue, index, array) {
    //   return currentValue[1];
    // });

    // io.emit('update:list', list);

    io.emit('update:list', [...config.onlines]);
  });

  socket.on('new:poke', function(data) {
    if(socket.id !== data.target.id) { // to prevent poking themself
      let username = config.onlines.get(socket.id),
          targetUsername = config.onlines.get(data.target.id);

      let info = {
        username,
        id: socket.id
      };

      let confirm = {
        username,
        message: ' You poked ' + targetUsername
      };

      if(username === data.username && targetUsername === data.target.username) {
        io.to(data.target.id).emit('new:poke', info)
        io.to(socket.id).emit('new:message', confirm);
      }
    }
  });
});

http.listen(3000 , function() {
  console.log('listening on *.3000');
});
