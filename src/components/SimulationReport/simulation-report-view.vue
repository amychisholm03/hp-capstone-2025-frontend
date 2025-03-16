<template>
  <v-card
    v-if="!loading"
    class="simulation-report-view"
  >
    <v-row
      no-gutters
      class="header-bar"
    >
      <v-col class="align-center d-flex header-bar justify-end">
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

    <v-row
      no-gutters
      style="flex-wrap: nowrap;"
      class="align-row d-flex main-body"
    >
      <!-- Section 1 -->
      <v-col class="section">
        <v-row
          class="overview-card"
          no-gutters
        >
          <div id="overview-top" />
          <!-- Overview -->
          <v-col>
            <v-row
              ref="overviewScroll"
              no-gutters
              class="overview-list-container"
            >
              <div
                v-if="overviewArrow && !scrollArrowConsumed"
                class="align-center d-flex justify-center scroll-arrow"
                @click="scrollToEndOfOverview"
              >
                <v-icon
                  size="large"
                  style="z-index:102; position:absolute;"
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
          </v-col>
        </v-row>
        <!-- End Overview -->

        <div class="vertical-gap"></div>

        <!-- Comparison -->
        <div id="comparison-top" />
        <v-row
          no-gutters
          class="comparison-card"
        >
          <v-col style="height:100%;">
            <v-row
              no-gutters
              class="align-row d-flex"
              style="flex-wrap: nowrap; height:100%;"
            >
              <!-- Step Name Column -->
              <v-col
                cols="2"
              >
                <table height="100%">
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
                  <tbody>
                    <tr
                      v-for="label in labels"
                      :key="label.value"
                    >
                      <td
                        style="text-align:center;"
                        class="step-name-selectable"
                        @click="highlightStep(label.value)"
                      >
                        <span
                          class="comparison-field"
                        >
                          <strong v-if="label.value === highlightedStep">
                            {{ label.title }}
                          </strong>
                          <span v-else>
                            {{ label.title }}
                          </span>
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </v-col>

              <!-- Step Times -->
              <v-col cols="6">
                <!-- Scroll Indicator -->
                <v-row
                  ref="comparisonScroll"
                  no-gutters
                  class="align-row d-flex"
                  style="flex-wrap:nowrap; flex-direction:row; overflow-x:scroll; overflow-y:hidden; height:100%; width:100%;"
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

                  <!-- Steps For A Particular Simulation... -->
                  <v-col
                    v-for="{report, printjob, workflow, steps, color } in reportData"
                    :key="report.id"
                    class="comparison-item"
                    style="width:8vh;"
                  >
                    <table height="100%">
                      <thead>
                        <tr>
                          <th class="comparison-header">
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
                      </thead>
                      <tbody>
                        <tr
                          v-for="(step, i) in steps"
                          :key="i"
                        >
                          <!-- Highlighting active: highlighted step -->
                          <td style="text-align:center;">
                            <span
                              v-if="i === highlightedStep"
                              class="comparison-field"
                            >
                              {{ toTimeUnit(step.time) }}
                            </span>
                            <!-- No Highlighting Active -->
                            <span
                              v-else-if="highlightedStep === null"
                              class="comparison-field"
                            >
                              {{ toTimeUnit(step.time) }}
                            </span>
                            <!-- Highlighting Active: non-highlighted step -->
                            <span
                              v-else
                              style="opacity:0.2;"
                              class="comparison-field"
                            >
                              {{ toTimeUnit(step.time) }}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </v-col>
                </v-row>
              </v-col>
              <!-- End Step Times Column -->

              <v-spacer></v-spacer>

              <!-- Settings Column -->
              <v-col
                cols="4"
                style="border-left:solid 1px grey; display:flex; flex-wrap:nowrap; flex-direction: column; row-gap:16px; overflow-y:scroll; overflow-x:hidden; padding-left:2%;"
              >
                <div class="d-flex justify-center">
                  <v-btn
                    rounded
                    size="small"
                    color="primary"
                  >
                    <v-icon>
                      mdi-file-delimited-outline
                    </v-icon>
                  </v-btn>
                  <v-btn
                    rounded
                    size="small"
                    color="primary"
                  >
                    <v-icon>
                      mdi-file-pdf-box
                    </v-icon>
                  </v-btn>
                  <v-btn
                    rounded
                    size="small"
                    color="primary"
                  >
                    <v-icon>
                      mdi-email
                    </v-icon>
                  </v-btn>
                </div>

                <v-divider></v-divider>

                <v-btn-toggle
                  v-model="secondsOrMinutes"
                  mandatory
                  base-color="grey-darken-2"
                  class="d-flex justify-center"
                >
                  <v-btn
                    :value="0"
                    color="green-darken-2"
                    size="x-small"
                    style="color:white !important; font-weight:900; height:3vh; width:50%;"
                  >
                    Minutes
                    <v-icon
                      v-if="!secondsOrMinutes"
                      class="mb-1 ml-1"
                    >
                      mdi-check-circle-outline
                    </v-icon>
                  </v-btn>
                  <v-btn
                    color="green-darken-2"
                    size="x-small"
                    style="color:white !important; font-weight:900; height:3vh; width:50%;"
                    :value="1"
                  >
                    Seconds
                    <v-icon
                      v-if="secondsOrMinutes"
                      class="mb-1 ml-1"
                    >
                      mdi-check-circle-outline
                    </v-icon>
                  </v-btn>
                </v-btn-toggle>
                <v-spacer></v-spacer>
              </v-col>
              <!-- End Settings Column -->
            </v-row>
          </v-col>
        </v-row>
        <!-- End Comparison -->
      </v-col>
      <!-- End Section 1 -->

      <v-col class="horizontal-gap">
      </v-col>

      <!-- Section 2 -->
      <v-col class="section">
        <!-- Charts -->
        <v-row
          class="chart-card"
          no-gutters
        >
          <v-col
            v-for="{ report, steps } in reportData"
            :key="report.id"
          >
            <chart-all
              :data="steps.map((step) => {
                return step.time;
              })"
              :labels="labels"
              :chart-id="report + report.id"
            >
            </chart-all>
          </v-col>
        </v-row>
        <!-- End Charts -->
        <div id="chart-bottom" />
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
  if (secondsOrMinutes.value === 0) {
    return (time / 60).toFixed(2);
  }
  return time;
};
const comparisonScroll = ref(null);
const comparisonArrow = ref(false);
const overviewScroll = ref(null);
const overviewArrow = ref(false);
const scrollArrowConsumed = ref(false);
const checkScroll = () => {
  const element = comparisonScroll.value.$el;
  comparisonArrow.value = element.scrollLeft + element.clientWidth < element.scrollWidth;
  const element2 = overviewScroll.value.$el;
  overviewArrow.value = element2.scrollLeft + element2.clientWidth < element2.scrollWidth;
}

