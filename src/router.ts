import { createRouter } from 'vue-router-ns'
import { stayData } from './stay-data'
import { navigationState } from './navigation-state'
import { session } from './travel-state'

export const router = createRouter({
  restore: navigationState,
  diagnostics: { maxEvents: 250, recording: { maxRecords: 400, maxBytes: 512 * 1024 } },
  preload: { concurrency: 2, maxEntries: 8, ttl: 30_000 },
  preloadData: { concurrency: 2, maxEntries: 8, ttl: 30_000 },
  links: {
    schemes: ['airbnbns'],
    frame: (location) => {
      const tab = location.path.split('/')[1]
      return ['saved', 'trips', 'messages', 'profile'].includes(tab) ? tab : 'explore'
    },
  },
  routes: [
    { path: '/', component: () => import('./pages/Explore.vue') },
    {
      path: '/destinations/:id',
      props: true,
      component: () => import('./pages/Destination.vue'),
    },
    {
      path: '/stays/:id',
      name: 'stay',
      component: () => import('./pages/Stay.vue'),
      meta: { tabBarVisibility: 'hidden', loaders: stayData },
    },
    { path: '/saved', component: () => import('./pages/Saved.vue') },
    {
      path: '/trips',
      component: () => import('./pages/Trips.vue'),
      children: [
        {
          path: ':id',
          component: () => import('./pages/Trip.vue'),
          meta: { requiresSession: true, tabBarVisibility: 'hidden' },
          children: [
            { path: 'edit', component: () => import('./pages/TripEditor.vue') },
            { path: 'reserve', component: () => import('./pages/TripEditor.vue') },
          ],
        },
      ],
    },
    {
      path: '/messages',
      component: () => import('./pages/Messages.vue'),
      children: [
        {
          path: ':id',
          component: () => import('./pages/Conversation.vue'),
          meta: { requiresSession: true, tabBarVisibility: 'hidden' },
        },
      ],
    },
    {
      path: '/profile',
      component: () => import('./pages/Profile.vue'),
      children: [
        {
          path: 'diagnostics',
          component: () => import('./pages/Diagnostics.vue'),
          meta: { tabBarVisibility: 'hidden' },
        },
      ],
    },
    { path: '/search', modal: true, component: () => import('./pages/Search.vue') },
    {
      path: '/login',
      modal: {
        ios: { detents: ['large'], grabber: true },
        android: { sheet: { state: 'expanded', skipCollapsed: true } },
      },
      component: () => import('./pages/Login.vue'),
    },
    { path: '/guests', modal: true, component: () => import('./pages/Guests.vue') },
  ],
})

router.beforeEach((to) => {
  if (to.meta.requiresSession && !session.value)
    return { path: '/login', query: { next: to.fullPath } }
})
