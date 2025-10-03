<template>
  <v-app>
    <v-container>
      <v-row>
        <v-col cols="12" md="3">
          <v-card class="workflow-card">
            <v-card-title class="workflow-card-title">Workflows</v-card-title>
            <v-list class="workflow-list scrollable">
              <v-list-item
                v-for="workflow in workflows"
                :key="workflow.name"
                @click="selectWorkflow(workflow)"
                :class="{
                  'workflow-item': true,
                  'active-workflow': selectedWorkflow?.name === workflow.name,
                }"
              >
                <v-list-item-content>
                  <v-list-item-title class="workflow-item-title">{{
                    workflow.name
                  }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card class="workflow-card">
            <v-card-title class="workflow-card-title">
              Workflow Data
            </v-card-title>
            <v-card-text class="scrollable">
              <div v-if="selectedWorkflow">
                <h3
                  style="
                    margin-top: 20px;
                    margin-left: 10px;
                    margin-bottom: 15px;
                  "
                >
                  {{ selectedWorkflow.name }}
                </h3>

                <pre class="json-editor" v-html="formattedJson"></pre>
              </div>
              <div v-else>
                <h3 style="margin-top: 20px; margin-bottom: 15px">
                  Select a workflow to see the details.
                </h3>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="5">
          <v-card class="workflow-card">
            <v-card-title
              class="workflow-card-title d-flex align-center py-3 px-4"
            >
              <div class="d-flex align-center gap-2">
                <span>Workflow Chart</span>
                <v-chip
                  style="margin-left: 8px"
                  v-if="isDirty"
                  size="small"
                  color="warning"
                  label
                  >Unsaved</v-chip
                >
              </div>

              <v-spacer />

              <div class="d-flex align-center">
                <v-btn
                  v-if="isDirty"
                  style="margin-right: 10px"
                  icon
                  color="default"
                  variant="text"
                  density="comfortable"
                  class="btn-icon"
                  aria-label="Reset perubahan"
                  @click="resetWorkflowTask"
                >
                  <v-icon icon="mdi-reload" />
                </v-btn>

                <v-btn
                  class="btn-eq"
                  prepend-icon="mdi-content-save-outline"
                  color="primary"
                  variant="flat"
                  height="36"
                  min-width="120"
                  density="comfortable"
                  rounded="lg"
                  :loading="saving"
                  :disabled="!isDirty || saving"
                  @click="saveWorkflow"
                >
                  Simpan
                </v-btn>
              </div>
            </v-card-title>

            <v-divider />
            <workflow-diagram
              :tasks="selectedWorkflow?.tasks"
              @add="handleAdd"
              @delete="handleDelete"
            />
          </v-card>
        </v-col>
      </v-row>

      <v-dialog v-model="showSwitchConfirm" max-width="460">
        <v-card>
          <v-card-title class="text-h6">Perubahan belum disimpan</v-card-title>
          <v-card-text>
            Kamu punya perubahan yang belum disimpan di
            <strong>{{ selectedWorkflow?.name }}</strong
            >. Yakin mau pindah dan buang perubahan?
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn variant="text" @click="cancelSwitch">Batal</v-btn>
            <v-btn color="warning" @click="confirmSwitch">Buang & Pindah</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-snackbar
        v-model="toast.open"
        :timeout="toast.timeout"
        :color="toast.color"
        location="top right"
        rounded="lg"
        elevation="6"
      >
        <div class="d-flex align-center gap-2">
          <v-icon :icon="toast.icon" size="small" class="mr-2" />
          <span class="font-weight-medium">{{ toast.message }}</span>
        </div>

        <template #actions>
          <v-btn variant="text" @click="toast.open = false">Tutup</v-btn>
        </template>
      </v-snackbar>

      <v-dialog v-model="errorDialog.open" max-width="520">
        <v-card>
          <v-card-title class="text-h6 d-flex align-center">
            <v-icon
              icon="mdi-alert-circle-outline"
              color="error"
              class="mr-2"
            />
            Gagal Menyimpan
          </v-card-title>
          <v-card-text>
            <p class="mb-2">
              Ada yang salah pas nyimpen workflow
              <strong>{{ selectedWorkflow?.name }}</strong
              >.
            </p>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn variant="text" @click="errorDialog.open = false"
              >Tutup</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-app>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import WorkflowDiagram from "@/components/WorkflowDiagram.vue";
import Prism from "prismjs";
import "prismjs/components/prism-json.min.js";

const workflows = ref([]);
const selectedWorkflow = ref(null);
const pendingWorkflow = ref(null);
const saving = ref(false);
const showSwitchConfirm = ref(false);

const toast = ref({
  open: false,
  message: "",
  color: "success",
  icon: "mdi-check-circle-outline",
  timeout: 2500,
});

const errorDialog = ref({
  open: false,
  detail: "",
});

const formattedJson = computed(() => {
  if (!selectedWorkflow.value) return "";

  const raw = JSON.stringify(selectedWorkflow.value, null, 2);
  return Prism.highlight(raw, Prism.languages.json, "json");
});

const isDirty = computed(() => {
  if (selectedWorkflow.value) {
    const workflow = workflows.value.find(
      (el) => el.name === selectedWorkflow.value.name
    );

    if (
      workflow &&
      workflow.tasks.length === selectedWorkflow.value.tasks.length
    ) {
      return false;
    }

    return true;
  }

  return false;
});

const confirmSwitch = () => {
  selectedWorkflow.value = pendingWorkflow.value;

  pendingWorkflow.value = null;
  showSwitchConfirm.value = false;
};

const cancelSwitch = () => {
  pendingWorkflow.value = null;
  showSwitchConfirm.value = false;
};

const saveWorkflow = async () => {
  if (!selectedWorkflow.value) return;
  try {
    saving.value = true;
    const url = `api/metadata/workflow`;
    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([selectedWorkflow.value]),
    });
    if (!res.ok) throw new Error(await res.text());
    await fetchWorkflows();
    showToast({
      message: `Workflow “${selectedWorkflow.value.name}” berhasil disimpan.`,
      color: "success",
    });
    console.log("✅ Workflow tersimpan");
  } catch (e) {
    showToast({
      message: "Gagal menyimpan workflow.",
      color: "error",
    });
    errorDialog.value = {
      open: true,
      detail: "",
    };
    console.error("❌ Save error:", e);
  } finally {
    saving.value = false;
  }
};

