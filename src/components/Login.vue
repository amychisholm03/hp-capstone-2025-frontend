<template>
  <v-app theme="light">
    <v-main>
      <v-container class="ma-3 pa-3 d-flex justify-center">
        <v-card class="pa-5" style="max-width: 500px; width: 100%;">
          <h2 class="text-h5 mb-4">Log in or Create Account</h2>
          <v-text-field label="Email" v-model="email" type="email" outlined dense />
          <v-text-field label="Password" v-model="password" type="password" outlined dense />
          <v-btn color="primary" class="mt-4" @click="submit">Submit</v-btn>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const email = ref('');
const password = ref('');

const userStore = useUserStore();

const submit = () => {
  userStore.setEmail(email.value)
  console.log('Login with:', email.value, password.value)
  router.push('/')  // redirect to dashboard or home
}
</script>