<template>
  <div id="message-list-container">
    <li v-for="(item, index) in messages" :key="index">
      {{ item.message }}
    </li>
  </div>
</template>

<script>
  export default {
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
  }
</style>