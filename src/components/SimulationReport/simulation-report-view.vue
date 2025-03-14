<template>
  <v-card
    v-if="!loading"
    class="ma-0 pa-0 simulation-report-view"
  >
    <v-row class="ma-0 pa-0">
      <v-col class="align-center d-flex justify-end ma-0 pa-0">
        <v-btn
          class="close-button"
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

    <v-row class="ma-0 pa-0">
      <!-- Section 1 -->
      <v-col class="section">
        <v-row>
          <!-- Overview -->
          <div id="overview-top" />
          <v-col>
            <v-card
              class="overview-card"
            >
              <!-- Body -->
              <v-row
                ref="overviewScroll"
                no-gutters
                style="max-height:inherit; width:inherit; height:inherit; display:flex; flex-direction: row; overflow-x:scroll; overflow-y:hidden; flex-wrap:nowrap;"
              >
                <v-col
                  v-for="{report, printjob, workflow, color} in reportData"
                  :key="report.id"
                  class="overview-list"
                  style=""
                >
                  <!-- Data -->
                  <v-row
                    style="overflow:hidden; height:100%;"
                    no-gutters
                  >
                    <v-col style="width:12vw; height:100%; max-height:100%;">
                      <!-- Simulation Report Title -->
                      <div
                        class="overview-list-header"
                      >
                        <v-chip
                          :color="color"
                          size="x-small"
                        >
                          {{ printjob.Title }}
                        </v-chip>
                        <br />
                        <v-chip
                          size="x-small"
                          :color="color"
                        >
                          {{ workflow.Title }}
                        </v-chip>
                      </div>

                      <!-- Simulation Report Labels -->
                      <div
                        v-for="header in headersOverview.report"
                        :key="header.value"
                        class="overview-list-item"
                      >
                        <div class="overview-list-label">
                          {{ header.text }}
                        </div>
                        <div class="overview-list-value">
                          {{ report[header.value] }}
                        </div>
                        <br />
                      </div>

                      <!-- Print Job Labels -->
                      <div
                        v-for="header in headersOverview.printjob"
                        :key="header.value"
                        class="overview-list-item"
                      >
                        <div class="overview-list-label">
                          {{ header.text }}
                        </div>
                        <div class="overview-list-value">
                          {{ printjob[header.value] }}
                        </div>
                        <br />
                      </div>

                      <!-- Workflow Labels -->
                      <div
                        v-for="header in headersOverview.workflow"
                        :key="header.value"
                        class="overview-list-item"
                      >
                        <div class="overview-list-label">
                          {{ header.text }}
                        </div>
                        <div class="overview-list-value">
                          {{ workflow[header.value] }}
                        </div>
                        <br />
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
        <!-- End Overview -->

        <!-- Comparison -->
        <div id="comparison-top" />
        <v-row style="width:fit-content;">
          <v-col>
            <v-card
              class="comparison-card"
            >
              <v-row
                class="align-row d-flex"
                style="flex-wrap:nowrap;"
              >
                <v-col
                  cols="auto"
                  style="margin-top:14px;"
                >
                  <table>
                    <thead>
                      <tr>
                        <th class="comparison-header">
                          <div class="d-flex justify-center">
                            <v-chip
                              tile
                              color="white"
                            >
                              <span style="color:black; font-weight:bold;">
                                Step
                              </span>
                            </v-chip>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <thead>
                      <tr
                        v-for="label in labels"
                        :key="label"
                      >
                        <td class="comparison-field">
                          {{ label }}
                        </td>
                      </tr>
                    </thead>
                  </table>
                </v-col>
                <v-col cols="auto">
                  <v-row
                    ref="comparisonScroll"
                    class="align-row d-flex mb-0 mt-0"
                    style="flex-wrap:nowrap; overflow-x:scroll; overflow-y:hidden;"
                  >
                    <div
                      v-if="comparisonArrow"
                      class="align-center d-flex justify-center scroll-arrow"
                    >
                      <v-icon
                        size="large"
                        style="position:absolute; z-index:102;"
                      >
                        mdi-circle
                      </v-icon>
                      <v-icon
                        color="white"
                        style="z-index:103;"
                      >
                        mdi-chevron-double-right
                      </v-icon>
                    </div>
                    <v-col
                      v-for="{report, printjob, workflow, times, color } in reportData"
                      :key="report.id"
                      class="comparison-item"
                      :style="`width:${ 100 / reportData.length }%;`"
                      cols="auto"
                    >
                      <!-- Data -->
                      <table
                        style="width:100%;"
                      >
                        <thead>
                          <tr>
                            <th class="comparison-header d-flex justify-center">
                              <v-chip
                                :color="color"
                                tile
                              >
                                <div style="color:black; font-weight:bold; overflow:hidden; font-size:0.8em; width:50em; max-width:50px;">
                                  <p style="text-overflow:ellipsis; overflow-x:hidden;">
                                    {{ printjob.Title }}
                                  </p>
                                  <p style="text-overflow:ellipsis; overflow-x:hidden;">
                                    {{ workflow.Title }}
                                  </p>
                                </div>
                              </v-chip>
                            </th>
                          </tr>
                          <tr>
                            <div class="divider"></div>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="(time, i) in times"
                            :key="i"
                          >
                            <td class="comparison-field d-flex justify-center">
                              {{ toTimeUnit(time) }}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col
                  cols="auto"
                  class="d-flex justify-center"
                >
                  <v-btn-toggle
                    v-model="secondsOrMinutes"
                    rounded
                    outlined
                    mandatory
                  >
                    <v-btn
                      size="x-small"
                      :value="0"
                      color="green-lighten-3"
                    >
                      Minutes
                    </v-btn>
                    <v-btn
                      size="x-small"
                      :value="1"
                      color="green-lighten-3"
                    >
                      Seconds
                    </v-btn>
                  </v-btn-toggle>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
        <!-- End Comparison -->
      </v-col>
      <!-- End Section 1 -->

      <!-- Section 2 -->
      <v-col class="ml-2 pa-0 section">
        <!-- Charts -->
        <v-row>
          <v-col>
            <v-card class="chart-card">
              <v-row
                no-gutters
                style="max-height:inherit; height:inherit; width:inherit; max-width:inherit; overflow-x:hidden; overflow-y:scroll;"
              >
                <v-col
                  v-for="{ report, times } in reportData"
                  :key="report.id"
                  style="flex:0; width:50%; height:50%;"
                >
                  <chart-all
                    style="width:100%; height:100%;"
                    :data="times"
                    :labels="labels"
                    :chart-id="report + report.id"
                  >
                  </chart-all>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
          <!-- End Charts -->
          <div id="chart-bottom" />
        </v-row>
      </v-col>
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

