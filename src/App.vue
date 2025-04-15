<template>
  <v-app
    theme="light"
    class="main-app"
  >
    <ChatWidget />
    <v-toolbar
      v-if="mobile"
      class="align-center d-flex"
    >
      <v-btn
        class="ml-1 pl-3"
        size="medium"
        @click="drawer=!drawer"
      >
        <v-icon
          size="large"
        >
          mdi-menu
        </v-icon>
      </v-btn>
    </v-toolbar>
    <site-navigation-drawer
      :style="`width:${calcDrawerWidth}`"
      :open="drawer"
      @close="closeDrawer()"
    >
    </site-navigation-drawer>
    <router-view
      :style="`margin-left: ${calcContentMargin}`"
    >
    </router-view>
  </v-app>
</template>

<script setup>
  import { ref, computed } from "vue"
  import { useDisplay } from "vuetify"
  import ChatWidget from './components/ChatBot/chat-widget.vue';
  import SiteNavigationDrawer from './components/SiteNavigationDrawer.vue';

  ////////////////////////////
  //// Static Data
  ////////////////////////////
  const drawerWidth = '300px';
  const drawerWidthMobile = '100vw';

  ////////////////////////////
  //// Reactive Data
  ////////////////////////////
  const drawer = ref(false);

  ////////////////////////////
  //// Computed
  ////////////////////////////
  const { name } = useDisplay();
  const mobile = computed(() => {
    return name.value === 'xs';
  });

  const closeDrawer = () => {
    console.log("closed");
    drawer.value = false;
  };

  const calcDrawerWidth = computed(() => {
    const isMobile = mobile.value;
    const isOpen = drawer.value;
    if (isMobile && isOpen) {
      return drawerWidthMobile;
    }
    if (!isMobile) {
      return drawerWidth;
    }
    return '0px';
  });

  const calcContentMargin = computed(() => {
    const isMobile = mobile.value;
    if (isMobile) {
      return '';
    }
    return drawerWidth;
  });
</script>

<style>
.main-app{
  overflow:hidden;
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

.logs-module {
  max-width:800px;
  max-height: 620px;
  border-width:1px;
  border-color: darkgray;
}

.large-module{
  max-width:800px;
  max-height: 800px;
  border-width:1px;
  border-color: darkgray;
}

.skinny-module{
  max-width:700px;
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
