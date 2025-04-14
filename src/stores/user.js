import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
	state: () => {
return {
		email: ''
	}
},
	actions: {
		setEmail(email) {
			this.email = email
		},
		clearEmail() {
			this.email = ''
		}
	}
})