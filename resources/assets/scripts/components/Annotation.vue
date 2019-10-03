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
      <div ref="video" class="annotation-video responsive-embed" v-if="hasVideo">
        <youtube
          v-if="open"
          ref="youtube"
          :video-id="videoId"
          :player-vars="playerVars"
        ></youtube>
      </div>
      <h3>{{ getRendered(post.title) }}</h3>
      <div class="annotation-excerpt" v-html="getRendered(post.excerpt)"></div>
    </aside>
  </div>
</template>

<script>
const he = require('he')
const getVideoId = require('get-video-id')

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
      offsetY: 0,
      originalHeight: 0,
      playerVars: {
        origin: window.location.origin
      }
    }
  },
  watch: {
    'post.top': function(val) {
      this.y = val
    },
    'post.offset': function(newVal, oldVal) {
      if (newVal === oldVal) return null

      // console.log('Offset watcher triggered for', this.post.slug, newVal)
      const app = this
      this.$anime({
        targets: app.$refs.box,
        translateY: newVal,
        easing: 'easeInOutExpo',
        duration: 500,
      })

      if(app.maybeMoveNextPost) {
        // console.log('Next post is', app.nextPost.slug, 'which should move', newVal)
        app.nextPost.setOffset(newVal)
      }
    },
    'post.open': function(val) {
      const app = this
      if (val) {
        if (app.isMobile) {
          const paragraph = app.$refs.box.closest('p')
          const box = app.$refs.box
          const height = app.originalHeight + box.offsetHeight + this.targetHeight
          const y = app.originalHeight + 16

          this.$nextTick(() => {
            app.$anime({
              targets: app.$refs.box,
              opacity: 1,
              translateY: y,
              duration: 500,
              easing: 'easeInOutExpo'
            })

            app.$anime({
              targets: paragraph,
              height: height,
              easing: 'easeInOutExpo',
              duration: 500
            })
          })
        }

        this.$anime({
          targets: app.$refs.video,
          paddingBottom: '56.25%',
          easing: 'easeInOutExpo',
          duration: 500
        })

        if(app.maybeMoveNextPost) {
          /* -------------------------------------------------------------
          // Use nextTick here to ensure that when there's a race condition
          // between resetting the offset to 0 and moving the next post,
          // moving the next post is the last instruction
          // ------------------------------------------------------------- */
          this.$nextTick(() => {
            app.nextPost.setOffset(app.targetHeight)
          })
        }
      } else {
        this.$anime({
          targets: app.$refs.video,
          paddingBottom: 0,
          easing: 'easeInOutExpo',
          duration: 500,
        })

        app.$anime({
          targets: app.$refs.box,
          // opacity: 0,
          translateY: 0,
          duration: 500,
          easing: 'easeInOutExpo'
        })

        if(app.maybeMoveNextPost) {
          app.nextPost.setOffset(0)
        }

        if(app.isMobile) {
          const paragraph = app.$refs.box.closest('p')
          const box = app.$refs.box

          app.$anime({
            targets: app.$refs.box,
            opacity: 0,
            // translateY: 0,
            duration: 500,
            easing: 'easeInOutExpo'
          })

          app.$anime({
            targets: paragraph,
            height: app.originalHeight,
            easing: 'easeInOutExpo',
            duration: 500,
            complete: function() {
              paragraph.style.height = null
            }
          })
        }
      }
    }
  },
  computed: {
    index() {
      return this.post.index
    },
    slug() {
      return this.post.slug
    },
    targetHeight() {
      return this.$refs.box.offsetWidth * 9 / 16
    },
    isMobile() {
      return this.windowWidth < 1024
    },
    maybeMoveNextPost() {
      // If next post is within the box range
      // and we're on desktop, return true
      const nextPost = this.$parent.$children[this.index + 1]
      const nextPostTop = nextPost.$refs.box.offsetTop
      const targetHeight = this.$refs.box.offsetHeight + this.$refs.box.offsetWidth * 9 / 16
      const targetBottom = targetHeight + this.y

      if (targetBottom > nextPostTop + 40) {
        return true
      } else {
        return false
      }
    },
    nextPost() {
      return this.$parent.$children[this.index + 1]
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
    videoId() {
      var regex = /<iframe.*?s*src="(.*?)".*?<\/iframe>/
      var src = regex.exec(this.videoEmbed)
      return src ? getVideoId(src[1]).id : null
    },
    open() {
      return this.post.open
    },
    style() {
      if (this.windowWidth < 1024) return null
      return `top: ${ this.y }px;`
    },
    player() {
      return this.hasVideo ? this.$refs.youtube.player : null
    }
  },
  methods: {
    setOffset(y) {
      if (this.windowWidth < 1024) return null
      // console.log('setting offset for', this.slug, 'of', y)
      this.$store.commit('setPostOffset', {
        id: this.post.id,
        offset: y
      })
    },
    getParagraphHeight() {
      const paragraph = this.$refs.box.closest('p')
      return paragraph.offsetHeight
    },
    handleResize(event) {
      // console.log('handleResize triggered for', this.slug, event)
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
      const app = this
      this.setOffset(0)
      this.$store.dispatch('pauseAudio')
      this.$store.dispatch('openAnnotation', app.post.id).then(async () => {
        app.handleResize()
        if (app.player) await app.player.playVideo()
      })
    },
  },
  mounted() {
    this.originalHeight = this.getParagraphHeight()
  }
}
</script>

<style lang="scss">
// .mvm-has-annotation.annotation {
//   background: transparent !important;
//   display: inline;
//   @apply static cursor-pointer;
// }
//
// .annotation-text {
//   @apply relative;
//   display: inline;
//   margin-right: -0.25rem;
//   // padding: 0rem 0.25rem;
//   // margin-left: -0.25rem;
//   transition: all 0.25s ease;
//   background-color: #D8D8D8;
// }
//
// .annotation-aside {
//   @apply absolute text-gray-600 ml-auto w-1/3;
//   @apply pl-10;
//   padding-top: 16px;
//   right: 0;
//   h3 {
//     @apply font-display text-gray-600;
//     font-size: 18px;
//   }
//   p {
//     margin-bottom: 16px !important;
//   }
// }
//
// #lyrics .annotation-excerpt * {
//   @apply font-body text-gray-600 font-medium;
//   font-size: 15px;
// }
//
// #lyrics .annotation:hover,
// #lyrics .annotation.is-open {
//   .annotation-text {
//     background-color: #F0E0AD;
//     transition: all 0.25s ease;
//   }
//
//   .annotation-aside h3 {
//     @apply text-black;
//     transition: all 0.25s ease;
//   }
// }
//
//
// .annotation-video {
//   @apply mb-4 bg-gray-400 rounded;
//   max-height: 0px;
//   padding-bottom: 0px;
//   iframe {
//     opacity: 0;
//     transition: opacity 0.5s ease 0.5s;
//   }
// }
//
// .is-open .annotation-video iframe {
//   opacity: 1;
//   transition: opacity 0.5s ease 0.5s;
// }
//
// .is-open .annotation-aside {
//   @apply border-solid border-gold-bright;
//   border-left-width: 3px;
// }
//
// // .is-open .annotation-video {
// //   padding-bottom: 56.25%;
// //   // transition: padding 0.25s ease;
// // }
//
// // .openBox-enter-active {
// //   transition: opacity 0.25s ease;
// // }
// //
// // .openBox-enter, .openBox-leave-to {
// //   opacity: 1;
// // }
// //
// // .openBox-leave {
// //   opacity: 0;
// // }
</style>
