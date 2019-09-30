<template>
  <div ref="lyrics" class="relative">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Lyrics',
  mounted() {
    this.$store.dispatch('getAnnotations')
  }
}
</script>
