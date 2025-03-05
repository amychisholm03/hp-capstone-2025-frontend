<template>
  <v-card
    v-if="loading"
    class="ma-0 pa-0"
  >
    <!-- Header -->
    <v-row
      class="align-center d-flex ma-0"
      style="background-color:#555555; color:white; position:fixed; z-index:100; height:40px; width:100%;"
    >
      <v-col
        class="align-center d-flex justify-center"
      >
        <h4 style="font-weight:600;">
          Simulation Report Comparison
        </h4>
      </v-col>
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

    <!-- Main Body -->
    <v-row
      class="ml-3 mr-5"
      style="margin-top:40px;"
    >
      <!-- General Overview Section -->
      <v-col
        no-gutters
        style="max-width:650px;"
      >
        <v-card
          class="pb-5 pl-5 pr-5"
          style="border-width:1px; border-style:solid; border-color: rgba(0, 0, 0, 0.2); width: 600px;"
        >
          <!-- <v-card-title class="title"> -->
          <!--   Overview -->
          <!-- </v-card-title> -->
          <v-divider class="mb-2" />
          <v-row no-gutters>
            <!-- Simulation Report 1 -->
            <v-col class="mr-2">
              <v-text-field
                v-model="dateTimeReport1"
                :readonly="true"
                density="compact"
                label="Date Created"
              ></v-text-field>
              <v-text-field
                v-model="viewableReport1.PrintJobTitle"
                :readonly="true"
                density="compact"
                label="Print Job Title"
              ></v-text-field>
              <v-text-field
                v-model="printjobReport1.PageCount"
                :readonly="true"
                density="compact"
                label="Page Count"
              ></v-text-field>
              <v-text-field
                v-model="viewableReport1.RasterizationProfile"
                :readonly="true"
                density="compact"
                label="Rasterization Profile"
              ></v-text-field>
              <v-text-field
                v-model="viewableReport1.TotalTimeTaken"
                :readonly="true"
                density="compact"
                label="Total Time Taken (secs)"
              ></v-text-field>
              <v-text-field
                v-model="viewableReport1.WorkflowTitle"
                :readonly="true"
                density="compact"
                label="Workflow Title"
              ></v-text-field>
            </v-col>

            <!-- Simulation Report 2 -->
            <v-col>
              <v-text-field
                v-model="dateTimeReport2"
                :readonly="true"
                density="compact"
                label="Date Created"
              ></v-text-field>
              <v-text-field
                v-model="viewableReport2.PrintJobTitle"
                :readonly="true"
                density="compact"
                label="Print Job Title"
              ></v-text-field>
              <v-text-field
                v-model="printjobReport2.PageCount"
                :readonly="true"
                density="compact"
                label="Page Count"
              ></v-text-field>
              <v-text-field
                v-model="viewableReport2.RasterizationProfile"
                :readonly="true"
                density="compact"
                label="Rasterization Profile"
              ></v-text-field>
              <v-text-field
                v-model="viewableReport2.TotalTimeTaken"
                :readonly="true"
                density="compact"
                label="Total Time Taken (secs)"
              ></v-text-field>
              <v-text-field
                v-model="viewableReport2.WorkflowTitle"
                :readonly="true"
                density="compact"
                label="Workflow Title"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <!-- Workflow Step Comparison Section -->
      <v-col style="max-width:700px;">
        <v-card
          style="border-width:1px; border-style:solid; border-color: rgba(0, 0, 0, 0.2); height: 100%;"
        >
          <!-- <v-card-title class="title"> -->
          <!--   Step Times -->
          <!-- </v-card-title> -->
          <v-divider class="mb-2" />
          <v-row no-gutters>
            <v-col no-gutters>
              <table style="width: 100%; height:100%;">
                <tr style="text-align:left; font-size: 20px; text-align:center; height:50px;">
                  <th style="width:50%; font-weight:400;">
                    Step
                  </th>
                  <th style="width:50%; font-weight:400;">
                    Time
                  </th>
                </tr>
                <tr
                  v-for="step, i in stepsReport1"
                  :key="i"
                  style="text-align:center;"
                >
                  <td
                    style="width:50%; font-size: 18px;"
                  >
                    {{ step.Title }}
                  </td>
                  <td
                    :style="`background-color:${ getComparison(i, 1) }; width:50%; font-weight: 600;`"
                  >
                    {{ step.time }}s
                  </td>
                </tr>
              </table>
            </v-col>
            <v-divider
              vertical
              class="ml-2 mr-2"
            />
            <v-col class="no-gutters">
              <table style="width: 100%; height:100%;">
                <tr style="text-align:left; font-size: 20px; text-align:center; height:50px;">
                  <th style="width:50%; font-weight:400;">
                    Time
                  </th>
                  <th style="width:50%; font-weight:400;">
                    Step
                  </th>
                </tr>
                <tr
                  v-for="step, i in stepsReport2"
                  :key="i"
                  style="text-align:center;"
                >
                  <td
                    :style="`background-color:${ getComparison(i, 2) }; width:50%; font-weight:600;`"
                  >
                    {{ step.time }}s
                  </td>
                  <td style="width:50%; font-size: 18px;">
                    {{ step.Title }}
                  </td>
                </tr>
              </table>
            </v-col>
          </v-row>
          <v-divider class="mt-2" />
        </v-card>
      </v-col>
    </v-row>
    <v-row
      no-gutters
      class="ma-6"
    >
      <v-col>
        <v-card
          style="border-width:1px; border-style:solid; border-color: rgba(0, 0, 0, 0.2); width: 1000px;"
        >
          <!-- <v-row class="d-flex justify-center"> -->
          <!--   <v-col> -->
          <!--     <v-card-title class="title"> -->
          <!--       Chart -->
          <!--     </v-card-title> -->
          <!--   </v-col> -->
          <!-- </v-row> -->
          <v-divider />
          <v-row
            no-gutters
            class="d-flex"
          >
            <v-col style="max-width: 50%;">
              <canvas
                id="canvasChartReport1"
              />
            </v-col>
            <v-col style="max-width: 50%;">
              <canvas
                id="canvasChartReport2"
              />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
