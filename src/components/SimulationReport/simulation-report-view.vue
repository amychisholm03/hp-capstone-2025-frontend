<template>
  <v-card
    v-if="!loading"
    :class="mobile ? 'simulation-report-view-mobile' : 'simulation-report-view'"
  >
    <v-btn
      class="close-button"
      size="small"
      color="white"
      icon
      flat
      @click="$emit('exit')"
    >
      <v-icon size="x-large">
        mdi-window-close
      </v-icon>
    </v-btn>

    <v-row
      no-gutters
      class="align-row d-flex"
      :class="mobile ? 'main-body' : 'main-body-mobile'"
    >
      <v-col class="section">
        <!-- Overview -->
        <v-row
          class="overview-card"
          no-gutters
        >
          <v-col>
            <report-overview
              :report-data="reportData"
              :mobile="mobile"
            >
            </report-overview>
          </v-col>
        </v-row>

        <div class="vertical-gap"></div>

        <!-- Comparison -->
        <v-row
          no-gutters
          class="comparison-card"
        >
          <v-col>
            <report-comparison
              :report-data="reportData"
              :labels="labels"
              :mobile="mobile"
            ></report-comparison>
          </v-col>
        </v-row>

        <!-- Graphs (Mobile Only) -->
        <v-row
          v-if="mobile"
          class="chart-card"
          no-gutters
        >
          <v-col
            style="display:flex; flex-direction:column; overflow:hidden; height:100%;"
          >
            <v-tabs
              v-model="selectedChart"
              fixed-tabs
            >
              <v-tab
                v-for="{ index, printjob, workflow } in reportData"
                :key="index"
                :value="index"
                color="white"
                :class="index === selectedChart ? 'tab-selected' : 'tab-unselected'"
                style="max-width:unset;"
              >
                {{ printjob.Title }} - {{ workflow.Title }}
              </v-tab>
            </v-tabs>

            <!-- Chart Canvas -->
            <div
              class="align-center d-flex justify-center pl-3 pr-3"
            >
              <canvas
                id="chart-canvas"
                style="max-width:600px; max-height:500px; display:block;"
              >
              </canvas>
            </div>

            <!-- Chart Selector -->
            <chart-all
              v-if="chartCanvas"
              style="margin-top:auto;"
              :chart-info="{data: selectedChartData, labels: selectedChartLabels }"
              :canvas="chartCanvas"
            >
            </chart-all>
          </v-col>
        </v-row>
      </v-col>

      <v-col class="horizontal-gap"></v-col>

      <!-- Graph Section (desktop only) -->
      <v-col
        v-if="!mobile"
        class="section"
      >
        <v-row
          class="chart-card"
          no-gutters
        >
          <v-col
            style="display:flex; flex-direction:column; overflow:hidden; height:100%;"
          >
            <v-tabs
              v-model="selectedChart"
              fixed-tabs
            >
              <v-tab
                v-for="{ index, printjob, workflow } in reportData"
                :key="index"
                :value="index"
                color="white"
                :class="index === selectedChart ? 'tab-selected' : 'tab-unselected'"
                style="max-width:unset;"
              >
                {{ printjob.Title }} - {{ workflow.Title }}
              </v-tab>
            </v-tabs>

            <!-- Chart Canvas -->
            <div
              class="align-center d-flex justify-center pa-3"
              style="height:100%; width:100%;"
            >
              <canvas
                id="chart-canvas"
                style="max-width:600px; max-height:600px; display:block;"
              >
              </canvas>
            </div>

            <!-- Chart Selector -->
            <chart-all
              v-if="chartCanvas"
              style="margin-top:auto;"
              :chart-info="{data: selectedChartData, labels: selectedChartLabels }"
              :canvas="chartCanvas"
            >
            </chart-all>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
import { onMounted, ref, computed, nextTick } from "vue";
import {getPrintJob, getWorkflow, getCollection, getWorkflowTimes } from "../api.js";
import ChartAll from '../Chart/chart-all.vue';
import ReportOverview from './View/overview.vue';
import ReportComparison from './View/comparison.vue';

//// Props
const {
  reports = [],
  mobile = false,
}
=
defineProps({
  reports: Array,
  mobile: Boolean,
});

///////////////////
//// DATA
///////////////////

const loading = ref(true);

