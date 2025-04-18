<template>
  <v-row
    ref="horizontalScroll"
    no-gutters
    fill-height
    class="container"
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
      class="pa-2 soft-border"
      no-gutters
    >
      <!-- Simulation Report Title -->
      <div class="list-header">
        <v-chip
          :color="color"
          class="list-chips"
          size="x-small"
          variant="elevated"
        >
          {{ printjob.Title }}
        </v-chip>
        <br>
        <v-chip
          size="x-small"
          :color="color"
          class="list-chips"
          variant="elevated"
        >
          {{ workflow.Title }}
        </v-chip>
      </div>

      <div
        class="divider my-1"
      ></div>

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
      </div>

      <div
        class="divider my-1"
      ></div>
    </v-col>
  </v-row>
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
.container {
  display:flex;
  flex-direction: row;
  flex-wrap:nowrap;
  position:relative;
  column-gap:4px;

  overflow-x:scroll;
  overflow-y:hidden;

  padding:8px;
}

.overview-list{
  width:30%;
  max-width:30%;
  justify-items:center;
  text-align:center;
}

.overview-list-mobile{
  width: 50vw;
  display:flex;
  flex-direction:column;
  justify-content: center;
}

.list-header{
  font-family:'Courier New', Courier;
  text-overflow:ellipsis;
  text-wrap:nowrap;
  overflow:hidden;
}

.overview-list-label{
  font-family:'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
  color:black;
  font-size:xx-small;
}

.overview-list-value{
  font-size:xx-small;
  font-family:'Courier New', Courier, monospace;
}

.soft-border{
  border-width:1px;
  border-color:rgba(50,50,50,0.5);
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
.list-chips{

  font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
}
.divider{
  border-top-width:1px;
  height:1px;
  width:75%;
  border-top-style:solid;
  border-color:rgba(50,50,50,0.2);
}
</style>
