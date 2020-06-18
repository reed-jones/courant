<template>
 <RouterView @update-room="room = $event" @update-username="username = $event" :room="room" :username="username" />
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    let room = ref('')
    let username = ref('anon_' + Math.floor(Math.random() * 100000))
    return {
      room,
      username
    }
  }
}
</script>

<style>
.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active, .list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
</style>
