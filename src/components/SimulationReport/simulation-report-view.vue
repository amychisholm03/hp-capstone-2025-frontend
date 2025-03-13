<template>
  <v-card
    v-if="!loading"
    class="ma-0 pa-0"
  >
    <!-- Header -->
    <v-row
      class="align-center d-flex header-row"
    >
      <!-- Title -->
      <v-col
        class="align-center d-flex justify-center"
      >
        <h4>
          <div v-if="singleReport">
            Simulation Report Detailed View
          </div>
          <div v-else>
            Simulation Report Comparison
          </div>
        </h4>
      </v-col>

      <!-- Exit Button -->
      <v-col
        style="position:fixed;"
        class="align-center d-flex justify-end mb-1"
      >
        <v-btn
          class="close-button ma-0 pa-0"
          icon
          size="xx-small"
          color="error"
          @click="$emit('exit')"
        >
          <v-icon>
            mdi-window-close
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <div id="comparison-top" />
    <div id="overview-top" />

    <v-row
      class="ml-3 mr-5"
      style="margin-top:40px;"
    >
      <!-- Overview -->
      <v-col
        v-for="{report, printjob, workflow} in reportData"
        :key="report.id"
        style="max-width:650px;"
        @click="scrollToTopOfOverview"
      >
        <v-card
          class="overview-card"
        >
          <h5 style="text-align:center; margin-bottom:5px;">
            {{printjob.Title }} / {{ workflow.Title }}
          </h5>
          <v-row no-gutters>
            <v-col class="mr-2">
              <v-text-field
                v-model="report.dateTime"
                :readonly="true"
                density="compact"
                label="Date Created"
              ></v-text-field>
              <v-text-field
                v-model="printjob.Title"
                :readonly="true"
                density="compact"
                label="Print Job Title"
              ></v-text-field>
              <v-text-field
                v-model="printjob.PageCount"
                :readonly="true"
                density="compact"
                label="Page Count"
              ></v-text-field>
              <v-text-field
                v-model="report.RasterizationProfile"
                :readonly="true"
                density="compact"
                label="Rasterization Profile"
              ></v-text-field>
              <v-text-field
                v-model="report.TotalTimeTaken"
                :readonly="true"
                density="compact"
                label="Total Time Taken (secs)"
              ></v-text-field>
              <v-text-field
                v-model="workflow.Title"
                :readonly="true"
                density="compact"
                label="Workflow Title"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <!-- End Overview Section -->

      <!-- Comparison Section -->
      <v-col
        style="max-width:700px;"
        @click="scrollToTopOfComparison"
      >
        <v-card
          class="comparison-card"
        >
          <v-row no-gutters>
            <v-col
              v-for="{report, printjob, workflow, steps } in reportData"
              :key="report.id"
              no-gutters
            >
              <h5 style="text-align:center; margin-bottom:5px;">
                {{ printjob.Title }} / {{ workflow.Title }}
              </h5>
              <table style="width: 100%; height:100%;">
                <tr style="text-align:left; font-size: 20px; text-align:center; height:50px;">
                  <th style="width:50%; font-weight:400;">
                    Step
                  </th>
                  <th style="width:50%; font-weight:400;">
                    Time
                  </th>
                </tr>
                <tr
                  v-for="(step) in steps"
                  :key="step.Title"
                  style="text-align:center;"
                >
                  <td
                    style="width:50%; font-size: 18px;"
                  >
                    {{ step.Title }}
                  </td>
                  <td>
                    {{ step.time }}s
                  </td>
                </tr>
              </table>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <!-- End Comparison Section -->

    <!-- Charts Section -->
    <v-row
      class="ml-3 mr-5"
      style="margin-top:40px;"
      @click="scrollToBottomOfCharts"
    >
      <v-col>
        <v-card
          class="chart-card-single"
        >
          <v-card-title class="chart-card-title">
            CHARTS
          </v-card-title>
          <v-row>
            <v-col
              v-for="{ report, times } in reportData"
              :key="report.id"
            >
              <chart-all
                style="width:auto; height:auto;"
                :data="times"
                :labels="labels"
                :chart-id="report + report.id"
              >
              </chart-all>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <!-- End Charts Section -->
      <div id="chart-bottom" />
    </v-row>
  </v-card>
</template>

<script setup>
import { onMounted, ref, computed, nextTick, reactive } from "vue";
import {getPrintJob, getWorkflow, getCollection, getWorkflowTimes } from "../api.js";
import ChartAll from '../Chart/chart-all.vue';

const chartCanvas = ref();
//// Props
const {
  reports = [],
}
=
defineProps({
  reports: Array,
});

