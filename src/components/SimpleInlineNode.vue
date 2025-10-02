<template>
  <div
    class="container"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <span class="task-name">
      {{ data?.name }}
    </span>

    <span class="task-reference-name"> ({{ data?.taskReferenceName }}) </span>

    <div :class="['type-indicator', typeClass]">
      <span>{{ data?.type || "Simple" }}</span>
    </div>
    <div v-if="data?.inputParameters" class="code-block">
      <p>Evaluator Type/Language: {{ data?.inputParameters.evaluatorType }}</p>
      <pre><code>{{ data?.inputParameters.expression }}</code></pre>
    </div>

    <v-btn v-if="isHovered" icon @click="addHandler" class="add-btn">
      <v-icon>mdi-plus</v-icon>
    </v-btn>

    <v-btn v-if="isHovered" icon @click="deleteHandler" class="delete-btn">
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript.min.js";

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

const addHandler = () => {
  console.log("Add button clicked");
};

const deleteHandler = () => {
  console.log("Delete button clicked");
};

const typeClass = computed(() => {
  const type = props.data?.type?.toLowerCase();
  if (type === "inline") return "inline-type";
  if (type === "simple") return "simple-type";
  return "";
});

onMounted(() => {
  Prism.highlightAll();
});
</script>

<style scoped>
.container {
  border: 1px solid #333;
  border-radius: 15px;
  padding: 20px;
  background: #f7f9fc;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 15px;
  min-width: 180px;
  min-height: 100px;
  position: relative;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.type-indicator {
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 12px;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 5px;
  text-transform: uppercase;
  color: white;
}

.inline-type {
  background-color: #3498db;
}

.simple-type {
  background-color: #f39c12;
}

.task-name {
  font-size: 16px;
  font-weight: bold;
  color: #2c3e50;
  text-transform: capitalize;
  margin-bottom: 5px;
}

.task-reference-name {
  font-size: 12px;
  color: #7f8c8d;
  font-style: italic;
  margin-bottom: 10px;
}

.add-btn,
.delete-btn {
  position: absolute;
  width: 30px;
  height: 30px;
  font-size: 20px;
  padding: 5px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.3s ease;
}

.add-btn {
  bottom: 0;
  margin-bottom: 5px;
  background-color: #3498db;
  color: white;
}

.delete-btn {
  top: 10px;
  right: 10px;
  background-color: #e74c3c;
  color: white;
}

.add-btn:hover,
.delete-btn:hover {
  transform: scale(1.2);
}

.code-block {
  margin-top: 5px;
  margin-bottom: 20px;
  background-color: #ecf0f1;
  padding: 15px;
  border-radius: 5px;
  width: 100%;
  max-height: 150px;
  overflow-x: auto;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: "Courier New", Courier, monospace;
  font-size: 14px;
}

code {
  display: block;
  padding: 10px;
  background: #34495e;
  color: #ecf0f1;
  border-radius: 5px;
  font-size: 13px;
}
</style>
