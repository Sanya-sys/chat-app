<template>
  <div id="app">
    <div class="chat-container">
      <Chat user="Pihu" chatRoom="room1" class="chat-left" />
      <Chat user="Aisha" chatRoom="room1" class="chat-right" />
    </div>
  </div>
</template>

<script>
import Chat from './components/Chat.vue';

export default {
  components: {
    Chat,
  },
};
</script>

<style>
#app {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
}

.chat-container {
  display: flex;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.chat-left {
  margin-right: 20px;
}

.chat-right {
  margin-left: 20px;
}
</style>
