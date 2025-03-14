<template>
  <div style="width:100%; height:100%;">
    <v-row no-gutters style="width:100%; height:10%;">
      <v-col>
        <v-tabs
          v-model="tab"
          color="red"
          class="d-flex align-center"
        >
          <v-tab
            value="0"
            text="Pie"
            width="20%"
            style="margin:auto;"
          >
          </v-tab>
          <v-tab
            value="1"
            text="Bar"
            width="20%"
            style="margin:auto;"
          >
          </v-tab>
          <v-tab
            value="2"
            text="Radar"
            width="20%"
            style="margin:auto;"
          >
          </v-tab>
        </v-tabs>
      </v-col>
    </v-row>

    <v-row no-gutters style="width:100%; height:90%;">
      <v-col style="height:90%;">
        <v-tabs-window
          v-model="tab"
          style="height:100%"
        >
          <v-tabs-window-item
            value="0"
            :transition="false"
            style="width:100%; height:100%;"
          >
            <chart-pie
              style="width:100%; height:100%;"
              :data="data"
              :labels="labels"
              :chart-id="`r1-${ chartId}`"
            >
            </chart-pie>
          </v-tabs-window-item>
          <v-tabs-window-item
            value="1"
            :transition="false"
            style="width:100%; height:100%;"
          >
            <chart-bar
              style="width:100%; height:100%;"
              :data="data"
              :labels="labels"
              :chart-id="`r1-${ chartId}`"
            >
            </chart-bar>
          </v-tabs-window-item>
          <v-tabs-window-item
            value="2"
            style="width:100%; height:100%;"
            :transition="false"
          >
            <chart-radar
              :data="data"
              style="width:100%; height:100%;"
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
