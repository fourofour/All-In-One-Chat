<template>
  <div  id="message-list-container">
    <div>
      {{ active.split(':')[0] === 'USER' ? 'User: ' : 'Room: ' }}
      {{ active.split(':')[0] === 'USER' ? getUsername(active.split(':')[1]) : active.split(':')[1] }}
    </div>
    <ul>
      <li
        v-for="(item, index) in messages"
        :key="index"
        :class="{system: item.type === 'SERVER_MESSAGE', user: item.type === 'USER_MESSAGE'}"
        v-if="(active.split(':')[0] === 'ROOM' && item.room && active.split(':')[1] === item.room.key) ||
              (item.target && active.split(':')[1] === item.target.id) ||
              (item.target && item.target.id === id && active.split(':')[1] === item.id) ||
              (item.type === 'SERVER_FORCE_MESSAGE')"
        >

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
      },
      active: {
        get: function () {
          return this.$store.getters['chat/getActive']
        },
        set: function (newValue) {
          return newValue
        }
      },
      users: {
        get: function () {
          return this.$store.getters['chat/getUsers']
        },
        set: function (newValue) {
          return newValue
        }
      }
    },
    methods: {
      getUsername: function (id) {
        let username = ''

        this.users.forEach(function (value, index, array) {
          if (value.id === id) {
            username = value.username
          }
        })

        return username
      }
    }
  }
</script>

<style scoped>
  #message-list-container {
    position: fixed;
    top: 0;
    right: 400px;
    left: 0;
    bottom: 43px;
    overflow: auto;
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
  #message-list-container li.user {}
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