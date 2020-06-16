import { courantSymbol } from "./CourantConnector";
import { inject } from "vue";

export default {
  render({ local, remote, $slots }) {
    return $slots.default({ local, remote });
  },

  setup() {
    const { streams } = inject(courantSymbol);

    return {
      local: streams.local,
      remote: streams.remote,
    };
  },
};
