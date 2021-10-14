<template>
  <div>
    <b-alert
      v-for="(message, key) in messages"
      :key="key"
      class="m-1"
      :variant="message.type"
      show
      >{{ message.text }}</b-alert
    >
  </div>
</template>

<script>
export default {
  name: "Messages",
  props: {
    messages: [],
  },
};
</script>