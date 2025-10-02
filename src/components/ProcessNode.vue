<template>
  <div class="container">
    <span>{{ type }}</span>
  </div>

  <Handle
    id="a"
    type="source"
    :position="type === 'Start' ? Position.Bottom : Position.Top"
  />
</template>

<script setup>
import { Handle, Position } from "@vue-flow/core";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.container {
  border: 1px solid #777;
  font-weight: 600;
  padding: 10px;
  border-radius: 50%;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  max-width: 50px;
  width: 50px;
  height: 50px;
}
</style>
