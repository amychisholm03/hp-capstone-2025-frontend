<template>
  <v-app theme="light">
    <LiveChatWidget license="12332502" group="0" />
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

const success = ref(false);
const failure = ref(false);

const enabled = ref(false);
const parallelSteps = ref(null);
const numberOfRips = ref("1");

const workflowTitle = ref('');
const selectedSteps = ref(null);
const selectedStepsIDs = ref(null);
const workflowSteps = ref([]);


//// METHODS ////
const workflowTitleValidation = [
    x => {
        if (x) {
            return true;
        } return 'Workflow title cannot not be left empty'
    }
];

const selectedStepsValidation = [
    x => {
        if (x && x.length !== 0) {
            return true;
        } return 'Workflow must contain at least one step'
    }
];

const validateCreatedWorkflow = () => {
    const errors = [];
    workflowTitleValidation.forEach(rule => {
        const result = rule(workflowTitle.value);
        if (typeof result === "string") {
            errors.push(result);
        }
    })

    selectedStepsValidation.forEach(rule => {
        const result = rule(selectedSteps.value);
        if (typeof result === "string") {
            errors.push(result);
        }

    });

    if (errors.length > 0) {
        failure.value = true;
        success.value = false;
        setTimeout(() => {
            failure.value = false;
        }, 2000);
        return false;
    }
    return true;
}

//// API CALLS ////
const getWorkflowSteps = async () => {
    try {
        const response = await getCollection("WorkflowStep");
        if (response.ok) {
            workflowSteps.value = await response.json();
            // Pre-select the first 7 steps because they are required
            selectedSteps.value = workflowSteps.value.slice(0, 7);
        } else {
            throw new Error(String(response.status));
        }
    } catch (error) {
        errorMessage.value = "Error fetching list of workflow steps";
        console.log(`Error fetching list of WorkflowSteps: ${error}`);
    }
}

onMounted(async () => {
    await getWorkflowSteps();
})


const createWorkflow = async () => {
    if (!validateCreatedWorkflow()) {
        return false;
    }
    selectedStepsIDs.value = selectedSteps.value.map(stepID => {
        return stepID.id
    })
    const steps = formatSteps(toRaw(selectedStepsIDs.value));
    const response = await postWorkflow(workflowTitle.value.toString(), steps, enabled.value, parallelSteps.value, Number(numberOfRips.value));

    if (!response.ok) {
        console.log("Error posting data. Response from server: " + String(response.status))
        failure.value = true;
        setTimeout(() => {
            failure.value = false;
        }, 2000);
        return;
    } else {
        failure.value = false;
        success.value = true;
        setTimeout(() => {
            success.value = false;
        }, 2000);
    }
}
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
