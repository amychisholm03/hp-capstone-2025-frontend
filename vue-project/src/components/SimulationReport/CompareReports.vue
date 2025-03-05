<template>
  <v-app>
    <v-banner
      max-height="75px"
      style="border-width: 0px; font-size:large; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; font-weight: bold;"
    >
      <v-row>
        <v-col
          class="align-center d-flex justify-start"
        >
          Compare Simulation Reports
        </v-col>
        <v-col
          cols="2"
          class="align-center d-flex justify-end"
          align="right"
        >
          <v-btn
            class="align-center close-button d-flex"
            icon
            tile
            @click="$emit('exit')"
          >
            <v-icon>
              mdi-window-close
            </v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-banner>
  </v-app>
</template>

<script setup>
    import { onMounted, ref, computed } from "vue";
    const SimulationReportDialogue = ref(false);

    const {
    reportOne = null,
    workflowOne = null,
    printJobOne = null,
    reportTwo = null,
    workflowTwo = null,
    printJobTwo = null
    }
    =
    defineProps({
    reportOne: Object,
    workflowOne: Object,
    printJobOne: Object,
    reportTwo: Object,
    workflowTwo: Object,
    printJobTwo: Object,
    });
</script>

<style scoped>
.close-button:hover {
    color: red;
}
</style>
