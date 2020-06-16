<script>
import { courantSymbol } from "./CourantConnector";
import { provide, inject } from "vue";

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
</script>
