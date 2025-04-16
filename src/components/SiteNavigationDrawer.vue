<template>
  <v-navigation-drawer
    :model-value="open || !mobile"
    :permanent="!mobile"
    :persistent="true"
    class="main-drawer"
    theme="light"
  >
    <v-row
      no-gutters
      class="align-center d-flex"
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
        class="align-center d-flex drawer-title justify-start"
      >
        <span> Print OS </span>
      </v-col>
      <v-col
        v-if="mobile"
        cols="auto"
      >
        <v-btn
          size="small"
          flat
          icon
          color="white"
        >
          <v-icon
            size="x-large"
            @click="$emit('close')"
          >
            mdi-chevron-left
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-divider class="ma-0 pa-0"></v-divider>
    <v-list
      style="display: flex; flex-direction:column;"
    >
      <v-list-item @click.native.stop="routeTo('/Login')">
        <v-btn
          class="login-btn"
          variant="outlined"
          rounded
          color="primary"
          style="max-width: 280px; margin: 10px auto;"
        >
          {{ userStore.email ? `Hello, ${userStore.email}` : 'Log in / Create account' }}
        </v-btn>
      </v-list-item>

      <v-list-item
        class="menu-item"
        prepend-icon="mdi-view-dashboard"
        @click.native.stop="routeTo('/')"
      >
        <v-list-item-title>
          Dashboard
        </v-list-item-title>
      </v-list-item>

      <v-list-item
        class="menu-item"
        prepend-icon="mdi-printer-pos-plus"
        @click.native.stop="routeTo('/PrintJobs')"
      >
        <v-list-item-title>Print Jobs</v-list-item-title>
      </v-list-item>
      <v-list-item
        class="menu-item"
        prepend-icon="mdi-sitemap"
        @click.native.stop="routeTo('/Workflows')"
      >
        <v-list-item-title>Workflows</v-list-item-title>
      </v-list-item>
      <v-list-item
        class="menu-item"
        prepend-icon="mdi-test-tube"
        @click.native.stop="routeTo('/SimulationReports')"
      >
        <v-list-item-title>Simulation</v-list-item-title>
      </v-list-item>
      <v-divider style="margin-top:auto;" />
      <v-list-item
        class="menu-item"
        prepend-icon="mdi-archive"
        @click.native.stop="routeTo('/Logs')"
      >
        <v-list-item-title>Logging</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
  import { ref, computed, onMounted, watch } from "vue";
  import { useDisplay } from "vuetify"
  import { useRouter } from 'vue-router';
  import { useUserStore } from '@/stores/user';
  const router = useRouter();
  const disabled = ref(false);
  const { name } = useDisplay();

  const userStore = useUserStore();

  //// EMITS ////
  const emit = defineEmits(['close']);

  //// PROPS ////
  defineProps({
    open: {
      type: Boolean,
      required: true,
    }
  });

  //// ROUTING ////
  const routeTo = (where) => {
    router.push(where);
    emit('close');
  };

  //// COMPUTED ////
  const mobile = computed(() => {
    return name.value === 'xs';
  });
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

  .main-drawer{
    position: fixed;
    max-height:100vh;
    z-index:99;
  }

  .main-drawer .v-navigation-drawer__content {
    overflow: hidden !important;
  }

  .drawer-title {
    font-size:x-large;
    font-family:Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
    font-weight:200;
  }
</style>
