import { createApp } from "vue";
import "./main.css";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import { routes } from './routes.js'


// import Courant from "courant"; // in Production
// import Courant from '../dist/courant.esm'
import Courant from "./courant/main.js";

const app = createApp(App);

app.use(Courant, {
  // Websocket Host
  io: io("http://localhost:3000", {
    path: "/courant",
  }),
  autoConnect: true,
});

const router = createRouter({
  history: createWebHistory(),
  routes: __DEV__ ? [] : routes,
});

if (import.meta.hot) {
  const removeRoutes = [];

  for (let route of routes) {
    removeRoutes.push(router.addRoute(route));
  }

  import.meta.hot.acceptDeps("./routes.js", ({ routes }) => {
    for (let removeRoute of removeRoutes) removeRoute();
    removeRoutes = [];
    for (let route of routes) {
      removeRoutes.push(router.addRoute(route));
    }
    router.replace("");
  });
}

app.use(router);

app.mount("#app");
