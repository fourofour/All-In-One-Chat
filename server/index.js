var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)

let clients = []
let rooms = [
  {
    name: 'global'
  }
]

io.on('connection', function(socket) {
  clients.push({
    id: socket.id
  })

  console.log('a user connected')

  /*
  * user
  *   {
  *     username: username (String)
  *   }
  * */
  socket.on('NewUser', function(user) {
    clients.forEach(function (currentValue, index, array) {
      if (currentValue.id === socket.id) {
        clients[index].username = user.username

        user.target = {
          id: clients[index].id
        }

        io.emit('NewUser', user)

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

  /*
  * room
  *   {
  *     name: name (String)
  *   }
  *
  * */
  socket.on('AddRoom', function(room) {
    let exist = false

    rooms.forEach(function (currentValue, index, array) {
      if (currentValue.name === room.name) {
        exist = true
      }
    })

    if (!exist) {
      rooms.push(room)

      io.emit('AddRoom', {
        type: 'rooms',
        room: room
      })
    } else {
      io.emit(socket.id, {
        type: 'AddRoom',
        value: false
      })
    }
  })

  /*
  * message
  *  {
  *     type: user | system (String),
  *     id: userId (String),
  *     username: username (String),
  *     message: message (String),
  *     room: roomName (String),
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

      if (message.target && message.target.id === currentValue.id) {
        message.target.username = currentValue.username
      }
    })

    if (message.target) {
      io.emit(message.target.id, message)
      io.emit(message.id, message)
    } else {
      io.emit('AddMessage', message)
    }
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
})

http.listen(3001, function() {
  console.log('listening on *:3001')
})