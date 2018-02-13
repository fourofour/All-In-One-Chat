<template>
  <section id="main-container">
    <AddMessage :socket="socket"/>
    <MessageList/>
  </section>
</template>

<script>
  import { mapGetters } from 'vuex'
  import AddMessage from '~/components/AddMessage'
  import MessageList from '~/components/MessageList'

  export default {
    data () {
      return {
        socket: {}
      }
    },
    components: {
      AddMessage,
      MessageList
    },
    mounted: function () {
      let that = this
      this.socket = io('http://localhost:3001')

      this.socket.on('AddMessage', function(message) {
        that.$store.dispatch({
          type: 'chat/addMessage',
          amount: {
            message
          }
        })
      })
    },
    beforeDestroy: function () {
      this.socket.removeListener('AddMessage')
    }
  }
</script>

<style scoped>
  #main-container {
  }
</style>