const workflowSteps = ref([]);
const printjobs = ref([]);
const workflows = ref([]);
const labels = ref([]);
const loading = ref(true);
const singleReport = ref(false);

/* Contains Data For All Reports. */
const reportData = ref([
  // reports: [],
  // steps: [],
  // times: [],
  // workflows: [],
  // printjobs: [],
]);

//////////////////
//// Navigation
//////////////////

const scrollToBottomOfCharts = () => {
  document.getElementById("chart-bottom").scrollIntoView();
};

const scrollToTopOfOverview = () => {
  document.getElementById("overview-top").scrollIntoView();
};

const scrollToTopOfComparison = () => {
  document.getElementById("comparison-top").scrollIntoView();
};

const addTimes = (workflowSteps, stepTimes) => {
  workflowSteps.forEach((step) => {
    step.time = stepTimes[step.id] ? stepTimes[step.id] : 0;
  });
  return workflowSteps;
};

const addMissing = (workflowSteps, stepDefinitions) => {
  const stepExists = {};
  workflowSteps.forEach(step => {
    stepExists[step.WorkflowStepID] = step;
  });

  const allSteps = [];
  stepDefinitions.forEach(definedStep => {
    // If we have this step, join it with it's definition info
    const s = stepExists[definedStep.id];
    definedStep.time = 0;
    if (s) {
      allSteps.push({...definedStep, ...s });
    // If we don't have this step, include only the definition
    } else {
      allSteps.push(definedStep);
    }
  });

  return allSteps;
};

const getGenericWorkflowSteps = async () => {
  const response = await getCollection('WorkflowStep');
  if (response.ok) {
    return response.json();
  }
  alert("Failed to get workflow steps.");
  return [];
};

const prepareReports = async (workflowStepDefinitions) => {
  const genericSteps = await getGenericWorkflowSteps();

  // Get a local copy of all reports.
  const mutableReports = reports.map((report)=>{
    return JSON.parse(JSON.stringify(report));
  });

  // Get peripheral info about each report
  mutableReports.forEach( async (report) => {

    report.dateTime = report.Date + " " + report.Time;

    const response = await Promise.all([
      getPrintJob(report.PrintJobID),
      getWorkflow(report.WorkflowID),
      getWorkflowTimes(report.id),
    ]);

    for (let i = 0; i < response.length; i++) {
      if (!response[i].ok) {
        alert("Error Getting Data!");
        return false;
      }
    }

    const printjob = response[0].ok ? await response[0].json() : null;
    const workflow = response[1].ok ? await response[1].json() : null;
    const stepTime = response[2].ok ? await response[2].json() : null;
    const steps = addTimes(addMissing(workflow.WorkflowSteps, genericSteps), stepTime);
    const times = steps.map((step)=> {
      return step.time;
    });

    const all = {
      printjob: printjob,
      workflow: workflow,
      stepTime: stepTime,
      steps: steps,
      times: times,
      report: report,
    }

    reportData.value.push(all);

  });

  // Get labels for our charts
  labels.value = genericSteps.map((step) => {
    return step.Title;
  });

};

//////////////////
//// On Mounted
//////////////////

onMounted(
  async () => {
    await prepareReports();
    loading.value=false;
});
</script>
<style scoped>
.close-button:hover {
    color: red;
}

.title {
  text-align:center;
  font-weight:500;
  text-transform:uppercase;
  font-size: 24px;
}

.header-row{
  background-color:#555555;
  color:white;
  position:fixed;
  z-index:100;
  height:40px;
  width:100%;
  margin:0;
}

.overview-card{
  border-width:1px;
  border-style:solid;
  border-color: rgba(0, 0, 0, 0.2);
  width: 600px;
  padding-left:2%;
  padding-right:2%;
  padding-top:1%;
}

.comparison-card{
  border-width:1px;
  border-style:solid;
  border-color: rgba(0, 0, 0, 0.2);
  height: 100%;
  padding-left:2%;
  padding-right:2%;
  padding-top:1%;
}

.chart-card-single {
  border-style:solid;
  border-width:1px;
  border-color: rgba(0, 0, 0, 0.3);
  flex: 1;
  flex-direction:column;
  height: 700px;
  width: 600px;
}

.chart-card-double {
  border-style:solid;
  border-width:1px;
  border-color: rgba(0, 0, 0, 0.3);
  flex: 1;
  flex-direction:column;
  height: 700px;
  width: 1200px;
}

.chart-card-title{
  width:100%;
  background-color:rgba(50,50,50, 0.7);
  color:white;
  font-family:'Courier New', Courier, monospace;
  font-weight:600;
  text-align:center;
}
</style>

