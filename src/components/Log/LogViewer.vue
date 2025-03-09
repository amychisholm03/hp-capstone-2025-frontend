<template>
  <v-main>
    <!-- Show Logs -->
    <v-data-table
      v-if="logs && logs.length !== 0"
      :items="logs"
      :headers="headers"
      :sort-by="sortBy"
      :sort-desc="sortDesc"
      fixed-header
      item-value="value"
      style="height:100%; width: 100%;"
    >
      <template
        #item.date="{ value }"
        style="overflow-x: hidden;"
      >
        <div style="max-width:100%; width:100%; max-height: 50px; height:50px; overflow-x:hidden;">
          {{ toReadableDate(value) }}
        </div>
        <div style="max-width:100%; width:100%; max-height: 50px; height:50px; overflow-x:hidden;">
          {{ toReadableTime(value) }}
        </div>
      </template>
      <template
        #item.domain="{ value }"
        style="overflow: hidden;"
      >
        <div style="max-width:100%; width:100%; max-height: 100px; height:100px; overflow-x: hidden;">
          {{ value ? value : '---' }}
        </div>
      </template>
      <template
        #item.request="{ value }"
        style="overflow: hidden;"
      >
        <div style="max-width:100%; width:100%; max-height: 100px; height:100px; overflow-x: hidden;">
          {{ value ? value : '---' }}
        </div>
      </template>
      <template
        #item.response="{ value }"
        style="overflow: hidden;"
      >
        <div style="max-width:100%; width:100%; max-height: 100px; height:100px; overflow-x: hidden;">
          {{ value ? value : '---' }}
        </div>
      </template>



      <!-- EMPTY TABLE -->
      <template #no-data>
        <h4>no errors to show!</h4>
      </template>
    </v-data-table>

    <!-- No Logs To Show... -->
    <div
      v-else
      style="width:100%; height: 100%;"
      class="align-center d-flex justify-center"
    >
      <div class="spinner">
      </div>
    </div>
  </v-main>
</template>

<script setup>
  import { ref, onMounted, computed } from "vue";
  import { useRouter } from 'vue-router';

  //// ROUTING ////
  const router = useRouter();
  const routeTo = (where) => {
    router.push(where);
  };

  //// DATA ////
  const {
    logs = null,
  }
  =
  defineProps({
    logs: Array,
  });


  const toReadableDate = (unix_time) => {
    const dt = new Date(unix_time * 1000);
    const paddedMonth = dt.getMonth() < 10 ? '0' + dt.getMonth() : dt.getMonth();
    const paddedDay = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate();
    return paddedMonth + '/' + paddedDay + '/' + dt.getFullYear();
  };

  const toReadableTime = (unix_time) => {
    const dt = new Date(unix_time * 1000);
    const freedomHours = dt.getHours() > 12 ? dt.getHours() % 12 : dt.getHours();
    const paddedMinutes = dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes();
    const paddedSeconds  =dt.getSeconds() < 10 ? '0' + dt.getSeconds() : dt.getSeconds();
    const meridiem = dt.getHours() > 12 ? 'PM' : 'AM';
    return freedomHours + ':' + paddedMinutes + ':' + paddedSeconds + ' ' + meridiem;
  };

  const headers = [
    { title: "Date",     value: "date",     width: '12%', align: 'center',  class: 'table-header'},
    { title: "Method",   value: "method",   width: '15%' , align: 'center',  class: 'table-header' },
    { title: "Domain",   value: "domain",   width: '15%', align: 'center',  class: 'table-header'},
    { title: "Request",  value: "request",  width: '15%', align: 'center',  class: 'table-header'},
    { title: "Status",   value: "status",   width: '15%', align: 'center',  class: 'table-header'},
    { title: "Response", value: "response", width: '15%', align: 'center',  class: 'table-header'},
  ];
  const sortBy = ref([headers[0]]);
  const sortDesc = ref(true);
</script>
<style scoped>
@keyframes rotation {
  0% {
      transform: rotate(0deg);
  }
  100% {
      transform: rotate(360deg);
  }
}
.spinner {
  width: 192px;
  height: 192px;
  border: 32px solid #57B;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1.0s linear infinite;
}
.table-row-data {
  height: 25px;
}
:deep(.v-data-table-header__content) {
  font-size: 1.2rem;
  line-height: 0.9;
  font-weight: 600;
  font-family:Impact, Haettenschweiler, 'Arial Narrow Bold', monospace;
}

:deep(.v-data-table__th) {
  padding-left: 5px !important;
  padding-right: 10px !important;
  background-color: rgb(125, 125, 125) !important;
  color:white;
  margin: 0%;
}
:deep(.v-data-table__td) {
  border-right-color:darkslategray;
  border-right-style: solid;
  border-right-width:1px;
  padding-top: 10px !important;
}
</style>
