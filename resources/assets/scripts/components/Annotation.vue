<template>
  <div class="annotation">
    <div class="annotation-text">
      <slot></slot>
    </div>
    <aside v-if="post" class="annotation-aside">
      <h3>{{ getRendered(post.title) }}</h3>
      <p>{{ getRendered(post.excerpt )}}</p>
    </aside>
  </div>
</template>

<script>
const he = require('he')
export default {
  name: "Annotation",
  props: {
    dataPostId: {
      type: String,
      default: "0"
    },
  },
  data() {
    return {
      open: false
    }
  },
  computed: {
    post() {
      return this.$store.getters.getPost(parseInt(this.dataPostId)) || {}
    }
  },
  methods: {
    getRendered(obj) {
      return obj ? he.decode(obj.rendered) : ''
    }
  }
}
</script>

<style lang="scss">
</style>