///////////////////
//// DATA
///////////////////

const secondsOrMinutes = ref(0);
const toTimeUnit = (time) => {
  console.log(secondsOrMinutes.value);
  if (secondsOrMinutes.value === 0) {
    return (time / 60).toFixed(2);
  }
  return time;
};
const comparisonScroll = ref(null);
const comparisonArrow = ref(false);
const overviewScroll = ref(null);
const overviewArrow = ref(false);
const checkScroll = () => {
  console.log("BROH");
  const element = comparisonScroll.value.$el;
  comparisonArrow.value = element.scrollLeft + element.clientWidth < element.scrollWidth;
  const element2 = overviewScroll.value.$el;
  overviewArrow.value = element2.scrollLeft + element2.clientWidth < element2.scrollWidth;
}

const reportData = ref([]);
const labels = ref([]);
const loading = ref(true);

const headersOverview = ref({
  report: [
    { text: "Date Created", value: "dateTime" },
    { text: "Total Time (s)", value: "TotalTimeTaken" },
    { text: "Rasterization Profile", value: "RasterizationProfile" },
  ],
  printjob: [
    { text: "Page Count", value: "PageCount" },
  ],
  workflow: [
  ],
});

let colors = [
  'purple',
  'orange',
  'green',
  'red',
  'blue',
];

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

///////////////////////
//// Display
//////////////////////

