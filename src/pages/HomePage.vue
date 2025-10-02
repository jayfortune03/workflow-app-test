<template>
  <v-app>
    <div class="container">
      <v-btn variant="tonal"> Button </v-btn>

      <div>
        <h1>Workflows</h1>

        <div class="workflow-list">
          <div
            v-for="workflow in workflows"
            :key="workflow.id"
            class="workflow-item"
            @click="selectWorkflow(workflow)"
          >
            <h2>{{ workflow.name }}</h2>
            <p>{{ workflow.description }}</p>
          </div>
        </div>

        <div v-if="selectedWorkflow" class="task-buttons">
          <button @click="addTask">Add Task</button>
          <button @click="removeTask">Remove Task</button>
        </div>

        <div v-if="workflowMetadata">
          <h2>Workflow Diagram</h2>
          <div class="workflow-diagram">
            <img :src="workflowMetadata.diagramUrl" alt="Workflow Diagram" />
          </div>
        </div>
      </div>
    </div>
  </v-app>
</template>

<script setup>
import { onMounted, ref } from "vue";

const workflows = ref([]);
const selectedWorkflow = ref(null);
const workflowMetadata = ref(null);

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
  try {
    const response = await fetch(
      `/api/metadata/workflow/${workflow.id}/metadata`
    );
    const data = await response.json();
    workflowMetadata.value = data;
  } catch (error) {
    console.error("Error fetching workflow metadata:", error);
  }
};

const addTask = async () => {
  if (selectedWorkflow.value) {
    const newTask = {
      name: "New Task",
      type: "SIMPLE",
    };
    try {
      const response = await fetch(
        `http://localhost:8080/api/workflow/${selectedWorkflow.value.id}/tasks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTask),
        }
      );
      const data = await response.json();
      console.log("Task added:", data);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  }
};

const removeTask = async () => {
  if (selectedWorkflow.value) {
    try {
      const response = await fetch(
        `http://localhost:8080/api/workflow/${selectedWorkflow.value.id}/task/${taskId}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      console.log("Task removed:", data);
    } catch (error) {
      console.error("Error removing task:", error);
    }
  }
};

onMounted(() => {
  fetchWorkflows();
});
</script>

<style scoped>
.container {
  margin-left: 2.5rem;
  margin-right: 2.5rem;
}

.workflow-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.workflow-item {
  cursor: pointer;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #d81717;
  transition: background-color 0.3s;
}

.workflow-item:hover {
  background-color: #e0e0e0;
}

.task-buttons {
  margin-top: 1rem;
}

.workflow-diagram {
  margin-top: 2rem;
}

button {
  margin-right: 10px;
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
