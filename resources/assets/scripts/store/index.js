import Vuex from 'vuex'
import Vue from 'vue'
import findIndex from 'lodash/findIndex'

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
    },
    getPostByIndex: (state) => (index) => {
      return state.posts.find(post => post.index === index)
    }
  },
  mutations: {
    setPosts(state, arr) {
      state.posts = arr
    },
    setCorrectIndex(state, { id, index, top, bottom }) {
      console.log('Setting setCorrectIndex', top, bottom)
      let post = state.posts.find(post => post.id == id)
      // let p = findIndex(state.posts, p => { return p.id == id })
      console.log(id, index, top, bottom, post)

      // post = {
      //   ...post,
      //   index: index,
      //   top: top,
      //   botto: bottom
      // }
      post.index = index
      post.top = top
      post.bottom = bottom
    },
    setYPositions(state, { id, top, bottom }) {
      console.log(id, top, bottom)
      const post = state.posts.find(post => post.id == id)
      if (post) {
        console.log("index", post.index)
        post.top = top
        post.bottom = bottom
      }
    }
  },
  actions: {
    async getAnnotations({ state }) {
      const site = await WPAPI.discover(globals.siteUrl)
      const posts = await site.annotations().perPage(50).get()

      // Set posts
      state.posts = posts

      // Set annotations
      const annotations = await posts.map((post, index) => {
        const hasVideo = post.acf ? post.acf.type === "Video" : null
        const videoEmbed = hasVideo ? post.acf.video_url : null
        const externalUrl = !hasVideo ? post.acf.other_url : null

        return {
          open: false,
          ...post,
          index: null,
          hasVideo,
          videoEmbed,
          externalUrl,
        }
      })

      this.commit('setPosts', annotations)

      return annotations
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