const reportData = ref([]);
const genericSteps = ref(null);
const labels = ref([]);

const selectedChart = ref(null);
const chartCanvas = ref(null);

//////////////////
//// COMPUTED
//////////////////

const selectedChartData = computed(() => {
  if (selectedChart.value === null) {
    return [];
  }
  const report = reportData.value[selectedChart.value];
  return report.steps.map((step)=>{
    return step.time;
  });
});

const selectedChartLabels = computed(() => {
  return labels.value.map((label)=>{
    return label.title;
  })
});

///////////////////////
//// Logic
//////////////////////

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

/**
* Create Step
* @return {object} formatted step object
*/
const createStep = (reportId, stepId, stepTitle, timePerPage, setupTime, totalTime, isPlaceholder = false) => {
  return {
    reportid: reportId,
    stepid: stepId,
    title: stepTitle,
    setuptime: setupTime,
    timeperpage: timePerPage,
    time: totalTime,
    placeholder: isPlaceholder,
  }
}

const prepareReports = async (workflowStepDefinitions) => {
  //// 1. Copy Reports
  const mutableReports = reports.map((report)=>{
    return JSON.parse(JSON.stringify(report));
  });

  //// 2. Insert information into reports
  //// Todo: Make asynchrnous?
  let index = 0;
  for (const report of mutableReports) {

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

    const printjob = await response[0].json();
    const workflow = await response[1].json();
    const stepTime = await response[2].json();
    const steps = [];
    const stepsAccountedFor = {};

    //// Add formatted time to report
    report.dateTime = report.Date + " " + report.Time;

    //// Add each workflow step we have accounted a time for.
    for (let i = 0; i < workflow.Steps.length; i++) {
      const { id, setup_time, time_per_page, title } = workflow.Steps[i].data;
      const time = stepTime[id] ? stepTime[id] : 0;
      steps.push(
        createStep(report.id, id, title, time_per_page, setup_time, time)
      );
      stepsAccountedFor[id] = true;
    }

    //// Add any workflow steps we are missing time for as placeholders.
    for (let i = 0; i < genericSteps.value.length; i++) {
      if (!stepsAccountedFor[i]) {
        const { id, Title, SetupTime, TimePerPage } = genericSteps.value[i];
        steps.push(
          createStep(report.id, id, Title, TimePerPage, SetupTime, 0, true)
        );
        stepsAccountedFor[id] = false;
      }
    }

    let colors = [
      'purple',
      'orange',
      'green',
      'red',
      'blue',
    ];

    const all = {
      printjob: printjob,
      workflow: workflow,
      steps: steps,
      report: report,
      color: colors.pop(),
      index
    }

    reportData.value.push(all);
    index++;

  }

  //// 3. Get labels for our charts
  let i = 0;
  labels.value = genericSteps.value.map((step) => {
    return {title: step.Title, value: i++ }
  });

};

//////////////////
//// On Mounted
//////////////////

onMounted(
  async () => {
    genericSteps.value = await getGenericWorkflowSteps();
    await prepareReports();
    loading.value=false;
    await nextTick();
    setTimeout(() => {
      chartCanvas.value = document.getElementById("chart-canvas");
    }, 1000);
});
</script>
<style scoped>
.simulation-report-view {
  --vertical-gap:  16px;
  --horizontal-gap: 4vw;
  --header-height: 3vh;
  --overall-height: 96vh;
  --overall-padding: 16px;
  --overall-padding-top: 48px;
  --overall-width: 100%;
  --section-height: calc(100% - var(--overall-padding));
  --section-width: calc(((--overall-width) - calc(var(--overall-padding)) - calc(var(--horizontal-gap))) / 2);
  width: var(--overall-width);
  height: var(--overall-height);
  border-radius:10px !important;
  overflow: hidden !important;
  padding: var(--overall-padding);
  padding-top: var(--overall-padding-top);
  position:relative;
}

.simulation-report-view-mobile {
  --vertical-gap:  1vh;
  --header-height: 3vh;
  --overall-height: 96vh;
  --overall-padding: 2vw;
  --overall-width: 100%;
  --section-height: 100%;
  --section-width: var(--overall-width);
  width: var(--overall-width);
  height: var(--overall-height);
  max-height: var(--overall-height);
  border-radius:10px !important;
  padding-left: var(--overall-padding);
  padding-right: var(--overall-padding);
  padding-top: 32px;
  overflow-y: scroll !important;
  position:relative;
}

