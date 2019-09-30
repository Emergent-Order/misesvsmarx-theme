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
      this.$nextTick(() => {
        let prevPostBottom = 0

        for (let i = 0; i < app.$children.length; i++) {
          const child = app.$children[i]
          console.log(child.$refs.text.offsetTop, prevPostBottom)
          let top, bottom

          if (prevPostBottom > child.$refs.text.offsetTop + 40) {
            console.log("Uhoh, collision")
            top = prevPostBottom + 100
            bottom = top + child.$refs.box.offsetHeight
            console.log('new coords', top, bottom)
          } else {
            top = child.$refs.text.offsetTop
            bottom = top + child.$refs.box.offsetHeight
          }

          prevPostBottom = bottom

          app.$store.commit('setCorrectIndex', {
            id: app.$children[i].dataPostId,
            index: i,
            top: top,
            bottom: bottom
          })
        }
      })
    })
  }
}
</script>
