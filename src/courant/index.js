import CourantProvider from "./CourantProvider.vue";
import CourantChat from "./CourantChat.vue";
import CourantStream from "./CourantStream.vue";
import CourantControls from "./CourantControls.vue";

import { createCourant, courantSymbol } from "./CourantConnector";

export let options = {}

export default {
  install(app, _options = {}) {
    options = _options

    // mix options into CourantProvider
    app.component("CourantProvider", CourantProvider);
    app.component("CourantChat", CourantChat);
    app.component("CourantStream", CourantStream);
    app.component("CourantControls", CourantControls);
  },
};

export {
  /** Components */
  CourantProvider,
  CourantChat,
  CourantStream,
  CourantControls,
  /** Helpers */
  createCourant,
  courantSymbol,
};

// Automatic installation if Vue has been added to the global scope.
if (typeof window !== "undefined" && window.Vue) {
  window.Vue.use(MyPlugin);
}
