<template>
  <v-card
    v-if="!loading"
    class="simulation-report-view"
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
      fill-height
      no-gutters
    >
      <!-- Left Half of View -->
      <v-col
        style="overflow:hidden;"
        fill-height
        no-gutters
        cols="6"
        class="pa-3"
      >
        <report-overview
          style="height:45%; width:100%;"
          :report-data="reportData"
          :mobile="mobile"
        >
        </report-overview>

        <div class="vertical-gap"></div>

        <report-comparison
          style="height:50%; width:100%;"
          :report-data="reportData"
          :labels="labels"
          :mobile="mobile"
        ></report-comparison>

        <div
          v-if="mobile"
          class="vertical-gap"
        ></div>

        <report-chart
          v-if="mobile"
          :mobile="mobile"
          :report-data="reportData"
          :selected-chart-data="selectedChartData"
          :selected-chart-labels="selectedChartLabels"
          @select-chart="selectChart"
        >
        </report-chart>
      </v-col>

      <v-col class="horizontal-gap"></v-col>
    
      <!-- Right Half of View -->
      <v-col
        v-if="!mobile"
        style="overflow:hidden;"
        no-gutters
        fill-height
        cols="6"
        class="pa-3 pb-12 pt-12"
      >
        <report-chart
          style="height:90%; width:100%;"
          :mobile="mobile"
          :report-data="reportData"
          :selected-chart-data="selectedChartData"
          :selected-chart-labels="selectedChartLabels"
          @select-chart="selectChart"
        ></report-chart>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
import { onMounted, ref, computed, nextTick } from "vue";
import {getPrintJob, getWorkflow, getCollection, getWorkflowTimes } from "../api.js";
import ReportOverview from './View/overview.vue';
import ReportComparison from './View/comparison.vue';
import ReportChart from './View/charts.vue';

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

const colors = [ //nice colors to associate with simulation reports
    'purple',
    'orange-darken-2',
    'green-darken-3',
    'red',
    'blue-darken-2',
    'purple',
    'orange-darken-2',
    'green-darken-3',
    'red',
    'blue-darken-2',
    'purple',
    'orange-darken-2',
    'green-darken-3',
    'red',
    'blue-darken-2',
  ];

const loading = ref(true);

const reportData = ref([]);
const genericSteps = ref(null);
const labels = ref([]);

const selectedChart = ref(null);

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

const selectChart = (selection) =>{
  selectedChart.value = selection;
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
});
</script>
<style scoped>
.simulation-report-view {
  position: relative;
  height: inherit;
  width:  inherit;
  max-height: inherit;
  max-width:  inherit;
}
/* 
.simulation-report-view-mobile {
  --vertical-gap:  1vh;
  --header-height: 3vh;
  --horizontal-gap: 0;
  --overall-height: 96vh;
  --overall-padding: 16px;
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
  position:relative;
} */

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

.overview-card {
  display:block;
  justify-content:start;

  width: 30vw;

  /* min-width:  var(--section-width);
  max-width:  var(--section-width);
  width:      var(--section-width); */

  box-shadow: none;
}

.overview-card-mobile {
  display:block;
  height:40vh;
  justify-content:start;
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
.conform{
  max-height:inherit;
  max-width:inherit;
}
</style>

