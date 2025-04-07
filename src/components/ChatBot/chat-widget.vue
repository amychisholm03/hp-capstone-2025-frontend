<template>
  <LiveChatWidget 
    license="19113362" 
    group="0" 
    visibility="minimized" 
    customer-name="John Coke"
    customer-email="john@cocacola.com" 
    @change-group="handleChangeGroup"
    @new-event="handleNewEvent" 
    @form-submitted="handleFormSubmitted"
    @rating-submitted="handleRatingSubmitted" 
  />
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
    name: 'chat-widget', 
    components: {
        // eslint-disable-next-line vue/component-options-name-casing
        LiveChatWidget
    },
    setup() {
        const group = ref('0')
        // const chatData = useWidgetChatData()
        // const greeting = useWidgetGreeting()
        // const widgetState = useWidgetState()
        // const isWidgetReady = useWidgetIsReady()
        // const customerData = useWidgetCustomerData()

        return {
            group,
            // chatData,
            // greeting,
            // widgetState,
            // isWidgetReady,
            // customerData
        }
    },
    methods: {
        stringify(value) {
            return JSON.stringify(value, null, 2)
        },
        handleChangeGroup() {
            this.group = this.group === '0' ? '1' : '0'
        },
        async handleNewEvent(event) {
            console.log('LiveChatWidget -> onNewEvent: ', this.stringify(event))
            //console.log('chatdata: ', this.stringify(this.chatData))
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