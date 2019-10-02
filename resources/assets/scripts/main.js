import Vue from 'vue'

// External libraries
import VueYoutube from 'vue-youtube'
Vue.use(VueYoutube)

import VueAnime from 'vue-animejs'
Vue.use(VueAnime)

// Vuex Store
import store from './store'

import App from './App.vue'
import Lyrics from './components/Lyrics'
import Annotation from './components/Annotation'

Vue.component('lyrics', Lyrics)
Vue.component('annotation', Annotation)

new Vue({
  store,
}).$mount('#app');
