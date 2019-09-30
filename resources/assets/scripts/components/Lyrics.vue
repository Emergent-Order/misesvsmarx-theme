<template>
  <div ref="lyrics" class="container relative">
    <slot></slot>
    <aside>
      <!-- <annotation
        v-if="annotations"
        v-for="ann in annotations"
        :key="ann.postId"
        :postId="ann.postId"
      >
        {{ ann.postId }}
      </annotation> -->
    </aside>
  </div>
</template>

<script>
export default {
  name: 'Lyrics',
  data() {
    return {
      annotations: []
    }
  },
  mounted() {
    this.$store.dispatch('getAnnotations')
    // this.$nextTick(() => {
    //   const $ = cheerio.load(this.$refs.lyrics.innerHTML)
    //   const annotations = $('.mvm-has-annotation').map((index, node) => {
    //     return {
    //       node,
    //       postId: node.attribs["data-post-id"],
    //       status: false
    //     }
    //   }).get()
    //
    //   console.log(annotations)
    //   this.annotations = annotations
    // })
  }
}
</script>
