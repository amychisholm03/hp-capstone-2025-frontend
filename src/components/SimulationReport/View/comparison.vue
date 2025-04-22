<template>
  <div class="container">
    <v-row
      no-gutters
      fill-height
      class="align-row d-flex"
      style="flex-wrap: nowrap; height:100%; width:100%;"
    >
      <v-col
        no-gutters
        fill-height
        class="pr-2"
        :class="mobile ? 'label-column-mobile' : 'label-column'"
      >
        <table style="width:100%">
          <thead>
            <tr>
              <th class="comparison-header">
                <div class="d-flex justify-left">
                  <v-chip
                    tile
                    color="white"
                    class="pa-0"
                  >
                    <span style="color:black; font-weight:bold;">
                      Operation
                    </span>
                  </v-chip>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="label in labels"
              :key="label.value"
            >
              <td
                class="comparison-table-step-names step-name-selectable"
                @click="highlightStep(label.value)"
              >
                <strong
                  v-if="label.value === highlightedStep"
                  class="comparison-field"
                >
                  {{ label.title }}
                </strong>
                <span
                  v-else
                  class="comparison-field"
                >
                  {{ label.title }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </v-col>

      <v-col
        :class="mobile ? 'times-column-mobile' : 'times-column'"
      >
        <v-row
          ref="horizontalScroll"
          no-gutters
          class="align-row d-flex"
          style="flex-wrap:nowrap; flex-direction:row; overflow-x:scroll; overflow-y:hidden; height:100%; width:100%;"
        >
          <div
            v-if="horizontalArrow"
            class="align-center d-flex justify-center scroll-arrow"
          >
            <v-icon
              size="large"
              style="position:absolute; z-index:102;"
            >
              mdi-circle
            </v-icon>
            <v-icon
              color="white"
              style="z-index:103;"
            >
              mdi-chevron-double-right
            </v-icon>
          </div>

          <v-col
            v-for="{report, printjob, workflow, steps, color } in reportData"
            :key="report.id"
            cols="auto"
          >
            <table>
              <thead>
                <tr>
                  <th class="comparison-header">
                    <v-chip
                      :color="color"
                      tile
                    >
                      <div style="color:black; font-weight:bold; overflow:hidden; font-size:0.8em; width:50em; max-width:50px;">
                        <p style="text-overflow:ellipsis; overflow-x:hidden;">
                          {{ printjob.Title }}
                        </p>
                        <p style="text-overflow:ellipsis; overflow-x:hidden;">
                          {{ workflow.Title }}
                        </p>
                      </div>
                    </v-chip>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(step, i) in steps"
                  :key="i"
                >
                  <td
                    :style="`background-color:${getHeatmapColor(step)}`"
                    class="comparison-table-data"
                  >
                    <!-- Highlighting active: highlighted step -->
                    <span
                      v-if="i === highlightedStep"
                      class="comparison-field"
                    >
                      {{ toTimeUnit(step.time) }}
                    </span>
                    <!-- No Highlighting Active -->
                    <span
                      v-else-if="highlightedStep === null"
                      class="comparison-field"
                    >
                      {{ toTimeUnit(step.time) }}
                    </span>
                    <!-- Highlighting Active: non-highlighted step -->
                    <span
                      v-else
                      style="opacity:0.2;"
                      class="comparison-field"
                    >
                      {{ toTimeUnit(step.time) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </v-col>
        </v-row>
      </v-col>

      <v-col
        v-if="!mobile"
        class="settings-column"
      >
        <p
          class="mb-3 settings-title"
        >
          Time Units
        </p>
        <v-btn-toggle
          v-model="secondsOrMinutes"
          mandatory
        >
          <v-btn
            :value="0"
            class="ma-0"
            style="font-size:xx-small; width:64px; height:28px;"
            border
          >
            Minutes
          </v-btn>
          <v-btn
            :value="1"
            class="ma-0"
            style="font-size:xx-small; width:64px; height:28px;"
            border
          >
            Seconds
          </v-btn>
        </v-btn-toggle>

        <div>
          <p
            class="settings-title"
            variant="outlined"
            tile
          >
            Heat Map 
          </p>
          <v-switch
            class="pl-2"
            v-model="showHeatMap"
          >
          </v-switch>
        </div>
        <v-spacer></v-spacer>
      </v-col>
    </v-row>
    <div
      v-if="!mobile"
      class="d-flex justify-start"
      style="position:absolute; right:9px; bottom:12px;"
    >
      <v-btn
        icon
        color="primary"
        size="small"
        flat
        @click="handleCSV"
      >
        <v-icon>
          mdi-file-delimited-outline
        </v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, nextTick, reactive } from "vue";

//////////////////////////
//// Props
//////////////////////////

const {
  reportData = [],
  labels = [],
  mobile = false,
}
=
defineProps({
  reportData: Array,
  labels: Array,
  mobile: Boolean,
});

//////////////////////////
//// Data
//////////////////////////

const secondsOrMinutes = ref(0);
const showHeatMap = ref(0);
const highlightedStep = ref(null);

//////////////////////
//// Logic
//////////////////////

const toTimeUnit = (time) => {
  if (secondsOrMinutes.value === 0) {
    return (time / 60).toFixed(2);
  }
  return time;
};

const getHeatmapColor = (step) => {

  if (!showHeatMap.value) {
    return 'white';
  }

  const map = heatmap.value[step.stepid];
  const score = map.scores[step.reportid];
  const scores_total = score.length;
  const high_score = map.high_score ? map.high_score : 1;
  const mid_score  = map.high_score / 2;

  if (score > (mid_score)) {
    return `rgba(255,100,100,${score / mid_score});`
  } else if (score < (mid_score)) {
    return `rgba(100,255,100,calc(${1 - (score / high_score)}));`
  } else {
    return 'yellow';
  }
}

const generateHeatmap = (data, steps) => {
  const maps = [];

  // Loop through each step (eg Rasterization, Lamination etc.)
  steps.forEach((step) => {
    console.log(step);
    let times = [];
    let index = 0;

    // Loop through each simulation report and get it's time for our current step
    data.forEach((report) => {
      times.push({
          reportid: report.report.id,
          time: report.steps[step.value].time
        });
    });

    // Now that we have all times for this step, sort them.
    times = times.sort((a,b)=>{
      return (Number(a.time) - Number(b.time));
    });

    // Each simulation report will be assigned a score from where it lies in the sorted array.
    const scores = {};
    let prev_time = times[0].time;
    let score = 0;
    times.forEach((time) => {
      if (prev_time !== time.time) {
        score++;
      }
      prev_time = time.time;
      console.log(time.reportid);
      console.log(score);
      scores[time.reportid] = score;
    });
    maps.push({
      stepId: step.value,
      scores,
      high_score: score,
    });
  });
  return maps;
};

//////////////////////
//// Handlers
/////////////////////

const handleCSV = () => {

  const headers = labels.map((label)=>{
    return label.title;
  }).join(",");

  const data = reportData.map((report) => {
    const stepTimesInReport = [];
    report.steps.forEach((step)=>{
      stepTimesInReport.push(step.time);
    });
    const string = stepTimesInReport.join(",");
    return string + '\n';
  }).join('');

  const csv = headers + '\n' + data;
  const blob = new Blob([csv], { type: "text/csv"});
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = 'simulation-report-times.csv';
  document.body.appendChild(link);
  link.click();
};

///////////////////////
//// Display
//////////////////////

const highlightStep = (index) => {
  if (index === highlightedStep.value) {
    highlightedStep.value = null;
  } else {
    highlightedStep.value = index;
  }
}

////////////////////////////
//// Computed
////////////////////////////

const heatmap = computed(() => {
  if (labels.length && reportData.length){
    return generateHeatmap(reportData, labels);
  }
  return null;
});

//////////////////////////
//// Scroll Behavior
//////////////////////////

const horizontalArrow = ref(false);
const horizontalScroll = ref(null);
const horizontalArrowConsumed = ref(false);
const checkScroll = () => {
  const element = horizontalScroll.value.$el;
  horizontalArrow.value = element.scrollLeft + element.clientWidth < element.scrollWidth;
}
const scrollToEnd = () => {
  const refval = horizontalScroll.value;
  if (refval) {
    const el = refval.$el;
    const max = el.scrollWidth;
    el.scrollBy(max,0, 'smooth');
  }
  horizontalArrowConsumed.value = true;
};
</script>

<style scoped>
/* .comparison-card-title{
  height:18px;
  text-align:center;
  text-justify: center;
  background-color:rgb(25,25,25);
  color:white;
  font-weight: bold;
  font-size: 1.0em;
  font-family: 'Courier New', Courier, monospace;
  border-radius:5px;
  text-transform: uppercase;
} */

.comparison-header{
  height:35px;
  max-height:35px;
  min-height:35px;
  overflow-y:hidden;
}

.comparison-table-data{
  text-align:center;
  max-width:15px;
  padding-right:10%;
  text-wrap:nowrap;
  overflow:hidden;
  font-weight:500;
}

.comparison-table-step-names{
  text-overflow:ellipsis;
  padding-right:5%;
  max-width:70px;
  text-wrap:nowrap;
  overflow:hidden;
}

.comparison-field {
  font-size: 0.8em;
  overflow: hidden;
  text-overflow: ellipsis;
}

.container{
  padding:16px;
  padding-bottom:8px;
  position:relative;
  font-size:0.9em;
  border-style:solid;
  border-color:rgba(50,50,50,0.6);
  border-width:1px;
  border-radius:10px;
}

.settings-column{
  display:flex;
  flex-wrap:nowrap;
  flex-direction: column;
  overflow:hidden;
  row-gap:0px;
  margin-left:12px;
  margin-right:12px;
}

.scroll-arrow {
  position:absolute;
  right:5%;
  bottom:50%;
  animation-name:pop;
  animation-duration:6s;
  animation-fill-mode:forwards;
  color:black;
  z-index:150;
}

.scroll-arrow:hover {
  opacity: 0.5;
}

.label-column{
  overflow:hidden;
  min-width:15%;
  max-width:15%;
}

.label-column-mobile{
  overflow:hidden;
  min-width:35%;
  max-width:35%;
}

.times-column{
  border-style:groove;
  border-width:3px;
  border-color:white;
  max-width:60%;
  min-width:60%;
  position:relative;
}

.times-column-mobile{
  border-style:groove;
  border-width:3px;
  border-color:white;
  max-width:65%;
  min-width:65%;
  position:relative;
}

.settings-title{
  font-size:x-small;
  color:rgba(100,100,100, 0.9);
  font-weight:500;
  line-height: 12px;
  font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
}
</style>

