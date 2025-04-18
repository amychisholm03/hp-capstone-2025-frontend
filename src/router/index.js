
/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import Login from '@/components/Login.vue'
import SiteDashboard from '@/components/SiteDashboard.vue'
import PrintJobs from '@/components/PrintJobs.vue'
import WorkFlows from '@/components/WorkFlows.vue'
import SimulationReports from '@/components/SimulationReports.vue'
import Logs from '@/components/Logs.vue'

const routes = [
  { path: '/Login', component: Login},
	{ path: '/', component: SiteDashboard},
	{ path: '/PrintJobs', component: PrintJobs},
  { path: '/WorkFlows', component: WorkFlows},
  { path: '/SimulationReports', component: SimulationReports},
  { path: '/Logs', component: Logs},
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
