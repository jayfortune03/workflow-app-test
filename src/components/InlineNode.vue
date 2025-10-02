<template>
  <div class="container">{{ data?.label }}</div>

  <!-- <Handle
    id="a"
    type="source"
    :position="type === 'Start' ? Position.Bottom : Position.Top"
  /> -->
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
});
console.log(`🥶🥶🥶🥶 ~ フ ク ロ ウ props.data:`, props.data);
</script>

<style scoped>
.container {
  border: 1px solid #777;
  font-weight: 600;
  padding: 10px;
  background: #d4d4d4;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  min-width: 150px;
  min-height: 70px;
}
</style>
