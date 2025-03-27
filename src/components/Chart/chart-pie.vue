<template>
  <canvas
    :id="chartId !== null ? `${chartId}-pie-chart` : 'pie-chart'"
    style="width:100%; height:100%;"
  >
  </canvas>
</template>
<script setup>
import { defineProps, onMounted, ref, computed, nextTick, reactive } from "vue";
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

//// Props ////
const {
  data = null,
  labels = null,
  chartId = null,
}
=
defineProps({
  data: Array,
  labels: Array,
  chartId: String,
});
console.log(chartId);

onMounted(() => {
  const ref = document.getElementById(chartId !== null ? `${chartId }-pie-chart` : 'pie-chart');

  // get some nice colors picked out.
  const prepickedColors = ['#db3047','#9575CD', '#F06292', '#E57373','#64B5F6','#4DD0E1', '#60C381', '#FFD54F', '#4DB6AC']
  const colors = data.map((step) => {
    if (prepickedColors.length > 0) {
      return prepickedColors.pop();
    }
    return "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")";
  });

  // instantiate the chart
  new Chart(ref, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        label: '',
        data: data,
        backgroundColor: colors,
        borderWidth: 1
      }]
    },
  });
});
</script>
