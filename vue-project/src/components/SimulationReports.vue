<template>
  <v-app>
    <v-dialog
      v-model="SimulationReportDialogue"
      scrollable
      persistent
      class="detailed-report"
      max-width="500px"
      content-class="overflow-y-auto"
    >
      <div style="max-height: 60vh; overflow-y: hidden; overflow-x:hidden;">
        <detailed-report
          :report="selectedReport"
          :print-job="selectedPrintJob"
          :workflow="selectedWorkflow"
          @exit="SimulationReportDialogue = false"
        ></detailed-report>
      </div>
    </v-dialog>
    <v-main class="pa-3">
      <v-card
        style="width:700px"
        class="large-module mb-3 pa-3"
      >
        <simulation-report-history
          style="width:100%;"
          :print-jobs="printJobs"
          :workflows="workflows"
          :simulation-reports="simulationReports"
          @select-report="selectSimulationReport"
        ></simulation-report-history>
      </v-card>
      <v-card class="mb-3 module pa-3">
        <simulation-report-generate
          style="height:300px; width:800px;"
          :print-jobs="printJobs"
          :workflows="workflows"
          @create="getSimulationReports"
        ></simulation-report-generate>
      </v-card>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from "vue";
import DetailedReport from './SimulationReport/DetailedReport.vue';
import SimulationReportHistory from './SimulationReport/simulation-report-history.vue';
import SimulationReportGenerate from './SimulationReport/simulation-report-generate.vue';
import { getCollection } from "./api.js";

const workflows = ref([]);
const printJobs = ref([]);
const simulationReports = ref([]);
const SimulationReportDialogue = ref(false);

const selectedReport = ref(null)
const selectedPrintJob = ref(null)
const selectedWorkflow = ref(null)

//////////////////////
//// User Actions
//////////////////////

const selectSimulationReport = (id) => {
	selectedReport.value = simulationReports.value.find(item => {
return item.id === id
})
	selectedPrintJob.value = printJobs.value.find(item => {
return item.id === selectedReport.value.PrintJobID
})
	selectedWorkflow.value = workflows.value.find(item => {
return item.id === selectedReport.value.WorkflowID
})
	SimulationReportDialogue.value = true
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
  		simulationReports.value.forEach( (report) => {

        // parse the creation time to a human readable format
      	const dateObj = new Date(report.CreationTime * 1000);
      	report.Date= dateObj.getMonth()+1  + "/" + dateObj.getDate() + "/" + dateObj.getFullYear();
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
			console.log("Error fetching data. Response from server: " + String(response.status));
		}
	} catch (error) {
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

.v-btn {
	margin: 0 5px;
}

.module {
  max-width:800px;
  border-width:2px;
  border-color:dark-grey;
  padding:16px;
}

.large-module{
  max-width:1300px;
  border-width:2px;
  border-color:dark-grey;
}

.report-history-list {
	height: 90vh;
	width: 100%;
	overflow-y: scroll;
}


.simulation-report-search-box {
	max-width: 400px;
	max-height: 100px;
}

.item-desc {
	font-weight: bold;
	font-size: x-small;
}

.item-val {
	font-size: x-small;
}
</style>
