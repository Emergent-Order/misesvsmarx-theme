<template>
  <div ref="audio" id="media-player" class="container mx-auto">
    <vue-plyr ref="plyr" :options="options" class="player">
      <audio>
        <source :src="url" />
      </audio>
    </vue-plyr>
  </div>
</template>

<script>
  export default {
    name: 'MediaPlayer',
    props: {
      url: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        options: {
          settings: [],
          resetOnEnd: true
        }
      }
    },
    watch: {
      playing(newVal) {
        if (!newVal) {
          this.pausePlayer()
        }
      }
    },
    computed: {
      player() {
        return this.$refs.plyr.player
      },
      playing() {
        return this.$store.state.playing
      }
    },
    methods: {
      pausePlayer() {
        if (this.player) {
          this.player.pause()
        }
      }
    },
    mounted() {
      const app = this
      this.player.on('play', () => { app.$store.dispatch('playAudio') })
    }
  }
</script>

<style scoped>

</style>
