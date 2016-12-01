'use strict';
// Setting a core up to control our Application
class App {
  constructor() {
    let app = this;

    /**
    *   Client
    *   Control our client behavior
    *
    **/
    this._client = {
      print: {
        message(data) {
          // Getting a reference to our message_board DOM element
          let message_board = app._live.element.get('message_board');

          /**
          *   data
          *   data.code = number*
          **    0 = default
          **    1 = system
          **    2 = you
          **
          *   data.label = string
          *   data.message = string
          *
          **/

          // setting the options for the messege element
          let option = {
                tagName: 'li',
                children: [],
                classList: []
              },
              element,
              message = {
                tagName: 'span',
                classList: ['info']
              },
              label = {
                tagName: 'span',
                classList: ['label']
              };

          if(data.code === undefined)
            if(data.id === app._core.config.client.get('id'))
              data.code = 2;
            else
              data.code = 0;

          let label_text,
              message_text,
              element_class;

          switch(data.code.toString()) {
            case '2':
              element_class = 'you';
              label_text = 'You';
              message_text = data.message;
              break;
            case '1':
              element_class = 'system';
              label_text = 'System';
              message_text = data.message;
              break;
            case '0':
            default:
              message_text = data.message;
              label_text = data.label;
              break;
          }

          if(element_class)
            option.classList.push(element_class);

          label.textNode = label_text;
          message.textNode = message_text;
          option.children.push(label, message);
          
          // wrapping up message element
          element = app._core.fn.create.element(option);

          // appending message to the message_board
          message_board.appendChild(element);

          // scrolling message_board
          message_board.scrollTop = message_board.scrollHeight;
        },

        list(list = []) {
          // Getting a reference to our online_list DOM element
          let online_list = app._live.element.get('online_list');

          // cleaning online_list
          [...online_list.childNodes].forEach(function(currentValue, index, array) {
            currentValue.remove();
          });

          for(let item of list) {
            let option = {
                  tagName: 'li',
                  children: [],
                  classList: []
                },
                title = {
                  tagName: 'span',
                  textNode: item[1],
                  classList: ['info']
                },
                poke = {
                  tagName: 'span',
                  textNode: 'poke',
                  classList: ['poke'],
                  attributeList: {'data-socket-id': item[0], 'data-name': item[1]},
                  eventList: {'click': app._core.ev.click.poke}
                },
                element;

            option.children.push(title, poke);

            element = app._core.fn.create.element(option);

            online_list.appendChild(element);
          }
        }
      },
      state: {
        set(name) {
          app._client.state.active = name;

          document.body.setAttribute('data-state', name);
        },
        reset() {
          app._client.state.active = '';

          document.body.removeAttribute('data-state');
        },
        get() {
          return app._client.state.active;
        },
        active: ''
      }
    };

    /**
    *   Server
    *   Communication to server
    *
    **/
    this._server = {
      register: {
        username(username) {
          if(username.length > 0 && app._core.config.client.get('connected'))
            app._live.socket.emit('register:username', username);
        }
      },
      send: {
        message(message) {
          if(message.length > 0 && app._core.config.client.get('connected'))
            app._live.socket.emit('new:message', message);          
        }
      }
    };

    /**
    *   Core
    *   Keep Configs, functions, event handlers
    *
    **/
    this._core = {
      // not with capital becasue it will change
      config: {
        export: new Map(),
        client: new Map()
      },

      fn: {
        create: {
          element(option) {
            /**
            *   option
            *   option.textNode = string
            **    will be ignored if option.children is defined or not empty 
            **
            *   option.tagName = string
            **    will build textNode if option.tagName is undefined
            **
            *   option.classList = array
            *   option.eventList = object = {name1: handler1, name2: handler2}
            *   option.attributeList = object = {name1: value1, name2: value2}
            *   option.children = array = [ object === option ]
            **    will build a textNode from option.textNode if option.children is undefined or empty
            **
            *
            **/

            if(!option.tagName)
              return document.createTextNode(option.textNode);
            else {
              // creating our DOM element
              let element = document.createElement(option.tagName);

              // if we have the option.children we will ignore textNode
              if(option.children && option.children.length > 0)
                for(let child of option.children)
                  element.appendChild(app._core.fn.create.element(child));
              else
                if(option.textNode && option.textNode.length > 0)
                  element.appendChild(document.createTextNode(option.textNode));

              // if we have the option.classList
              if(option.classList && option.classList.length > 0)
                element.classList.add(...option.classList);

              // if we have the option.eventList
              for(let key in option.eventList)
                element.addEventListener(key, option.eventList[key]);

              // if we  have the option.attributeList
              for(let key in option.attributeList) {
                element.setAttribute(key, option.attributeList[key]);
              }

              return element;
            }
          }
        },
        export() {
          let list = [...app._core.config.export.entries()];

          list.forEach(function(currentValue, index, array) {
            app[currentValue[0]] = currentValue[1];
          });
        }
      },

      /**
      * Event Handlers
      *
      **/
      ev: {
        load: {
          document(event) {
            // collecting our necessary DOM elements
            app._live.element.set('message_board', document.getElementById('message_board'));
            app._live.element.set('online_list', document.getElementById('online_list'));
            app._live.element.set('message_form', document.getElementById('message_form'));
            app._live.element.set('register_form', document.getElementById('register_form'));

            // bind events
            app._live.element.get('message_form').addEventListener('submit', app._core.ev.submit.message);
            app._live.element.get('register_form').addEventListener('submit', app._core.ev.submit.register);

            // after DOM ready settings
            app._client.state.set('loaded');

            app._live.socket = io();

            // setting starter configs
            let config = app._core.config.client,
                socket = app._live.socket,
                message = app._client.print.message,
                list = app._client.print.list;

            config.set('connected', false);

            // Native event : connect
            socket.on('connect', function() {
              config.set('connected', true);

              let option = {
                message: 'You are connected!',
                code: '1'
              };

              message(option);
            });

            // Native event : disconnect
            socket.on('disconnect', function() {
              config.set('connected', false);

              // TODO
              // client.state.register();

              let option = {
                message: 'You are disconnected!',
                label: 'system',
                code: '1'
              };

              message(option);
            });

            // Native event : reconnect
            socket.on('reconnect', function () {
              config.set('connected', true);
              
              let username = config.get('username');

              if(username)
                socket.emit('register:username', username);

              let option = {
                message: 'You have been reconnected',
                label: 'system',
                code: '1'
              };

              message(option);
            });

            socket.on('reconnect_error', function () {
              let option = {
                message: 'Attempt to reconnect has failed!',
                label: 'system',
                code: '1'
              };

              message(option);
            });

            socket.on('new:message', function(option) {
              if(config.get('username'))
                message(option);
            });

            socket.on('register:username', function(data) {
              let option = {
                message: 'Welcome ' + data.username + '!',
                code: '1'
              };

              config.set('username', data.username);
              config.set('id', data.id);

              app._client.state.set('registred');

              message(option);
            });

            socket.on('update:list', function(data) {
              list(data);
            });

            socket.on('new:poke', function(option) {
              option.message = 'I Poked you!';

              message(option);
            });
          }
        },
        click: {
          poke(event) {
            event.preventDefault();

            let data = {
              username: this.getAttribute('data-name'),
              id: this.getAttribute('data-socket-id')
            };

            app._live.socket.emit('new:poke', data);
          }
        },
        submit: {
          register(event) {
            event.preventDefault();

            let input = this['register_input'];
            
            app._server.register.username(input.value);

            input.value = '';
          },

          message(event) {
            event.preventDefault();

            let input = this['message_input'];
            
            app._server.send.message(input.value);

            input.value = '';
          }
        }
      },

      // setting all configs before runing on constructor 
      init() {
        // it will run before ready state
        // setting some shortcuts
        app._core.config.export.set('createElement', app._core.fn.create.element);
        app._core.config.export.set('socket', app._live.socket);
        app._core.config.export.set('config', app._core.config.client);
        app._core.config.export.set('print', app._client.print);

        // using all our exports
        app._core.fn.export();

        // if DOM is loaded run the code
        if(document.readyState === "complete")
          app._core.ev.load.document(); 
        else
          window.addEventListener('load', app._core.ev.load.document);
      }
    };

    /**
    *   Live
    *   Keep things such as DOM elements
    *
    **/
    this._live = {
      element: new Map(),
      socket: undefined
    };

    // runing the core init
    app._core.init();
  }
}

// building our app :)
let app = new App();