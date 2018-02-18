var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)

let clients = []

io.on('connection', function(socket) {
  clients.push({
    id: socket.id
  })

  console.log('a user connected')

  /*
  * message
  *   {
  *     username: username (String)
  *   }
  * */
  socket.on('NewUser', function(message) {
    clients.forEach(function (currentValue, index, array) {
      if (currentValue.id === socket.id) {
        clients[index].username = message.username

        message.target = {
          id: clients[index].id
        }

        io.emit('NewUser', message)

        io.emit('AddMessage', {
          type: 'system',
          message: clients[index].username + ' joined the chat'
        })

        io.emit(socket.id, {
          type: 'system',
          message: 'Welcome ' + clients[index].username
        })

        io.emit('AddUser', {
          username: clients[index].username,
          id: clients[index].id
        })
      }
    })
  })

  socket.on('disconnect', function() {
    clients.forEach(function (currentValue, index, array) {
      if (currentValue.id === socket.id) {
        console.log(currentValue.username + ' disconnected')

        io.emit('RemoveUser', {
          username: clients[index].username,
          id: clients[index].id
        })

        io.emit('AddMessage', {
          type: 'system',
          message: clients[index].username + ' left the chat'
        })

        clients.splice(index, 1)
      }
    })
  })

  /*
  * message
  *  {
  *     type: user | system (String),
  *     id: userId (String),
  *     username: username (String),
  *     message: message (String),
  *     target: {
  *       id: userId (String),
  *       username: username (String)
  *     }
  *  }
  *
  * */

  socket.on('NewMessage', function(message) {
    clients.forEach(function (currentValue, index, array) {
      if (currentValue.id === socket.id) {
        message.username = currentValue.username
        message.id = currentValue.id
      }
    })

    if (message.target) {
      io.emit(message.target.id, message)
    } else {
      io.emit('AddMessage', message)
    }

  })
})

http.listen(3001, function() {
  console.log('listening on *:3001')
})