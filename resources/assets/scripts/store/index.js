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
  mutations: {
    setPosts(state, arr) {
      state.posts = arr
    }
  },
  actions: {
    async getAnnotations({ state }) {
      const site = await WPAPI.discover(globals.siteUrl)
      const posts = await site.annotations().perPage(50).get()

      // Set posts
      state.posts = posts

      // Set annotations
      const annotations = await posts.map(post => {
        const hasVideo = post.acf ? post.acf.type === "Video" : null
        const videoEmbed = hasVideo ? post.acf.video_url : null
        const externalUrl = !hasVideo ? post.acf.other_url : null

        return {
          open: false,
          ...post,
          hasVideo,
          videoEmbed,
          externalUrl,
        }
      })

      this.commit('setPosts', annotations)
    },
    async openAnnotation({ state, getters }, id) {
      const post = getters.getPost(id)
      const newPosts = await state.posts.map(post => {
        if (post.id === id) {
          post.open = true
          return post
        } else {
          post.open = false
          return post
        }
      })

      state.posts = newPosts
    }
  }
})

export default store
