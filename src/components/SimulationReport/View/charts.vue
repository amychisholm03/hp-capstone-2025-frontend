<template>
  <div
    :class="mobile ? 'mobile-container' : 'container'"
  >
    <v-tabs
      v-model="selectedChart"
      fixed-tabs
      class="charts-selection"
      @click="$emit('select-chart', selectedChart)"
    >
      <v-tab
        v-for="{ index, printjob, workflow } in reportData"
        :key="index"
        :value="index"
        :class="index === selectedChart ? 'tab-selected' : 'tab-unselected'"
      >
        {{ printjob.Title }} - {{ workflow.Title }}
      </v-tab>
    </v-tabs>

    <!-- Chart Canvas -->
    <div
      class="charts-canvas align-center justify-center d-flex"
    >
      <canvas
        id="chart-canvas"
        :class="mobile ? 'chart-canvas-div-mobile' : 'chart-canvas-div'"
      >
      </canvas>
    </div>

    <!-- Chart Selector -->
    <chart-all
      v-if="chartCanvas"
      :chart-info="{data: selectedChartData, labels: selectedChartLabels }"
      :canvas="chartCanvas"
    >
    </chart-all>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, nextTick } from "vue";
import ChartAll from '../../Chart/chart-all.vue';

const emit = defineEmits(['select-chart']);

//////////////////////////
//// Props
//////////////////////////
const {
  reportData = [],
  mobile = false,
  selectedChartData = [],
  selectedChartLabels = [],
}
=
defineProps({
  reportData: Array,
  mobile: Boolean,
  selectedChartData: Array,
  selectedChartLabels: Array,
});

const selectedChart = ref(null);
const chartCanvas   = ref(null);

onMounted(
  async () => {
    await nextTick();
    setTimeout(() => {
      chartCanvas.value = document.getElementById('chart-canvas');

      //select default chart.
      selectedChart.value = 0;
      emit('select-chart', 0);
    }, 3000);
});
</script>
<style scoped>
.container {

}
.mobile-container {
  width:100%;
  padding-inline:24px;
}
.chart-canvas-div-mobile {
  max-width:  200px;
  max-height: 200px;
  min-width:  200px;
  min-height: 200px;
  display: block;
}
.tab-selected {
  color: #000000 !important;
  font-weight:600;
  font-size:1.0em;
}
.tab-unselected {
  font-weight:400;
  font-size:0.8em;
}
.charts-canvas {
  min-width:100%;
  min-height:95%;
  max-width:100%;
  max-height:95%;
}
.chart-canvas-div {
  max-width:  500px;
  max-height: 500px;
  min-width:  500px;
  min-height: 500px;
  display: block;
}

.charts-selection {
  min-width:100%;
  max-width:100%;
  max-height:5%;
  min-height:5%;
}
</style>
