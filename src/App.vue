<template>
  <v-app theme="light" class="main-app">
    <v-toolbar>
      <v-btn
        large
        @click="drawer=!drawer"
      >
        <v-icon>
          mdi-menu
        </v-icon>
      </v-btn>
    </v-toolbar>
    <site-navigation-drawer
      class="sidebar"
      :open="drawer"
    >
    </site-navigation-drawer>
    <router-view
      :class="mobile ? 'content-mobile' : 'content'"
    >
    </router-view>
  </v-app>
</template>

<script setup>
  import { ref, computed } from "vue"
  import { useDisplay } from "vuetify"
  import SiteNavigationDrawer from './components/SiteNavigationDrawer.vue';

  ////////////////////////////
  //// Data
  ////////////////////////////
  const drawer = ref(false);

  ////////////////////////////
  //// Computed
  ////////////////////////////
  const { name } = useDisplay();
  const mobile = computed(() => {
    return name.value === 'xs';
  });
</script>

<style>
:root{
  --drawer-size:300px;
 }

.sidebar{
  position:fixed;
  width: var(--drawer-size);
  max-height: 100vh;
  z-index:99;
}

.main-app{
  overflow:hidden;
}

.content{
  margin-left: var(--drawer-size);
}

.content-mobile{
  margin-left: 0;
}

.header{
  color:black;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight:bolder;
  font-size: medium;
}

.toolbar{
  background-color: white;
  padding-left:10px;
  padding-bottom:15px;
  height:50px;
}

.module {
  max-width:800px;
  max-height: 420px;
  border-width:1px;
  border-color: darkgray;
}
.large-module{
  max-width:1100px;
  max-height: 800px;
  border-width:1px;
  border-color: darkgray;
}

.module-toolbar {
  align-content: center;
  height: 32px;
  max-height:32px;
  background-color:#555555;
  border-bottom-width:1px;
  border-bottom-color:black;
  border-bottom-style:solid;
}
</style>
