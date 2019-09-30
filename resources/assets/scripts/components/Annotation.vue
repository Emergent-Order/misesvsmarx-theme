<template>
  <div class="annotation" @click="openAnnotation()">
    <div ref="text" class="annotation-text">
      <slot></slot>
    </div>
    <aside v-if="post" class="annotation-aside" :style="`top: ${top}px`">
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
    },
  },
  data() {
    return {
      // open: false,
      top: 0
    }
  },
  computed: {
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
    }
  },
  methods: {
    getRendered(obj) {
      return obj ? he.decode(obj.rendered) : ''
    },
    getYPos() {
      const text = this.$refs.text
      const box = text.offsetTop
      this.top = box
    },
    openAnnotation() {
      this.$store.dispatch('openAnnotation', this.post.id)
    },
  },
  mounted() {
    this.getYPos()
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
  margin-right: -0.5rem;
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

#lyrics .annotation:hover {
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