const reportData = ref([]);
const labels = ref([]);
const loading = ref(true);
const highlightedStep = ref(null);

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


const scrollToEndOfOverview = () => {
  const refval = overviewScroll.value;
  if (refval) {
    const el = refval.$el;
    const max = el.scrollWidth;
    el.scrollBy(max,0, 'smooth');
  }
  scrollArrowConsumed.value = true;
};

const scrollToTopOfComparison = () => {
  document.getElementById("comparison-top").scrollIntoView();
};


//////////////////////
//// Logic
//////////////////////

const generateHeatmap = (steps) => {
  const maps = [];

  // Loop through each step (eg Rasterization, Lamination etc.)
  steps.forEach((step) => {
    const times = [];
    let index = 0;

    // Loop through each simulation report and get it's time for our current step
    reportData.value.forEach((report) => {
      times.push({
          reportId: index++,
          time: report.steps[step.value].time
        });
    });


    // Now that we have all times for this step, sort them.
    times.sort((a,b)=>{
      return (a.time > b.time);
    });

    // Each simulation report will be assigned a score from where it lies in the sorted array.
    const scores = {};
    let score = 0;
    let last_time = times.length ? times[0].time : null;
    times.forEach((time)=>{
      scores[time.reportId] = score;

      // we don't want multiple identical times with different colors.
      if (time.time !== last_time) {
        score++;
      }

      last_time = time.time;

    });

    maps.push({
      stepId: step.value,
      scores,
    });

  });

  console.log(maps);

  return maps;

};

