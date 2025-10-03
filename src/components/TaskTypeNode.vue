<template>
  <div
    class="container"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div
      style="
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 100%;
        padding-right: 20px;
        gap: 20px;
      "
    >
      <div style="display: flex; flex-direction: column">
        <span class="task-name">
          {{ taskTitle }}
        </span>
        <span class="task-reference-name"> ({{ taskSubTitle }}) </span>
      </div>

      <div :class="['type-indicator', typeClass]">
        <span>{{ data?.type || "Simple" }}</span>
      </div>
    </div>

    <div
      v-if="Object.keys(data?.inputParameters).length !== 0"
      class="code-block"
    >
      <div v-if="data?.inputParameters.evaluatorType && renderedCode">
        <p>
          Evaluator Type/Language: {{ data?.inputParameters.evaluatorType }}
        </p>
        <pre><code>{{ renderedCode }}</code></pre>
      </div>

      <div v-if="data?.inputParameters.http_request">
        <p>Method: {{ data?.inputParameters.http_request.method }}</p>
        <pre><code>{{ data?.inputParameters.http_request.uri }}</code></pre>
      </div>
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

const emit = defineEmits(["delete", "add"]);

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
  emit("add");
};

const deleteHandler = () => {
  emit("delete");
};

const typeClass = computed(() => {
  const type = props.data?.type?.toLowerCase();
  if (type === "inline") return "inline-type";
  if (type === "simple") return "simple-type";
  if (type === "http") return "http-type";
  return "";
});

const taskTitle = computed(() => {
  const type = props.data?.type?.toLowerCase();
  if (type === "simple" || type === "inline") return props.data?.name;
  if (type === "http") return props.data?.taskReferenceName;

  return data.name;
});

const taskSubTitle = computed(() => {
  const type = props.data?.type?.toLowerCase();
  if (type === "simple" || type === "inline")
    return props.data?.taskReferenceName;
  if (type === "http") return props.data?.name;

  return props.data.name;
});

const renderedCode = computed(() => {
  if (props.data) {
    const { expression, expressions } = props.data.inputParameters;

    return expression || expressions;
  }

  return null;
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
  max-height: 300px;
  max-width: 500px;
  position: relative;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.code-block {
  margin-top: 5px;
  margin-bottom: 20px;
  background-color: #ecf0f1;
  padding: 15px;
  border-radius: 5px;
  max-height: 150px;
  max-width: 350px;
  overflow-x: auto;
}

.type-indicator {
  font-size: 12px;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 5px;
  text-transform: uppercase;
  color: white;
  margin-left: auto;
}

.inline-type {
  background-color: #3498db;
}

.simple-type {
  background-color: #f39c12;
}

.http-type {
  background-color: #e9702a;
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
  width: 20px;
  height: 20px;
  font-size: 10px;
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
  top: 5px;
  right: 5px;
  background-color: #e74c3c;
  color: white;
}

.add-btn:hover,
.delete-btn:hover {
  transform: scale(1.2);
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
