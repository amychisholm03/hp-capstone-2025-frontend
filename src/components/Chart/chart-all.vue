<template>
  <div>
    <v-row>
      <v-col>
        <v-tabs
          v-model="tab1"
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
        <v-tabs-window
          v-model="tab1"
        >
          <v-tabs-window-item
            value="0"
            :transition="false"
            style="aspect-ratio: 1/1; width:100%; padding:1%;"
          >
            <chart-pie
              :data="data1"
              :labels="labels1"
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
              :data="data1"
              :labels="labels1"
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
              :data1="data1"
              :data2="data2"
              :labels="labels1"
              :chart-id="`r1-${ chartId}`"
              class="pa-10"
            >
            </chart-radar>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-col>

      <!-- Data 2 -->
      <v-col v-if="!!data2">
        <v-tabs
          v-model="tab2"
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
        <v-tabs-window
          v-model="tab2"
        >
          <v-tabs-window-item
            value="0"
            :transition="false"
            style="aspect-ratio: 1/1; width: 70%;"
          >
            <chart-pie
              :data="data2"
              :labels="labels2"
              :chart-id="`r2-${ chartId}`"
            >
            </chart-pie>
          </v-tabs-window-item>
          <v-tabs-window-item
            value="1"
            :transition="false"
            style="aspect-ratio: 2/1; height: 50%;"
          >
            <chart-bar
              :data="data2"
              :labels="labels2"
              :chart-id="`r2-${ chartId}`"
            >
            </chart-bar>
          </v-tabs-window-item>
          <v-tabs-window-item
            value="2"
            :transition="false"
            style="aspect-ratio: 1/1; width: 75%;"
          >
            <chart-radar
              :data1="data2"
              :data2="data1"
              :labels="labels1"
              :chart-id="`r2-${ chartId}`"
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
  data1 = null,
  labels1 = null,
  data2 = null,
  labels2 = null,
  chartId = null,
}
=
defineProps({
  data1: Array,
  data2: Array,
  labels1: Array,
  labels2: Array,
  chartId: String,
});

//// Data ////

const tab1 = ref('0');
const tab2 = ref('0');
</script>
