<template>
  <div class="annotation" @click="openAnnotation()" :class="{ 'is-open': open }">
    <div ref="text" class="annotation-text">
      <slot></slot>
    </div>
    <aside ref="box" v-if="post" class="annotation-aside" :style="style">
      <template v-if="hasVideo">
        <div v-show="open"
          class="annotation-video responsive-embed"
          v-html="videoEmbed"
        ></div>
      </template>
      <h3>{{ getRendered(post.title) }}</h3>
      <div class="annotation-excerpt" v-html="getRendered(post.excerpt )"></div>
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
    }
  },
  computed: {
    index() {
      return this.post.index
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
    y() {
      return this.post.top
    },
    bottom() {
      return this.post.bottom
    },
    style() {
      return `top: ${ this.post.top }px;`
    }
  },
  methods: {
    getRendered(obj) {
      return obj ? he.decode(obj.rendered) : ''
    },
    // getYPos() {
    //   let top, bottom
    //
    //   const prevPostBottom = this.prevPost ? this.prevPost.bottom : 0
    //
    //   if (prevPostBottom > this.$refs.text.offsetTop + 40) {
    //     top = prevPostBottom + 100
    //     bottom = top + this.$refs.box.offsetHeight
    //   } else {
    //     top = this.$refs.text.offsetTop
    //     bottom = top + this.$refs.box.offsetHeight
    //   }
    //
    //   const id = this.post.id
    //   this.$store.commit('setYPositions', { id, top, bottom })
    // },
    openAnnotation() {
      this.$store.dispatch('openAnnotation', this.post.id)
    },
  },
  mounted() {
    // this.getYPos()
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
  top: 4px;
  right: 0;
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
</style>
