<template>
  <v-navigation-drawer
    style="min-width: 300px; height: 100%;"
    class="main-drawer"
    :rail="disabled"
    :model-value="true"
    permanent
    theme="light"
  >
    <v-row
      no-gutters
      style="height: 10%;"
    >
      <v-col
        cols="3"
        class="d-flex justify-start"
      >
        <v-img
          height="48"
          max-width="64"
          aspect-ratio="1"
          class="ma-3"
          src="/src/assets/hp_icon.webp"
        ></v-img>
      </v-col>
      <v-col
        style="font-size:x-large; font-family:Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif; font-weight:200;"
        class="align-center d-flex justify-start"
      >
        <span> Print OS </span>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-list
      style="height: 90%; width:100%; display: flex; flex-direction:column;"
    >
      <v-list-item
        class="menu-item"
        prepend-icon="mdi-view-dashboard"
        @click="routeTo('/')"
      >
        <v-list-item-title>Dashboard</v-list-item-title>
      </v-list-item>
      <v-list-item
        class="menu-item"
        prepend-icon="mdi-printer-pos-plus"
        @click="routeTo('/PrintJobs')"
      >
        <v-list-item-title>Print Jobs</v-list-item-title>
      </v-list-item>
      <v-list-item
        class="menu-item"
        prepend-icon="mdi-sitemap"
        @click="routeTo('/Workflows')"
      >
        <v-list-item-title>Workflows</v-list-item-title>
      </v-list-item>
      <v-list-item
        class="menu-item"
        prepend-icon="mdi-test-tube"
        @click="routeTo('/SimulationReports')"
      >
        <v-list-item-title>Simulation</v-list-item-title>
      </v-list-item>
      <v-divider style="margin-top:auto;" class="pb-2" />
      <v-list-item
        class="menu-item"
        prepend-icon="mdi-archive"
        @click="routeTo('/Logs')"
      >
        <v-list-item-title>Logging</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
  import { ref, onMounted, watch } from "vue";
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const disabled = ref(false);

  //// ROUTING ////
  const routeTo = (where) => {
    router.push(where);
  };
</script>

<style>
  .drawer-button {
    text-align: left;
  }

  .exit-button {
    border: none;
    padding: 0;
    box-shadow: none;
    background: transparent;
  }

  .menu-item:hover{
    opacity: 0.7;
  }

  .header{
    font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-weight:bold;
  }

  .main-drawer .v-navigation-drawer__content {
    overflow: hidden;
  }
</style>
