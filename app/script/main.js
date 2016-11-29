// Setting up our log system
class Log {
  constructor(message_board = document) {
    this.message_board = message_board
  }

  message(data) {
    let element = document.createElement('li'),
        span1 = document.createElement('span'),
        text1 = document.createTextNode(data.message);

    let span2, text2;

    if(data.username) {
      span2 = document.createElement('span');
      text2 = document.createTextNode(data.username);

      span2.appendChild(text2);
      element.appendChild(span2);
    }

    span1.appendChild(text1);
    element.appendChild(span1);

    this.message_board.appendChild(element);
  }
}

// Setting up a class to controll our client behavior
class Client {
  constructor() {
    let client = this;

    this.show = {
      register: function() {
        let register_form = elements.get('register_form');

        register_form.style.removeProperty('display');
      },
      chat: function() {
        let message_form = elements.get('message_form');

        message_form.style.removeProperty('display');
      }
    };

    this.hide = {
      register: function() {
        let register_form = elements.get('register_form');

        register_form.style.display = 'none';
      },
      chat: function() {
        let message_form = elements.get('message_form');

        message_form.style.display = 'none';
      }
    };

    this.state = {
      register: function() {
        client.hide.chat();
        client.show.register();
      },
      chat: function() {
        client.show.chat();
        client.hide.register();
      }
    };
  }
}

// Building our client object
let client = new Client();

// Keep all elements in a collection
let elements = new Map();

// Keep all clinet configs
let config = new Map();

elements.set('message_form', document['message_form']);
elements.set('message_input', document['message_form']['message_input']);
elements.set('message_board', document.getElementById('message_board'));
elements.set('register_form', document['register_form']);
elements.set('register_input', document['register_form']['register_input']);

let socket = io();
let log = new Log(elements.get('message_board'));

elements.get('register_form').addEventListener('submit', function(event) {
  event.preventDefault();

  let input = elements.get('register_input');
  
  if(input.value.length > 0)
    socket.emit('register:username', input.value); 

  input.value = '';
});

elements.get('message_form').addEventListener('submit', function(event) {
  event.preventDefault();
  
  let input = elements.get('message_input');
  
  if(input.value.length > 0) {
    socket.emit('new:message', input.value);
  }

  input.value = '';
});

// sockets
socket.on('new:message', function(data) {
  log.message(data);
});

socket.on('register:username', function(username) {
  config.set('username', username);

  client.state.chat();
});

socket.on('disconnect', function() {
  let data = {
    message: 'you are disconnected!'
  };

  log.message(data);
});

socket.on('reconnect', function () {
  let data = {
    message: 'you have been reconnected'
  };

  log.message(data);
});

socket.on('reconnect_error', function () {
  let data = {
    message: 'attempt to reconnect has failed'
  };
  
  log.message(data);
});
// end of sockets

window.addEventListener('load', function(event) {
  client.state.register();
});