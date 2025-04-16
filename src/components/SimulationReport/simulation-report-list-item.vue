<template>
  <v-card
    :class="mobile ? 'report-history-item-mobile' : 'report-history-item'"
    @click="$emit('select-report', report.id)"
  >
    <v-row
      style="height:100%; width:100%; display:flex; flex-wrap:nowrap;"
      no-gutters
    >
      <!-- Workflow Title -->
      <v-col
        :cols="mobile ? '5' : '3'"
        class="align-center d-flex mr-2 pl-3"
        :class="mobile ? 'justify-center' : ''"
      >
        <v-chip
          variant="outlined"
          size="large"
          class="align-center d-flex justify-center pb-1 pt-1"
          style="width:100%; border-radius:10px;"
        >
          <v-card-text
            :class="mobile ? 'mobile-item-val' : 'item-val'"
          >
            <p class="item-val-desc">
              Workflow
            </p>
            <p class="d-flex justify-center">
              {{ report.WorkflowTitle ? report.WorkflowTitle : 'N/A' }}
            </p>
          </v-card-text>
        </v-chip>
      </v-col>

      <!-- Print Job Title -->
      <v-col
        :cols="mobile ? '6' : '3'"
        class="align-center d-flex pt-1"
        :class="mobile ? 'justify-center pr-3' : ''"
      >
        <v-chip
          flat
          size="large"
          variant="outlined"
          style="width:100%; border-radius:10px;"
          class="align-center d-flex justify-center pb-1 pt-1"
        >
          <div
            :class="mobile ? 'mobile-item-val' : 'item-val'"
          >
            <p class="d-flex item-val-desc justify-center">
              Print
            </p>
            <p class="d-flex justify-center">
              {{ report.PrintJobTitle ? report.PrintJobTitle : 'N/A' }}
            </p>
          </div>
        </v-chip>
      </v-col>

      <v-spacer v-if="!mobile">
      </v-spacer>

      <!-- Simulation Report Date and Time (Desktop only) -->
      <v-col
        v-if="!mobile"
        cols="auto"
        class="align-center d-flex mr-4"
      >
        <v-card-text
          class="item-val-time"
        >
          {{ report.Date ? report.Date : '---' }}
        </v-card-text>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from "vue";
const {report = null} = defineProps({
  report: Object,
  mobile: Boolean
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

.item-val {
  font-weight:600;
  font-size:1.0em;
  color:rgba(50,50,50,0.9);
  font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  width:100%;
}

.item-val-desc {
  font-weight:800;
  color:darkslategrey;
  opacity:0.6;
  font-size:0.7em;
  font-family:'Courier New', Courier, monospace;
}

.mobile-item-val{
  font-weight:500;
  font-size:0.8em;
  font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.item-val-time{
  font-weight:600;
  font-size:0.9em;
  font-family:'Courier New', Courier, monospace;
}
</style>
