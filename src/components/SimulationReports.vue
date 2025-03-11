<template>
  <v-app>
    <error-popups
      :error="errorMessage"
      @clear-error="errorMessage = ''"
    >
    </error-popups>
    <v-dialog
      v-model="SimulationReportCompareDialogue"
      scrollable
      persistent
    >
      <simulation-report-compare
        style="max-width: 100%; max-height:100%; overflow-y: scroll;"
        class="detailed-report"
        :report1="compareReportOne"
        :report2="compareReportTwo"
        @exit="clearCompareSimulationReports"
      >
      </simulation-report-compare>
    </v-dialog>

    <v-dialog
      v-model="SimulationReportViewDialogue"
      scrollable
      persistent
    >
      <simulation-report-compare
        style="max-width: 100%; max-height:100%; overflow-y: scroll;"
        class="detailed-report"
        :report1="selectedReport"
        :report2="null"
        @exit="SimulationReportViewDialogue = false"
      >
      </simulation-report-compare>
    </v-dialog>
    <v-main class="pa-3">
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
          @select-report="selectSimulationReport"
          @compare-reports="compareSimulationReports"
        >
        </simulation-report-history>
      </v-card>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from "vue";
import DetailedReport from './SimulationReport/DetailedReport.vue';
import SimulationReportHistory from './SimulationReport/simulation-report-history.vue';
import SimulationReportGenerate from './SimulationReport/simulation-report-generate.vue';
import SimulationReportCompare from './SimulationReport/simulation-report-compare.vue';
import ModuleToolbar from './module-toolbar.vue';
import { getCollection } from "./api.js";
import ErrorPopups from "./ErrorPopups.vue";

const errorMessage = ref('');
const workflows = ref([]);
const printJobs = ref([]);
const simulationReports = ref([]);
const SimulationReportViewDialogue = ref(false);
const SimulationReportCompareDialogue = ref(false);

const selectedReport = ref(null)
const selectedPrintJob = ref(null)
const selectedWorkflow = ref(null)

const simReportGenMinimized = ref(false);
const simReportHistoryMinimized = ref(false);

const compareReportOne = ref(false);
const compareReportTwo = ref(false);

//////////////////////
//// User Actions
//////////////////////

const clearCompareSimulationReports = () => {
  compareReportOne.value = null;
  compareReportTwo.value = null;
  SimulationReportCompareDialogue.value = false;
}

const compareSimulationReports = (report1, report2) => {
  compareReportOne.value = report1;
  compareReportTwo.value = report2;
  SimulationReportCompareDialogue.value = true;
};

const selectSimulationReport = (id) => {
  selectedReport.value = simulationReports.value.find(item => {
    return item.id === id
  });
  selectedPrintJob.value = printJobs.value.find(item => {
    return item.id === selectedReport.value.PrintJobID
  });
  selectedWorkflow.value = workflows.value.find(item => {
    return item.id === selectedReport.value.WorkflowID
  });
  SimulationReportViewDialogue.value = true;
}

///////////////////
//// API CALLS ////
///////////////////

/**
* Get a list of simulation reports
*/
const getSimulationReports = async () => {
  //TODO: Fix formatting
  try {
    const response = await getCollection("SimulationReport");
    if (response.ok) {
      simulationReports.value = await response.json();
      console.log(simulationReports.value);
      simulationReports.value.forEach((report) => {

        // parse the creation time to a human readable format
        const dateObj = new Date(report.CreationTime * 1000);
        report.Date = dateObj.getMonth() + 1 + "/" + dateObj.getDate() + "/" + dateObj.getFullYear();
        let hours = dateObj.getHours().toString();
        let minutes = dateObj.getMinutes().toString();
        if (hours.length == 1) {
          hours = '0' + hours;
        }
        if (minutes.length == 1) {
          minutes = '0' + minutes;
        }
        report.Time = hours + ":" + minutes;

      });
    } else {
      errorMessage.value = "Error fetching list of simulation reports";
      console.log("Error fetching data. Response from server: " + String(response.status));
    }
  } catch (error) {
    errorMessage.value = "Error fetching list of simulation reports";
    console.log(`Error fetching list of simulation reports: ${error}`);
  }
}

const getPrintJobs = async () => {
  try {
    const response = await getCollection("PrintJob");
    if (response.ok) {
      printJobs.value = await response.json();
    } else {
      throw new Error(String(response.status));
    }
  } catch (error) {
    errorMessage.value = "Error fetching list of print jobs";
    console.log(`Error fetching list of PrintJobs: ${error}`);
  }
}

const getWorkflows = async () => {
  try {
    const response = await getCollection("Workflow");
    if (response.ok) {
      workflows.value = await response.json();
    } else {
      throw new Error(String(response.status));
    }
  } catch (error) {
    errorMessage.value = "Error fetching list of workflows";
    console.log(`Error fetching list of Workflows: ${error}`);
  }
}

onMounted(async () => {
  await getPrintJobs();
  await getWorkflows();
  await getSimulationReports();
});
</script>

<style>
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

.v-overlay--active .v-overlay__scrim {
  display: none;
}
</style>
