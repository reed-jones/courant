import { createCourant, courantSymbol } from "./CourantConnector";
import { provide } from "vue";
import { getOptions } from './options'

export default {
  props: {
    room: {
      type: String,
      default: 'public'
    },

    username: {
      type: String,
      default: "unknown",
    },

    autoConnect: {
      type: Boolean,
      default: null,
    },

    socketUrl: {
      type: String,
      default: null,
    },
  },

  render({ $slots }) {
    return $slots.default();
  },

  setup(props) {
    const options = getOptions();

    const courant = createCourant({
      room: props.room,
      username: props.username,
      socket: (props.socketUrl && io?.(props.socketUrl)) ?? options?.io,
    });

    if (props.autoConnect ?? options.autoConnect) {
      courant.connect();
    }

    provide(courantSymbol, courant);
  },
};
