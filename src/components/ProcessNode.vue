<template>
  <div
    class="container"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <span>{{ data?.label }}</span>

    <v-btn v-if="isHovered" icon @click="addHandler" class="add-btn">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </div>

  <Handle id="a" type="source" :position="handlePosition" />
</template>

<script setup>
import { Handle, Position } from "@vue-flow/core";
import { computed, ref } from "vue";

const isHovered = ref(false);

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
  max-width: 50px;
  width: 50px;
  height: 50px;
}

.add-btn {
  z-index: 100;
  position: absolute;
  bottom: 0;
  width: 10px !important;
  height: 10px !important;
  font-size: 5px;
  background-color: rgb(57, 118, 231);
  color: white;
  padding: 2px;
}
</style>
