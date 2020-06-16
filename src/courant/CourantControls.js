import { courantSymbol } from "./CourantConnector";
import { inject } from "vue";

export default {
  render({ connect, disconnect, isConnected, video, audio, screenShare, $slots }) {
    return $slots.default({
      connect,
      disconnect,
      isConnected,
      video,
      audio,
      screenShare,
    });
  },

  setup() {
    const {
      connect,
      disconnect,
      isConnected,
      controls: { video, audio, screenShare },
    } = inject(courantSymbol);

    return {
      connect,
      disconnect,
      isConnected,
      video,
      audio,
      screenShare,
    };
  },
};