.header-bar {
  height: var(--header-height);
  max-height: var(--header-height);
  min-height: var(--header-height);
}

.main-body {
  height: 100%;
  overflow: hidden;
  flex-wrap: nowrap;
}

.main-body-mobile {
  padding:var(--overall-padding);
  height: var(--section-height);
  max-height: var(--section-height);
  min-height: var(--section-height);
}

.vertical-gap {
  height:var(--vertical-gap);
  min-height:var(--vertical-gap);
  max-height:var(--vertical-gap);
  padding:0;
  margin:0;
}
.horizontal-gap {
  width:var(--horizontal-gap);
  max-width:var(--horizontal-gap);
  min-width:var(--horizontal-gap);
  padding:0;
  margin:0;
}

.close-button{
  position:absolute;
  top:2px;
  right:2px;
  z-index:999;
}

.close-button:hover {
  opacity:0.5;
}

.title {
  text-align:center;
  font-weight:500;
  text-transform:uppercase;
  font-size: 24px;
}

.header-row{
  background-color:#000000;
  color:white;
  position:fixed;
  z-index:100;
  width:100%;
  margin:0;
}

.section {
  display:block;
  overflow:hidden;
  min-width:  var(--section-width);
  max-width:  var(--section-width);
  width:      var(--section-width);
  min-height: var(--section-height);
  max-height: var(--section-height);
  height:     var(--section-height);
}

.overview-card {
  display:block;
  height: calc((var(--section-height) - var(--vertical-gap)) / 2);
  justify-content:start;

  max-width:inherit;
  min-width:inherit;

  overflow:hidden;

  box-shadow: none;
}

.overview-card-mobile {
  display:block;

  width:100%;

  overflow:hidden;

  box-shadow: none;
}

.comparison-card{
  height: calc((var(--section-height) / 2));
  background:white;
  overflow-x:hidden;
  overflow-y:auto;
  border-width: 1px;
  border-style:solid;
  border-radius:5px;
  border-color: rgba(0, 0, 0, 0.4);
  box-shadow:none;
}

.comparison-card-mobile{
  background:white;

  width:100%;

  padding-left:2%;
  padding-top:3%;
  padding-bottom:3%;

  overflow-x:hidden;
  overflow-y:auto;

  border-width: 1px;
  border-style:solid;
  border-radius:5px;
  border-color: rgba(0, 0, 0, 0.4);
  box-shadow:none;
}


.chart-card{
  background:white;
  display:block;
  height: 100%;
  max-height:100%;
  min-height:100%;
  max-width:inherit;
  border-width: 1px;
  border-style:solid;
  border-radius:5px;
  border-color: rgba(0, 0, 0, 0.4);
  box-shadow:none;
}

.chart-card-mobile {
  background:white;
  display:block;
  height: 100%;
  width:100%;
  border-width: 1px;
  border-style:solid;
  border-radius:5px;
  border-color: rgba(0, 0, 0, 0.4);
  box-shadow:none;
}

.chart-card-title{
  height:18px;
  text-align:center;
  text-justify: center;
  background-color:rgb(25,25,25);
  color:white;
  font-weight: bold;
  font-size: 1.0em;
  font-family: 'Courier New', Courier, monospace;
  border-radius:5px;
  text-transform: uppercase;
}

@keyframes pop {
 0%    { scale: 2.0; }
 10%   { scale: 2.5; }
 20%   { scale: 2.0; }
 30%   { scale: 2.5; }
 40%   { scale: 2.0; }
 50%   { scale: 2.5; }
 75%   { scale: 2.0; }
 90%   { scale: 2.0; opacity:1; }
 100%  { scale: 2.0; opacity:0; }
}
.v-btn-toggle .v-btn {
  margin-right: 0 !important;
  margin-left: 0 !important;
}

.v-btn-toggle {
  margin-left: 5px !important;
}

.step-name-selectable:hover {
  opacity:0.5;
  cursor:pointer;
}

.tab-selected {
  color: #000000 !important;
  font-weight:600;
  font-size:1.0em;
}

.tab-unselected {
  font-weight:400;
  font-size:0.8em;
}
</style>

