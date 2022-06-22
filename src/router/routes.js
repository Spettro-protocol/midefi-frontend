import Landing from '@/views/Landing.vue'
import store from '@/store'

const requireAuth = (to, from, next) => {
  if (!store.getters.SESSION_IS_LOGGED) {
    next({ name: 'Landing' })
  } else {
    next()
  }
}

export default [
  {
    path: '/',
    name: 'Landing',
    component: Landing,
  },
  {
    path: '/myActivity',
    name: 'MyActivity',
    component: () => import(/* webpackChunkName: "myActivity" */ '@/views/MyActivity.vue'),
    beforeEnter: requireAuth,
  },
  {
    path: '/supplyBorrow',
    name: 'SupplyBorrow',
    component: () => import(/* webpackChunkName: "supplyBorrow" */ '@/views/SupplyBorrow.vue'),
    beforeEnter: requireAuth,
  },
  {
    path: '/swap',
    name: 'SwapPage',
    component: () => import(/* webpackChunkName: "status" */ '@/views/Swap.vue'),
  },
  {
    path: '/status',
    name: 'Status',
    component: () => import(/* webpackChunkName: "status" */ '@/views/Status.vue'),
  },
  {
    path: '/docs/introduction',
    name: 'Introduction',
    component: () =>
      import(/* webpackChunkName: "introduction" */ '@/views/docs/1-introduction.vue'),
  },
  {
    path: '/docs/keyConcepts',
    name: 'KeyConcepts',
    component: () => import(/* webpackChunkName: "keyConcepts" */ '@/views/docs/2-keyConcepts.vue'),
  },
  {
    path: '/docs/howTo',
    name: 'HowTo',
    component: () => import(/* webpackChunkName: "howTo" */ '@/views/docs/3-howTo.vue'),
  },
  {
    path: '/docs/financialMath',
    name: 'FinancialMath',
    component: () =>
      import(/* webpackChunkName: "financialMath" */ '@/views/docs/4-financialMath.vue'),
  },
  {
    path: '/docs/contracts',
    name: 'Contracts',
    component: () => import(/* webpackChunkName: "contracts" */ '@/views/docs/5-contracts.vue'),
  },
  {
    path: '/docs/oracles',
    name: 'Oracles',
    component: () => import(/* webpackChunkName: "oracles" */ '@/views/docs/6-oracles.vue'),
  },
  {
    path: '/docs/securityAudits',
    name: 'SecurityAudits',
    component: () =>
      import(/* webpackChunkName: "securityAudits" */ '@/views/docs/7-securityAudits.vue'),
  },
  {
    path: '/doc',
    name: 'Docs',
    component: () => import(/* webpackChunkName: "docs" */ '@/views/docs/1-introduction.vue'),
  },
  {
    path: '/faq',
    name: 'FAQ',
    component: () => import(/* webpackChunkName: "faq" */ '@/views/faqs/FAQ.vue'),
  },
  {
    path: '/terms',
    name: 'Terms',
    component: () => import(/* webpackChunkName: "terms" */ '@/views/Terms.vue'),
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: () => import(/* webpackChunkName: "privacy" */ '@/views/Privacy.vue'),
  },
  {
    path: '*',
    redirect: { name: 'Landing' },
  },
]
