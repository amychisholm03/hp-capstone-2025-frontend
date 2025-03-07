<template>
  <v-main>
    <!-- Show Logs -->
    <v-data-table
      v-if="logs"
      :items="logs"
    >
      <template #no-data>
        <h4>no errors to show!</h4>
      </template>
    </v-data-table>

    <!-- No Logs To Show... -->
    <div v-else style="width:100%; height: 100%;" class="d-flex align-center justify-center">
      <div class="spinner">
    </div>
    </div>
  </v-main>
</template>

<script setup>
  import { ref, onMounted } from "vue";
  import { useRouter } from 'vue-router';

  //// ROUTING ////
  const router = useRouter();
  const routeTo = (where) => {
    router.push(where);
  };

  //// DATA ////
  const {
    logs = null,
  }
  =
  defineProps({
    logs: Array,
  });
</script>
<style scoped>

@keyframes rotation {
  0% {
      transform: rotate(0deg);
  }
  100% {
      transform: rotate(360deg);
  }
}
.spinner {
  width: 192px;
  height: 192px;
  border: 32px solid #57B;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1.0s linear infinite;
}
</style>
