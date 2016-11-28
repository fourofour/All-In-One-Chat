class Log {
  constructor(target = document) {
    this.target = target
  }

  message(message = '') {        
      let element = document.createElement('li'),
          text = document.createTextNode(message);

      element.appendChild(text);
      this.target.appendChild(element);
  }
}

// elements collection
let ec = {};
ec.form = document['message_form'];
ec.message_board = document.getElementById('messages_board');

let socket = io();
let log = new Log(ec.message_board);

ec.form.addEventListener('submit', function(event) {
  event.preventDefault();
  
  let message = ec.form['message'];
  
  if(message.value.length > 0)
    socket.emit('chat message', message.value);

  message.value = '';
});

socket.on('chat message', function(message) {
  log.message(message);
});

