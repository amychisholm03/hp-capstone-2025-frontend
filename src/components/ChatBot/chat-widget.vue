<template>
  <div
    v-if="!mobile"
  >
    <LiveChatWidget
      license="19113362"
      group="0"
      visibility="minimized"
      :customer-name="name"
      :customer-email="email"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useDisplay } from "vuetify";
import {
    LiveChatWidget
} from '@livechat/widget-vue'
import { useUserStore } from '@/stores/user';
const userStore = useUserStore();
const email = ref('help@hp.com');
const { name } = useDisplay();
const username = ref('help');

const mobile = computed(() => {
  return name.value === 'xs';
});

watch(userStore, (newUserStore) => {
    if (newUserStore.email) {
        email.value = newUserStore.email;
        username.value = newUserStore.email.split('@')[0];
    }
}, { immediate: true });
</script>
