<template>
  <div>
    <!-- Header Row -->
    <v-row
      class="ml-4 mr-4 mt-1 pa-0"
      style="max-height:90px; height:90px; align-content:center; flex-wrap:nowrap;"
      no-gutters
    >
      <v-spacer />
      <v-col
        class="align-center d-flex justify-center pa-0"
        no-gutters
        cols="auto"
      >
        <!-- Open Comparison View Button -->
        <Transition name="slide-fade">
          <div
            v-if="comparing && comparePossible"
          >
            <v-btn
              class="mr-4"
              size="large"
              rounded
              dark
              style="text-transform: none;"
              color="green-darken-1"
              @click="viewReports"
            >
              <p>
                Begin Comparison
              </p>
            </v-btn>
            <v-icon>mdi-arrow-left-thick</v-icon>
          </div>
        </Transition>

        <!-- Select Reports For Comparison Button -->
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

    <v-row
      no-gutters
      class="mb-8 ml-8 mr-8 report-list-container"
    >
      <!-- Simulation Report List Column -->
      <v-col>
        <v-list class="ma-0 pa-0">
          <v-list-item
            v-for="(report, index) in simulationReports"
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
                @click="selectReport(report)"
              >
                <v-icon>
                  mdi-gesture-tap
                </v-icon>
              </v-col>
              <v-col no-gutters>
                <simulation-report-list-item
                  :report="report"
                  @click="viewReport(report);"
                />
              </v-col>
            </v-row>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
  import { nextTick, ref, onMounted, watch, computed } from "vue";
  import SimulationReportListItem from "./simulation-report-list-item.vue";


  /////////////////
  // PROPS
  /////////////////

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


  /////////////////
  // EMISSIONS
  /////////////////

  const emit = defineEmits(['view-reports']);

  /////////////////
  // DATA
  /////////////////

  const COMPARISON_LIMIT = 12;
  const comparing = ref(false);
  const selectedReports = ref([]);

  /////////////////
  //// Computed
  /////////////////

  const comparePossible = computed(() => {
    return selectedReports.value.length > 1;
  });

  /////////////////
  // Methods
  /////////////////

  const clearSelectedReports = () => {
    selectedReports.value.forEach((report) => {
      report.selected = false;
    });
    selectedReports.value = [];
  };

  const toggleCompareReports = () => {
    if (comparing.value) {
      clearSelectedReports();
    }
    comparing.value = !comparing.value;
  };

  const viewReports = () => {
    emit('view-reports', selectedReports.value);
    clearSelectedReports();
    comparing.value = false;
  };

  const viewReport = (report) => {
    emit('view-reports', [report]);
  };

  const alreadySelected = (report) => {
    const id = report.id;
    for (let i = 0; i < selectedReports.value.length; i++) {
      const reportID = selectedReports.value[i].id;
      if (id === reportID) {
        return i;
      }
    }
    return -1;
  };

  const selectReport = (report) => {
    const index = alreadySelected(report);

    // Already Selected -> Deselect
    if (index !== -1) {
      selectedReports.value.splice(index, 1);
      report.selected = false;
      return;
    }

    // Maxed Out -> Return
    if (selectedReports.value.length === COMPARISON_LIMIT) {
      return;
    }

    // Add Report
    report.selected = true;
    selectedReports.value.push(report);
  };
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

.report-list-container{
  max-height: 500px;
  overflow-y:auto;
  border-width: 2px;
  border-color: rgba(0, 0, 0, 0.15);
  border-style: solid;
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
