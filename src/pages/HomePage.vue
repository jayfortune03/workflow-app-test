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

                <pre class="json-editor">
                    {{ selectedWorkflow }}
                  </pre
                >
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
            <v-card-title class="workflow-card-title">
              Workflow Chart
            </v-card-title>
            <workflow-diagram :tasks="selectedWorkflow?.tasks" />
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup>
import { onMounted, ref } from "vue";
import WorkflowDiagram from "@/components/WorkflowDiagram.vue";

const workflows = ref([]);
const selectedWorkflow = ref(null);

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
  selectedWorkflow.value = workflow;
  formattedJson.value = JSON.stringify(workflow, null, 2);
};

onMounted(() => {
  fetchWorkflows();
});
</script>

<style scoped>
.code-block {
  margin-top: 5px;
  margin-bottom: 20px;
  background-color: #ecf0f1;
  padding: 15px;
  border-radius: 5px;
  width: 100%;
}

.container {
  margin-left: 2.5rem;
  margin-right: 2.5rem;
}

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
  max-height: 90vh;
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
  max-height: 70vh;
  overflow-y: auto;
  word-wrap: break-word;
  padding: 10px;
  background-color: #1e1e1e;
  border-radius: 5px;
  color: #f1f1f1;
  font-family: "Courier New", monospace; /* Monospaced font for code */
}

.workflow-diagram {
  margin-top: 2rem;
  padding: 1rem;
}

.workflow-data {
  text-align: center;
}

button {
  margin-right: 10px;
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #45a049;
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
