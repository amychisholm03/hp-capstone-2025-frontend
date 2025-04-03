<template>
    <LiveChatWidget license="12332502" group="0" visibility="minimized" customerName="John Doe"
        customerEmail="john.doe@example.com" v-on:new-event="handleNewEvent" v-on:form-submitted="handleFormSubmitted"
        v-on:rating-submitted="handleRatingSubmitted" />
</template>

<script>
import { ref } from 'vue'
import {
    LiveChatWidget,
    useWidgetState,
    useWidgetIsReady,
    useWidgetChatData,
    useWidgetGreeting,
    useWidgetCustomerData,
} from '@livechat/widget-vue'

export default {
    setup() {
        const group = ref < '0' | '1' > ('0')
        const chatData = useWidgetChatData()
        const greeting = useWidgetGreeting()
        const widgetState = useWidgetState()
        const isWidgetReady = useWidgetIsReady()
        const customerData = useWidgetCustomerData()

        return {
            group,
            chatData,
            greeting,
            widgetState,
            isWidgetReady,
            customerData
        }
    },
    components: {
        LiveChatWidget
    },
    methods: {
        stringify(value) {
            return JSON.stringify(value, null, 2)
        },
        handleChangeGroup() {
            this.group = this.group === '0' ? '1' : '0'
        },
        handleNewEvent(event) {
            console.log('LiveChatWidget -> onNewEvent', this.stringify(event))
        },
        handleFormSubmitted(form) {
            console.log('LiveChatWidget -> onFormSubmitted', this.stringify(form))
        },
        handleRatingSubmitted(rating) {
            console.log('LiveChatWidget -> onRatingSubmitted', this.stringify(rating))
        }
    }
}
</script>