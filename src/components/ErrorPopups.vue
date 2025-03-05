<template>
    <div class="ma-2 text-center">
      <v-snackbar
        v-model="errorMessage"
      >
        {{ error }}
  
        <template #actions>
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
      name: 'error-popup',
      props: {
        error: {
          type: String,
          default: ""
        }
      },
      computed: {
        errorMessage: {
          get: function () {
            return !!this.error;
          },
          set: function () {
            return;
          }
        }
      }
    }
  </script>