
<template>
<main class="w-screen h-screen flex items-center justify-center">
    <form @submit.prevent="room && $router.push(`/chat/${room}`)">
        <div class="flex m-2 items-center">
            <label for="room-name" class="text-xl text-gray-300 mr-4 w-full">Enter Your User Name:</label>
            <input type="text" id="room-name" class="p-4" :value="username" @input="$emit('update-username', $event.target.value)" />
            </div>
        <div class="flex m-2 items-center">
            <label for="room-name" class="text-xl text-gray-300 mr-4 w-full">Enter Your Room Name:</label>
            <input type="text" id="room-name" class="p-4" :value="room" @input="$emit('update-room', $event.target.value)" />
        </div>
        <div class="flex m-2 items-center">
            <button class="border border-gray-300 p-4 text-gray-300 w-full">Go</button>
        </div>
    </form>
</main>
</template>

<script>
import { ref } from 'vue'
export default {
    props: {
        username: String,
        room: String
    }
}
</script>
