import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/todolist',
    },
    {
      path: '/login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/signup',
      component: () => import('../views/RegisterView.vue'),
    },
    {
      path: '/todolist',
      component: () => import('../views/TodolistView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/todolist',
    },
  ],
})

export default router
