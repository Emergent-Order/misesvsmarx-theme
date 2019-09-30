<template>
  <div class="annotation">
    <div class="annotation-text">
      <slot></slot>
    </div>
    <aside class="annotation-aside">
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
  computed: {
    post() {
      return this.$store.getters.getPost(parseInt(this.dataPostId))
    }
  },
  methods: {
    getRendered(obj) {
      return he.decode(obj.rendered) || ''
    }
  }
}
</script>

<style lang="scss">
.mvm-has-annotation {
  background: transparent !important;
  @apply relative inline-block;
  display: inline-block;
}

.annotation-text {
  @apply cursor-pointer relative;
  display: inline-block;
  padding: 0rem 0.2rem;
  transition: all 0.25s ease;
  background-color: #D8D8D8;

  &:hover {
    background-color: #F0E0AD;
    transition: all 0.25s ease;
  }
}

.annotation-aside {
  @apply absolute text-gray-600 ml-auto w-1/3;
  top: 0;
  right: 0;
  h3 {
    @apply font-display;
    color: red;
  }
}
</style>
