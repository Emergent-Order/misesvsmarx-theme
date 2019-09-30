console.log("main.js loaded")

import Vue from 'vue'
import store from './store'
import App from './App.vue'

import Lyrics from './components/Lyrics'

Vue.component('lyrics', Lyrics)

new Vue({
  store,
}).$mount('#app');
