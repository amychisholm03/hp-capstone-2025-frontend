<template>
  <v-app v-if="loading">
    <v-banner
      max-height="75px"
      style="border-width: 0px; font-size:large; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; font-weight: bold;"
    >
      <!-- Header -->
      <v-row>
        <v-col
          class="align-center d-flex justify-start"
        >
          Simulation Report Comparison
        </v-col>
        <v-col
          cols="2"
          class="align-center d-flex justify-end"
          align="right"
        >
          <v-btn
            class="align-center close-button d-flex"
            icon
            tile
            @click="$emit('exit')"
          >
            <v-icon>
              mdi-window-close
            </v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-banner>

    <!-- Main Body -->
    <v-row class="ml-3 mr-5 mt-3">
      <!-- General Comparison Section -->
      <v-col no-gutters>
        <v-card class="pa-5">
          <v-row no-gutters>
            <!-- Simulation Report 1 -->
            <v-col class="mr-2">
              <v-text-field
                v-model="dateTimeReport1"
                :readonly="true"
                density="compact"
                label="Date Created"
              ></v-text-field>
              <v-text-field
                v-model="viewableReport1.PrintJobTitle"
                :readonly="true"
                density="compact"
                label="Print Job Title"
              ></v-text-field>
              <v-text-field
                v-model="printjobReport1.PageCount"
                :readonly="true"
                density="compact"
                label="Page Count"
              ></v-text-field>
              <v-text-field
                v-model="viewableReport1.RasterizationProfile"
                :readonly="true"
                density="compact"
                label="Rasterization Profile"
              ></v-text-field>
              <v-text-field
                v-model="viewableReport1.TotalTimeTaken"
                :readonly="true"
                density="compact"
                label="Total Time Taken (secs)"
              ></v-text-field>
              <v-text-field
                v-model="viewableReport1.WorkflowTitle"
                :readonly="true"
                density="compact"
                label="Workflow Title"
              ></v-text-field>
            </v-col>

            <!-- Simulation Report 2 -->
            <v-col>
              <v-text-field
                v-model="dateTimeReport2"
                :readonly="true"
                density="compact"
                label="Date Created"
              ></v-text-field>
              <v-text-field
                v-model="viewableReport2.PrintJobTitle"
                :readonly="true"
                density="compact"
                label="Print Job Title"
              ></v-text-field>
              <v-text-field
                v-model="printjobReport2.PageCount"
                :readonly="true"
                density="compact"
                label="Page Count"
              ></v-text-field>
              <v-text-field
                v-model="viewableReport2.RasterizationProfile"
                :readonly="true"
                density="compact"
                label="Rasterization Profile"
              ></v-text-field>
              <v-text-field
                v-model="viewableReport2.TotalTimeTaken"
                :readonly="true"
                density="compact"
                label="Total Time Taken (secs)"
              ></v-text-field>
              <v-text-field
                v-model="viewableReport2.WorkflowTitle"
                :readonly="true"
                density="compact"
                label="Workflow Title"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <!-- Workflow Step Comparison Section -->
      <v-col>
        <v-card class="pa-3">
          <v-row no-gutters>
            <v-col no-gutters>
              <v-list class="ma-0">
                <v-list-item
                  v-for="(step) in stepsReport1"
                  :key="step"
                  class="ma-0"
                >
                  <span>
                    <v-list-item-title> <strong>Step: </strong>{{ step.Title }}</v-list-item-title>
                    <v-list-item-subtitle> <strong>Time Taken:</strong> {{ }} secs</v-list-item-subtitle>
                  </span>
                </v-list-item>
              </v-list>
            </v-col>
            <v-col class="no-gutters">
              <v-list class="ma-0">
                <v-list-item
                  v-for="(step) in stepsReport2"
                  :key="step"
                  class="ma-0"
                >
                  <span>
                    <v-list-item-title> <strong>Step: </strong>{{ step.Title }}</v-list-item-title>
                    <v-list-item-subtitle> <strong>Time Taken:</strong> {{ }} secs</v-list-item-subtitle>
                  </span>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-app>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import {getPrintJob, getWorkflow, getCollection, getWorkflowTimes } from "../api.js";

