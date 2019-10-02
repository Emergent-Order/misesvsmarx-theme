<template>
  <div class="annotation" @click="openAnnotation()" :class="{ 'is-open': open }">
    <div ref="text" class="annotation-text">
      <slot></slot>
    </div>
    <aside
      ref="box"
      v-if="post"
      class="annotation-aside"
      :style="style"
    >
      <template v-if="hasVideo">
        <transition name="openBox">
          <div v-show="open"
            class="annotation-video responsive-embed"
            v-html="videoEmbed"
          ></div>
        </transition>
      </template>
      <h3>{{ getRendered(post.title) }}</h3>
      <div class="annotation-excerpt" v-html="getRendered(post.excerpt)"></div>
    </aside>
  </div>
</template>

<script>
const he = require('he')
// import resize from 'vue-resize-directive'
export default {
  name: "Annotation",
  props: {
    dataPostId: {
      type: String,
      default: "0"
    }
  },
  data() {
    return {
      y: 0,
      offsetY: 0
    }
  },
  watch: {
    post: {
      handler: function(val) {
        console.log('handling post change', val.offset)
        this.y = val.top
        this.offsetY = val.offset
      },
      deep: true
    }
  },
  computed: {
    index() {
      return this.post.index
    },
    slug() {
      return this.post.slug
    },
    prevPost() {
      return this.$store.getters.getPostByIndex(this.index - 1)
    },
    post() {
      return this.$store.getters.getPost(parseInt(this.dataPostId)) || {}
    },
    hasVideo() {
      return this.post.hasVideo
    },
    videoEmbed() {
      return this.post.videoEmbed
    },
    open() {
      return this.post.open
    },
    style() {
      return `top: ${ this.y }px; transform: translateY(${ this.post.offset }px);`
    },
  },
  methods: {
    setOffset(y, slug) {
      this.$store.commit('setPostOffset', {
        id: this.post.id,
        offset: y,
        slug: this.slug
      })
    },
    handleResize() {
      const nextPost = this.$parent.$children[this.index + 1]
      if (!nextPost) { return false }

      const top     = this.$refs.box.offsetTop + this.post.offset
      const height  = this.$refs.box.offsetHeight
      const bottom  = top + height
      const nextPostTop = nextPost.$refs.box.offsetTop + nextPost.post.offset

      // If the nextPost starts less than 20px after this one ends, move it down
      if (nextPostTop < bottom + 20) {
        // Get the offset amount from current position
        const offset = bottom - nextPostTop + 20
        nextPost.setOffset(offset, this.slug)
        nextPost.handleResize()
      }
    },
    getRendered(obj) {
      return obj ? he.decode(obj.rendered) : ''
    },
    async openAnnotation() {
      this.setOffset(0)
      this.$store.dispatch('openAnnotation', this.post.id).then(() => {
        this.handleResize()
      })
    },
  }
}
</script>

<style lang="scss">
.mvm-has-annotation.annotation {
  background: transparent !important;
  display: inline;
  @apply static cursor-pointer;
}

.annotation-text {
  @apply relative;
  display: inline;
  margin-right: -0.25rem;
  // padding: 0rem 0.25rem;
  // margin-left: -0.25rem;
  transition: all 0.25s ease;
  background-color: #D8D8D8;
}

.annotation-aside {
  @apply absolute text-gray-600 ml-auto w-1/3;
  right: 0;
  transition: transform 0.25s ease;
  h3 {
    @apply font-display text-gray-600;
    font-size: 18px;
  }
}

#lyrics .annotation-excerpt * {
  @apply font-body text-gray-600 font-medium;
  font-size: 15px;
}

#lyrics .annotation:hover,
#lyrics .annotation.is-open {
  .annotation-text {
    background-color: #F0E0AD;
    transition: all 0.25s ease;
  }

  .annotation-aside h3 {
    @apply text-black;
    transition: all 0.25s ease;
  }
}


.annotation-video {
  @apply mb-4;
  max-height: 400px;
  opacity: 100%;
}

.openBox-enter-active {
  transition: max-height 0.25s ease, opacity 0.25s ease;
}

.openBox-enter, .openBox-leave-to {
  max-height: 0px;
  opacity: 0;
}
</style>