const fetchWorkflows = async () => {
  try {
    const response = await fetch("api/metadata/workflow");
    const data = await response.json();
    workflows.value = data;
  } catch (error) {
    console.error("Error fetching workflows:", error);
  }
};

const selectWorkflow = async (workflow) => {
  if (selectedWorkflow.value && isDirty.value) {
    showSwitchConfirm.value = true;
    pendingWorkflow.value = workflow;
  } else {
    selectedWorkflow.value = JSON.parse(JSON.stringify(workflow));
  }
};

const handleAdd = (data) => {
  const { payload, task } = data;

  const idx = selectedWorkflow.value.tasks.findIndex(
    (t) => t.taskReferenceName === task.taskReferenceName
  );

  if (idx !== -1) {
    selectedWorkflow.value.tasks.splice(idx + 1, 0, payload);
  } else {
    selectedWorkflow.value.tasks.push(payload);
  }
};

const handleDelete = (data) => {
  console.log(`🥶🥶🥶🥶 ~ フ ク ロ ウ data:`, data);

  const { task } = data;

  const filteredTask = selectedWorkflow.value.tasks.filter(
    (el) => el.taskReferenceName !== task.taskReferenceName
  );

  selectedWorkflow.value.tasks = filteredTask;
};

const resetWorkflowTask = () => {
  const workflow = workflows.value.find(
    (el) => el.name === selectedWorkflow.value.name
  );

  if (workflow) {
    selectedWorkflow.value = workflow;
  }
};

const showToast = ({ message, color = "success", icon }) => {
  toast.value.message = message;
  toast.value.color = color;
  toast.value.icon =
    icon ||
    (color === "success"
      ? "mdi-check-circle-outline"
      : color === "warning"
      ? "mdi-alert-outline"
      : "mdi-alert-circle-outline");
  toast.value.open = true;
};

onMounted(() => {
  fetchWorkflows();
});
</script>

<style scoped>
.workflow-card {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.workflow-card-title {
  background-color: #42a5f5;
  color: white;
  padding: 16px;
  font-size: 18px;
  font-weight: bold;
}

.workflow-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.workflow-item {
  cursor: pointer;
  padding: 12px;
  margin: 4px 0;
  border-radius: 4px;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.workflow-item:hover {
  background-color: #e0f7fa;
  transform: translateX(10px);
}

.workflow-item-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.active-workflow {
  background-color: #42a5f5;
  color: white;
  font-weight: bold;
}

.scrollable {
  max-height: 80dvh;
  overflow-y: auto;
  padding: 12px;
  font-family: "Courier New", monospace;
  background-color: #f5f5f5;
  border-radius: 4px;
  border: 1px solid #ccc;
  transition: max-height 0.3s ease;
}

.scrollable {
  white-space: pre-wrap;
  word-wrap: break-word;
}

.json-editor {
  font-size: 14px;
  line-height: 1.6;
  max-height: 70dvh;
  overflow-y: auto;
  word-wrap: break-word;
  padding: 10px;
  background-color: #1e1e1e;
  border-radius: 5px;
  color: #f1f1f1;
  font-family: "Courier New", monospace;
}

.workflow-diagram {
  margin-top: 2rem;
  padding: 1rem;
}

.workflow-data {
  text-align: center;
}

.workflow-list .v-list-item {
  transition: transform 0.3s ease;
}

.workflow-list .v-list-item:hover {
  transform: translateX(5px);
}

.workflow-card-text {
  display: flex;
  justify-content: center;
  align-items: center;
}

h3 {
  font-size: 20px;
  color: #333;
  font-weight: bold;
  margin-bottom: 1rem;
}
</style>
