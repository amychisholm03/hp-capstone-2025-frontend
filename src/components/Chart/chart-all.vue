<template>
  <div>
    <!-- Chart Selection Area -->
    <v-row
      no-gutters
    >
      <v-col>
        <v-tabs
          v-model="type"
          color="info"
          stacked
          class="align-center d-flex"
        >
          <v-tab
            :value="0"
            text="Pie"
          >
            <v-icon>
              mdi-chart-pie
            </v-icon>
          </v-tab>
          <v-tab
            :value="1"
            text="Bar"
          >
            <v-icon>
              mdi-chart-bar
            </v-icon>
          </v-tab>
          <v-tab
            :value="2"
            text="Radar"
          >
            <v-icon>
              mdi-radar
            </v-icon>
          </v-tab>
        </v-tabs>
      </v-col>
    </v-row>

    <!-- Chart Area -->
    <v-row
      no-gutters
      style="width:100%; height:90%;"
    >
      <v-col>
      </v-col>
    </v-row>
    <div class="graph-bottom" />
  </div>
</template>
<script setup>
import { watch, onMounted, onBeforeUnmount, onUnmounted, ref, computed, nextTick, reactive } from "vue";
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

/////////////////
//// Props
/////////////////

const props
=
defineProps({
  chartInfo:{
    type: Object,
    default: null,
  },
  canvas: {
    type: Object,
    default:null,
}
});

/////////////////
//// Data
/////////////////

const type = ref(0);
const chart = ref(null);

//////////////////
//// METHODS
//////////////////

const getPrepickedColors = () => {
  const prepickedColors = ['#db3047','#9575CD', '#F06292', '#E57373','#64B5F6','#4DD0E1', '#60C381', '#FFD54F', '#4DB6AC']
  return props.chartInfo.data.map((step) => {
    if (prepickedColors.length > 0) {
      return prepickedColors.pop();
    }
    return "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")";
  });
};

const createPieChart = () => {
  const colors = getPrepickedColors();
  if (chart.value) {
    chart.value.destroy();
  }
  if (!props.canvas) {
    return;
  }

  chart.value = new Chart(
    props.canvas,
    {
      type: 'pie',
      data: {
        labels: props.chartInfo.labels,
        datasets: [{
          label: '',
          data: props.chartInfo.data,
          backgroundColor: colors,
          borderWidth: 1
        }],
      },
      options: {
        animation: false,
      }
  });
};

const createBarChart = () => {
  const colors = getPrepickedColors();
  if (chart.value) {
    chart.value.destroy();
  }
  if (!props.canvas) {
    return;
  }

  chart.value = new Chart(
    props.canvas, {
    type: 'bar',
    data: {
      labels: props.chartInfo.labels,
      datasets: [{
        data: props.chartInfo.data,
        backgroundColor: colors,
        borderWidth: 1
      }]
    },
    options: {
      indexAxis: 'y',
      animation: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
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
      },
    }
  });
};


const createRadarChart = () => {
  if (chart.value) {
    chart.value.destroy();
  }
  if (!props.canvas) {
    return;
  }
  const dataset = {
    label: '',
    data: props.chartInfo.data,
    backgroundColor: 'red',
  };

  chart.value = new Chart(
    props.canvas, {
    type: 'radar',
    data: {
      labels: props.chartInfo.labels,
      datasets: [dataset],
    },
    options: {
      animation: false,
      plugins: {
        legend: {
          display: false,
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
};

const refreshChart = () =>{
  if (chart.value) {
    chart.value.destroy();
  }
  switch (type.value) {
    // Pie Chart
    case 0:
      createPieChart()
    break;

    // Bar Chart
    case 1:
      createBarChart()
    break;

    // Radar Chart
    case 2:
      createRadarChart()
    break;

    default:
    break;
  }
};

//////////////////
//// Watchers
//////////////////

//// Refresh Chart On Prop Update
watch(
  () => {
return props.chartInfo
},
  (value) => {
  if (value.labels && value.data) {
    const l = value.labels;
    const d = value.data;
    if (l.length > 0 && d.length > 0) {
      refreshChart();
    }
  }
});

//// Refresh Chart when we change chart type
watch(
  type,
  () => {
    if (props.chartInfo.labels && props.chartInfo.data) {
      const l = props.chartInfo.labels;
      const d = props.chartInfo.data;
      if (l.length > 0 && d.length > 0) {
        refreshChart();
      }
    }
  }
)

////////////////////////
//// Lifecycle Methods
////////////////////////

//// Initial Chart Load on mount
onMounted(() => {
  refreshChart();
});

//// Destroy chart object on unmount
onBeforeUnmount(() => {
  if (chart.value) {
    chart.value.destroy();
  }
});
</script>
