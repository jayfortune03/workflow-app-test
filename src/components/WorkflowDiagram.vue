<template>
  <div id="workflow-diagram">
    <VueFlow
      :nodes="nodes"
      :edges="edges"
      :zoom="zoom"
      :pan="pan"
      :onNodeClick="handleNodeClick"
      :onEdgeClick="handleEdgeClick"
    />
    <!-- Add buttons to add/remove tasks -->
    <div class="actions">
      <button @click="addTask">Add Task</button>
      <button @click="removeTask">Remove Task</button>
      <button @click="addConnection">Add Connection</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { VueFlow } from "@vue-flow/core";

// Define the nodes and edges for the workflow diagram
const nodes = ref([
  { id: "node1", position: { x: 100, y: 100 }, data: { label: "SWITCH Task" } },
  { id: "node2", position: { x: 300, y: 100 }, data: { label: "INLINE Task" } },
  { id: "node3", position: { x: 500, y: 100 }, data: { label: "HTTP Task" } },
]);

const edges = ref([
  { id: "e1-2", source: "node1", target: "node2" },
  { id: "e2-3", source: "node2", target: "node3" },
]);

// Zoom and pan state
const zoom = ref(1);
const pan = ref({ x: 0, y: 0 });

// Function to handle node click
const handleNodeClick = (node) => {
  console.log("Node clicked:", node);
};

// Function to handle edge click
const handleEdgeClick = (edge) => {
  console.log("Edge clicked:", edge);
};

// Function to add a new task (node)
const addTask = () => {
  const newNode = {
    id: `node${nodes.value.length + 1}`,
    position: { x: Math.random() * 500, y: Math.random() * 500 },
    data: { label: `New Task ${nodes.value.length + 1}` },
  };
  nodes.value.push(newNode);
  console.log("Task added:", newNode);
};

// Function to remove a task (node)
const removeTask = () => {
  if (nodes.value.length > 0) {
    const removedNode = nodes.value.pop();
    edges.value = edges.value.filter(
      (edge) => edge.source !== removedNode.id && edge.target !== removedNode.id
    );
    console.log("Task removed:", removedNode);
  }
};

// Function to add a new connection (edge)
const addConnection = () => {
  if (nodes.value.length > 1) {
    const sourceNode = nodes.value[0];
    const targetNode = nodes.value[1];
    const newEdge = {
      id: `e${sourceNode.id}-${targetNode.id}`,
      source: sourceNode.id,
      target: targetNode.id,
    };
    edges.value.push(newEdge);
    console.log("Connection added:", newEdge);
  }
};
</script>

<style scoped>
#workflow-diagram {
  position: relative;
  width: 100%;
  height: 500px;
  border: 1px solid #ccc;
  margin-bottom: 20px;
}

.actions {
  display: flex;
  gap: 10px;
}

button {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>
