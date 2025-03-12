<template>
  <canvas :id="chartId ? `${chartId }-chart-radar` : 'chart-radar'">
  </canvas>
</template>
<script setup>
import { defineProps, onMounted, ref, computed, nextTick, reactive } from "vue";
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

//// Props ////
const {
  data1 = null,
  data2 = null,
  labels = null,
  chartId = null,
}
=
defineProps({
  data1: Array,
  data2: Array,
  labels: Array,
  chartId: String,
});

onMounted(() => {
  const ref = document.getElementById(chartId ? `${chartId }-chart-radar` : 'chart-radar');

  // get some nice colors picked out.
  const prepickedColors = ['#db3047','#9575CD', '#F06292', '#E57373','#64B5F6','#4DD0E1', '#60C381', '#FFD54F', '#4DB6AC']
  const colors = data1.map((step) => {
    if (prepickedColors.length > 0) {
      return prepickedColors.pop();
    }
    return "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")";
  });

  const dataset1 = {
        label: (!!data2) ? 'Report 1' : 'Report',
        data: data1,
        backgroundColor: 'red',
      };

  const dataset2 = {
        label: 'Report 2',
        data: data2,
        backgroundColor: 'green', //colors.toReversed(),
      };

  const datasets = [];
  datasets.push(dataset1);
  if (!!data2) {
    datasets.push(dataset2);
  }

  new Chart(ref, {
    type: 'radar',
    data: {
      labels: labels,
      datasets: datasets,
    },
    options: {
      plugins: {
        legend: {
          labels: {
            font: {
              size: 20,
              weight: 'bold'
            },
          }
        }
      },
      scales: {
        r: {
          pointLabels: {
            font: {
              size: 15,
              weight: 'bold'
            },
          },
          ticks: {
            font: {
              size: 13,
            }
          }
        },
        x: {
          ticks: {
            font: {
              size: 14,
              weight: 'bold'
            }
          }
        },
        y: {
          ticks: {
            font: {
              size: 14,
              weight: 'bold'
            }
          }
        }
      }
    }
  });
});
</script>
