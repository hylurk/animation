import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Guide from '../views/guide/index.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Guide',
    component: Guide
  },
  {
    path: '/fanpai',
    name: '翻牌',
    component: () => import(/* webpackChunkName: "fanpai" */ '../views/fanpai/index.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
