<template>
    <LiveChatWidget license="19113362" group="0" visibility="minimized" customer-name=""
    :customer-email="email" />
</template>

<script setup>
    import {ref, watch} from 'vue';
    import {
        LiveChatWidget
    } from '@livechat/widget-vue'
    import { useUserStore } from '@/stores/user';
    const userStore = useUserStore();
    const email = ref('');

    watch(userStore.email, (newEmail) => {
       email.value = newEmail;
    }, { immediate: true });
</script>