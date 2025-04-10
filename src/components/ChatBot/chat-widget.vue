<template>
    <LiveChatWidget license="19113362" group="0" visibility="minimized" customer-name=""
    :customer-email="name" />
</template>

<script setup>
    import {ref, watch} from 'vue';
    import {
        LiveChatWidget
    } from '@livechat/widget-vue'
    import { useUserStore } from '@/stores/user';
    const userStore = useUserStore();
    const name = ref('');

    watch(userStore.name, (newName) => {
       name.value = newName;
    }, { immediate: true });
</script>