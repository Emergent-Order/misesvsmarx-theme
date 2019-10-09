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
        <vue-plyr v-if="open" ref="plyr" :key="post.slug" :options="playerOpts">
          <div class="plyr__video-embed">
            <iframe
              :src="videoUrl"
              allowfullscreen allowtransparency allow="autoplay">
            </iframe>
          </div>
        </vue-plyr>
      </div>
      <h3>{{ getRendered(post.title) }}</h3>
      <div class="annotation-excerpt" v-html="getRendered(post.content)"></div>
    </aside>
  </div>
</template>

<script>
const getVideoId = require('get-video-id')
const S = require('string')
const qs = require('querystringify')

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
      playerOpts: {
        youtube: {
          noCookie: false,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          enablejsapi: 1
        },
        vimeo: {
          byline: false,
          controls: false,
          loop: false,
          playsinline: true,
          portrait: false,
          transparent: true
        },
        settings: []
      }
    }
  },
  watch: {
    'post.top': function(val) {
      this.y = val - 10
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
      const animation = `${ app.isMobile ? 'mobile' : 'desktop' }${ val ? '-open' : '-close' }`

      switch (animation) {
        case 'mobile-open':
          app.handleMobileOpen()
          break;
        case 'mobile-close':
          app.handleMobileClose()
          break;
        case 'desktop-open':
          app.handleDesktopOpen()
          break;
        case 'desktop-close':
          app.handleDesktopClose()
          break;
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
    video() {
      return this.hasVideo ? getVideoId(this.videoEmbed) : null
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
      return this.hasVideo ? this.$refs.plyr.player : null
    },
    videoUrl() {
      // Return false if anything went wrong with the video ID
      if (!this.hasVideo || !this.videoId) return false
      const id = this.videoId
      let q

      // Turn off autoplay for mobile devices
      let autoplay = !this.isMobile

      switch (this.video.service) {
        case 'vimeo':
          q = qs.stringify({
            autoplay: autoplay
          }, true)
          return `https://player.vimeo.com/video/${id}${q}`
        case 'youtube':
          q = qs.stringify({
            autoplay: autoplay ? 1 : 0
          }, true)
          return `https://www.youtube.com/embed/${id}${q}`
        default:
          return ''
      }
    },
    content() {
      return this.post.content ? this.post.content : ""
    }
  },
  methods: {
    handleDesktopOpen() {
      const app = this

      this.$anime({
        targets: app.$refs.video,
        paddingBottom: '56.25%',
        easing: 'easeInOutExpo',
        duration: 500
      })

      app.scrollToParagraph()

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
    },
    handleDesktopClose() {
      const app = this
      app.$anime({
        targets: app.$refs.video,
        paddingBottom: 0,
        easing: 'easeInOutExpo',
        duration: 500,
      })

      app.$anime({
        targets: app.$refs.box,
        translateY: 0,
        duration: 500,
        easing: 'easeInOutExpo'
      })

      if(app.maybeMoveNextPost) {
        app.nextPost.setOffset(0)
      }
    },
    handleMobileOpen() {
      const app = this
      const paragraph = app.$refs.box.closest('p')
      const box = app.$refs.box
      const height = app.originalHeight + box.offsetHeight + this.targetHeight
      const y = app.originalHeight + 16
      const delay = this.$store.state.isCurrentlyOpen ? 750 : 0
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const scrollYy = paragraph.getBoundingClientRect().top + scrollTop - 30

      const timeline = this.$anime.timeline({
        easing: 'easeInOutQuad',
        delay: delay,
        translateZ: 0,
        duration: 350
      })

      setTimeout(() => { app.scrollToParagraph() }, delay)

      timeline
        .add({
          targets: app.$refs.box,
          translateY: y,
        })
        .add({
          targets: paragraph,
          height: height,
        }, 0)
        .add({
          targets: app.$refs.video,
          paddingBottom: '56.25%',
        }, 0)
        .add({
          targets: app.$refs.box,
          opacity: 1,
        }, 350)
    },
    handleMobileClose() {
      const app = this
      const paragraph = app.$refs.box.closest('p')
      const box = app.$refs.box

      const timeline = this.$anime.timeline({
        easing: 'easeInOutQuad',
        translateZ: 0,
        duration: 350
      })

      timeline
        .add({
          targets: app.$refs.box,
          opacity: 0,
        })
        .add({
          targets: app.$refs.box,
          translateY: 0,
        }, 350)
        .add({
          targets: paragraph,
          height: app.originalHeight,
          complete: function() {
            paragraph.style.height = null
          }
        }, 350)
        .add({
          targets: app.$refs.video,
          paddingBottom: '0%'
        }, 350)
    },
    setOffset(y) {
      if (this.windowWidth < 1024) return null
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
      return obj ? S(obj.rendered).unescapeHTML().s : ''
    },
    scrollToParagraph() {
      const scroll = window.document.scrollingElement || window.document.body || window.document.documentElement
      const paragraph = this.$refs.box.closest('p')
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const fromTop = paragraph.getBoundingClientRect().top
      const y = paragraph.getBoundingClientRect().top + scrollTop - 30

      this.$anime({
        targets: scroll,
        scrollTop: y,
        duration: 500,
        easing: 'easeInOutExpo'
      })
    },
    async openAnnotation() {
      if (this.open) return false
      const app = this
      this.setOffset(0)
      this.$store.dispatch('pauseAudio')
      this.$store.dispatch('openAnnotation', app.post.id).then(async () => {
        app.handleResize()
        this.$store.commit('setIsCurrentlyOpen', { value: true })
        if (app.player) {
          app.player.restart()
          app.player.play()
        }
      })
    },
  },
  mounted() {
    this.originalHeight = this.getParagraphHeight()
  }
}
</script>
