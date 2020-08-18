<template>
  <base-button outline class="text-center text-capitalize btn-play mr-sm-4" :class="[square ? '' : 'd-none d-sm-inline-block']" @click="togglePlay">
    <i class="fa mr-0 play" :class="playing ? 'fa-pause' : 'fa-play'"/><br :class="[square ? 'd-none d-sm-inline-block' : '']" />
    Play
  </base-button>
</template>

<script>


  export default {
    name: 'dictionary-play-button',
    key: to => to.fullPath,
    props: {
      audioUrl: String,
      square: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        playing: false,
        audio: '',
      }
    },
    mounted() {
      this.audio = new Audio(this.audioUrl);
      this.audio.addEventListener('ended', () => this.playing = false);
    },
    methods: {
      async togglePlay () {
        if(!this.playing) {
          await this.audio.play();
          this.playing = true;
        } else {
          await this.audio.pause();
          this.playing = false;
        }

      }
    }
  }
</script>

<style scoped>

</style>
