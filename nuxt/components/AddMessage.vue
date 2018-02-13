<template>
  <div id="add-message-container">
    <form @submit.prevent="submit">
      <input type="text" v-model="message">
      <input type="submit" value="Send Message">
    </form>
  </div>
</template>

<script>
  export default {
    props: [
      'socket'
    ],
    data () {
      return {
        message: ''
      }
    },
    methods: {
      submit: function () {
        if (this.message.length > 0) {
          this.socket.emit('NewMessage', this.message)

          this.message = ''
        }
      }
    }
  }
</script>

<style scoped>
  #add-message-container {
  }
</style>