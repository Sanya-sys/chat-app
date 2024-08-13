<template>
  <div class="chat-window">
    <div class="chat-header">{{ user }}'s Chat</div>
    <div class="messages">
      <div
        v-for="message in orderedMessages"
        :key="message.id"
        :class="{
          'message-sent': message.user === user,
          'message-received': message.user !== user,
        }"
        class="message"
      >
        <div class="message-content">
          <div class="message-text">{{ message.text }}</div>
          <div class="message-time">{{ formatTime(message.timestamp) }}</div>
        </div>
      </div>
    </div>
    <input
      v-model="newMessage"
      @keyup.enter="sendMessage"
      placeholder="Type a message"
    />
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { db, collection, addDoc } from "../utils/firebase";
import dayjs from "dayjs";

export default {
  props: ["user", "chatRoom"],
  setup(props) {
    const messages = ref([]);
    const newMessage = ref("");
    const socket = new WebSocket("ws://localhost:8080");

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onopen = () => {
      console.log("WebSocket connection opened");
    };

    socket.onmessage = (event) => {
      handleIncomingMessage(event);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    const handleIncomingMessage = (event) => {
      if (event.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const message = JSON.parse(reader.result);
            if (message.chatRoom === props.chatRoom) {
              if (!messages.value.some((msg) => msg.id === message.id)) {
                messages.value.push(message);
              }
            }
          } catch (error) {
            console.error("Error:", error);
          }
        };
        reader.readAsText(event.data);
      } else if (typeof event.data === "string") {
        try {
          const message = JSON.parse(event.data);
          if (message.chatRoom === props.chatRoom) {
            if (!messages.value.some((msg) => msg.id === message.id)) {
              messages.value.push(message);
            }
          }
        } catch (error) {
          console.error("Error", error);
        }
      }
    };

    const sendMessage = async () => {
      const trimmedMessage = newMessage.value.trim();

      if (trimmedMessage) {
        const messageData = {
          text: trimmedMessage,
          user: props.user,
          chatRoom: props.chatRoom,
          timestamp: new Date().toISOString(),
        };

        try {
          // Save to Firestore
          const docRef = await addDoc(
            collection(db, "chatRooms", props.chatRoom, "messages"),
            messageData
          );
          messageData.id = docRef.id;
          messages.value.push(messageData);
          socket.send(JSON.stringify(messageData));
          newMessage.value = "";
        } catch (err) {
          console.error("Failed to send message:", err);
        }
      }
    };

    const orderedMessages = computed(() =>
      messages.value
        .slice()
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    );

    const formatTime = (timestamp) => {
      return dayjs(timestamp).format("h:mm A");
    };

    return { messages, newMessage, sendMessage, formatTime, orderedMessages };
  },
};
</script>

<style scoped>
.chat-window {
  border: 1px solid #ccc;
  padding: 10px;
  width: 45%;
  margin: 10px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.chat-header {
  font-weight: bold;
  padding: 10px;
  background-color: #075e54;
  color: white;
  border-radius: 8px 8px 0 0;
}

.messages {
  height: 300px;
  overflow-y: scroll;
  padding: 10px;
  background-color: #ece5dd;
}

.message {
  display: flex;
  margin-bottom: 10px;
}

.message-sent {
  justify-content: flex-end;
}

.message-received {
  justify-content: flex-start;
}

.message-content {
  max-width: 70%;
  padding: 8px 12px;
  border-radius: 18px;
  background-color: #dcf8c6;
  position: relative;
}

.message-sent .message-content {
  background-color: #6f9caf;
  color: white;
}

.message-text {
  margin-bottom: 5px;
}

.message-time {
  font-size: 0.75em;
  color: rgba(0, 0, 0, 0.6);
  text-align: right;
}
</style>
