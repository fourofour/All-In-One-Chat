let socket = io();
let form = document['message_form'];
let message_board = document.getElementById('messages_board');

form.addEventListener('submit', function(event) {
  event.preventDefault();
  
  let message = form['message'];
  
  if(message.value.length > 0)
    socket.emit('chat message', message.value);

  message.value = '';
});

socket.on('chat message', function(message) {
  let element = document.createElement('li'),
      text = document.createTextNode(message);

  element.appendChild(text);
  message_board.appendChild(element);
});

