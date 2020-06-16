<script>
import { courantSymbol } from "./CourantConnector";
import { provide, inject } from "vue";
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
</script>
