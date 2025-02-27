<template>
  <v-main>
    <v-form
      fast-fail
      class="mb-5 mt-5"
      @submit.prevent="createWorkflow"
    >
      <v-text-field
        v-model="workflowTitle"
        :rules="workflowTitleValidation"
        label="Workflow Title"
        class="ml-2 mr-5"
      />
      <v-select
        v-model="selectedSteps"
        :rules="selectedStepsValidation"
        :items="workflowSteps"
        label="Select Workflow Steps"
        item-title="Title"
        return-object
        class="ml-2 mr-5"
        multiple
      >
        <template #selection="{ item, index }">
          <v-chip v-if="index < 2">
            <span>{{ item.title }}</span>
          </v-chip>
          <span
            v-if="index === 2"
            class="align-self-center text-caption text-grey"
          >
            (+{{ selectedSteps.length - 2 }} others)
          </span>
        </template>
      </v-select>
      <v-row>
        <v-col
          cols="100"
          class="align-center d-flex"
        >
          <v-text-field
            v-model="numberOfRips"
            class="custom-field ml-2 mr-5"
            :rules="numberOfRipsValidation"
            label="Number of RIPs"
          />
        </v-col>
      </v-row>
      <v-row
        class="height:auto; mb-3 mr-1 pa-0"
        no-gutters
      >
        <v-col class="align-end d-flex justify-end mr-2">
          <v-btn
            v-if="success && !failure"
            size="x-small"
            icon
            type="submit"
            class="mb-2"
            color="success"
          >
            <v-icon size="medium">
              mdi-check
            </v-icon>
          </v-btn>
          <v-btn
            v-if="!success && failure"
            size="x-small"
            icon
            type="submit"
            class="mb-2"
            color="error"
          >
            <v-icon size="medium">
              mdi-close
            </v-icon>
          </v-btn>
          <v-btn
            type="submit"
            size="large"
            color="secondary"
            :disabled="failure || success"
            style="text-transform: none;"
          >
            Create Workflow
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-main>
</template>

<script setup>
import { ref, onMounted, toRaw } from "vue";
import { useRouter } from 'vue-router';
import { getCollection, formatSteps, postWorkflow } from "../api.js";

const router = useRouter();
const routeTo = (where) => {
    router.push(where);
};

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

const parallelStepsValidation = [
    x => {
 if (x && x.length !== 0) {
return true;
} return 'At least one step must be selected'
}
]

const numberOfRipsValidation = [
    x => {
 if (Number(x) > 0 && Number(x) <= 10) {
return true;
} return 'Number of Rips must be greater than 0 and less than 10'
}
]

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
    let steps = formatSteps(toRaw(selectedStepsIDs.value));
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
