<template>
  <courant-provider
    room="hello-world"
    username="Reed"
  >
    <courant-stream v-slot="{ local }">
      <video :src-object.prop.camel="local" autoplay muted playsinline />
    </courant-stream>

    <courant-stream v-slot="{ remote }">
      <video :src-object.prop.camel="remote" autoplay playsinline />
    </courant-stream>

    <courant-controls
      v-slot="{ video, audio, screenShare, connect, disconnect, isConnected }"
    >
      <div>
        <button @click="audio.toggle">
          {{ audio.isActive ? "Disable" : "Enable" }} Audio
        </button>
        <button @click="video.toggle">
          {{ video.isActive ? "Disable" : "Enable" }} Video
        </button>
        <button @click="screenShare.toggle">
          {{ screenShare.isActive ? "Disable" : "Enable" }} Screen Share
        </button>
        <button @click="disconnect" v-if="isConnected">Disconnect</button>
        <button @click="connect" v-else>Connect</button>
      </div>
    </courant-controls>

    <courant-chat v-slot="{ sendMessage, messages }">
      <div style="border: 1px solid; padding: 1rem; margin: 1rem;">
        <div v-for="msg in messages" :key="msg.id">
          <p>
            {{ msg.username }} -
            <span>{{ new Date(msg.timestamp).toLocaleTimeString() }}</span>
          </p>
          <p>
            <strong>{{ msg.message }}</strong>
          </p>
        </div>

        <form @submit.prevent="sendMessage($refs.msg.value)">
          <input type="text" ref="msg" />
          <button>Send</button>
        </form>
      </div>
    </courant-chat>
  </courant-provider>
</template>

<script>
export default {
  name: "App",
};
</script>

<style scoped>
video {
  background: black;
  margin: 1rem;
  width: 300px;
  height: 150px;
  border-radius: 1rem;
}
</style>