const {
  report1 = null,
  report2 = null,
}
=
defineProps({
  report1: Object,
  report2: Object,
});


const workflowStepsReport1 = ref(null);
const workflowStepsReport2 = ref(null);

const dateTimeReport1 = ref("");
const viewableReport1 = ref(null);
const printjobReport1 = ref(null);
const workflowReport1 = ref(null);
const stepTimeReport1 = ref(null);
const stepsReport1 = ref(null);

const dateTimeReport2 = ref("");
const viewableReport2 = ref(null);
const printjobReport2 = ref(null);
const workflowReport2 = ref(null);
const stepTimeReport2 = ref(null);
const stepsReport2 = ref(null);


const loading = ref(false);

// clone props so we cannot mute them.
viewableReport1.value = JSON.parse(JSON.stringify(report1));
viewableReport2.value = JSON.parse(JSON.stringify(report2));

/**
* Insert times into the main step array, if they exist.
*/
const addTimesToWorkflowStepArray = (workflowSteps, stepTimes) => {
  workflowSteps.forEach(step => {
    step.time = stepTimes[step.id] ? stepTimes[step] : null;
  });
  return workflowSteps;
};

/**
* Pad array of steps with any missing steps, so workflows
* can be displayed congruently.
*/
const addMissingStepsToWorkflowStepArray = (workflowSteps, stepDefinitions) => {
  const stepExists = {};
  workflowSteps.forEach(step => {
    stepExists[step.WorkflowStepID] = step;
  });

  const allSteps = [];
  stepDefinitions.forEach(definedStep => {
    const s = stepExists[definedStep.id];
    if (s) {
      allSteps.push(s);
    } else {
      allSteps.push(definedStep);
    }
  });

  return allSteps;
};

onMounted(
  async () => {
    dateTimeReport1.value = report1.Date + "  " + report1.Time;
    dateTimeReport2.value = report2.Date + "  " + report2.Time;

    const response = await Promise.all([
      getPrintJob(report1.PrintJobID),
      getWorkflow(report1.WorkflowID),
      getWorkflowTimes(report1.id),
      getPrintJob(report2.PrintJobID),
      getWorkflow(report2.WorkflowID),
      getWorkflowTimes(report2.id),
      getCollection('WorkflowStep'),
      ]);

    for (let i = 0; i < response.length; i++) {
      if (!response[i].ok) {
        alert("Error Getting Data!");
        return;
      }
    }

    printjobReport1.value = response[0].ok ? await response[0].json() : null;
    workflowReport1.value = response[1].ok ? await response[1].json() : null;
    stepTimeReport1.value = response[2].ok ? await response[2].json() : null;
    printjobReport2.value = response[3].ok ? await response[3].json() : null;
    workflowReport2.value = response[4].ok ? await response[4].json() : null;
    stepTimeReport2.value = response[5].ok ? await response[5].json() : null;
    const workflowStepDefinitions = response[6].ok ? await response[6].json() : null;

    stepsReport1.value = addMissingStepsToWorkflowStepArray(workflowReport1.value.WorkflowSteps, workflowStepDefinitions);
    console.log("TIMES:", stepTimeReport1.value);
    console.log("Times2:", stepTimeReport2.value);
    stepsReport1.value = addTimesToWorkflowStepArray(stepsReport1.value, stepTimeReport1.value);
    console.log("STEPS 1: ", stepsReport1.value);

    stepsReport2.value = addMissingStepsToWorkflowStepArray(workflowReport2.value.WorkflowSteps, workflowStepDefinitions);
    stepsReport2.value = addTimesToWorkflowStepArray(stepsReport2.value, stepTimeReport2.value);
    console.log("STEPS 2: ", stepsReport2.value);



    loading.value=true; // loading done
});
</script>

<style scoped>
.close-button:hover {
    color: red;
}
</style>

