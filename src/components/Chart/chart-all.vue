<template>
  <v-card>
    <v-row>
      <v-col>
        <v-tabs
          v-model="tab"
        >
          <v-tab
            key="0"
            :value="0"
            text="Bar"
          >
            <chart-pie
              :data="data"
              :labels="labels"
            >
            </chart-pie>
          </v-tab>
          <v-tab
            key="1"
            :value="1"
            text="Bar"
          >
            <chart-pie
              :data="data"
              :labels="labels"
            >
            </chart-pie>
          </v-tab>
        </v-tabs>
      </v-col>
    </v-row>
  </v-card>
</template>
<script setup>
import { onMounted, ref, computed, nextTick, reactive } from "vue";
import PieChart from "./chart-pie.vue"

//// Props ////
const {
  data = null,
  labels = null,
}
=
defineProps({
  data: Array,
  labels: Array
});

//// Data ////
const tab = ref(0);

//// Computed ////
const loaded = computed(() => {
  return !!data;
});
</script>
