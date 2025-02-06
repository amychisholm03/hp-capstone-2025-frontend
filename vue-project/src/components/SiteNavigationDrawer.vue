<template>
  <v-app theme="light">
    <v-navigation-drawer
      style="min-width:300px;"
      :rail="disabled"
      :model-value="true"
      permanent
      theme="light"
    >
      <v-row
        no-gutters
        class="fill-width"
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
          style="font-size:x-large; font-family:'Lucida Sans'; font-weight:200;"
          class="align-center d-flex justify-start"
        >
          <span> Print OS </span>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-list>
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
      </v-list>
    </v-navigation-drawer>
  </v-app>
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
</style>
