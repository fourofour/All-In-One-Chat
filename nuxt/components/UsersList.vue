<template>
  <div id="users-list-container">
    <ul>
      <li
        v-for="(item, index) in users"
        :key="index"
        @click.prevent="setActive(item.id)"
        v-if="item.username && item.username.length > 0"
        >

        {{ item.id !== id ? item.username : 'You (' + item.username + ')' }}
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: [
      'socket',
      'id'
    ],
    computed: {
      users: {
        get: function () {
          return this.$store.getters['chat/getUsers']
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
      }
    },
    methods: {
      setActive: function (userId) {
        let amount = {
          value: (userId !== this.id ? 'USER:' + userId : ''),
          name: (this.active.split(':')[0] === 'ROOM' ? this.active.split(':')[1] : ''),
          socket: this.socket
        }

        this.$store.dispatch({
          type: 'chat/setActive',
          amount
        })
      }
    }
  }
</script>

<style scoped>
  #users-list-container {
    position: fixed;
    top: 0;
    width: 200px;
    right: 0;
    bottom: 43px;
    background-color: #47494e;
    color: #fff;
  }
</style>