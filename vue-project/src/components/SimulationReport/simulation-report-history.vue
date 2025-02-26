<template>
  <v-app>
    <v-row class="mb-2 ml-1">
      <v-col
        class="align-center d-flex justify-start"
        style="font-size:x-large;"
      >
        <span class="module-title">Simulation Report History</span>
      </v-col>
      <v-col class="d-flex justify-end">
        <v-menu
          v-model="drawer"
          location="start"
          :close-on-content-click="false"
          transition="slide-x-reverse-transition"
        >
          <template #activator="{ props }">
            <v-checkbox-btn
              v-model="enabled"
              class="pe-2"
              label="Compare Reports"
            ></v-checkbox-btn>
            <v-btn
              v-bind="props"
              icon
              class="mb-2 mt-1"
              tile
              @click="drawer=!drawer;"
            >
              <v-icon>mdi-filter</v-icon>
            </v-btn>
          </template>
          <v-card
            width="300px"
            class="pa-5"
          >
            <v-col>
              <v-row>
                <v-text-field
                  v-model="searchValue"
                  single-line
                  density="compac"
                  label="Search Reports"
                  append-icon="mdi-magnify"
                  @update:modelValue="filter"
                />
              </v-row>
              <v-divider></v-divider>
              <v-row class="mb-2 mt-1">
                <v-col class="ma-0 pa-0">
                  <v-text-field
                    v-model="fromDate"
                    flat
                    solo-filled
                    hide-details
                    outlined
                    density="compac"
                    single-line
                    label="From"
                    type="datetime-local"
                  >
                  </v-text-field>
                </v-col>
                <v-col class="ma-0 ml-2 pa-0">
                  <v-text-field
                    v-model="toDate"
                    flat
                    hide-details
                    style="font-size:xx-small"
                    outlined
                    density="compac"
                    single-line
                    label="To"
                    type="datetime-local"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
              <v-divider></v-divider>
              <v-row class="mb-1 mt-3">
                <v-col class="ma-0 pa-0">
                  <v-autocomplete
                    v-model="selectedPrintJobs"
                    density="compac"
                    variant="solo-filled"
                    single-line
                    style="overflow-y:auto"
                    multiple
                    :items="printJobs"
                    item-title="Title"
                    item-value="Title"
                    label="Print Job"
                    @update:modelValue="filter"
                  >
                  </v-autocomplete>
                  <v-autocomplete
                    v-model="selectedWorkflows"
                    density="compac"
                    variant="solo-filled"
                    single-line
                    multiple
                    :items="workflows"
                    item-title="Title"
                    item-value="Title"
                    label="Workflow"
                    @update:modelValue="filter"
                  >
                  </v-autocomplete>
                </v-col>
              </v-row>
            </v-col>
          </v-card>
        </v-menu>
      </v-col>
    </v-row>
    <div
      style="width:98%;"
      class="report-history-table"
    >
      <v-list style="margin:0; padding:0;">
        <v-list-item
          v-for="(report, index) in simulationReportsDisplay"
          :key="index"
          style="margin:0; padding:0;"
        >
          <v-card
            class="report-history-item"
            @click="$emit('select-report', report.id)"
          >
            <!-- Workflow has defined printjob title -->
            <div>
              <v-row class="ml-0 mt-2 pa-0">
                <v-col
                  cols="3"
                  class="ma-0 pa-0"
                >
                  <v-card-text class="item-desc mb-1 ml-5 pa-0">
                    Print Job:
                  </v-card-text>
                  <v-card-text class="item-desc ml-5 pa-0">
                    Workflow:
                  </v-card-text>
                </v-col>

                <v-col
                  cols="3"
                  class="mb-2 pa-0"
                >
                  <v-card-text
                    class="item-val mb-1 ml-0 pa-0"
                  >
                    {{ report.PrintJobTitle ? report.PrintJobTitle : 'N/A' }}
                  </v-card-text>
                  <v-card-text
                    class="item-val ma-0 ml-0 pa-0"
                  >
                    {{ report.WorkflowTitle ? report.WorkflowTitle : 'N/A' }}
                  </v-card-text>
                </v-col>

                <v-col
                  cols="3"
                  class="ma-0 pa-0"
                >
                  <v-card-text class="item-desc mb-1 ml-5 pa-0">
                    Total Time:
                  </v-card-text>
                </v-col>
                <v-col
                  cols="3"
                  class="mb-2 pa-0"
                >
                  <v-card-text class="item-val mb-1 ml-0 pa-0">
                    {{ report.TotalTimeTaken ? report.TotalTimeTaken : 'N/A' }}
                    secs.
                  </v-card-text>
                </v-col>
              </v-row>
              <v-row class="mb-0 ml-0 mt-2 pa-0">
                <v-col
                  cols="3"
                  class="ma-0 pa-0"
                >
                  <v-card-text class="item-desc mb-1 ml-5 pa-0">
                    Created:
                  </v-card-text>
                </v-col>
                <v-col
                  cols="3"
                  class="ma-0 pa-0"
                >
                  <v-card-text class="item-val ma-0 ml-0 pa-0">
                    {{ report.Date }} @ {{ report.Time }}
                  </v-card-text>
                </v-col>
              </v-row>
            </div>
          </v-card>
        </v-list-item>
      </v-list>
    </div>
  </v-app>
</template>

<script setup>
  import { nextTick, ref, onMounted, watch } from "vue";

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

  const emit = defineEmits(['select-report']);

  const simulationReportsDisplay = ref([]);
  const searchValue = ref('');
  const drawer = ref(false);
  const selectedPrintJobs = ref([]);
  const selectedWorkflows = ref([]);
  const fromDate = ref(null);
  const toDate = ref(null);
  const enabled = ref(false);

  ///////////////////////////////
  ///// Filters and Searching
  ///////////////////////////////
  const filter = () => {

    nextTick(() => {
      const printJobLookup = {};
      const workflowLookup = {};

      selectedPrintJobs.value.forEach( (job) => {
        printJobLookup[job] = true;
      });

      selectedWorkflows.value.forEach( (flow) => {
        workflowLookup[flow] = true;
      });

      const filteringJobs = (selectedPrintJobs.value.length > 0);
      const filteringWorkflows = (selectedWorkflows.value.length > 0);

      simulationReportsDisplay.value = simulationReports.filter( (report) => {
        if (filteringWorkflows && workflowLookup[report.WorkflowTitle] === undefined){
          return false;
        }
        if (filteringJobs && printJobLookup[report.PrintJobTitle] === undefined){
          return false;
        }
        return true;
      });

      if (searchValue.value === '') {
        return;
      }

      simulationReportsDisplay.value = simulationReportsDisplay.value.filter((report) => {
        if ((!report.PrintJobTitle) || (!report.WorkflowTitle)) {
          return false;
        }

        const matchPrintJobTitle = report.PrintJobTitle.toLowerCase().includes(searchValue.value.toLowerCase());
        const matchWorkflowTitle = report.WorkflowTitle.toLowerCase().includes(searchValue.value.toLowerCase());

        return (matchPrintJobTitle || matchWorkflowTitle);

      });
    });
  }

  watch(
    () => {
return simulationReports
},
    (newReports) => {
      simulationReportsDisplay.value = newReports;
      filter();
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
  margin-bottom:0px;
}

.report-history-table {
  height:98vh;
  border-width:1px;
  border-style:solid;
  border-color:rgba(0, 0, 0, 0.1);
  margin:5px;
  overflow-y:auto;
}

.report-history-item:hover {
	opacity: 0.5;
	cursor: pointer;
}
</style>

