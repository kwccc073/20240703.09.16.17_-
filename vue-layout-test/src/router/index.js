import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../layouts/Admin.vue'),
      children: [
        {
          path: '',
          name: 'adminIndex',
          component: () => import('../views/admin/HomeView.vue')
        },
      ]
    },
    {
      path: '/',
      name: 'home',
      component: () => import('../layouts/Default.vue'),
      children: [
        {
          path: '',
          name: 'Index',
          component: () => import('../views/HomeView.vue'),
        },
        {
          path: 'about',
          name: 'About',
          component: () => import('../views/AboutView.vue')
        }
      ]
    },
  ]
})

export default router
