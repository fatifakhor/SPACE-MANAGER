import { createRouter, createWebHistory } from 'vue-router'
import dispositivos from '../components/dispositivos.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/:sala/:tipo/:dispositivo', 
    name: 'dispositivo', 
    component: dispositivos }
  ]
})

export default router