<template>
  <v-app theme="light">
    <site-navigation-drawer class="sidebar"></site-navigation-drawer>
    <router-view class="content"></router-view>
  </v-app>
</template>

<script setup>
  import SiteNavigationDrawer from './components/SiteNavigationDrawer.vue';
</script>

<style>
:root{
  --drawer-size:300px;
 }

.sidebar{
  position:fixed;
  width: var(--drawer-size);
  z-index:99;
}

.content{
  margin-left: var(--drawer-size);
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
