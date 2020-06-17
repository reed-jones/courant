import { createApp } from "vue";
import App from "./App.vue";
import "./index.css";

// import Courant from "courant"; // in Production
import Courant from "./courant/main.js";

const app = createApp(App);

app.use(Courant, {
  // Websocket Host
  io: io("http://localhost:3000", {
    path: '/courant'
  }),
  autoConnect: true,
});

app.mount("#app");
