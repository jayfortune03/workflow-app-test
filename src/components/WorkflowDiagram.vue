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

      <template #node-inline="props">
        <simple-inline-node :id="props.id" :data="props.data" />
      </template>

      <template #node-simple="props">
        <simple-inline-node :id="props.id" :data="props.data" />
      </template>

      <template #node-start="props">
        <process-node :id="props.id" :data="props.data" />
      </template>

      <template #node-end="props">
        <process-node :id="props.id" :data="props.data" />
      </template>
    </VueFlow>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { MarkerType, VueFlow, useVueFlow } from "@vue-flow/core";
import { Background } from "@vue-flow/background";
import { Controls } from "@vue-flow/controls";
import { MiniMap } from "@vue-flow/minimap";
import ProcessNode from "./ProcessNode.vue";
import SimpleInlineNode from "./SimpleInlineNode.vue";

const containerWidth = 800;
const nodeWidth = 150;
const nodeHeight = 70;

const props = defineProps({
  tasks: {
    type: Object,
    required: true,
  },
});

const nodes = ref([
  {
    id: "start",
    position: { x: (containerWidth - nodeWidth) / 2, y: 0 },
    data: { label: "Start" },
    type: "start",
  },
  {
    id: "node1",
    position: { x: (containerWidth - nodeWidth) / 2, y: nodeHeight * 2 },
    data: {
      label: "Simple Task",
      type: "SIMPLE",
      referenceLabel: "simple_node",
    },
    type: "simple",
  },
  {
    id: "node2",
    position: { x: (containerWidth - nodeWidth) / 2, y: nodeHeight * 4 },
    data: {
      name: "Inline Task",
      type: "INLINE",
      taskReferenceName: "inline_node",
      inputParameters: {
        evaluatorType: "javascript",
        fraksikwh: "${workflow.input.data.fraksikwh}",
        emin: "${workflow.input.data.emin}",
        expression:
          "    function generatedFunction() {      var fraksikwh =  1;       return fraksikwh;    }    generatedFunction()  ",
      },
    },
    type: "inline",
  },
  {
    id: "end",
    position: { x: (containerWidth - nodeWidth) / 2, y: nodeHeight * 6 },
    data: { label: "End" },
    type: "end",
  },
]);

const edges = ref([
  {
    id: "e1-1",
    source: "start",
    target: "node1",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "black",
    },
  },
  {
    id: "e1-2",
    source: "node1",
    target: "node2",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "black",
    },
  },
  {
    id: "e1-3",
    source: "node2",
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

const handleNodeClick = (props) => {
  const { data } = props.node;
  console.log("Node clicked:", data);
};

const handleEdgeClick = (edge) => {
  console.log("Edge clicked:", edge);
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
  height: 80dvh;
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
