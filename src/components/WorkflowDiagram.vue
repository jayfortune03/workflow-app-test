<template>
  <div id="workflow-diagram">
    <div v-if="hasSwitchTask" class="switch-message-container">
      <p class="switch-progress-message fade-in">
        Switch diagram still in progress...
      </p>
    </div>
    <VueFlow
      v-model:nodes="nodes"
      v-model:edges="edges"
      :zoom="zoom"
      v-model:viewport="viewport"
      :pan="pan"
      :onNodeClick="handleNodeClick"
      :onEdgeClick="handleEdgeClick"
    >
      <Background pattern-color="#aaa" :gap="16" />

      <MiniMap />

      <Controls position="top-right"> </Controls>

      <template #node-inline="props">
        <task-type-node
          :id="props.id"
          :data="props.data"
          @add="openAddDialog"
          @delete="openDeleteDialog"
        />
      </template>

      <template #node-simple="props">
        <task-type-node
          :id="props.id"
          :data="props.data"
          @add="openAddDialog"
          @delete="openDeleteDialog"
        />
      </template>

      <template #node-http="props">
        <task-type-node
          :id="props.id"
          :data="props.data"
          @add="openAddDialog"
          @delete="openDeleteDialog"
        />
      </template>

      <template #node-start="props">
        <process-node
          :id="props.id"
          :data="props.data"
          @add-start="openAddDialog"
        />
      </template>

      <template #node-end="props">
        <process-node :id="props.id" :data="props.data" />
      </template>

      <template #node-fork="props">
        <join-fork-node :id="props.id" :data="props.data" />
      </template>

      <template #node-join="props">
        <join-fork-node :id="props.id" :data="props.data" />
      </template>
    </VueFlow>
  </div>

  <v-dialog v-model="showDelete" max-width="420">
    <v-card>
      <v-card-title class="text-h6"> Hapus node ini? </v-card-title>
      <v-card-text>
        Node <strong>{{ selectedNode?.name }}</strong> ({{
          selectedNode?.taskReferenceName
        }}) akan dihapus. Aksi ini tidak bisa dibatalkan.
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn variant="text" @click="showDelete = false">Batal</v-btn>
        <v-btn color="error" @click="confirmDelete">Hapus</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- ===================== DIALOG: TAMBAH NODE ===================== -->
  <v-dialog v-model="showAdd" max-width="720">
    <v-card>
      <v-card-title class="text-h6">Tambah Node</v-card-title>
      <v-card-text>
        <v-form ref="addFormRef" v-model="isFormValid">
          <!-- Common -->
          <div class="mb-4 grid-2">
            <v-select
              v-model="addForm.type"
              :items="nodeTypes"
              label="Type"
              :rules="[(r) => !!r || 'Wajib']"
            />
            <v-text-field
              v-model="addForm.taskReferenceName"
              label="Task Reference Name"
              :rules="[
                (r) => !!r || 'Wajib',
                (r) => /^[a-zA-Z0-9_\\-]+$/.test(r) || 'Huruf/angka/_/-',
              ]"
            />
          </div>

          <v-text-field
            v-model="addForm.name"
            label="Name/Title"
            :rules="[(r) => !!r || 'Wajib']"
            class="mb-6"
          />

          <!-- SIMPLE -->
          <div v-if="addForm.type === 'SIMPLE'">
            <div class="mb-2 d-flex align-center justify-space-between">
              <div class="text-subtitle-2">Input Parameters (opsional)</div>
              <v-btn size="small" @click="kvAdd(addForm.simple.params)"
                >+ Param</v-btn
              >
            </div>
            <div class="kv-wrap">
              <div
                v-for="(row, idx) in addForm.simple.params"
                :key="'sp-' + idx"
                class="kv-row"
              >
                <v-text-field v-model="row.key" label="Key" />
                <v-text-field v-model="row.value" label="Value" />
                <v-btn icon @click="kvRemove(addForm.simple.params, idx)"
                  ><v-icon>mdi-delete</v-icon></v-btn
                >
              </div>
            </div>
          </div>

          <!-- INLINE -->
          <div v-if="addForm.type === 'INLINE'">
            <v-select
              v-model="addForm.inline.evaluatorType"
              :items="['javascript']"
              label="Evaluator Type"
              :rules="[(r) => !!r || 'Wajib']"
              class="mb-4"
            />
            <div class="mb-2 d-flex align-center justify-space-between">
              <div class="text-subtitle-2">Variables (key–value)</div>
              <v-btn size="small" @click="kvAdd(addForm.inline.vars)"
                >+ Var</v-btn
              >
            </div>
            <div class="kv-wrap">
              <div
                v-for="(row, idx) in addForm.inline.vars"
                :key="'iv-' + idx"
                class="kv-row"
              >
                <v-text-field
                  v-model="row.key"
                  label="Key (ex: tglbacaakhir)"
                />
                <v-text-field
                  v-model="row.value"
                  label="Value (ex: ${workflow.input.data.tglbacaakhir})"
                />
                <v-btn icon @click="kvRemove(addForm.inline.vars, idx)"
                  ><v-icon>mdi-delete</v-icon></v-btn
                >
              </div>
            </div>

            <v-textarea
              v-model="addForm.inline.expression"
              label="Expression (JS)"
              rows="6"
              :rules="[(r) => !!r || 'Wajib']"
              hint="function generatedFunction(){ ... } generatedFunction();"
              persistent-hint
              class="mt-4"
            />
          </div>

          <!-- HTTP -->
          <div v-if="addForm.type === 'HTTP'">
            <div class="grid-2 mb-4">
              <v-select
                v-model="addForm.http.method"
                :items="[
                  'GET',
                  'POST',
                  'PUT',
                  'DELETE',
                  'PATCH',
                  'HEAD',
                  'OPTIONS',
                ]"
                label="HTTP Method"
                :rules="[(r) => !!r || 'Wajib']"
              />
              <v-text-field
                v-model="addForm.http.uri"
                label="Request URL"
                :rules="[required, urlRule]"
              />
            </div>

            <div class="mb-2 d-flex align-center justify-space-between">
              <div class="text-subtitle-2">Headers (opsional)</div>
              <v-btn size="small" @click="kvAdd(addForm.http.headers)"
                >+ Header</v-btn
              >
            </div>
            <div class="kv-wrap">
              <div
                v-for="(row, idx) in addForm.http.headers"
                :key="'hh-' + idx"
                class="kv-row"
              >
                <v-text-field v-model="row.key" label="Header Key" />
                <v-text-field v-model="row.value" label="Header Value" />
                <v-btn icon @click="kvRemove(addForm.http.headers, idx)"
                  ><v-icon>mdi-delete</v-icon></v-btn
                >
              </div>
            </div>

            <v-textarea
              v-model="addForm.http.body"
              label="Body (opsional)"
              rows="4"
              hint="Raw JSON/string"
              persistent-hint
              class="mt-2"
            />
          </div>
        </v-form>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn variant="text" @click="showAdd = false">Batal</v-btn>
        <v-btn color="primary" :disabled="!isFormValid" @click="confirmAdd"
          >Tambah</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, nextTick, ref, watch } from "vue";
