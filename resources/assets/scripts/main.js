console.log("main.js loaded")

import Vue from 'vue'
import store from './store'
import App from './App.vue'

import Lyrics from './components/Lyrics'
import Annotation from './components/Annotation'

Vue.component('lyrics', Lyrics)
Vue.component('annotation', Annotation)

new Vue({
  store,
}).$mount('#app');
