<template>
  <div
    class="container"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <span>{{ data?.label }}</span>

    <v-btn
      v-if="isHovered && data.label === 'Start'"
      icon
      @click="addHandler"
      class="add-btn"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </div>

  <Handle id="a" type="source" :position="handlePosition" />
</template>

<script setup>
import { Handle, Position } from "@vue-flow/core";
import { computed, ref } from "vue";

const isHovered = ref(false);

const emit = defineEmits(["add-start"]);

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

const handlePosition = computed(() => {
  return props.data.label === "Start" ? Position.Bottom : Position.Top;
});

const addHandler = () => {
  console.log("Add button clicked");
  emit("add-start");
};
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
  justify-content: center;
  align-items: center;
  gap: 10px;
  width: 150px;
  height: 150px;
  font-size: 35px;
}

.add-btn {
  z-index: 100;
  position: absolute;
  bottom: 0;
  width: 20px !important;
  height: 20px !important;
  font-size: 10px;
  background-color: #3498db;
  color: white;
  margin-bottom: 5px;

  padding: 2px;
}
</style>
