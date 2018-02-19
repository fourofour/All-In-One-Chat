<template>
  <div id="rooms-list-container">
    <ul>
      <li v-for="(item, index) in rooms" :key="index" :data-id="item.name" @click.prevent="setActive(item.key)">
        {{ item.key }}
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: [
      'socket',
      'RoomSocket'
    ],
    computed: {
      rooms: {
        get: function () {
          return this.$store.getters['chat/getRooms']
        },
        set: function (newValue) {
          return newValue
        }
      }
    },
    watch: {
      RoomSocket (v) {
        v.removeListener('AddMessage')

        v.on('AddMessage', function (message) {
          console.log(message)
        })
      }
    },
    methods: {
      setActive: function (name) {
        this.$store.dispatch({
          type: 'chat/setActive',
          amount: {
            value: 'ROOM:' + name,
            socket: this.socket,
            name
          }
        })

        this.socket.emit('JoinRoom', {
          key: name
        })

        this.$store.dispatch({
          type: 'chat/setSocket',
          amount: io('http://localhost:3001' + name)
        })
      }
    }
  }
</script>

<style scoped>
  #rooms-list-container {
    position: fixed;
    top: 0;
    width: 200px;
    right: 200px;
    bottom: 43px;
    background-color: #7f828b;
    color: #fff;
  }
</style>