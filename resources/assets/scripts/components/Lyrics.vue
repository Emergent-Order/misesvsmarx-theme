<template>
  <div ref="lyrics" class="relative">
    <slot></slot>
  </div>
</template>

<script>
import each from 'lodash/each'
export default {
  name: 'Lyrics',
  computed: {
    posts() {
      return this.$store.state.posts
    },
    children() {
      return this.$children
    }
  },
  mounted() {
    const app = this
    this.$store.dispatch('getAnnotations').then(() => {
      app.$nextTick(() => {
        app.$store.dispatch('setAllCoordinates', app.$children)
        // console.log('Getting coordinates')
        // let prevPostBottom = 0
        //
        // for (let i = 0; i < app.$children.length; i++) {
        //   const child = app.$children[i]
        //   const id = app.$children[i].dataPostId
        //   console.log(child.$refs.text.offsetTop, prevPostBottom)
        //   let top, bottom
        //
        //   if (prevPostBottom + 40 > child.$refs.text.offsetTop) {
        //     console.log("Uhoh, collision")
        //     top = prevPostBottom + 100
        //     bottom = top + child.$refs.box.offsetHeight
        //     console.log('new coords', top, bottom)
        //   } else {
        //     top = child.$refs.text.offsetTop
        //     bottom = top + child.$refs.box.offsetHeight
        //   }
        //
        //   prevPostBottom = bottom
        //   console.log('Coords: ', top, bottom, prevPostBottom)
        //
        //   app.$store.commit('setCorrectIndex', {
        //     id,
        //     index: i
        //   })
        //
        //   app.$store.commit('setCoordinates', {
        //     id,
        //     top,
        //     bottom
        //   })
        // }
      })
    })
  }
}
</script>
