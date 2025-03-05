<template>
  <v-card
    class="report-history-item"
    @click="$emit('select-report', report.id)"
  >
    <v-row
      style="height:100%;"
      no-gutters
    >
      <v-col
        style="height: 100%;"
      >
        <v-card-text class="item-desc">
          Print Job:
        </v-card-text>
        <v-card-text class="item-desc">
          Workflow:
        </v-card-text>
      </v-col>

      <v-col
        cols="3"
      >
        <v-card-text
          class="item-val"
        >
          {{ report.PrintJobTitle ? report.PrintJobTitle : 'N/A' }}
        </v-card-text>
        <v-card-text
          class="item-val"
        >
          {{ report.WorkflowTitle ? report.WorkflowTitle : 'N/A' }}
        </v-card-text>
      </v-col>

      <v-col
        cols="3"
      >
        <v-card-text>
          Total Time:
        </v-card-text>
      </v-col>
      <v-col
        cols="3"
      >
        <v-card-text>
          {{ report.TotalTimeTaken ? report.TotalTimeTaken : 'N/A' }}
          secs.
        </v-card-text>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="3"
      >
        <v-card-text>
          Created:
        </v-card-text>
      </v-col>
      <v-col
        cols="3"
      >
        <v-card-text>
          {{ report.Date }} @ {{ report.Time }}
        </v-card-text>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from "vue";
const {report = null} = defineProps({
  report: Object,
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
</style>
