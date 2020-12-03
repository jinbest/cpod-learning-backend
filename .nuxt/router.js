import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _27f225bc = () => interopDefault(import('..\\client\\pages\\404.vue' /* webpackChunkName: "pages_404" */))
const _adebf20a = () => interopDefault(import('..\\client\\pages\\argon-demo\\index.vue' /* webpackChunkName: "pages_argon-demo_index" */))
const _618e9500 = () => interopDefault(import('..\\client\\pages\\dictionary\\index.vue' /* webpackChunkName: "pages_dictionary_index" */))
const _c9afe500 = () => interopDefault(import('..\\client\\pages\\argon-demo\\landing.vue' /* webpackChunkName: "pages_argon-demo_landing" */))
const _72b1aa12 = () => interopDefault(import('..\\client\\pages\\argon-demo\\login.vue' /* webpackChunkName: "pages_argon-demo_login" */))
const _efc777dc = () => interopDefault(import('..\\client\\pages\\argon-demo\\profile.vue' /* webpackChunkName: "pages_argon-demo_profile" */))
const _616144ec = () => interopDefault(import('..\\client\\pages\\argon-demo\\register.vue' /* webpackChunkName: "pages_argon-demo_register" */))
const _4c86d8ea = () => interopDefault(import('..\\client\\pages\\dictionary\\_word\\index.vue' /* webpackChunkName: "pages_dictionary__word_index" */))
const _cc98d928 = () => interopDefault(import('..\\client\\pages\\lesson\\_slug\\index.vue' /* webpackChunkName: "pages_lesson__slug_index" */))

// TODO: remove in Nuxt 3
const emptyFn = () => {}
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onComplete = emptyFn, onAbort) {
  return originalPush.call(this, location, onComplete, onAbort)
}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: decodeURI('/'),
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/404",
    component: _27f225bc,
    name: "404"
  }, {
    path: "/argon-demo",
    component: _adebf20a,
    name: "argon-demo"
  }, {
    path: "/dictionary",
    component: _618e9500,
    name: "dictionary"
  }, {
    path: "/argon-demo/landing",
    component: _c9afe500,
    name: "argon-demo-landing"
  }, {
    path: "/argon-demo/login",
    component: _72b1aa12,
    name: "argon-demo-login"
  }, {
    path: "/argon-demo/profile",
    component: _efc777dc,
    name: "argon-demo-profile"
  }, {
    path: "/argon-demo/register",
    component: _616144ec,
    name: "argon-demo-register"
  }, {
    path: "/dictionary/:word",
    component: _4c86d8ea,
    name: "dictionary-word"
  }, {
    path: "/lesson/:slug",
    component: _cc98d928,
    name: "lesson-slug"
  }, {
    path: "/lesson/:slug/*",
    components: {
      default: _cc98d928
    }
  }, {
    path: "*",
    components: {
      default: _27f225bc
    },
    name: "catchall"
  }],

  fallback: false
}

export function createRouter () {
  return new Router(routerOptions)
}
