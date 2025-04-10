<template>
  <v-app theme="light">
    <ChatWidget />
    <v-toolbar class="toolbar">
      <v-toolbar-title class="header">
        Dashboard
      </v-toolbar-title>
    </v-toolbar> 
    <v-main>
      <v-container class="ma-3 pa-3">
        <v-row>
          <v-card
            class="dashboard-component ma-3"
            style="width: 425px; height: 305px;"
          >
            <v-img src="/src/assets/image1.png"></v-img>
          </v-card>

          <v-card
            class="dashboard-component ma-3"
            style="width: 425px; height: 305px;"
          >
            <v-img src="/src/assets/image2.png"></v-img>
          </v-card>
        </v-row>

        <v-row>
          <v-card
            class="dashboard-component ma-3"
            style="width: 425px; height: 305px;"
          >
            <v-img src="/src/assets/image4.png"></v-img>
          </v-card>

          <v-card
            class="dashboard-component ma-3"
            style="width: 425px; height: 305px;"
          >
            <v-img src="/src/assets/image3.png"></v-img>
          </v-card>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
  import { ref, onMounted } from "vue";
  import { useRouter } from 'vue-router';
  import ChatWidget from './ChatBot/chat-widget.vue';

  const router = useRouter();

  //// ROUTING ////
  const routeTo = (where) => {
    router.push(where);
  };
</script>

<style scoped>
  .exit-button {
    border: none;
    padding: 0;
    box-shadow: none;
    background: transparent;
  }

  .dashboard-component {
    width: 400px;
    height: 400px;
  }

  .dashboard-container {
    max-width: 400px;
  }
</style>
