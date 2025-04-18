<template>
  <div
    class="container"
  >
    <v-tabs
      v-model="selectedChart"
      fixed-tabs
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
        style="max-width:600px; max-height:500px; display:block;"
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
      chartCanvas.value = ref(document.getElementById("chart-canvas"));
      console.log(chartCanvas.value);
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
  max-width:600px;
  max-height:600px;
  display:block;
}
</style>