import { MarkerType, VueFlow, useVueFlow } from "@vue-flow/core";
import { Background } from "@vue-flow/background";
import { Controls } from "@vue-flow/controls";
import { MiniMap } from "@vue-flow/minimap";
import ProcessNode from "./ProcessNode.vue";
import TaskTypeNode from "./TaskTypeNode.vue";
import JoinForkNode from "./JoinForkNode.vue";

const containerWidth = 800;
const nodeWidth = 150;
const nodeHeight = 350;

const props = defineProps({
  tasks: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["delete", "add"]);

const {
  onInit,
  fitView,
  onNodeDragStop,
  onConnect,
  addEdges,
  setViewport,
  toObject,
  setCenter,
} = useVueFlow();
const nodeTypes = ["SIMPLE", "HTTP", "INLINE"];

const zoom = ref(1);
const pan = ref({ x: 0, y: 0 });
const viewport = ref({ x: 2000, y: 0, zoom: 0 });
const nodes = ref([]);
const edges = ref([]);
const showDelete = ref(false);
const isFormValid = ref(false);
const showAdd = ref(false);
const addFormRef = ref(null);
const selectedNode = ref(null);

const hasSwitchTask = computed(() => {
  return props.tasks?.some((task) => task.type === "SWITCH");
});
const hasForkTask = computed(() => {
  return props.tasks?.some((task) => task.type === "FORK_JOIN");
});

const required = (v) => !!v || "Wajib";
const urlRule = (v) => /^https?:\/\/.+/i.test(v || "") || "URL harus valid";

const buildGraph = (tasks) => {
  const nodeData = [];
  const edgeData = [];

  const startNode = {
    id: "start",
    position: { x: hasForkTask.value ? 1425 : 430, y: 0 },
    data: { label: "Start" },
    type: "start",
  };

  nodeData.push(startNode);

  let yPosition = nodeHeight;

  tasks.forEach((task, index) => {
    if (task.type === "FORK_JOIN") {
      const forkNode = {
        id: task.taskReferenceName,
        position: { x: containerWidth + 450, y: yPosition },
        data: { label: "Fork", ...task },
        type: "fork",
      };
      nodeData.push(forkNode);

      const spacing = -120;

      let xPosition = spacing;
      task.forkTasks.forEach((forkTaskArray, forkTaskIndex) => {
        forkTaskArray.forEach((forkTask) => {
          nodeData.push({
            id: forkTask.taskReferenceName,
            position: { x: xPosition, y: yPosition + 250 },
            data: {
              ...forkTask,
              fromTaskIndex: index,
              forkTaskIndex: forkTaskIndex,
            },
            type: "http",
          });
          xPosition += spacing + 700;
        });
      });

      yPosition += nodeHeight * 2;
    } else if (task.type === "JOIN") {
      const joinNode = {
        id: task.taskReferenceName,
        position: { x: containerWidth + 450, y: yPosition },
        data: { label: "Join", ...task },
        type: "join",
      };
      nodeData.push(joinNode);

      yPosition += nodeHeight;
    } else {
      const taskNode = {
        id: task.taskReferenceName,
        position: {
          x: hasForkTask.value
            ? containerWidth + 500
            : (containerWidth - nodeWidth) / 2,
          y: yPosition,
        },
        data: { ...task },
        type: task.type.toLowerCase(),
      };
      nodeData.push(taskNode);
      yPosition += nodeHeight;
    }
  });

  const endNode = {
    id: "end",
    position: {
      x: hasForkTask.value ? 1425 : (containerWidth - nodeWidth) / 2,
      y: yPosition,
    },
    data: { label: "End" },
    type: "end",
  };

  nodeData.push(endNode);

  edgeData.push({
    id: "e_start-1",
    source: "start",
    target: tasks[0].taskReferenceName,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "black",
    },
  });

  for (let i = 0; i < tasks.length; i++) {
    const currentTask = tasks[i];
    const forkTasks = tasks.find((el) => el.type === "FORK_JOIN");
    const nextTask = tasks[i + 1];

    if (currentTask.type === "FORK_JOIN") {
      currentTask.forkTasks.forEach((forkTaskArray) => {
        forkTaskArray.forEach((forkTask) => {
          edgeData.push({
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
          edgeData.push({
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
      edgeData.push({
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

  edgeData.push({
    id: `e_last-end`,
    source: tasks[tasks.length - 1].taskReferenceName,
    target: "end",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "black",
    },
  });

  return { nodes: nodeData, edges: edgeData };
};

const openDeleteDialog = () => {
  showDelete.value = true;
};
const openAddDialog = () => {
  showAdd.value = true;
};

const confirmDelete = () => {
  showDelete.value = false;
  emit("delete", { task: JSON.parse(JSON.stringify(selectedNode.value)) });
  selectedNode.value = null;
};

const addForm = ref({
  type: "SIMPLE",
  name: "",
  taskReferenceName: "",
  simple: { params: [] },
  inline: {
    evaluatorType: "javascript",
    vars: [],
    expression: "",
  },
  http: {
    method: "GET",
    uri: "",
    headers: [],
    body: "",
  },
});

const kvAdd = (arr) => {
  arr.push({ key: "", value: "" });
};
const kvRemove = (arr, idx) => {
  arr.splice(idx, 1);
};

const buildPayloadFromForm = () => {
  const t = addForm.value.type;

  const base = {
    name: addForm.value.name,
    taskReferenceName: addForm.value.taskReferenceName,
    description: null,
    type: t,
    dynamicTaskNameParam: null,
    caseValueParam: null,
    caseExpression: null,
    scriptExpression: null,
    dynamicForkJoinTasksParam: null,
    dynamicForkTasksParam: null,
    dynamicForkTasksInputParamName: null,
    startDelay: 0,
    subWorkflowParam: null,
    sink: null,
    optional: false,
    taskDefinition: null,
    rateLimited: null,
    asyncComplete: false,
    loopCondition: null,
    retryCount: null,
    evaluatorType: null,
    expression: null,
  };

  if (t === "SIMPLE") {
    const ip = {};
    for (const { key, value } of addForm.value.simple.params) {
      if (key) ip[key] = value ?? "";
    }
    return {
      ...base,
      inputParameters: ip,
    };
  }

  if (t === "INLINE") {
    const ip = {
      evaluatorType: addForm.value.inline.evaluatorType || "javascript",
      expression: addForm.value.inline.expression || "",
    };

    for (const { key, value } of addForm.value.inline.vars) {
      if (key) ip[key] = value ?? "";
    }
    return {
      ...base,
      inputParameters: ip,
    };
  }

  if (t === "HTTP") {
    const headersObj = {};
    for (const { key, value } of addForm.value.http.headers) {
      if (key) headersObj[key] = value ?? "";
    }
    const httpReq = {
      method: addForm.value.http.method || "GET",
      uri: addForm.value.http.uri || "",
    };
    if (Object.keys(headersObj).length) httpReq.headers = headersObj;
    if (addForm.value.http.body?.length) httpReq.body = addForm.value.http.body;

    return {
      ...base,
      inputParameters: { http_request: httpReq },
    };
  }

  return { ...base, inputParameters: {} };
};

const confirmAdd = async () => {
  if (addFormRef.value) {
    const ok = await addFormRef.value.validate();
    if (!ok) return;
  }
  const payload = buildPayloadFromForm();

  emit("add", {
    payload,
    task: JSON.parse(JSON.stringify(selectedNode.value)),
  });

  showAdd.value = false;
  addForm.value = {
    type: "SIMPLE",
    name: "",
    taskReferenceName: "",
    simple: { params: [] },
    inline: { evaluatorType: "javascript", vars: [], expression: "" },
    http: { method: "GET", uri: "", headers: [], body: "" },
  };
};

const handleNodeClick = (props) => {
  const { data } = props.node;
  selectedNode.value = data;
};

const handleEdgeClick = (edge) => {
  console.log("Edge clicked:", edge);
};

onInit((vueFlowInstance) => {
  vueFlowInstance.fitView();
});

watch(
  () => props.tasks,
  async (taskProp) => {
    if (!taskProp || !taskProp.length) {
      nodes.value = [];
      edges.value = [];
      return;
    }
    const built = buildGraph(taskProp);
    nodes.value = built.nodes;
    edges.value = built.edges;

    await nextTick();

    if (hasForkTask.value) {
      console.log("fork punya ini ");
      viewport.value = { x: -1250, y: 20, zoom: 1 };
      setViewport({ x: -1250, y: 20, zoom: 1 });
      pan.value = { x: -1250, y: 20, zoom: 1 };
    } else {
      viewport.value = { x: -290, y: 20, zoom: 1 };
      setViewport({ x: -290, y: 20, zoom: 1 });
      pan.value = { x: -290, y: 20, zoom: 1 };
    }
  },
  { deep: true, immediate: true }
);
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
</style>