///////////////////////
//// Display
//////////////////////

const highlightStep = (index) => {
  if (index === highlightedStep.value) {
    highlightedStep.value = null;
  } else {
    highlightedStep.value = index;
  }
}

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


  let index = 0;

  // Get peripheral info about each report
  for (const report of mutableReports) {

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
      return { title: step.Title, time: step.time }
    });


    const all = {
      printjob: printjob,
      workflow: workflow,
      stepTime: stepTime,
      steps: steps,
      times: times,
      report: report,
      color: colors.pop(),
      index
    }

    reportData.value.push(all);

    index++;

  }

  // Get labels for our charts
  let i = 0;
  labels.value = genericSteps.map((step) => {
    return {title: step.Title, value: i++ }
  });

  generateHeatmap(labels.value);

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
.simulation-report-view {
  --vertical-gap:  1vh;
  --horizontal-gap: 4vw;
  --header-height: 3vh;
  --overall-height: 96vh;
  --overall-padding: 1vw;
  --overall-width: 100%;
  --section-height: calc(100% - var(--overall-padding));
  --section-width: calc((--overall-width) - calc(var(--overall-padding)) - calc(var(--horizontal-gap)));
  width: var(--overall-width);
  height: var(--overall-height);
  border-radius:10px !important;
}

.header-bar {
  height: var(--header-height);
  max-height: var(--header-height);
  min-height: var(--header-height);
}

.main-body {
  padding:var(--overall-padding);
  height: var(--section-height);
  max-height: var(--section-height);
  min-height: var(--section-height);
  overflow:hidden;
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

  min-width: calc(var(--section-width) / 2);
  max-width: calc(var(--section-width) / 2);
  width: calc(var(--section-width) / 2);

  min-height: var(--section-height);
  max-height: var(--section-height);
  height: var(--section-height);

  overflow:hidden;
}

.overview-card {
  display:block;
  height: calc((var(--section-height) - var(--vertical-gap)) / 2);

  max-width:inherit;
  min-width:inherit;

  overflow:hidden;

  box-shadow: none;
}

.comparison-card{
  background:white;
  display:block;
  height: calc((var(--section-height) - var(--vertical-gap)) / 2);

  max-width:inherit;
  min-width:inherit;

  padding:10px;

  overflow:hidden;

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
  max-height: var(--section-height);
  min-height: var(--section-height);
  max-width:inherit;
  border-width: 1px;
  border-style:solid;
  border-radius:5px;
  border-color: rgba(0, 0, 0, 0.4);
  box-shadow:none;
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
  height:35px;
  max-height:35px;
  min-height:35px;
  overflow-y:hidden;
}

.comparison-field {
  font-size: 0.8rem;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 1vw;
  max-width: 1vw;
  min-width: 1vw;
  aspect-ratio: 2/1;
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

.overview-list-container {
  height:100%;
  position:relative;
  display:flex;
  flex-direction: row;
  overflow-x:scroll;
  overflow-y:hidden;
  flex-wrap:nowrap;
  flex-grow:1;
}

.overview-list{
  background:white;
  height:inherit;
  max-height:inherit;
  width:14vw;
  max-width:14vw;
  border-width:1px;
  border-color:rgba(50,50,50,0.5);
  margin-right:5px;
  border-radius: 15px;
  border-style:groove;
}

.scroll-arrow {
  position:absolute;
  right:5%;
  bottom:50%;
  animation-name:pop;
  animation-duration:6s;
  animation-fill-mode:forwards;
  color:black;
  z-index:150;
}

.scroll-arrow:hover {
  opacity: 0.5;
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
</style>

