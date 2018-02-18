<template>
  <div  id="message-list-container">
    <ul>
      <li v-for="(item, index) in messages" :key="index" :class="{system: item.type === 'system', user: item.type === 'user'}">
        <span class="username" v-if="item.type === 'user'">
          {{ item.id === id ? 'you' :  item.username }}
        </span>
        <span class="message">
          {{ item.message }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: [
      'id'
    ],
    computed: {
      messages: {
        get: function () {
          return this.$store.getters['chat/getMessages']
        },
        set: function (newValue) {
          return newValue
        }
      }
    }
  }
</script>

<style scoped>
  #message-list-container {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 43px;
  }
  #message-list-container ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }
  #message-list-container li {
    padding: 5px 10px;
  }
  #message-list-container li:nth-child(odd) {
    background: #d8d5d5;
  }
  #message-list-container li.system {
    text-align: center;
  }
  #message-list-container li span {
    display: inline-block;
  }
  #message-list-container li .username {
    color: red;
    margin-right: 10px;
  }
  #message-list-container li .message {}
</style>