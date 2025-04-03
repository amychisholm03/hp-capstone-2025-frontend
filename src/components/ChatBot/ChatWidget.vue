<template>
    <LiveChatWidget 
        license="19113362" 
        group="0" 
        visibility="minimized" 
        customerName="John Coke"
        customerEmail="john.coke@example.com" 
        v-on:change-group="handleChangeGroup"
        v-on:new-event="handleNewEvent" 
        v-on:form-submitted="handleFormSubmitted"
        v-on:rating-submitted="handleRatingSubmitted" 
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
import { OpenAI } from 'openai'
const GPT_MODEL = "gpt-4o"

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
})

export default {
    setup() {
        const group = ref('0')
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
        async handleNewEvent(event) {
            console.log('LiveChatWidget -> onNewEvent', this.stringify(event))
            console.log(this.stringify(this.chatData))
            if (event.type === 'message' && event.text) {
                const response = await this.getOpenAIResponse(event.text)
                this.sendChatMessage(response)
            }
        },
        handleFormSubmitted(form) {
            console.log('LiveChatWidget -> onFormSubmitted', this.stringify(form))
        },
        handleRatingSubmitted(rating) {
            console.log('LiveChatWidget -> onRatingSubmitted', this.stringify(rating))
        },
        async getOpenAIResponse(userInput) {
            try {
                const response = await openai.chat.completions.create({
                    model: GPT_MODEL,
                    messages: [{ role: 'user', content: userInput }]
                })
                console.log(response.choices[0].message.content)
                return response.choices[0].message.content
            } catch (error) {
                console.error('Error fetching OpenAI response:', error)
                return 'Sorry, I encountered an error. Please try again later.'
            }
        },
        sendChatMessage(message) {
            LiveChatWidget.call('sendMessage', { text: message })
        }
    }
}
</script>