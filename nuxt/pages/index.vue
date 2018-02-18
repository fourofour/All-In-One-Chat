<template>
  <section id="main-container">
    <Register v-if="!loggedIn" :socket="socket"/>
    <AddMessage v-if="loggedIn" :socket="socket"/>
    <MessageList v-if="loggedIn" :id="id"/>
    <UsersList v-if="loggedIn"/>
  </section>
</template>

<script>
  import Register from '~/components/Register'
  import UsersList from '~/components/UsersList'
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
      AddMessage,
      MessageList
    },
    mounted: function () {
      let that = this

      this.socket = io('http://localhost:3001')

      this.socket.on('AddMessage', function(message) {
        that.$store.dispatch({
          type: 'chat/addMessage',
          amount: message
        })
      })

      this.socket.on('NewUser', function(message) {
        if (message.target.id === that.socket.id) {
          that.id = that.socket.id
          that.loggedIn = true


          that.socket.on(that.id, function(message) {
            that.$store.dispatch({
              type: 'chat/addMessage',
              amount: message
            })
          })
        }
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
