<template>
  <div id="workflow-diagram">
    <VueFlow
      :nodes="nodes"
      :edges="edges"
      :zoom="zoom"
      :pan="pan"
      :onNodeClick="handleNodeClick"
      :onEdgeClick="handleEdgeClick"
    >
      <Background pattern-color="#aaa" :gap="16" />

      <MiniMap />

      <Controls position="top-right">
        <v-button title="Reset Transform" @click="resetTransform">
          <Icon name="reset" />
        </v-button>
      </Controls>

      <template #node-start="props">
        <process-node :id="props.id" :data="props.data" :type="'Start'" />
      </template>

      <template #node-end="props">
        <process-node :id="props.id" :data="props.data" :type="'End'" />
      </template>
    </VueFlow>
    <div class="actions">
      <button @click="addTask">Add Task</button>
      <button @click="removeTask">Remove Task</button>
      <button @click="addConnection">Add Connection</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { MarkerType, VueFlow, useVueFlow } from "@vue-flow/core";
import { Background } from "@vue-flow/background";
import { Controls } from "@vue-flow/controls";
import { MiniMap } from "@vue-flow/minimap";
import ProcessNode from "./ProcessNode.vue";

const nodes = ref([
  {
    id: "start",
    position: { x: 100, y: 0 },
    data: {},
    type: "start",
  },
  {
    id: "node1",
    position: { x: 50, y: 100 },
    data: { label: "Simple Task" },
    type: "simple",
  },
  {
    id: "end",
    position: { x: 100, y: 200 },
    data: { label: "End" },
    type: "end",
  },
]);

const edges = ref([
  {
    id: "e1-2",
    source: "start",
    target: "node1",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "black",
    },
  },
  {
    id: "e1-3",
    source: "node1",
    target: "end",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "black",
    },
  },
]);

const { onInit, onNodeDragStop, onConnect, addEdges, setViewport, toObject } =
  useVueFlow();

const zoom = ref(1);
const pan = ref({ x: 0, y: 0 });

onInit((vueFlowInstance) => {
  // instance is the same as the return of `useVueFlow`
  vueFlowInstance.fitView();
});

const handleNodeClick = (node) => {
  console.log("Node clicked:", node);
  console.log(`🥶🥶🥶🥶 ~ フ ク ロ ウ toObject:`, toObject());
};

const handleEdgeClick = (edge) => {
  console.log("Edge clicked:", edge);
};

const addTask = () => {
  const newNode = {
    id: `node${nodes.value.length + 1}`,
    position: { x: Math.random() * 500, y: Math.random() * 500 },
    data: { label: `New Task ${nodes.value.length + 1}` },
    type: "simple",
  };
  nodes.value.push(newNode);
  console.log("Task added:", newNode);
};

const removeTask = () => {
  if (nodes.value.length > 0) {
    const removedNode = nodes.value.pop();
    edges.value = edges.value.filter(
      (edge) => edge.source !== removedNode.id && edge.target !== removedNode.id
    );
    console.log("Task removed:", removedNode);
  }
};

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

const resetTransform = () => {
  setViewport({ x: 0, y: 0, zoom: 1 });
};
</script>

<style scoped>
@import "https://cdn.jsdelivr.net/npm/@vue-flow/core@1.47.0/dist/style.css";
@import "https://cdn.jsdelivr.net/npm/@vue-flow/core@1.47.0/dist/theme-default.css";
@import "https://cdn.jsdelivr.net/npm/@vue-flow/controls@latest/dist/style.css";
@import "https://cdn.jsdelivr.net/npm/@vue-flow/minimap@latest/dist/style.css";
@import "https://cdn.jsdelivr.net/npm/@vue-flow/node-resizer@latest/dist/style.css";

#workflow-diagram {
  position: relative;
  width: 100%;
  height: 500px;
  border: 1px solid #ccc;
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
