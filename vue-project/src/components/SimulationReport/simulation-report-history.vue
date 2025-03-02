<template>
  <v-main>
    <!-- Header Row -->
    <v-row
      class="ml-4 mr-4 mt-1 pa-0"
      style="max-height:90px; height:90px; align-content:center;"
      no-gutters
    >
      <v-col
        class="align-center d-flex justify-center pa-0"
        style="align-content: center;"
        no-gutters
        cols="auto"
      >
        <v-text-field
          v-model="searchValue"
          label="Search"
          append-inner-icon="mdi-magnify"
          style="min-width:400px;"
          class="ml-4 mt-3 pa-0"
        >
        </v-text-field>
      </v-col>
      <v-spacer />
      <v-col
        class="align-center d-flex justify-center pa-0"
        no-gutters
        cols="auto"
      >
        <Transition name="slide-fade">
          <div
            v-if="comparing && compareSelections.first && compareSelections.second"
          >
            <v-btn
              class="mr-4"
              size="large"
              rounded
              dark
              style="text-transform: none;"
              color="green-darken-1"
              @click="compareReports"
            >
              <p>
                Begin Comparison
              </p>
            </v-btn>
            <v-icon>mdi-arrow-left-thick</v-icon>
          </div>
        </Transition>
        <!-- Compare Reports Button -->
        <v-btn
          label="Compare Reports"
          tile
          class="mr-4"
          size="large"
          dark
          style="text-transform: none;"
          :color="comparing ? 'error' : 'grey-darken-1'"
          @click="toggleCompareReports"
        >
          <p v-if="!comparing">
            Compare Reports
          </p>
          <p v-if="comparing">
            Cancel
          </p>
        </v-btn>
      </v-col>
    </v-row>
    <!-- Primary Row -->
    <v-row
      class="mb-8 ml-8 mr-8"
      no-gutters
      style="max-height: 500px; overflow-y:auto; border-width: 2px; border-color: rgba(0, 0, 0, 0.15); border-style: solid;"
    >
      <!-- Simulation Report List Column -->
      <v-col>
        <v-list class="ma-0 pa-0">
          <v-list-item
            v-for="(report, index) in simulationReportsDisplay"
            :key="index"
            class="ma-0 pa-0"
          >
            <v-row
              no-gutters
              width="100%"
            >
              <v-col
                v-if="comparing"
                no-gutters
                cols="1"
                :class="`${report.selected ? 'item-selection-selected' : 'item-selection' } align-center d-flex justify-center`"
                @click="selectReportForComparison(report)"
              >
                <v-icon>
                  mdi-gesture-tap
                </v-icon>
              </v-col>
              <v-col no-gutters>
                <simulation-report-list-item :report="report" />
              </v-col>
            </v-row>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-main>
</template>

