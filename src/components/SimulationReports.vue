<template>
  <div>
    <LiveChatWidget license="12332502" group="0" />
    <error-popups
      :error="errorMessage"
      @clear-error="errorMessage = ''"
    >
    </error-popups>

    <!-- Viewing Simulation Reports -->
    <v-dialog
      v-model="viewing"
      persistent
      height="96vh"
    >
      <simulation-report-view
        :reports="selectedReports"
        @exit="clearReports"
      >
      </simulation-report-view>
    </v-dialog>

    <!-- Main -->
    <v-main class="pa-3">
      <!-- Create Simulation Reports -->
      <v-card
        class="module"
        style="max-height: 292px; height:auto;"
      >
        <module-toolbar
          class="module-toolbar"
          title="Simulation Report Creation"
          icon="mdi-test-tube"
          @minimize="simReportGenMinimized = true"
          @maximize="simReportGenMinimized = false"
        >
        </module-toolbar>
        <simulation-report-generate
          v-if="!simReportGenMinimized"
          :print-jobs="printJobs"
          :workflows="workflows"
          @create="getSimulationReports"
        ></simulation-report-generate>
      </v-card>
      <div class="mb-1 mt-1"></div>

      <!-- View a List of Simulation Reports -->
      <v-card class="large-module">
        <module-toolbar
          class="module-toolbar"
          title="Simulation Report History"
          icon="mdi-clipboard-text-clock-outline"
          @minimize="simReportHistoryMinimized = true;"
          @maximize="simReportHistoryMinimized = false;"
        >
        </module-toolbar>
        <simulation-report-history
          v-if="!simReportHistoryMinimized"
          style="overflow-x: scroll !important; min-width: 500px;"
          :print-jobs="printJobs"
          :workflows="workflows"
          :simulation-reports="simulationReports"
          @view-reports="viewReports"
        >
        </simulation-report-history>
      </v-card>
    </v-main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getCollection } from "./api.js";
import DetailedReport from './SimulationReport/DetailedReport.vue';
import SimulationReportHistory from './SimulationReport/simulation-report-history.vue';
import SimulationReportGenerate from './SimulationReport/simulation-report-generate.vue';
import SimulationReportView from './SimulationReport/simulation-report-view.vue';
import ModuleToolbar from './module-toolbar.vue';
import ErrorPopups from "./ErrorPopups.vue";
import { LiveChatWidget } from '@livechat/widget-vue'

///////////////////////
//// DATA
///////////////////////

const simReportGenMinimized = ref(false);
const simReportHistoryMinimized = ref(false);
const viewing = ref(false);
const workflows = ref([]);
const printJobs = ref([]);
const simulationReports = ref([]);
const selectedReports = ref([]);
const errorMessage = ref('');

///////////////////////
//// On Mounted
///////////////////////

onMounted(async () => {
  await Promise.all([
    getPrintJobs(),
    getWorkflows(),
    getSimulationReports(),
  ]);
});

//////////////////////
//// User Actions
//////////////////////

/**
* Clear Selected Simulation Reports
*/
const clearReports = () => {
  selectedReports.value = [];
  viewing.value = false;
}

/**
* View One Or More Simulation Report
*/
const viewReports = (reports) => {
  console.log(reports);
  selectedReports.value = reports;
  viewing.value = true;
};

////////////////////////
//// Helper Functions
////////////////////////

const addTimeProperty = (reports) => {
  reports.forEach((report) => {
    const d = new Date(report.CreationTime * 1000);
    const month = d.getMonth() + 1;
    const day   = d.getDate();
    const year  = d.getFullYear();
    const hours = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
    const minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
    report.Date = month + "/" + day + "/" + year;
    report.Time = hours + ":" + minutes;
  });
}

///////////////////
//// API CALLS ////
///////////////////

/**
* Get a list of simulation reports
*/
const getSimulationReports = async () => {
  const response = await getCollection("SimulationReport");
  if (response.ok) {
    simulationReports.value = await response.json();
    addTimeProperty(simulationReports.value);
  } else {
    errorMessage.value = "Error fetching list of simulation reports";
    return false;
  }
  return true;
}

/**
* Get a list of print jobs
*/
const getPrintJobs = async () => {
  const response = await getCollection("PrintJob");
  if (response.ok) {
    printJobs.value = await response.json();
  } else {
    throw new Error(String(response.status));
    errorMessage.value = "Error fetching list of print jobs";
    return false;
  }
  return true;
}

/**
* Get a list of workflows
*/
const getWorkflows = async () => {
  const response = await getCollection("Workflow");
  if (response.ok) {
    workflows.value = await response.json();
  } else {
    errorMessage.value = "Error fetching list of workflows";
    return false;
  }
  return true;
}
</script>

<style scoped>
.exit-button {
  border: none;
  padding: 0;
  box-shadow: none;
  background: transparent;
}

.dashboard-component {
  border: 1px;
  width: 400px;
  height: 400px;
}

.dashboard-container {
  max-width: 400px;
}

:deep(.v-overlay--active) {
  display: none;
}

:deep( .v-overlay__scrim) {
  display: none;
}

/* style the overlay container as required */
:deep(.v-overlay--active) {
  backdrop-filter: blur(2px);
}
</style>
