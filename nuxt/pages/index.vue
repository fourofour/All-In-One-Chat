<template>
  <section id="main-container">
    <Register v-if="!loggedIn" :socket="socket"/>
    <AddMessage v-if="loggedIn" :socket="socket" :RoomSocket="RoomSocket"/>
    <MessageList v-if="loggedIn && active.length > 0" :id="id"/>
    <UsersList v-if="loggedIn" :id="id"/>
    <RoomsList v-if="loggedIn" :socket="socket" :RoomSocket="RoomSocket"/>
  </section>
</template>

<script>
  import Register from '~/components/Register'
  import UsersList from '~/components/UsersList'
  import RoomsList from '~/components/RoomsList'
  import AddMessage from '~/components/AddMessage'
  import MessageList from '~/components/MessageList'

  export default {
    data () {
      return {
        socket: {},
        loggedIn: false,
        id: ''
      }
    },
    components: {
      Register,
      UsersList,
      RoomsList,
      AddMessage,
      MessageList
    },
    computed: {
      active: {
        get: function () {
          return this.$store.getters['chat/getActive']
        },
        set: function (newValue) {
          return newValue
        }
      },
      RoomSocket: {
        get: function () {
          return this.$store.getters['chat/getSocket']
        },
        set: function (newValue) {
          return newValue
        }
      }
    },
    mounted: function () {
      let that = this

      this.socket = io('http://localhost:3001')

      this.socket.on('connect', function () {
        that.socket.on(that.socket.id, function(message) {
          that.id = that.socket.id
          that.loggedIn = true

          switch (message.type) {
            case 'SYSTEM_INIT':
              that.$store.dispatch({
                type: 'chat/setRooms',
                amount: message.data.rooms
              })
              that.$store.dispatch({
                type: 'chat/setUsers',
                amount: message.data.users
              })
              break
            default:
              that.$store.dispatch({
                type: 'chat/addMessage',
                amount: message
              })
              break
          }
        })
      })

      this.socket.on('NewUser', function(client) {
        that.$store.dispatch({
          type: 'chat/addUsers',
          amount: client
        })
      })

      this.socket.on('AddMessage', function(message) {
        console.log(message)
        that.$store.dispatch({
          type: 'chat/addMessage',
          amount: message
        })
      })

      this.socket.on('AddUser', function(message) {
        that.$store.dispatch({
          type: 'chat/addUsers',
          amount: message
        })
      })

      this.socket.on('RemoveUser', function(message) {
        that.$store.dispatch({
          type: 'chat/removeUsers',
          amount: message
        })
      })
    },
    beforeDestroy: function () {
      this.socket.removeListener('AddMessage')
      this.socket.removeListener('NewUser')
      this.socket.removeListener('AddUser')
      this.socket.removeListener('RemoveUser')
      this.socket.removeListener(this.id)
    }
  }
</script>

<style scoped>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    font: 13px Helvetica, Arial;
  }
</style>
