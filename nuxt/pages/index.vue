<template>
  <section id="main-container">
    <Register v-if="!loggedIn" :socket="socket"/>
    <AddMessage v-if="loggedIn" :socket="socket"/>
    <MessageList v-if="loggedIn && active.length > 0" :id="id"/>
    <UsersList v-if="loggedIn"/>
    <RoomsList v-if="loggedIn"/>
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
      }
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
            console.log(message)
            console.log(that.active)
            switch (message.type) {
              default:
                that.$store.dispatch({
                  type: 'chat/addMessage',
                  amount: message
                })
                break
            }
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
