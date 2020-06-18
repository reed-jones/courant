import CourantProvider from "./CourantProvider.js";
import CourantChat from "./CourantChat.js";
import CourantStream from "./CourantStream.js";
import CourantControls from "./CourantControls.js";

import { createCourant, courantSymbol } from "./CourantConnector";
import { setOptions } from './options'

export default {
  install(app, _options = {}) {

    setOptions(_options)

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
