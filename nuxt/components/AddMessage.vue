<template>
  <div id="add-message-container">
    <form @submit.prevent="submit">
      <span>
        <input type="text" v-model="message">
      </span>
      <span>
        <input type="submit" value="Send Message">
      </span>
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
          this.socket.emit('NewMessage', {
            type: 'user',
            message: this.message
          })

          this.message = ''
        }
      }
    }
  }
</script>

<style scoped>
  #add-message-container {
    background: #000;
    padding: 3px;
    position: fixed;
    bottom: 0;
    width: 100%;
    right: 0;
    height: 43px;
  }
  #add-message-container form {
    display: table;
    width: 100%;
  }
  #add-message-container span {
    display: table-cell;
  }
  #add-message-container span * {
    width: 100%;
  }
  #add-message-container span + span {
    width: 200px;
  }
  #add-message-container input {
    border: 0;
    padding: 10px;
    margin-right: .5%;
  }
  #add-message-container input[type="submit"] {
    background: rgb(130, 224, 255);
    border: none;
    padding: 10px;
  }
</style>