<template>
  <v-app theme="light">
    <v-main>
      <v-container class="ma-3 pa-3">
        <v-card class="module" style="max-height: 600px; height: 600px;">
          <module-toolbar
            class="module-toolbar"
            title="Error Logs"
            icon="mdi-skull"
            style="max-height: 5%; height: 5%;"
          >
          </module-toolbar>
          <log-viewer
            :logs="logs"
            style="max-height: 95%; height: 95%;"
          ></log-viewer>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
  import { ref, onMounted, nextTick } from "vue";
  import { useRouter } from 'vue-router';
  import LogViewer from './Log/LogViewer.vue';
  import { getErrorLogs } from './api.js';

  //// ROUTING ////
  const router = useRouter();
  const routeTo = (where) => {
    router.push(where);
  };

  //// DATA ////
  const logs = ref(null);

  //// INITIALIZATION ////
  onMounted( async () => {
    // get error logs
    logs.value = await getErrorLogs();
    logs.value = null;

    // Todo: uncomment once api gets setup
    // if (logsResponse.ok) {
    //   logs.value = await logsResponse.json();
    //   alert("Success");
    //   console.log(logs.value);
    // } else {
    //   // TODO: turn into snackbar alert.
    //   alert("Error getting logs!");
    //   return;
    // }
  });
</script>
