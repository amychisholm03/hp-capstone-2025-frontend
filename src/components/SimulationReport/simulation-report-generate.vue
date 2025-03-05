<template>
  <v-row class="mb-4 mt-4">
    <v-col>
      <v-form
        fast-fail
        @submit.prevent="generateSimulationReport"
      >
        <v-select
          v-model="selectedPrintJob"
          return-object
          :rules="printJobTitleValidation"
          :items="printJobs"
          label="Select Print Job"
          style="text-transform: none; font-weight: 500;"
          item-title="Title"
          class="ml-2 mr-5"
          item-value="id"
        >
        </v-select>
        <v-select
          v-model="selectedWorkflow"
          return-object
          :rules="selectedWorkflowValidation"
          style="text-transform: none; font-weight: 500;"
          :items="workflows"
          label="Select Workflow"
          item-title="Title"
          class="ml-2 mr-5"
          item-value="id"
        >
          <template #item="{ props }">
            <v-list-item v-bind="props"></v-list-item>
          </template>
        </v-select>
        <v-row>
          <v-col class="align-center d-flex justify-end">
            <v-btn
              v-if="success && !failure"
              size="x-small"
              icon
              type="submit"
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
              color="error"
            >
              <v-icon size="medium">
                mdi-close
              </v-icon>
            </v-btn>

            <v-btn
              type="submit"
              color="secondary"
              size="medium"
              style="text-transform: none; font-weight: 500;"
              class="mr-4 pa-3"
              tile
              :disabled="failure || success"
              append-icon="mdi-test-tube"
            >
              Run Simulation Report
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-col>
  </v-row>
</template>

<script setup>
  import { ref, onMounted, watch, toRaw } from "vue";
  import { postSimulationReport } from "../api.js";
  const {printJobs = null, workflows = null } = defineProps({
      printJobs: Array,
      workflows: Array,
  });

  const emit = defineEmits(['create'])

  const success = ref(false);
  const failure = ref(false);
  const selectedPrintJob = ref(null);
  const selectedWorkflow = ref(null);
  const printJobTitleValidation = [x => {
 if (x) {
return true;
} return 'Print job title cannot not be left empty'
}];
  const selectedWorkflowValidation = [x => {
 if (x) {
return true;
} return 'Workflow must be selected';
}];

  const validateGenerateSimulationReport = () => {
    const errors = [];
    printJobTitleValidation.forEach(rule => {
      const result = rule(selectedPrintJob.value);
      if (typeof result === "string") {
        errors.push(result);
      }
    });

    selectedWorkflowValidation.forEach(rule => {
      const result = rule(selectedWorkflow.value);
      if (typeof result === "string") {
        errors.push(result);
      }
    });
    if (errors.length > 0) {
      failure.value=true;
      success.value=false;
      setTimeout(() => {
        failure.value=false;
      }, 2000);
      return false;
    }
    return true;
  }

  const generateSimulationReport = async () => {
    if (failure.value || success.value){
      return;
    }
    try {
      if (!validateGenerateSimulationReport()) {
        return;
      }

      const response = await postSimulationReport(
        toRaw(selectedPrintJob)._rawValue.id,
        toRaw(selectedWorkflow)._rawValue.id
      );

      if (!response.ok) {
        console.log("Error generating report. Response from server: " + String(response.status));
        failure.value=true;
        setTimeout(() => {
          failure.value=false;
        }, 2000);
        return;
      }
      emit('create');
      failure.value=false;
      success.value=true;
      setTimeout(() => {
        success.value=false;
      }, 2000);
      return;
    } catch (error) {
      console.log("An error occurred generating the simulation report: " + error);
    }
  }
</script>
