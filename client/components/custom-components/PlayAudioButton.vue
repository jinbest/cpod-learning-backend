<template>
  <base-button type="secondary" size="sm" class="mr-0" @click="playSound(audioUrl)">
    <i class="fas" :class="playing ? 'fa-pause' : 'fa-volume-up'"></i>
  </base-button>
</template>

<script>
  export default {
    name: 'PlayAudioButton',
    props: {
      audioUrl: String
    },
    data() {
      return {
        playing: false
      }
    },
    methods: {
      playSound(sound) {
        if(sound) {
          this.playing = true;
          const audio = new Audio(sound);
          audio.addEventListener('ended', () => this.playing = false)
          audio.play();
        }
      }
    }
  }
</script>

<style scoped>

</style>
