<template>
  <div :class="containerClass">
    <span :class="labelClass">{{ label }}</span>
    <span>({{ data?.taskReferenceName }})</span>
  </div>
</template>

<script setup>
import { computed } from "vue";

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

const label = computed(() => {
  return props.data?.name;
});

const labelClass = computed(() => {
  switch (label.value) {
    case "fork":
      return "text-orange-500";
    case "join":
      return "text-blue-500";
    default:
      return "text-gray-700";
  }
});

const containerClass = computed(() => {
  switch (label.value) {
    case "fork":
      return "container fork";
    case "join":
      return "container join";
    default:
      return "container default";
  }
});
</script>

<style scoped>
.container {
  border: 1px solid #777;
  font-weight: 600;
  padding: 20px;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  width: 500px;
  height: 100px;
  font-size: 18px;
  border-radius: 8px;
}

.container.fork {
  background: rgba(255, 165, 0, 0.2);
  border-color: #ff9800;
}

.container.join {
  background: rgba(66, 165, 245, 0.2);
  border-color: #42a5f5;
}

.container.default {
  background: #f5f5f5;
  border-color: #777;
}

.text-orange-500 {
  color: #ff9800;
}

.text-blue-500 {
  color: #42a5f5;
}

.text-green-500 {
  color: #4caf50;
}

.text-gray-700 {
  color: #333;
}

span {
  font-size: 20px;
  font-weight: bold;
}
</style>
