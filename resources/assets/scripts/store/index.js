import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

const WPAPI = require('wpapi')
const site = WPAPI.discover(globals.siteUrl)


const store = new Vuex.Store({
  state: {
    posts: []
  },
  actions: {
    async getAnnotations({ state }) {
      console.log('running getAnnotations')
      const site = await WPAPI.discover(globals.siteUrl)
      const posts = await site.annotations().get()
      this.posts = posts
    },
    async getAnnotation({ state }, id) {
      const site = await WPAPI.discover(globals.siteUrl)
      return site.annotations().id(id)
    }
  }
})

export default store
