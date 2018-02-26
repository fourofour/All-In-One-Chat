<template>
  <div id="rooms-list-container">
    <ul>
      <li
        v-for="(item, index) in rooms"
        :key="index"
        :data-id="item.name"
        @click.prevent="setActive(item.key)"
        >

        {{ item.key }}
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: [
      'socket'
    ],
    computed: {
      rooms: {
        get: function () {
          return this.$store.getters['chat/getRooms']
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
      setActive: function (name) {
        let that = this

        if (this.active.split(':')[0] !== 'ROOM' || this.active.split(':')[1] !== name) {
          this.socket.on('room/' + name.toLowerCase(), function (message) {
            switch (message.type) {
              default:
                that.$store.dispatch({
                  type: 'chat/addMessage',
                  amount: message
                })
                break
            }
          })

          this.$store.dispatch({
            type: 'chat/setActive',
            amount: {
              value: 'ROOM:' + name,
              socket: this.socket,
              name,
              active: this.active
            }
          })
        }
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