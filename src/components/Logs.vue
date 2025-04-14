<template>
  <v-app theme="light">
    <v-main>
      <v-container class="ma-3 pa-3">
        <v-card
          class="module"
        >
          <module-toolbar
            class="module-toolbar"
            title="Error Logs"
            icon="mdi-skull"
            @minimize="errorLogsMinimized = true"
            @maximize="errorLogsMinimized = false"
          >
          </module-toolbar>
          <log-viewer
            v-if="!errorLogsMinimized"
            style="height:550px;"
            :logs="logs"
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
  const errorLogsMinimized = ref(false);

  //// INITIALIZATION ////
  onMounted( async () => {
    const response = await getErrorLogs();
    if (response.ok) {
      logs.value = await response.json();
      console.log(logs.value);
    } // todo: error popup here
  });
</script>
