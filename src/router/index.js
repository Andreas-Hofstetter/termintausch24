import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/kontakt',
    name: 'kontakt',
    component: () => import('../views/Kontakt.vue')
  },
  {
    path: '/gekauft',
    name: 'gekauft',
    component: () => import('../views/GekauftView.vue')
  },
  {
    path: '/angeboten',
    name: 'angeboten',
    component: () => import('../views/VerkauftView.vue')
  },
  {
    path: '/:anbieterId',
    name: 'view-Anbieter',
    component: () => import('../views/AnbieterView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
