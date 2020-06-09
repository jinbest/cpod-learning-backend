const pkg = require('./package');
const webpack =  require('webpack');
const axios = require('axios');

module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'X-UA-Compatible', content: 'IE=edge' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.5, user-scalable=1, shrink-to-fit=no' },
      { hid: 'description', name: 'description', content: pkg.description },
      { hid: 'og:title', property: 'og:title', content: 'ChinesePod' },
      { hid: 'og:description', name: 'og:description', content: '' },
      { property: 'og:image', content: '/icon.png' },
      { property: 'og:image:width', content: 512 },
      { property: 'og:image:height', content: 512 },
      { property: 'og:image:type', content: 'image/png' },
      { property: 'og:type', content: 'website' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto+Slab:300,400,600,700' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,600,700' }
    ]
  },

  /*
  ** Configuration for @nuxtjs/pwa
  ** https://developer.mozilla.org/en-US/docs/Web/Manifest
  */
  manifest: {
    name: 'ChinesePod',
    short_name: 'ChinesePod',
    description: 'Learn Mandarin Chinese with ChinesePod',
    theme_color: '#e1001e',
    background_color: '#e1001e',
  },
  srcDir: 'client/',
  meta: {
    // apple-mobile-web-app-capable=yes
    // https://medium.com/@firt/dont-use-ios-web-app-meta-tag-irresponsibly-in-your-progressive-web-apps-85d70f4438cb
    mobileAppIOS: true,
    appleStatusBarStyle: '#e1001e'
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
    '~assets/argon/vendor/nucleo/css/nucleo.css',
    '~assets/argon/vendor/icomoon/css/icomoon.css',
    '@fortawesome/fontawesome-free/css/all.css',
    '~assets/argon/scss/argon.scss',
    'bootstrap-vue/dist/bootstrap-vue.css',
    '~assets/transitions.css'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    {
      src: '@/plugins/bootstrap.js',
      ssr: false
    },
    '~/plugins/argon/argon-kit'
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://bootstrap-vue.js.org/docs/
    ['bootstrap-vue/nuxt', {
      bootstrapCSS: true,
      bootstrapVueCSS: true,
      componentPlugins: [
        'Carousel',
        'Spinner'
      ],
      directivePlugins: [
        'Tooltip',
        'Popover'
      ]
    }],
    '@nuxtjs/pwa'
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  /*
  ** Build configuration
  */
  // buildDir: 'assets/nuxt',

  build: {
    /*
    ** You can extend webpack config here
    */
    publicPath: 'ssr/', //(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? false :
    plugins: [
      new webpack.ProvidePlugin({
        '$': 'jquery',
        'jQuery': 'jquery',
        'jquery': 'jquery',
        'window.jQuery': 'jquery',
      })
    ],
    extend(config, ctx) {

    }
  },

  /*
  ** Env configuration
  */
  env: {
    API_URL: (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? 'http://localhost:1337/api/v1' : '/api/v1'
  },
  /*
  ** Generate pages
  */
  generate: {
    routes () {
      return axios.get('https://staging.chinesepod.com/api/v1/lessons/get-sitemap')
        .then((res) => {
          return res.data.map((lesson) => {
            return '/lessons/' + lesson.slug
          })
        })
    }
  },
  dev: false //!process.env.NODE_ENV || process.env.NODE_ENV === 'development'
}
