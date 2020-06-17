import { courantSymbol } from "./CourantConnector";
import { inject } from "vue";
export default {
  render({ messages, sendMessage, $slots }) {
    return $slots.default({
      messages,
      sendMessage,
    });
  },

  setup(props, { emit }) {
    const { messages } = inject(courantSymbol);
    messages.setMessageCallback(msg => emit('new-message', msg))
    return {
      messages: messages.all,
      sendMessage: messages.sendMessage,
    };
  },
};
