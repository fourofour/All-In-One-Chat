/*
* user
*   {
*     username: username (String)
*     id: id (String)
*   }
* */

/*
* room
*   {
*     key: key (String)
*   }
*
* */

/*
* message
*  {
*     type: USER_MESSAGE | SERVER_MESSAGE ! SYSTEM_INIT (String),
*     id: userId (String),
*     username: username (String),
*     message: message (String),
*     room: key (String),
*     target: {
*       id: userId (String),
*       username: username (String)
*     },
*     data: {
*       users: clients (Array),
*       rooms: roomsList (Array),
*       client: client (Object)
*     }
*  }
*
* */

var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http, {
  serveClient: false,
  // below are engine.IO options
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false
})

let clients = []
let rooms = new Map([
  ['Global', io.of('/global')],
  ['Server', io.of('/server')]
])

let createRoom = function (RoomKey) {
  rooms.set(RoomKey, io.of(RoomKey))

  rooms.get(RoomKey).on('connect', function (socket) {
    let { client } = getClientInfo(socket.id)

    io.of(RoomKey).emit('AddMessage', {
      type: 'SERVER_MESSAGE',
      message: client.username + ' has joined the room',
      room: {
        key: RoomKey
      }
    })
  })

  rooms.get(RoomKey).on('disconnect', function (socket) {
    let { client } = getClientInfo(socket.id)

    io.of(RoomKey).emit('AddMessage', {
      type: 'SERVER_MESSAGE',
      message: client.username + ' has left the room',
      room: {
        key: RoomKey
      }
    })
  })
}

let getClientInfo = function (SocketId) {
  let item

  clients.forEach(function (value, index, array) {
    if (value.id === SocketId) {
      item = {
        client: value,
        index
      }
    }
  })

  return item
}

rooms.forEach(function (value, key, map) {
  createRoom(key)
})

io.on('connection', function(socket) {
  clients.push({
    id: socket.id
  })

  console.log('a user connected')

  socket.on('NewUser', function(user) {
    let { client, index } = getClientInfo(socket.id)

    clients[index].username = user.username

    let roomsList = []

    rooms.forEach(function (value, key, map) {
      roomsList.push({ key })
    })

    io.emit(socket.id, {
      type: 'SYSTEM_INIT',
      data: {
        users: clients,
        rooms: roomsList,
        client
      }
    })

    io.emit('NewUser', client)
  })

  socket.on('JoinRoom', function(room) {
    socket.join(room.key)

    io.emit('JoinRoom', {
      type: 'SYSTEM_JOIN_ROOM',
      room
    })
  })

  socket.on('LeaveRoom', function(room) {
    socket.leave(room.key)

    io.emit('LeaveRoom', {
      type: 'SYSTEM_LEAVE_ROOM',
      room
    })
  })

  socket.on('CreateRoom', function(room) {
    let exist = false

    rooms.forEach(function (value, index, array) {
      if (value.name === room.name) {
        exist = true
      }
    })

    if (!exist) {
      createRoom(room.key)
    }
  })

  socket.on('NewMessage', function(message) {
    let { client } = getClientInfo(socket.id)

    message.username = client.username
    message.id = client.id

    if (message.target && message.target.id === client.id) {
      message.target.username = client.username
    }

    if (message.room) {
      rooms.get(message.room).emit('NewMessage', message)
    } else if (message.target) {
      if (message.target.id !== message.id) {
        io.emit(message.target.id, message)
      }

      io.emit(message.id, message)
    } else {
      io.emit('AddMessage', message)
    }
  })

  socket.on('disconnecting', function() {
    let { client, index } = getClientInfo(socket.id)

    console.log(client.username + ' disconnected')

    io.emit('RemoveUser', client)

    clients.splice(index, 1)
  })
})

http.listen(3001, function() {
  console.log('listening on *:3001')
})