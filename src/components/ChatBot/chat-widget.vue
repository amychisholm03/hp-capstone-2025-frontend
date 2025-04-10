<template>
    <LiveChatWidget license="19113362" group="0" visibility="minimized" :customer-name="name"
        :customer-email="email" />
</template>

<script setup>
import { ref, watch } from 'vue';
import {
    LiveChatWidget
} from '@livechat/widget-vue'
import { useUserStore } from '@/stores/user';
const userStore = useUserStore();
const email = ref('help@hp.com');
const name = ref('help')

watch(userStore, (newUserStore) => {
    if (newUserStore.email) {
        email.value = newUserStore.email;
        name.value = newUserStore.email.split('@')[0];
    }
}, { immediate: true });
</script>