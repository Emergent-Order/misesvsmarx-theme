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
      })
    })
  }
}
</script>
