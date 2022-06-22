import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from '@/router/routes'

Vue.use(VueRouter)

const router = new VueRouter({
  linkActiveClass: 'is-active',
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior: function (to) {
    if (to.hash) {
      return {
        selector: to.hash,
      }
    }
  },
})

export default router
