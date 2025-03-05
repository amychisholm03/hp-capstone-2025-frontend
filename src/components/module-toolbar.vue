<template>
  <v-app style="max-height:50px; overflow: hidden;">
    <v-row
      class="mb-1 module-toolbar"
      no-gutters
    >
      <v-col
        style="align-content:center;"
        cols="auto"
      >
        <h4 style="color:white; margin-left: 5px; align-self:center;">
          <v-icon class="mr-1">
            {{ icon }}
          </v-icon>
          {{ title }}
        </h4>
      </v-col>
      <v-spacer></v-spacer>
      <v-col
        style="align-content:center;"
        cols="auto"
      >
        <v-btn
          icon
          flat
          size="xx-small"
          rounded
          @click="toggleMinimized"
        >
          <v-icon v-if="!minimized">
            mdi-window-minimize
          </v-icon>
          <v-icon v-if="minimized">
            mdi-chevron-down
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-app>
</template>

<script setup>
  import { onMounted, ref, computed } from "vue";
  const { title = '', icon = '' } = defineProps({
      title: String,
      icon: String,
  });

  const emits = defineEmits(['minimize', 'maximize']);
  const minimized = ref(false);
  const toggleMinimized = () => {
    minimized.value = !minimized.value;
    minimized.value ? emits('minimize') : emits('maximize');
  };
</script>
