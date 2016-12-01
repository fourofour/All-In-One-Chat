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
    let option = {
      label: config.onlines.get(socket.id),
      message: message,
      id: socket.id
    }

    io.emit('new:message', option);
  });

  socket.on('register:username', function(username) {
    config.onlines.set(socket.id, username);

    let data = {
      username,
      id: socket.id
    }

    io.to(socket.id).emit('register:username', data);

    // Need to send socket.id for poke, just for now
    // let list = [...config.onlines];
    
    // list = list.map(function(currentValue, index, array) {
    //   return currentValue[1];
    // });

    // io.emit('update:list', list);

    io.emit('update:list', [...config.onlines]);
  });

  socket.on('new:poke', function(data) {
    if(socket.id !== data.id) { // to prevent poking themself
      let username = config.onlines.get(socket.id),
          targetUsername = config.onlines.get(data.id);

      let option = {
        label: username,
        id: socket.id
      };

      let option2 = {
        code: 1,
        message: 'You poked ' + targetUsername
      };

      if(targetUsername === data.username) { // make sure about the information
        io.to(data.id).emit('new:poke', option)
        io.to(socket.id).emit('new:message', option2);
      }
    }
  });
});

http.listen(3000 , function() {
  console.log('listening on *.3000');
});
