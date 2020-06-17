<template>
  <div class="h-screen w-screen">
    <courant-provider room="hello-world" username="Reed">
      <courant-stream v-slot="{ local, remote }">
        <div class="absolute bottom-0 left-0 my-2 mx-8 z-50 hidden md:block">
          <video
            class="h-48 rounded-lg shadow-2xl object-cover"
            :src-object.prop.camel="swapped ? remote.stream : local.stream"
            autoplay
            muted
            playsinline
          />
          <p class="text-center text-white">You</p>
        </div>
      </courant-stream>

      <courant-stream v-slot="{ remote, local }">
        <div class="w-full h-full md:p-16 absolute">
          <video
            class="w-full h-full rounded-lg shadow-2xl m-0 p-0 object-cover"
            :src-object.prop.camel="swapped ? local.stream : remote.stream"
            autoplay
            playsinline
          />
        </div>
      </courant-stream>

      <courant-controls
        v-slot="{ video, audio, screenShare, connect, disconnect, isConnected }"
      >
        <div class="absolute flex h-full items-center justify-center">
          <div class="flex flex-col">
            <button @click="audio.toggle" class="group flex items-center justify-center border border-gray-300 rounded-lg text-gray-300 opacity-50 m-2 hover:opacity-100 transition duration-100 hover:shadow-lg hover:bg-gray-700">
              <svg class="m-2 w-6" v-if="audio.isActive" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clip-rule="evenodd"></path></svg>
              <svg class="m-2 w-6" v-else fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
              <span class="invisible absolute ml-16 left-0 group-hover:visible w-32 pointer-events-none bg-gray-300 px-2 rounded-lg bg-opacity-25">{{ audio.isActive ? 'Mute' : 'Unmute' }}</span>
            </button>

            <button @click="video.toggle" class="group flex items-center justify-center border border-gray-300 rounded-lg text-gray-300 opacity-50 m-2 hover:opacity-100 transition duration-100 hover:shadow-lg hover:bg-gray-700">
              <svg class="m-2 w-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path></svg>
              <span class="invisible absolute ml-16 left-0 group-hover:visible w-32 pointer-events-none bg-gray-300 px-2 rounded-lg bg-opacity-25">{{ video.isActive ? 'Go Dark' : 'Enable Video' }}</span>
            </button>

            <button @click="screenShare.toggle" class="group flex items-center justify-center border border-gray-300 rounded-lg text-gray-300 opacity-50 m-2 hover:opacity-100 transition duration-100 hover:shadow-lg hover:bg-gray-700">
              <svg class="m-2 w-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path></svg>
              <span class="invisible absolute ml-16 left-0 group-hover:visible w-32 pointer-events-none bg-gray-300 px-2 rounded-lg bg-opacity-25">{{ screenShare.isActive ? 'Share Screen' : 'Camera' }}</span>
            </button>

            <button @click="swapInputs" class="group flex items-center justify-center border border-gray-300 rounded-lg text-gray-300 opacity-50 m-2 hover:opacity-100 transition duration-100 hover:shadow-lg hover:bg-gray-700">
              <svg class="m-2 w-6" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path></svg>
              <span class="invisible absolute ml-16 left-0 group-hover:visible w-32 pointer-events-none bg-gray-300 px-2 rounded-lg bg-opacity-25">Change Layout</span>
            </button>

            <button @click="isConnected ? () => connect() : () => disconnect()" class="group flex items-center justify-center border border-gray-300 rounded-lg text-gray-300 opacity-50 m-2 hover:opacity-100 transition duration-100 hover:shadow-lg hover:bg-gray-700">
              <svg class="m-2 w-6" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path></svg>
              <span class="invisible absolute ml-16 left-0 group-hover:visible w-32 pointer-events-none bg-gray-300 px-2 rounded-lg bg-opacity-25">{{ isConnected ? 'Disconnect' : 'Connect' }}</span>
            </button>
          </div>
        </div>
      </courant-controls>

      <courant-chat v-slot="{ sendMessage, messages }" @new-message="saveLocalMessage" ref="chatStream">
        <div class="z-50 absolute bottom-0 right-0 mx-8 my-10">
          <transition-group name="list" tag="ul">
            <li
                class="bg-gray-700 px-4 py-2 mx-2 my-4 rounded-lg shadow-2xl bg-opacity-75"
                v-for="msg in recentMessages"
                :key="msg.id">
                <p class="text-sm underline" :key="msg.id">
                  {{ msg.username }}
                  <span class="font-light text-xs">{{ new Date(msg.timestamp).toLocaleTimeString() }}</span>
                </p>
                <p>
                  <strong>{{ msg.message }}</strong>
                </p>
            </li>
          </transition-group>

          <form @submit.prevent="send(sendMessage)" class="px-2 flex items-stretch">
            <input type="text" v-model="currentMessage" class="rounded-lg opacity-75 px-2 mr-2"/>
            <button class="bg-gray-500 p-2 rounded-lg text-white text-sm h-full">Send</button>
          </form>
          <p class="p-2 text-gray-600 absolute" v-if="messages.length > 0">History: {{ messages.length }} message</p>
        </div>
      </courant-chat>

    </courant-provider>
  </div>
</template>

<script>
export default {
  name: "App",
  data: () => ({
    currentMessage: '',
    swapped: false,
    messagesSet: new Set()
  }),

  computed: {
    recentMessages() {
      return [...this.messagesSet]
    }
  },

  methods: {
    send(callback) {
      callback(this.currentMessage)
      this.currentMessage = ''
    },

    swapInputs() {
      this.swapped = !this.swapped
    },

    saveLocalMessage(msg) {
      this.messagesSet.add(msg)
      setTimeout(() => { this.messagesSet.delete(msg) }, 15000)
    }
  }
};
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
