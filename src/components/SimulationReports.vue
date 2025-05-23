<template>
  <div>
    <error-popups
      :error="errorMessage"
      @clear-error="errorMessage = ''"
    >
    </error-popups>

    <!-- Viewing Simulation Reports -->
    <v-dialog
      v-model="viewing"
      persistent
      class="simulation-report-view-dialog"
      height="95vh"
      width="95vw"
      max-height="95vh"
      max-width="95vw"
    >
      <simulation-report-view
        :reports="selectedReports"
        :mobile="mobile"
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
          @create="refresh()"
        ></simulation-report-generate>
      </v-card>
      <div class="mb-1 mt-1"></div>

      <!-- View a List of Simulation Reports -->
      <v-card class="skinny-module">
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
          style="overflow-x: scroll !important;"
          :print-jobs="printJobs"
          :workflows="workflows"
          :simulation-reports="simulationReports"
          :mobile="mobile"
          @view-reports="viewReports"
        >
        </simulation-report-history>
      </v-card>
    </v-main>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import {useDisplay} from 'vuetify';
import { getCollection } from "./api.js";
import ChatWidget from './ChatBot/chat-widget.vue';
import SimulationReportHistory from './SimulationReport/simulation-report-history.vue';
import SimulationReportGenerate from './SimulationReport/simulation-report-generate.vue';
import SimulationReportView from './SimulationReport/simulation-report-view.vue';
import ModuleToolbar from './module-toolbar.vue';
import ErrorPopups from "./ErrorPopups.vue";

///////////////////////
//// DATA
///////////////////////

const workflows         = ref([]);
const printJobs         = ref([]);
const simulationReports = ref([]);

const selectedReports   = ref([]);
const viewing           = ref(false);

const simReportGenMinimized     = ref(false);
const simReportHistoryMinimized = ref(false);
const errorMessage              = ref('');

///////////////////////
//// COMPUTED
///////////////////////

const { name } = useDisplay();
const mobile = computed(() => {
  return name.value === 'xs';
})

//////////////////////
//// Init / Refresh
//////////////////////
const refresh = async () => {
  const response = await Promise.all([
      getPrintJobs(),
      getWorkflows(),
      getSimulationReports(),
  ]);
  printJobs.value         = response[0];
  workflows.value         = response[1];
  simulationReports.value = addTime(response[2]);
};

///////////////////////
//// On Mounted
///////////////////////

onMounted(async () => {
  refresh()
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
* View one or more Simulation Reports
*/
const viewReports = (reports) => {
  selectedReports.value = reports;
  viewing.value = true;
};

////////////////////////
//// Helper Functions
////////////////////////

const addTime = (reports) => {
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
  return reports;
}

///////////////////
//// API CALLS ////
///////////////////

/**
* Get a list of simulation reports
*/
const getSimulationReports = async () => {
  const response = await getCollection("SimulationReport");
  if (response && response.ok) {
    return response.json();
  } else {
    errorMessage.value = "Error fetching list of simulation reports";
    return [];
  }
  return [];
}

/**
* Get a list of print jobs
*/
const getPrintJobs = async () => {
  const response = await getCollection("PrintJob");
  if (response.ok) {
    return response.json();
  } else {
    errorMessage.value = String("response.status");
    return [];
  }
  return [];
}

/**
* Get a list of workflows
*/
const getWorkflows = async () => {
  const response = await getCollection("Workflow");
  if (response.ok) {
    return response.json();
  } else {
    errorMessage.value = "Error fetching list of workflows";
    return [];
  }
  return [];
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

.simulation-report-view-dialog {
  width:95vw;
  max-width:95vw;
  height:95vh;
  max-height:95vh;
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
