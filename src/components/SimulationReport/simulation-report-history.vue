<template>
  <div>
    <!-- Header Row (Mobile) -->
    <v-row
      v-if="mobile"
      class="px-2"
      :class="mobile ? 'mobile-options' : 'options'"
      no-gutters
    >
      <v-col
        class="align-center d-flex justify-center pa-0"
        no-gutters
        cols="auto"
      >
        <!-- Select Reports For Comparison Button -->
        <v-btn
          tile
          dark
          style="text-transform: none;"
          :color="comparing ? 'error' : 'grey-darken-1'"
          @click="toggleCompareReports"
        >
          <p v-if="!comparing">
            Compare
          </p>
          <p v-if="comparing">
            Cancel
          </p>
        </v-btn>

        <!-- Open Comparison View Button -->
        <div
          v-if="comparing && comparePossible"
        >
          <v-icon>mdi-arrow-right-thick</v-icon>
          <v-btn
            class="mr-4"
            rounded
            dark
            style="text-transform: none;"
            color="green-darken-1"
            @click="viewReports"
          >
            <p>
              Begin!
            </p>
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Header Row (Desktop) -->
    <v-row
      v-else
      class="mt-1 mx-4 options pa-0"
      no-gutters
    >
      <v-spacer>
      </v-spacer>
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

    <!-- Simulation Report List -->
    <div
      no-gutters
      :class="mobile ? 'report-list-container-mobile' : 'report-list-container'"
      :style="comparing ? 'border-style: none;' : 'border-style: solid;'"
    >
      <v-list class="ma-0 pa-0">
        <v-list-item
          v-for="(report, index) in simulationReports"
          :key="index"
          class="ma-0 pa-0"
        >
          <simulation-report-list-item
            :mobile="mobile"
            :report="report"
            :style="`background-color: ${calcReportColor(report)};`"
            :class="comparing ? 'report-history-item-comparing' : ''"
            @click="comparing ? selectReport(report) : viewReport(report);"
          />
        </v-list-item>
      </v-list>
    </div>
    <!-- End Simulation Report List -->
  </div>
</template>

<script setup>
  import { nextTick, ref, onMounted, watch, computed } from "vue";
  import { useDisplay } from 'vuetify';
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

  const { name } = useDisplay();
  const mobile = computed(() => {
    return name.value === 'xs';
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
    setTimeout(clearSelectedReports, 500); // wait a sec so user doesn't see it clear.
    setTimeout(() => {
 comparing.value = false;
}, 500);
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

  const calcReportColor = (report) => {
    if (report.selected) {
      return 'rgba(150,150,150, 0); border-style:inset; border-bottom-color:green; border-bottom-width:5px;'
    }
    if (comparing.value) {
      return 'rgba(0,0,0,0);'
    }
    return 'rgba(0,0,0,0);'
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
.options {
  height:70px;
  align-content:center;
  flex-wrap:nowrap;
}

.mobile-options{
  height:60px;
  align-content:center;
  flex-wrap:nowrap;
}

.report-history-item {
  height:64px;
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

.report-history-item-comparing {
  border-style:groove;
  border-width:2px;
  border-color:lightgray;
  margin-bottom:16px;
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
  margin-bottom: 32px !important;
  margin-left: 32px !important;
  margin-right: 32px !important;
  border-width: 2px;
  border-color: rgba(0, 0, 0, 0.15);
}
.report-list-container-mobile{
  max-height: 50vh;
  margin-left: 8px !important;
  margin-right: 8px !important;
  margin-bottom: 8px;
  overflow-y: auto;
  overflow-x:hidden;
  border-style:none !important;
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