import { onMounted, ref, computed, nextTick, reactive } from "vue";
import {getPrintJob, getWorkflow, getCollection, getWorkflowTimes } from "../api.js";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';

Chart.register(Title, Tooltip, Legend, ArcElement);

const chartCanvas = ref();
//// Props
const {
  report1 = null,
  report2 = null,
}
=
defineProps({
  report1: Object,
  report2: Object,
});

const chartData = ref({
  labels: ['Red', 'Blue', 'Yellow'],
  datasets: [
    {
      label: 'Votes',
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      data: [30, 50, 20]
    }
  ]
});

const chartOptions = ref({
  responsive: true,
  plugins: {
    legend: {
      position: 'top'
    }
  }
});

const workflowStepsReport1 = ref(null);
const workflowStepsReport2 = ref(null);

const dateTimeReport1 = ref("");
const viewableReport1 = ref(null);
const printjobReport1 = ref(null);
const workflowReport1 = ref(null);
const stepTimeReport1 = ref(null);
const stepsReport1    = ref(null);

const dateTimeReport2 = ref("");
const viewableReport2 = ref(null);
const printjobReport2 = ref(null);
const workflowReport2 = ref(null);
const stepTimeReport2 = ref(null);
const stepsReport2    = ref(null);

const noStepTimesReport1 = computed(() => {
  stepsReport1.value.forEach((step)=>{
    if (step.time != 0) {
      return false;
    }
  });
  return true;
});

const noStepTimesReport2 = computed(() => {
  stepsReport2.value.forEach((step)=>{
    if (step.time != 0) {
      return false;
    }
  });
  return true;
});



const timesReport1 = computed(() => {
    if (!stepsReport1.value) {
      return null;
    }
    return stepsReport1.value.map((step) => {
      return step.time;
    });
});

const timesReport2 = computed(() => {
    if (!stepsReport2.value) {
      return null;
    }
    return stepsReport2.value.map((step) => {
      return step.time;
    });
});


/**
* Compare Two Steps, return icon based on which one is bigger.
*/
const getComparison = ((index, reportNum) => {

  const good = '#2abf64';
  const bad = '#db3047';
  const neutral = '#FFFFFF';

  if (index > stepsReport1.value.length || index > stepsReport2.value.length) {
    return neutral;
  }
  if (stepsReport1.value[index].time > stepsReport2.value[index].time) {
    return reportNum === 2 ? good : bad;
  } else if (stepsReport1.value[index].time < stepsReport2.value[index].time) {
    return reportNum === 2 ? bad : good;
  } else {
    return neutral;
  }
});

