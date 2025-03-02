<template>
  <v-app>
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
      class="detailed-report"
      max-width="500px"
      content-class="overflow-y-auto"
    >
      <div style="max-height: 60vh; overflow-y: hidden; overflow-x:hidden;">
        <detailed-report
          :report="selectedReport"
          :print-job="selectedPrintJob"
          :workflow="selectedWorkflow"
          @exit="SimulationReportViewDialogue = false"
        ></detailed-report>
      </div>
    </v-dialog>
	<v-dialog
      v-model="CompareReportsDialogue"
      scrollable
      persistent
      class="compare-reports"
      max-width="500px"
      content-class="overflow-y-auto"
    >
		<div style="max-height: 100vh; overflow-y: hidden; overflow-x:hidden;">
			<compare-reports
			:report-one="selectedReport"
			:print-job-one="selectedPrintJob"
			:workflow-one="selectedWorkflow"
			:report-two="selectedReport2"
			:print-job-two="selectedPrintJob2"
			:workflow-two="selectedWorkflow2"
			@exit="CompareReportsDialogue = false"
			></compare-reports>
		</div>
	</v-dialog>
    <v-main class="pa-3">
      <v-card
        class="module"
        style="max-height: 292px; height:auto;"
      >
<<<<<<< HEAD
        <module-toolbar
          class="module-toolbar"
          title="Simulation Report Creation"
          icon="mdi-test-tube"
          @minimize="simReportGenMinimized=true"
          @maximize="simReportGenMinimized=false"
        >
        </module-toolbar>
=======
        <simulation-report-history
          style="width:100%;"
          :print-jobs="printJobs"
          :workflows="workflows"
          :simulation-reports="simulationReports"
          @select-report="selectSimulationReport"
		  @compare-reports="compareSimulationReports"
        ></simulation-report-history>
      </v-card>
      <v-card class="mb-3 module pa-3">
>>>>>>> origin/compareSimulationReports
        <simulation-report-generate
          v-if="!simReportGenMinimized"
          :print-jobs="printJobs"
          :workflows="workflows"
          @create="getSimulationReports"
        ></simulation-report-generate>
      </v-card>
      <div class="mb-1 mt-1"></div>
      <v-card
        class="large-module"
      >
        <module-toolbar
          class="module-toolbar"
          title="Simulation Report History"
          icon="mdi-clipboard-text-clock-outline"
          @minimize="simReportHistoryMinimized=true;"
          @maximize="simReportHistoryMinimized=false;"
        >
        </module-toolbar>
        <simulation-report-history
          v-if="!simReportHistoryMinimized"
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
import CompareReports from './SimulationReport/CompareReports.vue';
import SimulationReportHistory from './SimulationReport/simulation-report-history.vue';
import SimulationReportGenerate from './SimulationReport/simulation-report-generate.vue';
import SimulationReportCompare from './SimulationReport/simulation-report-compare.vue';
import ModuleToolbar from './module-toolbar.vue';
import { getCollection } from "./api.js";

const workflows = ref([]);
const printJobs = ref([]);
const simulationReports = ref([]);
<<<<<<< HEAD
const SimulationReportViewDialogue = ref(false);
const SimulationReportCompareDialogue = ref(false);
=======
const SimulationReportDialogue = ref(false);
const CompareReportsDialogue = ref(false);
>>>>>>> origin/compareSimulationReports

const selectedReport = ref(null)
const selectedPrintJob = ref(null)
const selectedWorkflow = ref(null)

<<<<<<< HEAD
const simReportGenMinimized = ref(false);
const simReportHistoryMinimized = ref(false);

const compareReportOne = ref(false);
const compareReportTwo = ref(false);
=======
const selectedReport2 = ref(null)
const selectedPrintJob2 = ref(null)
const selectedWorkflow2 = ref(null)
>>>>>>> origin/compareSimulationReports

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
<<<<<<< HEAD
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
=======
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
>>>>>>> origin/compareSimulationReports
}

const compareSimulationReports = (id1, id2) => {
	selectedReport.value = simulationReports.value.find(item => { 
		return item.id === id1 
	})
	selectedPrintJob.value = printJobs.value.find(item => {
		return item.id === selectedReport.value.PrintJobID
	})
	selectedWorkflow.value = workflows.value.find(item => {
		return item.id === selectedReport.value.WorkflowID
	})

	selectedReport2.value = simulationReports.value.find(item => { 
		return item.id === id2
	})
	selectedPrintJob2.value = printJobs.value.find(item => {
		return item.id === selectedReport2.value.PrintJobID
	})
	selectedWorkflow2.value = workflows.value.find(item => {
		return item.id === selectedReport2.value.WorkflowID
	})
	CompareReportsDialogue.value = true	
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

.v-overlay--active .v-overlay__scrim {
    display: none;
}
/* style the overlay container as required */
.v-overlay--active {
    backdrop-filter: blur(2px);
}
</style>
