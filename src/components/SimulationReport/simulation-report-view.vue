<template>
  <v-card
    v-if="!loading"
    class="ma-0 pa-0 simulation-report-view"
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
          <div v-if="reportData.length === 1">
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


    <v-row class="ma-2">
      <!-- Section 1 -->
      <v-col class="pa-0 section">
        <v-row>
          <!-- Overview -->
          <div id="overview-top" />
          <v-col>
            <v-card
              class="overview-card"
            >
              <v-row>
                <v-col class="overview-card-title">
                  <span> Overview </span>
                </v-col>
              </v-row>
              <v-row
                ref="overviewScroll"
                style="flex-wrap:nowrap; overflow-x:auto; overflow-y:hidden;"
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
                  v-for="{report, printjob, workflow, color} in reportData"
                  :key="report.id"
                >
                  <div :style="`width:${ calculateOverviewWidth()};`">
                    <!-- Title -->
                    <div class="d-flex justify-center mb-1 mt-2">
                      <v-chip
                        :color="color"
                        tile
                      >
                        <span style="color:black; font-weight:bold;">
                          {{ printjob.Title }}/{{ workflow.Title }}
                        </span>
                      </v-chip>
                    </div>

                    <!-- Data -->
                    <v-row>
                      <v-col class="mr-2">
                        <v-text-field
                          v-for="header in headersOverview.report"
                          :key="header.value"
                          v-model="report[header.value]"
                          :label="String(header.text)"
                          class="overview-text-field"
                          hide-details
                          readonly
                        />
                        <v-text-field
                          v-for="header in headersOverview.printjob"
                          :key="header.value"
                          v-model="printjob[header.value]"
                          :label="String(header.text)"
                          class="overview-text-field"
                          hide-details
                          readonly
                        />
                        <v-text-field
                          v-for="header in headersOverview.workflow"
                          :key="header.value"
                          v-model="workflow[header.value]"
                          :label="String(header.text)"
                          class="overview-text-field"
                          readonly
                        />
                      </v-col>
                    </v-row>
                  </div>
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
              <v-row>
                <v-col class="comparison-card-title">
                  <span> Comparison </span>
                </v-col>
              </v-row>
              <v-row
                ref="comparisonScroll"
                class="align-row d-flex"
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
                  cols="auto"
                >
                  <table>
                    <thead>
                      <tr>
                        <th class="comparison-header">
                          <div class="d-flex justify-center">
                            <v-chip>
                              <span style="color:black; font-weight:bold;">
                                OPERATION
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
                        <td style="text-align: center;">
                          {{ label }}
                        </td>
                      </tr>
                    </thead>
                  </table>
                </v-col>
                <v-col
                  v-for="{report, printjob, workflow, times, color } in reportData"
                  :key="report.id"
                  style="border-left-style:solid; border-left-color:grey; border-left-width:1px;"
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
                    </thead>
                    <tbody>
                      <tr
                        v-for="(time, i) in times"
                        :key="i"
                      >
                        <td class="d-flex justify-center">
                          {{ time }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
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
              <v-row>
                <v-col class="chart-card-title">
                  <span> Chart </span>
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  v-for="{ report, times } in reportData"
                  :key="report.id"
                >
                  <chart-all
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
    { text: "Total Time Taken", value: "TotalTimeTaken" },
    { text: "Rasterization Profile", value: "RasterizationProfile" },
  ],
  printjob: [
    { text: "Page Count", value: "PageCount" },
    { text: "Print Job Title", value: "Title" },
  ],
  workflow: [
    { text: "Workflow Title", value: "Title" },
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
.simulation-report-view {
  --title-height: 40px;
}

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
  height:var(--title-height);
  width:100%;
  margin:0;
}

.overview-card {
  border-width: 2px;
  border-style:solid;
  border-radius:5px;
  padding:10px;
  border-color: rgba(0, 0, 0, 1);
  overflow:hidden;
  max-width:48vw;
  max-height:50vh;
  width:fit-content;
}

.overview-card-title {
  width:100%;
  height:48px;
  text-align:center;
  text-justify: center;
  background-color:black;
  color:white;
  font-family: 'Courier New', Courier, monospace;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 1.2em;
}

.comparison-card{
  border-width: 2px;
  border-style:solid;
  border-radius:5px;
  border-color: rgba(0, 0, 0, 1);
  max-width:35vw;
  max-height:35vh;
  padding:10px;
}

.comparison-card-title{
  width:100%;
  height:48px;
  text-align:center;
  text-justify: center;
  background-color:black;
  color:white;
  font-family: 'Courier New', Courier, monospace;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 1.2em;
}

.comparison-header{
  max-height:35px;
  height:35px;
  overflow-y:hidden;
}

.chart-card{
  border-width: 2px;
  border-style:solid;
  max-width:48vw;
  max-height:88vh;
  border-radius:5px;
  border-color: rgba(0, 0, 0, 1);
}

.chart-card-title{
  width:100%;
  height:48px;
  text-align:center;
  text-justify: center;
  background-color:black;
  color:white;
  font-family: 'Courier New', Courier, monospace;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 1.2em;
}

.section {
  width:50%;
  max-width:50%;
  margin-top: var(--title-height);
}

@keyframes pop {
 0%    { scale: 2.0; }
 45%   { scale: 2.0; }
 60%   { scale: 2.5; }
 75%   { scale: 2.0; }
 90%   { scale: 2.0; opacity:1; }
 100%  { scale: 2.0; opacity:0; }
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

