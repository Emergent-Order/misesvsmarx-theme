import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

const WPAPI = require('wpapi')
const site = WPAPI.discover(globals.siteUrl)


const store = new Vuex.Store({
  state: {
    posts: [],
    annotations: []
  },
  getters: {
    getPost: (state) => (id) => {
      return state.posts.find(post => post.id === id)
    }
  },
  actions: {
    async getAnnotations({ state }) {
      const site = await WPAPI.discover(globals.siteUrl)
      const posts = await site.annotations().perPage(50).get()
      state.posts = posts
    },
    async getAnnotation({ state }, id) {
      const site = await WPAPI.discover(globals.siteUrl)
      return site.annotations().id(id)
    },
    setAnnotations({ state }, arr) {
      state.annotations = arr
    },
    addAnnotation({ state }, obj) {
      state.annotations.push(obj)
    }
  }
})

export default store
