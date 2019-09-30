<template>
  <div ref="lyrics">
    <slot></slot>
    <aside>
      <annotation
        v-if="annotations"
        v-for="ann in annotations"
        :key="ann.postId"
        :postId="ann.postId"
      >
        {{ ann.postId }}
      </annotation>
    </aside>
  </div>
</template>

<script>
import cheerio from 'cheerio'
import annotation from './Annotation'
export default {
  name: 'Lyrics',
  components: {
    annotation
  },
  data() {
    return {
      annotations: []
    }
  },
  mounted() {
    this.$store.dispatch('getAnnotations')
    this.$nextTick(() => {
      const $ = cheerio.load(this.$refs.lyrics.innerHTML)
      const annotations = $('.mvm-has-annotation').map((index, node) => {
        return {
          node,
          postId: node.attribs["data-post-id"],
          status: false
        }
      }).get()

      console.log(annotations)
      this.annotations = annotations
    })
  }
}
</script>
