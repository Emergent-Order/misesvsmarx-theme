import Vue from 'vue'

// External libraries
import VueYoutube from 'vue-youtube'
Vue.use(VueYoutube)

import VueAnime from 'vue-animejs'
Vue.use(VueAnime)

import VuePlyr from 'vue-plyr'
Vue.use(VuePlyr)

// Vuex Store
import store from './store'

import App from './App.vue'
import Lyrics from './components/Lyrics'
import Annotation from './components/Annotation'
import MediaPlayer from './components/MediaPlayer'

Vue.component('lyrics', Lyrics)
Vue.component('annotation', Annotation)
Vue.component('mediaplayer', MediaPlayer)

new Vue({
  store,
}).$mount('#app');