/**
* Calculates how wide each report in the overview should be
* Based on the assumption each of the two sections (data and graph)
* takes up roughly have the viewport.
*/
const calculateOverviewWidth = () => {
  const reportCount = reportData.value.length ? reportData.value.length : 1;
  if (reportCount === 1) {
    return '100%';
  }
  if (reportCount <= 3) {
    return (45 / reportCount) + 'vw';
  }
  return (45 / 3) + 'vw';
};

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
      color: colors.pop(),
    }

    reportData.value.push(all);

  });

  // Get labels for our charts
  labels.value = genericSteps.map((step) => {
    return step.Title;
  });

};

//////////////////
//// Computed
//////////////////

//////////////////
//// On Mounted
//////////////////

onMounted(
  async () => {
    await prepareReports();
    loading.value=false;
    await nextTick();
    setTimeout(() => {
      checkScroll();
    }, 1000);
});
</script>
<style scoped>
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
  min-width: 48vw;
  max-width: 48vw;
  overflow:hidden;
}

.overview-card {
  overflow:hidden;
  max-width:45vw;
  width:45vw;
  max-height:42vh;
  height: 42vh;
  box-shadow: none;
}

.overview-container{
  margin-left:20px;
  margin-right:20px;
  margin-bottom:20px;
  overflow-x:hidden;
  overflow-y:hidden;
  border-style:solid;
  border-width:1px;
  border-radius:0px;
  border-color:rgba(0,0,0,0.2);
}

.overview-item{
  border-right-style:solid;
  border-left-style:solid;
  border-width:1px;
  margin:0;
  padding:0;
}

.overview-card-title {
  font-size: 1.2em;
  height:18px;
  text-align:center;
  text-justify: center;
  background-color:rgb(25,25,25);
  color:white;
  font-weight: bold;
  font-size: 1.0em;
  font-family: 'Courier New', Courier, monospace;
  border-radius:0px;
  text-transform: uppercase;
  margin-bottom:10px;

}

.comparison-card{
  border-width: 1px;
  border-style:solid;
  border-radius:5px;
  border-color: rgba(0, 0, 0, 0.4);
  max-width:45vw;
  min-width:16vw;
  max-height:35vh;
  border-radius:0px;
  padding:10px;
}

.comparison-card-title{
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

.comparison-header{
  max-height:35px;
  height:35px;
  overflow-y:hidden;
}

.comparison-field {
  text-align: center;
  font-size: 0.8rem;
}

.chart-card{
  max-width:48vw;
  max-height:88vh;
  height:88vh;
  width:48vw;
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
 45%   { scale: 2.0; }
 60%   { scale: 2.5; }
 75%   { scale: 2.0; }
 90%   { scale: 2.0; opacity:1; }
 100%  { scale: 2.0; opacity:0; }
}

.overview-list-item{
  width:100%;
  height:14.28%;
  border-width:1px;
}

.overview-list-header{
  width:100%;
  text-align:center;
  align-content:center;
  height:20%;
  color:white;
  font-family:'Courier New', Courier;
  text-overflow:ellipsis;
  overflow:hidden;
  text-wrap:nowrap;
  max-height:40%;
}

.overview-list-label{
  opacity: 0.7;
  text-overflow:hidden;
  text-align: center;
  max-height:40%;
  max-width:80%;
  margin-left:auto;
  margin-right:auto;
  text-wrap:nowrap;
  overflow:hidden;
  font-size:0.8em;
}

.overview-list-value{
  opacity:1.0;
  text-overflow:ellipsis;
  max-height:60%;
  max-width:80%;
  margin-left:auto;
  margin-right:auto;
  text-align: center;
  text-wrap:nowrap;
  overflow:hidden;
  font-size:0.9em;
}

.overview-list{
  height:inherit;
  max-height:inherit;
  width:8vw;
  border-width:1px;
  border-color:rgba(50,50,50,0.5);
  margin-right:5px;
  border-radius: 15px;
  border-style:groove;
}

.comparison-item {
  border-right-style:solid;
  border-right-color:grey;
  border-right-width:1px;
}

.scroll-arrow {
  position:absolute;
  right:5%;
  bottom:40%;
  animation-name:pop;
  animation-duration:3s;
  animation-fill-mode:forwards;
  color:black;
  z-index:150;
}
</style>

