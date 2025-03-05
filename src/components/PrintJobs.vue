<template>
  <v-app theme="light">
    <v-main class="pa-3">
      <error-popups :error="errorMessage" @clear-error="errorMessage = ''">
      </error-popups>
      <v-card class="module">
        <module-toolbar class="module-toolbar" title="Print Job Creation" icon="mdi-printer"
          @minimize="printJobCreateMinimize = true" @maximize="printJobCreateMinimize = false">
        </module-toolbar>
        <print-job-create v-if="!printJobCreateMinimize">
        </print-job-create>
      </v-card>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ModuleToolbar from "./module-toolbar.vue";
import PrintJobCreate from "./PrintJob/print-job-create.vue";
import ErrorPopups from "./ErrorPopups.vue";

const errorMessage = ref('');
const router = useRouter();
const routeTo = (where) => {
  router.push(where);
};

const printJobCreateMinimize = ref(false);
</script>
