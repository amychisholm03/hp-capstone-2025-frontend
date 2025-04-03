<template>
  <v-app theme="light">
    <LiveChatWidget
      license="12332502"
      group="0"
    />
    <v-main class="pa-3">
      <error-popups
        :error="errorMessage"
        @clear-error="errorMessage = ''"
      >
      </error-popups>
      <v-card class="module">
        <module-toolbar
          class="module-toolbar"
          title="Workflow Creation"
          icon="mdi-graph"
          @minimize="workflowCreateMinimized = true"
          @maximize="workflowCreateMinimized = false"
        ></module-toolbar>
        <workflow-create v-if="!workflowCreateMinimized">
        </workflow-create>
      </v-card>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted, toRaw } from "vue";
import { useRouter } from 'vue-router';
import { getCollection, formatSteps, postWorkflow } from "./api.js";
import ModuleToolbar from "./module-toolbar.vue";
import WorkflowCreate from "./Workflow/workflow-create.vue";
import ErrorPopups from "./ErrorPopups.vue";
import { LiveChatWidget } from '@livechat/widget-vue'

const errorMessage = ref('');
const router = useRouter();
const routeTo = (where) => {
    router.push(where);
};
const workflowCreateMinimized = ref(false);
const selectedSteps = ref(null);
const workflowSteps = ref([]);

const getWorkflowSteps = async () => {
    try {
        const response = await getCollection("WorkflowStep");
        if (response.ok) {
            workflowSteps.value = await response.json();
            // Pre-select the first 7 steps because they are required
            selectedSteps.value = workflowSteps.value.slice(0, 7);
        }
    } catch (error) {
        errorMessage.value = "Error fetching list of workflow steps";
        console.log(`Error fetching list of WorkflowSteps: ${error}`);
    }
}

onMounted(async () => {
    await getWorkflowSteps();
})
</script>

<style>
.dashboard-component {
    border: 1px;
    width: 400px;
    height: 400px;
}

.dashboard-container {
    max-width: 400px;
}

.v-btn {
    margin: 0 5px;
}
</style>
