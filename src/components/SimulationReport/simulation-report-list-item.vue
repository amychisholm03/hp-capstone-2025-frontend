<template>
  <v-card
    :class="mobile ? 'report-history-item-mobile' : 'report-history-item'"
    @click="$emit('select-report', report.id)"
  >
    <v-row
      style="height:100%; width:100%; display:flex; flex-wrap:nowrap;"
      no-gutters
    >
      <v-col
        :cols="mobile ? '5' : 'auto'"
        class="align-center d-flex pl-3"
        :class="mobile ? 'justify-center' : ''"
      >
        <v-chip
          variant="elevated"
          size="small"
          class="align-center d-flex justify-center"
          style="box-shadow:none;"
        >
          <v-card-text
            :class="mobile ? 'mobile-item-val' : 'item-val'"
          >
            {{ report.WorkflowTitle ? report.WorkflowTitle : 'N/A' }}
          </v-card-text>
        </v-chip>
      </v-col>

      <v-col
        v-if="!mobile"
        cols="auto"
        class="align-center d-flex"
        :class="mobile ? 'justify-center' : ''"
      >
        <v-icon>
          mdi-plus
        </v-icon>
      </v-col>

      <v-col
        v-else
        cols="1"
      >
      </v-col>

      <v-col
        :cols="mobile ? '6' : 'auto'"
        class="align-center d-flex"
        :class="mobile ? 'justify-center pr-3' : ''"
      >
        <v-chip
          size="small"
          variant="elevated"
          style="box-shadow:none;"
        >
          <v-card-text
            :class="mobile ? 'mobile-item-val' : 'item-val'"
          >
            {{ report.PrintJobTitle ? report.PrintJobTitle : 'N/A' }}
          </v-card-text>
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
  font-weight:bold;
  font-size:1.1em;
  font-family:'Courier New', Courier, monospace;
  margin-inline: 4px;
}

.mobile-item-val{
  font-weight:bold;
  font-size:0.8em;
  font-family:'Courier New', Courier, monospace;
}

.item-val-time{
  font-weight:600;
  font-size:0.9em;
  font-family:'Courier New', Courier, monospace;
}
</style>
