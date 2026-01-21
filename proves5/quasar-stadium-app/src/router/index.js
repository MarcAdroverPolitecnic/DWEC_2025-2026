import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/stadiums'
  },
  {
    path: '/stadiums',
    name: 'StadiumSelection',
    component: () => import('../pages/StadiumSelectionPage.vue')
  },
  {
    path: '/stadiums/create',
    name: 'StadiumCreate',
    component: () => import('../pages/StadiumBuilderPage.vue')
  },
  {
    path: '/stadiums/edit/:id',
    name: 'StadiumEdit',
    component: () => import('../pages/StadiumBuilderPage.vue'),
    props: true
  },
  {
    path: '/events',
    name: 'Events',
    component: () => import('../pages/EventsPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
