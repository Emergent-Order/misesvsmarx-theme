<template>
  <div class="annotation">
    {{ postId }}
  </div>
</template>

<script>
export default {
  name: "Annotation",
  props: {
    postId: {
      type: String,
      default: "0"
    },
  },
  methods: {
    getPost() {
      
    }
  }
}
</script>

<style scoped>

</style>
