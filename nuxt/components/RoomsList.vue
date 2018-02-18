<template>
  <div id="rooms-list-container">
    <ul>
      <li v-for="(item, index) in rooms" :key="index" :data-id="item.name" @click.prevent="setActive(item.name)">
        {{ item.name }}
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
      }
    },
    methods: {
      setActive: function (name) {
        this.$store.dispatch({
          type: 'chat/setActive',
          amount: 'ROOM:' + name
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