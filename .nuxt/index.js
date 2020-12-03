import Vue from 'vue'
import Meta from 'vue-meta'
import ClientOnly from 'vue-client-only'
import NoSsr from 'vue-no-ssr'
import { createRouter } from './router.js'
import NuxtChild from './components/nuxt-child.js'
import NuxtError from './components/nuxt-error.vue'
import Nuxt from './components/nuxt.js'
import App from './App.js'
import { setContext, getLocation, getRouteData, normalizeError } from './utils'
import { createStore } from './store.js'

/* Plugins */

import nuxt_plugin_workbox_e8f1753a from 'nuxt_plugin_workbox_e8f1753a' // Source: .\\workbox.js (mode: 'client')
import nuxt_plugin_nuxticons_2e1ac0be from 'nuxt_plugin_nuxticons_2e1ac0be' // Source: .\\nuxt-icons.js (mode: 'all')
import nuxt_plugin_bootstrapvue_4cce1d36 from 'nuxt_plugin_bootstrapvue_4cce1d36' // Source: .\\bootstrap-vue.js (mode: 'all')
import nuxt_plugin_axios_53ec3607 from 'nuxt_plugin_axios_53ec3607' // Source: .\\axios.js (mode: 'all')
import nuxt_plugin_googleanalytics_4318e7bf from 'nuxt_plugin_googleanalytics_4318e7bf' // Source: .\\google-analytics.js (mode: 'client')
import nuxt_plugin_bootstrap_56cad686 from 'nuxt_plugin_bootstrap_56cad686' // Source: ..\\client\\plugins\\bootstrap.js (mode: 'client')
import nuxt_plugin_argonkit_f49492a4 from 'nuxt_plugin_argonkit_f49492a4' // Source: ..\\client\\plugins\\argon\\argon-kit (mode: 'all')

// Component: <ClientOnly>
Vue.component(ClientOnly.name, ClientOnly)

// TODO: Remove in Nuxt 3: <NoSsr>
Vue.component(NoSsr.name, {
  ...NoSsr,
  render (h, ctx) {
    if (process.client && !NoSsr._warned) {
      NoSsr._warned = true

      console.warn('<no-ssr> has been deprecated and will be removed in Nuxt 3, please use <client-only> instead')
    }
    return NoSsr.render(h, ctx)
  }
})

// Component: <NuxtChild>
Vue.component(NuxtChild.name, NuxtChild)
Vue.component('NChild', NuxtChild)

// Component NuxtLink is imported in server.js or client.js

// Component: <Nuxt>
Vue.component(Nuxt.name, Nuxt)

Vue.use(Meta, {"keyName":"head","attribute":"data-n-head","ssrAttribute":"data-n-head-ssr","tagIDKeyName":"hid"})

const defaultTransition = {"name":"page","mode":"out-in","appear":false,"appearClass":"appear","appearActiveClass":"appear-active","appearToClass":"appear-to"}