<script setup>
  import { nextTick, ref, onMounted, watch } from "vue";
  import SimulationReportListItem from "../SimulationReport/simulation-report-list-item.vue";

  const {
    simulationReports = [],
    workflows = [],
    printJobs = []
  }
  =
  defineProps({
    simulationReports: Array,
    workflows : Array,
    printJobs: Array,
  });

  const emit = defineEmits(['select-report', 'compare-reports']);

  const simulationReportsDisplay = ref([]);
  const searchValue = ref('');
  const drawer = ref(true);
  const selectedPrintJobs = ref([]);
  const selectedWorkflows = ref([]);
  const fromDate = ref(null);
  const toDate = ref(null);
  const comparing = ref(false);
  const compareSelections = ref({first: null, second: null,});

  const clearSelectedReports = () => {
      compareSelections.value.first.selected = false;
      compareSelections.value.second.selected = false;
      compareSelections.value.first = null;
      compareSelections.value.second = null;
  }

  ///////////////////////////////
  ///// Comparison Functions
  ///////////////////////////////

  /*
  * Enable or disable Report Comparison.
  * Clear selections on disable.
  */
  const toggleCompareReports = () => {
    if (comparing.value) {
      clearSelectedReports();
    }
    comparing.value = !comparing.value;
  }

  /**
  * Tell our parent to compare two reports
  */
  const compareReports = () => {
    if (!compareSelections.value.first || !compareSelections.value.second) {
      return;
    }
    emit('compare-reports', compareSelections.value.first, compareSelections.value.second);
    clearSelectedReports();
  }

  /**
  * check if a given report is already selected.
  */
  const alreadySelected = (report) => {
    const reportJSON = JSON.stringify(report);
    const report1JSON = JSON.stringify(compareSelections.value.first);
    const report2JSON = JSON.stringify(compareSelections.value.second);
    if (reportJSON === report1JSON) {
      return 1;
    }

    if (reportJSON === report2JSON) {
      return 2;
    }

    return 0;

  }


  /**
  * Select a report for comparison.
  * User can select up to two reports.
  * @param {Object} report - Simulation Report
  * @returns {void}
  */
  const selectReportForComparison = (report) => {

    // If report is already seleted, unselect it and return
    const result = alreadySelected(report);
    if (result && result === 1) {
      compareSelections.value.first.selected = false;
      compareSelections.value.first = null;
      return;
    }
    if (result && result === 2) {
      compareSelections.value.second.selected = false;
      compareSelections.value.second = null;
      return;
    }

    // If we already have two reports selected. clear both selections...
    if (compareSelections.value.first && compareSelections.value.second) {
      clearSelectedReports();
    }

    // If we don't have a first report selected yet, select the first report
    if (!compareSelections.value.first) {
      compareSelections.value.first = report;
      compareSelections.value.first.selected = true;
      return;
    }

    // If we don't have a second report selected yet, select the second report
    if (!compareSelections.value.second) {
      console.log(compareSelections.value);
      compareSelections.value.second = report;
      compareSelections.value.second.selected = true;
      return;
    }

  };

  ///////////////////////////////
  ///// Filters and Searching
  ///////////////////////////////
  const filter = () => {
    nextTick(() => {
      simulationReportsDisplay.value = filterSelections(simulationReportsDisplay.value, selectedPrintJobs.value, selectedPrintJobs.value);
      simulationReportsDisplay.value = filterSearchTerm(simulationReportsDisplay.value, searchValue.value.toLowerCase());
    });
  };

  /**
  * Filter a list of simulation reports based on
  * whether they are included in the provided list of printjobs or workflows.
  * @param {Array} list of simulation reports
  * @param {Array} list of selected print jobs
  * @param {Array} list of selected workflows
  * @returns {Array} filtered list of simulation reports
  */
  const filterSelections = (reports, selPrintJobs, selWorkflows) => {
    const printJobLookup = {};
    const workflowLookup = {};

    selectedPrintJobs.value.forEach( (job) => {
      printJobLookup[job] = true;
    });

    selectedWorkflows.value.forEach( (flow) => {
      workflowLookup[flow] = true;
    });

    const filteringPrintJobs = (selPrintJobs.length > 0);
    const filteringWorkflows = (selWorkflows.length > 0);

     return reports.filter( (report) => {
        if (filteringWorkflows && !workflowLookup[report.WorkflowTitle]){
          return false;
        }

        if (filteringPrintJobs && !printJobLookup[report.PrintJobTitle]) {
          return false;
        }

        return true;
      });
  };

  /**
  * Filter a list of simulation reports based on a search term.
  * Reports will be included if a workflow title AND/OR printjob title
  * matches the search term.
  * @param {Array} list of simulation reports
  * @param {string} a search term
  * @returns {Array} list of filtered simulation reports
  */
  const filterSearchTerm = (simulationReports, term) => {
      if (!term) {
        return simulationReports;
      }

      return simulationReports.filter((report) => {
        if ((!report.PrintJobTitle) || (!report.WorkflowTitle)) {
          return false;
        }

        const matchPrintJobTitle = report.PrintJobTitle.toLowerCase().includes(term);
        const matchWorkflowTitle = report.WorkflowTitle.toLowerCase().includes(term);

        return (matchPrintJobTitle || matchWorkflowTitle);
      });
  };

  // Watch list of simulation reports for any changes.
  watch(
    () => {
      return simulationReports
    },
    (newReports) => {
      simulationReportsDisplay.value = newReports;
      filter();
      console.log("REPORTS!:", simulationReportsDisplay.value);
    },
    { immediate: true }
  );

  onMounted( async () => {
    simulationReportsDisplay.value = simulationReports;
  });
</script>

<style>
.report-history-item {
  height:125px;
  border-width:1px;
  border-left-width:0px;
  border-right-width:0px;
  border-top-width:1px;
}

.report-history-table {
  border-width:1px;
  border-style:solid;
  border-color:rgba(0, 0, 0, 0.1);
  overflow-y: scroll;
}

.report-history-item:hover {
	opacity: 0.9;
  border-left: solid;
  border-right: solid;
  border-color: lightgray;
  border-width: 2px;
	cursor: pointer;
}

.slide-fade-enter-active {
  transition: all 0.1s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 1;
}
.card-selection-tab {
  max-width: 50px;
  height:100%;
  align-content: center;
  background-color:lightslategray;
  align-content:center;
  justify-content:center;
}
.item-selection {
  border-width:1px;
  border-color:grey;
  border-top-style:solid;
  border-left-style:solid;
  border-right-style:solid;
}
.item-selection-selected{
  background-color:darkslategray;
  color:white;
  border-top-style:solid;
  border-left-style:solid;
  border-right-style:solid;
  border-bottom-style:solid;
}

.item-selection:hover{
  opacity:0.75;
}
.item-selection-selected:hover{
  opacity:0.75;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
