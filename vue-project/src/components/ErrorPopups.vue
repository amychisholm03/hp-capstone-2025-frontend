<template>
  <div class="text-center ma-2">
    <v-snackbar
      v-model="errorMessage"
    >
      {{ error }}

      <template v-slot:actions>
        <v-btn
          color="pink"
          variant="text"
          @click="$emit('clear-error')"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
  export default {
    data: () => ({
      enabled: false
    }),
    computed: {
      errorMessage: {
        get: function () {
          this.enabled = !!this.error;
          return this.enabled;
        },
        set: function() {
          return;
        }
      }
    },
    props: {
      error: String
    }
  }
</script>