async function createApp (ssrContext) {
  const router = await createRouter(ssrContext)

  const store = createStore(ssrContext)
  // Add this.$router into store actions/mutations
  store.$router = router

  // Fix SSR caveat https://github.com/nuxt/nuxt.js/issues/3757#issuecomment-414689141
  const registerModule = store.registerModule
  store.registerModule = (path, rawModule, options) => registerModule.call(store, path, rawModule, Object.assign({ preserveState: process.client }, options))

  // Create Root instance

  // here we inject the router and store to all child components,
  // making them available everywhere as `this.$router` and `this.$store`.
  const app = {
    head: {"title":"ChinesePod","meta":[{"charset":"utf-8"},{"name":"X-UA-Compatible","content":"IE=edge"},{"name":"viewport","content":"width=device-width, initial-scale=1.0, maximum-scale=1.5, user-scalable=1, shrink-to-fit=no"},{"hid":"description","name":"description","content":"ChinesePod Javascript Stack"},{"hid":"og:title","property":"og:title","content":"ChinesePod"},{"hid":"og:description","name":"og:description","content":""},{"property":"og:image","content":"\u002Ficon.png"},{"property":"og:image:width","content":512},{"property":"og:image:height","content":512},{"property":"og:image:type","content":"image\u002Fpng"},{"property":"og:type","content":"website"},{"hid":"mobile-web-app-capable","name":"mobile-web-app-capable","content":"yes"},{"hid":"apple-mobile-web-app-capable","name":"apple-mobile-web-app-capable","content":"yes"},{"hid":"apple-mobile-web-app-status-bar-style","name":"apple-mobile-web-app-status-bar-style","content":"#e1001e"},{"hid":"apple-mobile-web-app-title","name":"apple-mobile-web-app-title","content":"ChinesePod"},{"hid":"author","name":"author","content":"Ugis Rozkalns"},{"hid":"theme-color","name":"theme-color","content":"#e1001e"},{"hid":"og:site_name","name":"og:site_name","property":"og:site_name","content":"ChinesePod"}],"link":[{"rel":"icon","type":"image\u002Fx-icon","href":"\u002Ffavicon.ico"},{"rel":"stylesheet","href":"https:\u002F\u002Ffonts.googleapis.com\u002Fcss?family=Roboto+Slab:300,400,600,700"},{"rel":"stylesheet","href":"https:\u002F\u002Ffonts.googleapis.com\u002Fcss?family=Roboto:300,400,600,700"},{"rel":"manifest","href":"\u002F_nuxt\u002Fmanifest.85188de4.json"},{"rel":"shortcut icon","href":"\u002F_nuxt\u002Ficons\u002Ficon_64x64.ac273f.png"},{"rel":"apple-touch-icon","href":"\u002F_nuxt\u002Ficons\u002Ficon_512x512.ac273f.png","sizes":"512x512"},{"href":"\u002F_nuxt\u002Ficons\u002Fsplash_iphonese_640x1136.ac273f.png","media":"(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)","rel":"apple-touch-startup-image"},{"href":"\u002F_nuxt\u002Ficons\u002Fsplash_iphone6_50x1334.ac273f.png","media":"(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)","rel":"apple-touch-startup-image"},{"href":"\u002F_nuxt\u002Ficons\u002Fsplash_iphoneplus_1080x1920.ac273f.png","media":"(device-width: 621px) and (device-height: 1104px) and (-webkit-device-pixel-ratio: 3)","rel":"apple-touch-startup-image"},{"href":"\u002F_nuxt\u002Ficons\u002Fsplash_iphonex_1125x2436.ac273f.png","media":"(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)","rel":"apple-touch-startup-image"},{"href":"\u002F_nuxt\u002Ficons\u002Fsplash_iphonexr_828x1792.ac273f.png","media":"(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)","rel":"apple-touch-startup-image"},{"href":"\u002F_nuxt\u002Ficons\u002Fsplash_iphonexsmax_1242x2688.ac273f.png","media":"(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)","rel":"apple-touch-startup-image"},{"href":"\u002F_nuxt\u002Ficons\u002Fsplash_ipad_1536x2048.ac273f.png","media":"(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)","rel":"apple-touch-startup-image"},{"href":undefined,"media":"(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)","rel":"apple-touch-startup-image"},{"href":undefined,"media":"(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)","rel":"apple-touch-startup-image"},{"href":undefined,"media":"(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)","rel":"apple-touch-startup-image"}],"style":[],"script":[],"htmlAttrs":{"lang":"en"}},

    store,
    router,
    nuxt: {
      defaultTransition,
      transitions: [defaultTransition],
      setTransitions (transitions) {
        if (!Array.isArray(transitions)) {
          transitions = [transitions]
        }
        transitions = transitions.map((transition) => {
          if (!transition) {
            transition = defaultTransition
          } else if (typeof transition === 'string') {
            transition = Object.assign({}, defaultTransition, { name: transition })
          } else {
            transition = Object.assign({}, defaultTransition, transition)
          }
          return transition
        })
        this.$options.nuxt.transitions = transitions
        return transitions
      },

      err: null,
      dateErr: null,
      error (err) {
        err = err || null
        app.context._errored = Boolean(err)
        err = err ? normalizeError(err) : null
        let nuxt = app.nuxt // to work with @vue/composition-api, see https://github.com/nuxt/nuxt.js/issues/6517#issuecomment-573280207
        if (this) {
          nuxt = this.nuxt || this.$options.nuxt
        }
        nuxt.dateErr = Date.now()
        nuxt.err = err
        // Used in src/server.js
        if (ssrContext) {
          ssrContext.nuxt.error = err
        }
        return err
      }
    },
    ...App
  }

  // Make app available into store via this.app
  store.app = app

  const next = ssrContext ? ssrContext.next : location => app.router.push(location)
  // Resolve route
  let route
  if (ssrContext) {
    route = router.resolve(ssrContext.url).route
  } else {
    const path = getLocation(router.options.base, router.options.mode)
    route = router.resolve(path).route
  }

  // Set context to app.context
  await setContext(app, {
    store,
    route,
    next,
    error: app.nuxt.error.bind(app),
    payload: ssrContext ? ssrContext.payload : undefined,
    req: ssrContext ? ssrContext.req : undefined,
    res: ssrContext ? ssrContext.res : undefined,
    beforeRenderFns: ssrContext ? ssrContext.beforeRenderFns : undefined,
    ssrContext
  })

  const inject = function (key, value) {
    if (!key) {
      throw new Error('inject(key, value) has no key provided')
    }
    if (value === undefined) {
      throw new Error(`inject('${key}', value) has no value provided`)
    }

    key = '$' + key
    // Add into app
    app[key] = value

    // Add into store
    store[key] = app[key]

    // Check if plugin not already installed
    const installKey = '__nuxt_' + key + '_installed__'
    if (Vue[installKey]) {
      return
    }
    Vue[installKey] = true
    // Call Vue.use() to install the plugin into vm
    Vue.use(() => {
      if (!Object.prototype.hasOwnProperty.call(Vue, key)) {
        Object.defineProperty(Vue.prototype, key, {
          get () {
            return this.$root.$options[key]
          }
        })
      }
    })
  }

  if (process.client) {
    // Replace store state before plugins execution
    if (window.__NUXT__ && window.__NUXT__.state) {
      store.replaceState(window.__NUXT__.state)
    }
  }

  // Plugin execution

  if (process.client && typeof nuxt_plugin_workbox_e8f1753a === 'function') {
    await nuxt_plugin_workbox_e8f1753a(app.context, inject)
  }

  if (typeof nuxt_plugin_nuxticons_2e1ac0be === 'function') {
    await nuxt_plugin_nuxticons_2e1ac0be(app.context, inject)
  }

  if (typeof nuxt_plugin_bootstrapvue_4cce1d36 === 'function') {
    await nuxt_plugin_bootstrapvue_4cce1d36(app.context, inject)
  }

  if (typeof nuxt_plugin_axios_53ec3607 === 'function') {
    await nuxt_plugin_axios_53ec3607(app.context, inject)
  }

  if (process.client && typeof nuxt_plugin_googleanalytics_4318e7bf === 'function') {
    await nuxt_plugin_googleanalytics_4318e7bf(app.context, inject)
  }

  if (process.client && typeof nuxt_plugin_bootstrap_56cad686 === 'function') {
    await nuxt_plugin_bootstrap_56cad686(app.context, inject)
  }

  if (typeof nuxt_plugin_argonkit_f49492a4 === 'function') {
    await nuxt_plugin_argonkit_f49492a4(app.context, inject)
  }

  // If server-side, wait for async component to be resolved first
  if (process.server && ssrContext && ssrContext.url) {
    await new Promise((resolve, reject) => {
      router.push(ssrContext.url, resolve, () => {
        // navigated to a different route in router guard
        const unregister = router.afterEach(async (to, from, next) => {
          ssrContext.url = to.fullPath
          app.context.route = await getRouteData(to)
          app.context.params = to.params || {}
          app.context.query = to.query || {}
          unregister()
          resolve()
        })
      })
    })
  }

  return {
    store,
    app,
    router
  }
}

export { createApp, NuxtError }
