<template>
  <div>
    <v-row>
      <v-col>
        <v-tabs
          v-model="tab"
        >
          <v-tab
            value="0"
            text="Pie"
          >
          </v-tab>
          <v-tab
            value="1"
            text="Bar"
          >
          </v-tab>
          <v-tab
            value="2"
            text="Radar"
          >
          </v-tab>
        </v-tabs>
      </v-col>

      <v-col>
        <v-tabs-window
          v-model="tab"
        >
          <v-tabs-window-item
            value="0"
            :transition="false"
            style="aspect-ratio: 1/1; width:100%; padding:1%;"
          >
            <chart-pie
              :data="data"
              :labels="labels"
              :chart-id="`r1-${ chartId}`"
            >
            </chart-pie>
          </v-tabs-window-item>
          <v-tabs-window-item
            value="1"
            :transition="false"
            style="aspect-ratio: 1/1; width:100%; padding:1%;"
          >
            <chart-bar
              :data="data"
              :labels="labels"
              :chart-id="`r1-${ chartId}`"
              class="pa-5"
            >
            </chart-bar>
          </v-tabs-window-item>
          <v-tabs-window-item
            value="2"
            :transition="false"
          >
            <chart-radar
              :data="data"
              :labels="labels"
              :chart-id="`r1-${chartId}`"
              class="pa-10"
            >
            </chart-radar>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-col>
    </v-row>
    <div class="graph-bottom" />
  </div>
</template>
<script setup>
import { onMounted, ref, computed, nextTick, reactive } from "vue";
import PieChart from "./chart-pie.vue";
import BarChart from "./chart-bar.vue";
import ChartRadar from "./chart-radar.vue";

//// Props ////

const {
  data = null,
  labels = null,
  chartId = 'default',
}
=
defineProps({
  data: Array,
  labels: Array,
  chartId: String,
});

console.log(data);
console.log(labels);
console.log(chartId);

//// Data ////

const tab = ref('0');
</script>