const loading = ref(false);

// clone props so we cannot mute them.
viewableReport1.value = JSON.parse(JSON.stringify(report1));
viewableReport2.value = JSON.parse(JSON.stringify(report2));

/**
* Insert times into the main step array, if they exist.
*/
const addTimesToWorkflowStepArray = (workflowSteps, stepTimes) => {
  workflowSteps.forEach((step) => {
    step.time = stepTimes[step.id] ? stepTimes[step.id] : 0;
  });
  return workflowSteps;
};

/**
* Pad array of steps with any missing steps, so workflows
* can be displayed congruently.
*/
const addMissingStepsToWorkflowStepArray = (workflowSteps, stepDefinitions) => {
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

  /**
  * Initalize Chart.js pie charts to show steps.
  */
  const initCharts = () => {

    const labelsReport1 = stepsReport1.value.map((step) => {
      return step.Title;
    });

    const labelsReport2 = stepsReport2.value.map((step) => {
      return step.Title;
    });

    const chartReport1 = document.getElementById('canvasChartReport1');
    const chartReport2 = document.getElementById('canvasChartReport2');

    const prepickedColors = ['#db3047','#9575CD', '#F06292', '#E57373','#64B5F6','#4DD0E1', '#60C381', '#FFD54F', '#4DB6AC']
    const colors = timesReport1.value.map((step) => {
      if (prepickedColors.length > 0) {
        return prepickedColors.pop();
      }
      return "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")";
    });

    new Chart(chartReport1, {
      type: 'pie',
      data: {
        labels: labelsReport1,
        datasets: [{
          label: 'Report 1',
          data: timesReport1.value,
          backgroundColor: colors,
          borderWidth: 1
        }]
      },
      options: {
      }
    });

    new Chart(chartReport2, {
      type: 'pie',
      data: {
        labels: labelsReport2,
        datasets: [{
          label: 'Report 2',
          data: timesReport2.value,
          backgroundColor: colors,
          borderWidth: 1
        }]
      },
      options: {
      }
    });
  }




onMounted(
  async () => {
    dateTimeReport1.value = report1.Date + "  " + report1.Time;
    dateTimeReport2.value = report2.Date + "  " + report2.Time;

    const response = await Promise.all([
      getPrintJob(report1.PrintJobID),
      getWorkflow(report1.WorkflowID),
      getWorkflowTimes(report1.id),
      getPrintJob(report2.PrintJobID),
      getWorkflow(report2.WorkflowID),
      getWorkflowTimes(report2.id),
      getCollection('WorkflowStep'),
      ]);

    for (let i = 0; i < response.length; i++) {
      if (!response[i].ok) {
        alert("Error Getting Data!");
        return;
      }
    }

    printjobReport1.value = response[0].ok ? await response[0].json() : null;
    workflowReport1.value = response[1].ok ? await response[1].json() : null;
    stepTimeReport1.value = response[2].ok ? await response[2].json() : null;
    printjobReport2.value = response[3].ok ? await response[3].json() : null;
    workflowReport2.value = response[4].ok ? await response[4].json() : null;
    stepTimeReport2.value = response[5].ok ? await response[5].json() : null;
    const workflowStepDefinitions = response[6].ok ? await response[6].json() : null;

    stepsReport1.value = addMissingStepsToWorkflowStepArray(workflowReport1.value.WorkflowSteps, workflowStepDefinitions);
    stepsReport1.value = addTimesToWorkflowStepArray(stepsReport1.value, stepTimeReport1.value);

    stepsReport2.value = addMissingStepsToWorkflowStepArray(workflowReport2.value.WorkflowSteps, workflowStepDefinitions);
    stepsReport2.value = addTimesToWorkflowStepArray(stepsReport2.value, stepTimeReport2.value);

    loading.value=true; // loading done

    await nextTick(); // Load Charts Next Frame
    initCharts();

});
</script>

<style scoped>
.close-button:hover {
    color: red;
}

.title {
  text-align:center;
  font-weight:500;
  text-transform:uppercase;
  font-size: 24px;
}
</style>

