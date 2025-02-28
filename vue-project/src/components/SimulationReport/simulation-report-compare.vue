<template>
  <v-app v-if="loading">
    <v-banner
      max-height="75px"
      style="border-width: 0px; font-size:large; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; font-weight: bold;"
    >
      <!-- Header -->
      <v-row>
        <v-col
          class="align-center d-flex justify-start"
        >
          Simulation Report Comparison
        </v-col>
        <v-col
          cols="2"
          class="align-center d-flex justify-end"
          align="right"
        >
          <v-btn
            class="align-center close-button d-flex"
            icon
            tile
            @click="$emit('exit')"
          >
            <v-icon>
              mdi-window-close
            </v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-banner>

    <!-- Main Body -->
    <v-row class="mt-1 pl-6 pr-6">
      <!-- General Comparison Section -->
      <v-col>
        <v-row>
          <!-- Simulation Report 1 -->
          <v-col>
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
      </v-col>
      <!-- Workflow Step Comparison Section -->
      <v-spacer />
      <v-col>
        <v-row>
          <h3>Steps</h3>
        </v-row>
        <v-row class="align-center d-flex">
          <v-col>
            <v-list>
              <v-text-field
                :readonly="true"
                density="compact"
                label="Workflow Steps"
              ></v-text-field>
              <v-list-item
                v-for="(time, step) in viewableReport1.StepTimes"
                :key="step"
              >
                <span>
                  <v-list-item-title> <strong>Step: </strong>{{ step }}</v-list-item-title>
                  <v-list-item-subtitle> <strong>Time Taken:</strong> {{ time }} secs</v-list-item-subtitle>
                </span>
              </v-list-item>
            </v-list>
          </v-col>
          <v-col>
            <v-text-field
              :readonly="true"
              density="compact"
              label="Number of Steps"
            ></v-text-field>
            <v-list>
              <v-text-field
                :readonly="true"
                density="compact"
                label="Workflow Steps"
              ></v-text-field>
              <v-list-item
                v-for="(time, step) in viewableReport2.StepTimes"
                :key="step"
              >
                <span>
                  <v-list-item-title> <strong>Step: </strong>{{ step }}</v-list-item-title>
                  <v-list-item-subtitle> <strong>Time Taken:</strong> {{ time }} secs</v-list-item-subtitle>
                </span>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-app>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import {getPrintJob, getWorkflow } from "../api.js";

const {
  report1 = null,
  report2 = null,
}
=
defineProps({
  report1: Object,
  report2: Object,
});

const dateTimeReport1 = ref("");
const dateTimeReport2 = ref("");
const viewableReport1 = ref(null);
const viewableReport2 = ref(null);
const printjobReport1 = ref(null);
const workflowReport1 = ref(null);
const printjobReport2 = ref(null);
const workflowReport2 = ref(null);

const loading = ref(false);

// clone props so we cannot mute them.
viewableReport1.value = JSON.parse(JSON.stringify(report1));
viewableReport2.value = JSON.parse(JSON.stringify(report2));

onMounted(
  async () => {
    dateTimeReport1.value = report1.Date + "  " + report1.Time;
    dateTimeReport2.value = report2.Date + "  " + report2.Time;

    const response = await Promise.all([
      getPrintJob(report1.PrintJobID),
      getWorkflow(report1.WorkflowID),
      getPrintJob(report2.PrintJobID),
      getWorkflow(report2.WorkflowID),
      ]);
    console.log(response[3]);

    printjobReport1.value = response[0].ok ? await response[0].json() : null;
    workflowReport1.value = response[1].ok ? await response[1].json() : null;
    printjobReport2.value = response[2].ok ? await response[2].json() : null;
    workflowReport2.value = response[3].ok ? await response[3].json() : null;

    console.log(report1);
    console.log(workflowReport2.value);

    loading.value=true; // loading done
});
</script>

<style scoped>
.close-button:hover {
    color: red;
}
</style>

