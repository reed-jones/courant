import { courantSymbol } from "./CourantConnector";
import { inject } from "vue";
export default {
  render({ messages, sendMessage, $slots }) {
    return $slots.default({
      messages,
      sendMessage,
    });
  },

  setup() {
    const { messages } = inject(courantSymbol);

    return {
      messages: messages.allMessages,
      sendMessage: messages.sendMessage,
    };
  },
};
