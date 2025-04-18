/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import { createPinia } from 'pinia'
import vuetify from './vuetify'
import router from '@/router'

export function registerPlugins (app) {
  const pinia = createPinia()
  app
    .use(pinia)
    .use(vuetify)
    .use(router)
}
