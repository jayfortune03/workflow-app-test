<template>
  <div id="workflow-diagram">
    <div v-if="hasSwitchTask" class="switch-message-container">
      <p class="switch-progress-message fade-in">
        Switch diagram still in progress...
      </p>
    </div>
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

      <Controls position="top-right"> </Controls>

      <template #node-inline="props">
        <task-type-node :id="props.id" :data="props.data" />
      </template>

      <template #node-simple="props">
        <task-type-node :id="props.id" :data="props.data" />
      </template>

      <template #node-http="props">
        <task-type-node :id="props.id" :data="props.data" />
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
import { computed, ref, watch } from "vue";
import { MarkerType, VueFlow, useVueFlow } from "@vue-flow/core";
import { Background } from "@vue-flow/background";
import { Controls } from "@vue-flow/controls";
import { MiniMap } from "@vue-flow/minimap";
import ProcessNode from "./ProcessNode.vue";
import TaskTypeNode from "./TaskTypeNode.vue";

const containerWidth = 800;
const nodeWidth = 150;
const nodeHeight = 350;

const props = defineProps({
  tasks: {
    type: Array,
    required: true,
  },
});

const {
  onInit,
  fitView,
  onNodeDragStop,
  onConnect,
  addEdges,
  setViewport,
  toObject,
} = useVueFlow();

const zoom = ref(1);
const pan = ref({ x: 0, y: 0 });

const hasSwitchTask = computed(() => {
  return props.tasks?.some((task) => task.type === "SWITCH");
});
const hasForkTask = computed(() => {
  return props.tasks?.some((task) => task.type === "FORK_JOIN");
});

const nodes = computed(() => {
  if (props.tasks) {
    const startNode = {
      id: "start",
      position: { x: hasForkTask ? 1425 : 430, y: 0 },
      data: { label: "Start" },
      type: "start",
    };

    let yPosition = nodeHeight;
    const taskNodes = [];

    props.tasks.forEach((task, index) => {
      if (task.type === "FORK_JOIN") {
        const forkNode = {
          id: task.taskReferenceName,
          position: { x: containerWidth + 600, y: yPosition },
          data: { label: "Fork", ...task },
          type: "fork",
        };
        taskNodes.push(forkNode);

        const spacing = -120;

        let xPosition = spacing;
        task.forkTasks.forEach((forkTaskArray) => {
          forkTaskArray.forEach((forkTask) => {
            taskNodes.push({
              id: forkTask.taskReferenceName,
              position: { x: xPosition, y: yPosition + 150 },
              data: { ...forkTask },
              type: "http",
            });
            xPosition += spacing + 700;
          });
        });

        yPosition += nodeHeight * 2;
      } else if (task.type === "JOIN") {
        const joinNode = {
          id: task.taskReferenceName,
          position: { x: containerWidth + 600, y: yPosition },
          data: { label: "Join", ...task },
          type: "join",
        };
        taskNodes.push(joinNode);

        yPosition += nodeHeight;
      } else {
        const taskNode = {
          id: task.taskReferenceName,
          position: {
            x: hasForkTask
              ? containerWidth + 500
              : (containerWidth - nodeWidth) / 2,
            y: yPosition,
          },
          data: { ...task },
          type: task.type.toLowerCase(),
        };
        taskNodes.push(taskNode);
        yPosition += nodeHeight;
      }
    });

    const endNode = {
      id: "end",
      position: {
        x: hasForkTask ? 1425 : (containerWidth - nodeWidth) / 2,
        y: yPosition,
      },
      data: { label: "End" },
      type: "end",
    };

    return [startNode, ...taskNodes, endNode];
  }
  return [];
});

const edges = computed(() => {
  if (props.tasks) {
    const edgeList = [];

    edgeList.push({
      id: "e_start-1",
      source: "start",
      target: props.tasks[0].taskReferenceName,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: "black",
      },
    });

    for (let i = 0; i < props.tasks.length; i++) {
      const currentTask = props.tasks[i];
      const forkTasks = props.tasks.find((el) => el.type === "FORK_JOIN");
      const nextTask = props.tasks[i + 1];

      if (currentTask.type === "FORK_JOIN") {
        currentTask.forkTasks.forEach((forkTaskArray) => {
          forkTaskArray.forEach((forkTask) => {
            edgeList.push({
              id: `e_fork-${currentTask.taskReferenceName}-${forkTask.taskReferenceName}`,
              source: currentTask.taskReferenceName,
              target: forkTask.taskReferenceName,
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: "black",
              },
            });
          });
        });
      } else if (currentTask.type === "JOIN") {
        forkTasks.forkTasks.forEach((forkTaskArray) => {
          forkTaskArray.forEach((forkTask) => {
            edgeList.push({
              id: `e_join-${forkTask.taskReferenceName}-join`,
              source: forkTask.taskReferenceName,
              target: `join`,
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: "black",
              },
            });
          });
        });
      } else if (nextTask) {
        edgeList.push({
          id: `e${i}-${i + 1}`,
          source: currentTask.taskReferenceName,
          target: nextTask.taskReferenceName,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "black",
          },
        });
      }
    }

    edgeList.push({
      id: `e_last-end`,
      source: props.tasks[props.tasks.length - 1].taskReferenceName,
      target: "end",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: "black",
      },
    });

    return edgeList;
  }
  return [];
});

onInit((vueFlowInstance) => {
  vueFlowInstance.fitView();
});

watch([nodes, edges], () => {
  pan.value = { x: pan.value.x, y: 0 };
  fitView();
});

const handleNodeClick = (props) => {
  const { data } = props.node;
  console.log("Node clicked:", data, nodes, edges);
};

const handleEdgeClick = (edge) => {
  console.log("Edge clicked:", edge);
};
</script>

<style scoped>
@import "https://cdn.jsdelivr.net/npm/@vue-flow/core@1.47.0/dist/style.css";
@import "https://cdn.jsdelivr.net/npm/@vue-flow/core@1.47.0/dist/theme-default.css";
@import "https://cdn.jsdelivr.net/npm/@vue-flow/controls@latest/dist/style.css";
@import "https://cdn.jsdelivr.net/npm/@vue-flow/minimap@latest/dist/style.css";
@import "https://cdn.jsdelivr.net/npm/@vue-flow/node-resizer@latest/dist/style.css";

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.switch-message-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.switch-progress-message {
  font-size: 18px;
  color: #44beee;
  font-weight: bold;
  padding: 10px;
  background-color: #f9f9f9;
  border: 1px solid #26aceb;
  border-radius: 5px;
  animation: fadeIn 1.5s ease-out;
}
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
