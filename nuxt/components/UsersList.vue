<template>
  <div id="users-list-container">
    <ul>
      <li v-for="(item, index) in users" :key="index" :data-id="item.id">
        {{ item.username }}
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
      users: {
        get: function () {
          return this.$store.getters['chat/getUsers']
        },
        set: function (newValue) {
          return newValue
        }
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