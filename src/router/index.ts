import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Playlist',
    component: () => import('@/views/MPlaylist.vue')
  },
  {
    path: '/tags',
    name: 'Tags',
    component: () => import('@/views/MTags.vue')
  },
  {
    path: '/queue',
    name: 'Queue',
    component: () => import('@/views/MQueue.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/MSettings.vue')
  },
  {
    path: '/player',
    name: 'Player',
    component: () => import('@/views/MPlayer.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
