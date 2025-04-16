<template>
  <div>
    <div id="overview-top" />
    <!-- Overview -->
    <v-col>
      <v-row
        ref="horizontalScroll"
        no-gutters
        class="overview-list-container pb-3"
      >
        <div
          v-if="horizontalArrow && !horizontalArrowConsumed"
          class="align-center d-flex justify-center scroll-arrow"
          @click="scrollToEnd"
        >
          <v-icon
            size="large"
            style="z-index:102; position:absolute;"
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
          v-for="{report, printjob, workflow, color} in reportData"
          :key="report.id"
          :class="mobile ? 'overview-list-mobile' : 'overview-list'"
          style=""
        >
          <!-- Data -->
          <v-row
            style="overflow:hidden; height:100%;"
            no-gutters
          >
            <v-col style="width:12vw; height:100%; max-height:100%;">
              <!-- Simulation Report Title -->
              <div
                class="overview-list-header"
              >
                <v-chip
                  :color="color"
                  size="x-small"
                >
                  {{ printjob.Title }}
                </v-chip>
                <br />
                <v-chip
                  size="x-small"
                  :color="color"
                >
                  {{ workflow.Title }}
                </v-chip>
              </div>

              <!-- Simulation Report Labels -->
              <div
                v-for="header in headers.report"
                :key="header.value"
                class="overview-list-item"
              >
                <div class="overview-list-label">
                  {{ header.text }}
                </div>
                <div class="overview-list-value">
                  {{ report[header.value] }}
                </div>
                <br />
              </div>

              <!-- Print Job Labels -->
              <div
                v-for="header in headers.printjob"
                :key="header.value"
                class="overview-list-item"
              >
                <div class="overview-list-label">
                  {{ header.text }}
                </div>
                <div class="overview-list-value">
                  {{ printjob[header.value] }}
                </div>
                <br />
              </div>

              <!-- Workflow Labels -->
              <div
                v-for="header in headers.workflow"
                :key="header.value"
                class="overview-list-item"
              >
                <div class="overview-list-label">
                  {{ header.text }}
                </div>
                <div class="overview-list-value">
                  {{ workflow[header.value] }}
                </div>
                <br />
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, nextTick, reactive } from "vue";

//////////////////////////
//// Props
//////////////////////////
const {
  reportData = [],
  mobile = false,
}
=
defineProps({
  reportData: Array,
  mobile: Boolean,
});

//////////////////////////
//// Data
//////////////////////////
const headers = ref({
  report: [
    { text: "Date Created", value: "dateTime" },
    { text: "Total Time (s)", value: "TotalTimeTaken" },
    { text: "Rasterization Profile", value: "RasterizationProfile" },
  ],
  printjob: [
    { text: "Page Count", value: "PageCount" },
  ],
  workflow: [
  ],
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
.overview-container{
  margin-left:20px;
  margin-right:20px;
  margin-bottom:20px;
  overflow-x:hidden;
  overflow-y:hidden;
  border-style:solid;
  border-width:1px;
  border-radius:0px;
  border-color:rgba(0,0,0,0.2);
}

.overview-item{
  border-width:1px;
  margin:0;
  padding:0;
}

.overview-card-title {
  font-size: 1.2em;
  height:18px;
  text-align:center;
  text-justify: center;
  background-color:rgb(25,25,25);
  color:white;
  font-weight: bold;
  font-size: 1.0em;
  font-family: 'Courier New', Courier, monospace;
  border-radius:0px;
  text-transform: uppercase;
  margin-bottom:10px;

}

.overview-list-item{
  width:100%;
  height:14.28%;
  border-width:1px;
}

.overview-list-header{
  width:100%;
  text-align:center;
  align-content:center;
  height:20%;
  color:white;
  font-family:'Courier New', Courier;
  text-overflow:ellipsis;
  overflow:hidden;
  text-wrap:nowrap;
  max-height:40%;
}

.overview-list-label{
  opacity: 0.7;
  text-overflow:hidden;
  text-align: center;
  max-height:40%;
  max-width:80%;
  margin-left:auto;
  margin-right:auto;
  text-wrap:nowrap;
  overflow:hidden;
  font-size:0.8em;
}

.overview-list-value{
  opacity:1.0;
  text-overflow:ellipsis;
  max-height:60%;
  max-width:80%;
  margin-left:auto;
  margin-right:auto;
  text-align: center;
  text-wrap:nowrap;
  overflow:hidden;
  font-size:0.9em;
}

.overview-list-container {
  height:100%;
  position:relative;
  display:flex;
  flex-direction: row;
  overflow-x:scroll;
  overflow-y:hidden;
  flex-wrap:nowrap;
  flex-grow:1;
}

.overview-list{
  background:white;
  height:inherit;
  max-height:inherit;
  width:14vw;
  max-width:14vw;
  border-width:1px;
  border-color:rgba(50,50,50,0.5);
  margin-right:5px;
  border-radius: 15px;
  border-style:groove;
}

.overview-list-mobile{
  background:white;
  height:inherit;
  max-height:inherit;
  width:45vw;
  min-width:45vw;
  max-width:45vw;
  border-width:1px;
  border-color:rgba(50,50,50,0.5);
  margin-right:5px;
  border-radius: 15px;
  border-style:groove;
}

.scroll-arrow {
  position:absolute;
  right:5%;
  bottom:50%;
  animation-name:pop;
  animation-duration:6s;
  animation-fill-mode:forwards;
  color:black;
  z-index:103;
}

.scroll-arrow:hover {
  opacity: 0.5;
}
</style>

