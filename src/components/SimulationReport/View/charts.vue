<template>
  <div
    class="container"
  >
    <v-tabs
      v-model="selectedChart"
      fixed-tabs
      class="charts-selection"
      @change="$emit('select-chart', selectedChart)"
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
      class="charts-canvas"
    >
      <canvas
        id="chart-canvas"
        style="max-width:500px; max-height:500px; display:block;"
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
    console.log(selectedChartData);
    setTimeout(() => {
      chartCanvas.value = document.getElementById('chart-canvas');
      console.log(chartCanvas.value);

      //select default chart.
      selectedChart.value = 0;
      emit('select-chart', 0);
    }, 3000);
});
</script>
<style scoped>
.container {
  border-width:1px;
  border-style:solid;
  border-color:black;
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
.charts-canvas{
  min-width:100%;
  min-height:85%;
  max-width:100%;
  max-height:85%;
  justify-items:center;
  display:block;
}

.charts-selection{
  min-width:100%;
  min-height:15%;
  max-width:100%;
  max-height:15%;
}
</style>