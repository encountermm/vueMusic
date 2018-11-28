import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import fastClick from 'fastclick'
import VueLazyload from 'vue-lazyload'

import 'assets/stylus/index.styl'


Vue.config.productionTip = false

fastClick.attach(document.body)

Vue.use(VueLazyload, {
  loading: require('assets/images/default.png')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
