import { createApp } from "vue";
import App from "./App.vue";
import "./index.css";

import Courant from "courant";
const app = createApp(App);

app.use(Courant, {
  // Websocket Host
  io: io("http://localhost:3000"),
  autoConnect: true,
});

app.mount("#app");
