import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

const WPAPI = require('wpapi')
const site = WPAPI.discover(globals.siteUrl)


const store = new Vuex.Store({
  state: {
    posts: []
  },
  getters: {
    getPost: (state) => (id) => {
      return state.posts.find(post => post.id === id)
    }
  },
  actions: {
    async getAnnotations({ state }) {
      console.log('running getAnnotations')
      const site = await WPAPI.discover(globals.siteUrl)
      const posts = await site.annotations().get()
      console.log('posts', posts)
      state.posts = posts
    },
    async getAnnotation({ state }, id) {
      const site = await WPAPI.discover(globals.siteUrl)
      return site.annotations().id(id)
    }
  }
})

export default store
