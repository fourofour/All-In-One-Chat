<template>
  <div id="register-container">
    <form @submit.prevent="submit">
      <input v-model="username" type="text" placeholder="Your name...">
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
        username: ''
      }
    },
    methods: {
      submit: function () {
        if (this.username.length > 0) {
          this.socket.emit('NewUser', {
            username: this.username
          })

          this.username = ''
        }
      }
    }
  }
</script>

<style scoped>
  #register-container {
    position: fixed;
    background-color: #47494e;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    text-align: center;
  }
  #register-container input {
    background-color: transparent;
    border-style: none;
    color: #fff;
    font-size: 25px;
    margin-top: 200px;
  }
</style>