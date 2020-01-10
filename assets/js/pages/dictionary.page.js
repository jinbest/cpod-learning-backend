parasails.registerPage('dictionary', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    charSet: 'simplified',
    definition: [],
    both: false,
    characters: [],
    player: '',
    playing: false
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);
  },
  mounted: async function() {
    if (this.definition.length > 0) {
      this.definition[0][this.charSet].split('').forEach((character, index) => {
        this.characters.push(HanziWriter.create(`character-${index}`, character, {
          strokeAnimationSpeed: 2,
          padding: 5
        }));
      });
      await this.animate();
    }
  },
  computed: {
    calculateWidth() {
      return `width: ${100 / this.definition[0][this.charSet].split('').length}%`
    }
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    async asyncForEach  (array, callback) {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
      }
    },
    isPunctuation(character) {
      return new RegExp(`[!"\#$%&'()*+,\-./:;<=>?@\[\\\]^_\`{|}~、，。：·～！¥…（）—；【】「」《》？ˋ．・]|\\s|[A-z]|[0-9]|\\d+`).test(character);
    },

    async animate () {
      await this.asyncForEach(this.characters, (character) => character.hideCharacter({duration: 0}));
      await this.asyncForEach(this.characters, async (character) => {
        await character.animateCharacter({onComplete: async function() {}})
      });
    },
    async playAudio (example) {
      if (!this.player) {
        this.player = new Plyr('#player');
      }
      this.player.source = {
        type: 'audio',
        title: example.title ? example.title : 'ChinesePod Vocabulary',
        sources: [
          {
            src: example.audio,
            type: 'audio/mp3'
          }
        ]
      };
      this.player.play()

    },
    async pauseAudio () {
      this.player.pause();
    }
  }
});
