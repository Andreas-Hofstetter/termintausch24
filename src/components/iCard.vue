
<template>
  <div class="close-box">
    <button class="close-btn" @click="$emit('close')">×</button>
    <div class="content">
      <slot>{{ text }}</slot>
    </div>
  </div>
</template>

<script>
//copied from Chatgpt; Not tested!!
export default {
  name: "CloseBox",
  props: {
    text: {
      type: String,
      default: ""
    }
  }
}
</script>

<style scoped>
.close-box {
  position: relative;
  display: inline-block;
  padding: 12px 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.close-btn {
  position: absolute;
  top: 4px;
  right: 6px;
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #666;
}

.close-btn:hover {
  color: black;
}

.content {
  font-size: 14px;
}
</style>