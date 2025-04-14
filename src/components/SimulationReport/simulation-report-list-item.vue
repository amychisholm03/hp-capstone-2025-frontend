<template>
  <v-card
    class="report-history-item"
    @click="$emit('select-report', report.id)"
  >
    <v-row
      style="height:100%; width:100%; display:flex; flex-wrap:nowrap;"
      no-gutters
    >
      <v-col
        :cols="mobile ? '5' : '4'"
        class="align-center d-flex pl-3"
        :class="mobile ? 'justify-center' : ''"
      >
        <v-chip
          variant="elevated"
          :size="mobile ? 'x-small' : 'small'"
          tile
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
        cols="1"
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
        :cols="mobile ? '6' : '4'"
        class="align-center d-flex"
        :class="mobile ? 'justify-center pr-6' : ''"
      >
        <v-chip
          :size="mobile ? 'x-small' : 'small'"
          variant="elevated"
          tile
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
        class="mr-4"
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

.item-val{
  font-weight:bold;
  font-size:1.8em;
  font-family:'Courier New', Courier, monospace;
}

.mobile-item-val{
  font-weight:bold;
  font-size:1.3em;
  font-family:'Courier New', Courier, monospace;
}

.item-val-time{
  font-weight:600;
  font-size:0.9em;
  font-family:'Courier New', Courier, monospace;
}
</style>
