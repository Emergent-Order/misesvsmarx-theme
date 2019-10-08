import Vuex from 'vuex'
import Vue from 'vue'
import findIndex from 'lodash/findIndex'

Vue.use(Vuex)

const WPAPI = require('wpapi')

const store = new Vuex.Store({
  state: {
    posts: [],
    playing: false,
    isCurrentlyOpen: false
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
    setIsCurrentlyOpen(state, { value }) {
      state.isCurrentlyOpen = value
    },
    setPostOffset(state, { id, offset }) {
      let post = state.posts.find(post => post.id == id)
      post.offset = offset
    },
    setPosts(state, arr) {
      state.posts = arr
    },
    setCoordinates(state, { id, top, bottom }) {
      let post = state.posts.find(post => post.id == id)
      post = Object.assign(post, {
        top,
        bottom
      })
    },
    setCorrectIndex(state, { id, index, top, bottom }) {
      let post = state.posts.find(post => post.id == id)
      post.index = index
    },
    setYPositions(state, { id, top, bottom }) {
      const post = state.posts.find(post => post.id == id)
      if (post) {
        console.log("index", post.index)
        post.top = top
        post.bottom = bottom
      }
    },
    setBottomCoordinate(state, { id, val }) {
      let post = state.posts.find(post => post.id == id)
      post = Object.assign(post, {
        bottom: val
      })
    },
    setTopCoordinate(state, { id, val }) {
      let post = state.posts.find(post => post.id == id)
      post = Object.assign(post, {
        top: val
      })
    }
  },
  actions: {
    pauseAudio({ state }) {
      state.playing = false
    },
    async playAudio({ state, commit, dispatch }) {
      await dispatch('closeAnnotations')
      commit('setIsCurrentlyOpen', { value: false })
      state.playing = true
      return true
    },
    async getAnnotations({ state }) {
      const site = WPAPI.discover(globals.siteUrl)
      const posts = await site.annotations().perPage(50).get()

      // Set posts
      state.posts = posts

      // Set annotations
      const annotations = await posts.map((post, index) => {
        const hasVideo = post ? post.type === "Video" : null
        const videoEmbed = hasVideo ? post.video_url : null
        // const externalUrl = !hasVideo ? post.acf.other_url : null

        return {
          open: false,
          index: null,
          offset: 0,
          top: 0,
          ...post,
          hasVideo,
          videoEmbed,
          // externalUrl,
        }
      })

      this.commit('setPosts', annotations)
      return annotations
    },
    async closeAnnotations({ state, getters}) {
      const newPosts = await state.posts.map(post => {
        post.open = false
        return post
      })

      state.posts = newPosts

      return newPosts
    },
    async openAnnotation({ state, getters }, id) {
      console.log('Opened!')
      const post = getters.getPost(id)

      // Open selected post, close other posts
      const newPosts = await state.posts.map(post => {
        if (post.id === id) {
          post.open = true
          // post.offset = 0
          return post
        } else {
          post.open = false
          // post.offset = 0
          return post
        }
      })

      state.posts = newPosts

      return newPosts
    },
    setAllCoordinates({ state, getters, commit }, children) {
      let prevPostBottom = 0

      for (let i = 0; i < children.length; i++) {
        const child = children[i]
        const id = children[i].dataPostId
        // console.log(child.$refs.text.offsetTop, prevPostBottom)
        let top, bottom

        if (prevPostBottom + 40 > child.$refs.text.offsetTop) {
          // console.log("Uhoh, collision")
          top = prevPostBottom + 20
          bottom = top + child.$refs.box.offsetHeight
          // console.log('new coords', top, bottom)
        } else {
          top = child.$refs.text.offsetTop - 20
          bottom = top + child.$refs.box.offsetHeight
        }

        prevPostBottom = bottom
        // console.log('Coords: ', top, bottom, prevPostBottom)

        commit('setCorrectIndex', {
          id,
          index: i
        })

        commit('setCoordinates', {
          id,
          top,
          bottom
        })
    }
  }
  }
})

export default store
