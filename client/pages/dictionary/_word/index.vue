<template>
  <div>
    <div class="container-fluid py-2">
      <div id="searchArea" class="col-12 col-lg-8 offset-lg-2 col-xl-6 offset-xl-3">
        <base-input group prepend-icon="fas fa-search">
          <input type="search" class="form-control" placeholder="Search in English or Chinese" aria-label="Search in English or in Chinese" aria-describedby="button-addon2" v-model.trim="searchTerm" @search="runSearch()">
          <div class="input-group-append">
            <base-button class="btn btn-outline-primary is-loading" type="button" id="button-addon2" @click="runSearch()" :loading="searching">Search</base-button>
          </div>
        </base-input>
      </div>
    </div>
    <div class="bg-lighter vocabulary-page pb-2">
      <section class="section main-word-section">
        <div class="container">
          <div class="row align-items-center">
            <div  class="col-12 d-flex justify-content-center" :class="[(showAnimation || audioUrl) ? 'col-sm-5 col-lg-6' : '']">
              <div>
                <div class="main-word">{{ simplified }}{{ simplified !== traditional ? ` (${traditional})` : '' }}</div>
                <div class="pronounciation">
                  <div>{{ pinyin }}</div>
                  <div class="pronounciation-comment">Pinyin</div>
                </div>
              </div>
            </div>

            <div v-if="showAnimation || audioUrl" class="col-12 col-sm-7 col-lg-6 animation-audio-container">
              <div v-if="showAnimation" class="animation" id="animation-hanzi-container">
                <svg class="grid-background" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%" id="grid-background-target" preserveAspectRatio="xMidYMid meet">
                  <line x1="0" y1="0" x2="200" y2="200" class="line" />
                  <line x1="200" y1="0" x2="0" y2="200" class="line" />
                  <line x1="100" y1="0" x2="100" y2="200" class="line" />
                  <line x1="0" y1="100" x2="200" y2="100" class="line" />
                </svg>
              </div>

              <div class="audio-buttons mr-md-4">
                <dictionary-play-button v-if="audioUrl" :audio-url="audioUrl" :key="audioUrl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="section section-sm definition-section mt-3">
        <div class="container">
          <h4 class="section-title">Definition</h4>
          <card shadow>
            <div class="definition" v-for="(definition, index) in definitionList" :key="index">
              <div class="definition-title d-flex align-items-center">
                <div class="simplified pr-3">{{ definition.simplified }}{{ definition.simplified !== definition.traditional ? ` (${definition.traditional})` : '' }}</div>&nbsp;-&nbsp;
                <div class="pinyin pl-3">{{ definition.pinyin }}</div>
              </div>
              <ol>
                <li v-for="(item, ind) in definition.items" :key="ind">
                  {{ item }}
                </li>
              </ol>
            </div>
          </card>
        </div>
      </section>

      <section class="section section-sm decomposition-section">
        <div class="container">
          <h4 class="section-title">Character Decomposition</h4>
          <card shadow>
            <div class="content">
              <div v-for="(decomposition, index) in decompositionList" :key="index">
                <div v-if="checkDecomposition(decomposition.character)" class="composition">
                  <div class="composition-text">
                    <div class="decomposition-item ml-0">
                      <nuxt-link :to="`/dictionary/${decomposition.character}`">{{ decomposition.character }}</nuxt-link>
                    </div>
                  </div>

                  <div class="decomposition-container row ml-0">
                    <div class="decomposition-item" v-for="(item, index1) in cleanDecomposition(decomposition.components)" :key="index1">
                      <nuxt-link :to="`/dictionary/${item}`">{{ item }}</nuxt-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </card>
        </div>
      </section>

      <section v-if="compoundsList.length > 0"  class="section section-sm compounds-section">
        <div class="container">
          <h4 class="section-title">Compounds <span>({{ compoundsList.length }})</span></h4>
          <collapse-table-card :data="compoundsList" links />
        </div>
      </section>

      <section  v-if="relatedWordsList.length > 0" class="section section-sm">
        <div class="container">
          <h4 class="section-title">Related Words <span>({{ relatedWordsList.length }})</span></h4>
          <collapse-table-card :data="relatedWordsList" links/>
        </div>
      </section>

      <section v-if="idiomsList.length > 0" class="section section-sm">
        <div class="container">
          <h4 class="section-title">Idioms <span>({{ idiomsList.length }})</span></h4>
          <collapse-table-card :data="idiomsList"  />
        </div>
      </section>

      <section v-if="sampleSentenceList.length > 0" class="section section-sm sample-sentence-section">
        <div class="container">
          <h4 class="section-title">Sample Sentences</h4>
          <card shadow class="sample-sentence-card" v-for="(sentence, index) in sampleSentenceList" :key="index">
            <div class="content">
              <div class="sentence-content pr-md-3">
                <div class="simplified-sentence" v-html="sentence.simplified"></div>
                <div class="pinyin-sentence pt-2" v-html="cleanPinyin(sentence.pinyin)"></div>
                <div class="english-sentence pt-3" v-html="sentence.english"></div>
              </div>
              <div class="action-content">
                <dictionary-play-button class="mr-lg-4" v-if="sentence.audioUrl" :audio-url="sentence.audioUrl" square />
                <div class="sub-action-buttons pt-2">
                  <base-button
                    class="text-capitalize btn text-white mb-md-1"
                    :class="`${getButtonType(sentence.lessonInfo.level)}`">
                    {{ sentence.lessonInfo && sentence.lessonInfo.level }}
                  </base-button>
                  <a v-if="sentence.lessonInfo && sentence.lessonInfo.slug" :title="sentence.lessonInfo.title" :href="`https://www.chinesepod.com/lesson/${sentence.lessonInfo.slug}`" class="btn btn-outline-primary link-button text-capitalize mt-md-2" role="button" >
                    Go to Lesson&nbsp;<i class="fa fa-angle-right" />
                  </a>
                </div>
              </div>
            </div>
          </card>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
  import HanziWriter from 'hanzi-writer'
  import isChinese from 'is-chinese'
  import { sendGet } from '@/util/api'
  import { cleanPinyin, cleanDefinitions, cleanDecomposition, checkDecomposition } from "@/util/dictionary";
  import CollapseTableCard from '@/components/custom-components/collapse-table-card'
  import DictionaryPlayButton from '@/components/custom-components/dictionary-play-button'
  export default {
    name: "dictionary",
    layout: 'default',
    validate({params}) {
      return params.word && typeof params.word === 'string'
    },
    components: {
      DictionaryPlayButton,
      CollapseTableCard
    },
    data() {
      return {
        searching: false,
        searchTerm: '',
        writer: null,
        showAnimation: true,
      };
    },
    head() {
      return {
        title: `${this.simplified}${this.simplified !== this.traditional ? ` [${this.traditional}]` : ''} - ${this.definitionList[0].items.join(', ')} - ${this.pinyin} | Definition | ChinesePod.com`,
        meta: [
          {hid: 'description', name: 'description', content: `English - Chinese Dictionary | Meaning of ${this.simplified}${this.simplified !== this.traditional ? ` [${this.traditional}]` : ''} in English: ${this.definitionList[0].items.join(', ')} | ChinesePod.com`}
        ]
      }
    },
    async asyncData ({ params, error, payload, redirect }) {
      const word = params.word
      const response = await sendGet('/dictionary/get-details', { word })
        .catch(() => redirect('https://www.chinesepod.com/dictionary'));

      if (!response) {
        redirect('https://www.chinesepod.com/dictionary')
        return
      }

      const data = response.data
      if (!data) {
        redirect('https://www.chinesepod.com/dictionary')
        return
      }

      try {


        const compoundsList = data.compounds.map(compound => compound)
        const relatedWordsList = data.related.map(related => related)
        const idiomsList = data.idioms.map(idiom => idiom)
        const sampleSentenceList = data.lessons.map(lesson => lesson)
        const definitionList = data.definition.map(definition => {
          const items = definition.definition.split('/')
          return {
            ...definition,
            items
          }
        })

        let decompositionList = []
        for (let [key, value] of Object.entries(data.decomposition)) {
          decompositionList.push(value)
        }
        const animationCharacters = cleanDecomposition(Array.from(word))

        return {
          simplified: data.definition[0].simplified,
          traditional: data.definition[0].traditional,
          pinyin: data.definition[0].pinyin,
          audioUrl: data.audioUrl,
          definitionList,
          decompositionList,
          compoundsList,
          relatedWordsList,
          idiomsList,
          sampleSentenceList,
          animationCharacters
        }

      } catch (e) {
        console.log(e);
        // redirect('https://www.chinesepod.com')
      }

    },
    mounted() {
      this.writer = HanziWriter.create('animation-hanzi-container', this.animationCharacters[0], {
        padding: 5,
        delayBetweenLoops: 3000,
        onLoadCharDataSuccess: () => {
          document.getElementById('animation-hanzi-container')
            .addEventListener('click', () => {
              this.playAnimation(0, true)
            })
        },
        onLoadCharDataError: () => {
          this.showAnimation = false;
          console.log('Oh No! Could not load character data');
        }
      });
      this.playAnimation(0, true);
    },
    methods: {
      isChinese: isChinese,
      cleanDefinitions: cleanDefinitions,
      cleanPinyin: cleanPinyin,
      cleanDecomposition: cleanDecomposition,
      checkDecomposition: checkDecomposition,
      async runSearch () {

        this.searching = true;

        if (this.searchTerm) {

          this.$router.push({path: '/dictionary', query: {search: this.searchTerm}})

        } else {

          this.$router.push({path: '/dictionary'})

        }

      },
      getButtonType(type) {
        return type.toLowerCase().split(' ').join('-')
        if (type === 'Newbie') return 'primary'
        if (type === 'Intermediate') return 'warning'
        if (type === 'Upper Intermediate') return 'danger'
        if (type === 'Elementary') return 'success'
        if (type === 'Media') return 'default'
        return 'primary'
      },
      async playAnimation(index, isStartAnimation = false) {
        this.writer.setCharacter(this.animationCharacters[index])

        if (index === 0 && !isStartAnimation) return

        await this.writer.animateCharacter({
          onComplete: () => {
            setTimeout(() => {
              this.playAnimation((index + 1) % this.animationCharacters.length)
            }, 1000)
          }
        })
      }
    }
  };
</script>

<style lang="scss">
  .vocabulary-page {

    $cpod-any: #0F4BBD !default;
    $cpod-newbie: #2487C1 !default;
    $cpod-elementary: #35C567 !default;
    $cpod-preint: #F7B500 !default;
    $cpod-intermediate: #FF4D0F !default;
    $cpod-upperint: #E1001E !default;
    $cpod-advanced: #89006B !default;
    $cpod-media: #003041 !default;

    .any {
      background-color: $cpod-any;
    }
    .newbie {
      background-color: $cpod-newbie;
    }
    .elementary {
      background-color: $cpod-elementary;
    }
    .pre-intermediate {
      background-color: $cpod-preint;
    }
    .intermediate {
      background-color: $cpod-intermediate;
    }
    .upper-intermediate {
      background-color: $cpod-upperint;
    }
    .advanced {
      background-color: $cpod-advanced;
    }
    .media {
      background-color: $cpod-media;
      display: block;
    }

    .characters {
      font-size: 30px;
      font-family: 'Noto Sans SC', sans-serif;
      color: black;
    }
    .pinyin {
      font-family: 'Noto Sans SC', sans-serif;
    }
    .pinyin, .english {
      font-size: 24px;
      color: black;
    }

    color: #000;
    .main-word-section {
      background: #FFFFFF;
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
      padding: 20px 0;
      .main-word {
        font-size: 64px;
        @media (max-width: 576px)  {
          font-size: 48px;
        }
        @media (max-width: 360px)  {
          font-size: 44px;
        }
      }
      .pronounciation {
        font-size: 30px;
        .pronounciation-comment {
          font-size: 14px;
          color: #999;
        }
      }
      .animation-audio-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .animation {
          border: 1px solid #DDD;
          width: 150px;
          height: 150px;
          position: relative;
          visibility: hidden;
          &:first-child {
            visibility: visible;
          }
          @media (min-width: 768px) {
            width: 200px;
            height: 200px;
          }
          .grid-background {
            position: absolute;
            .line {
              stroke: #545454;
              stroke-dasharray: 2 2;
              opacity: .3;
            }
          }
        }
        .audio-buttons {
          display: flex;
          flex-direction: column;
          @media (max-width: 576px)  {
            width: 80%;
            align-items: center;
          }
        }
        @media (max-width: 576px)  {
          flex-direction: column;
        }
      }
    }
    .definition-section {
      .definition {
        margin-top: 20px;
        &:first-child {
          margin-top: 0;
        }
      }
      .definition-title {
        font-size: 24px;
        .simplified {
          font-size: 30px;
        }
      }
      ol {
        padding-left: 1.5rem;
        font-size: 18px;
        .chinese-sentence {
          font-size: 36px;
        }
        span {
          color: #999999;
        }
        li {
          padding-top: 15px;
          &:first-child {
            padding-top: 0;
          }
        }
      }
    }
    .decomposition-section {
      .composition {
        display: flex;
        margin-bottom: 20px;
        &:last-child {
          margin-bottom: 0;
        }
      }
      .decomposition-item {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100px;
        height: 100px;
        border: 1px solid #DDDDDD;
        box-sizing: border-box;
        border-radius: 15px;
        font-size: 44px;
        line-height: 65px;
        color: #999999;
        position: relative;
        margin: 0 20px 10px 25px;
        &::after {
          content: '+';
          position: absolute;
          right: -30px;
          font-size: 24px;
        }
        @media (max-width: 480px)  {
          width: 90px;
          height: 90px;
        }
        @media (max-width: 450px)  {
          width: 80px;
          height: 80px;
        }
      }
      .composition-text {
        .decomposition-item::after {
          content: '=';
        }
      }
      .decomposition-container {
        display: flex;
        .decomposition-item:last-child::after {
          display: none;
        }
      }
    }
    .sample-sentence-section {
      font-size: 18px;
      .content {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        @media (max-width: 768px)  {
          flex-direction: column;
          align-items: flex-start;
        }
      }
      .sample-sentence-card {
        margin-top: 15px;
        &:first-child {
          margin-top: 0;
        }
      }
      .sentence-content {
        flex: 1;
        .simplified-sentence {
          font-size: 30px;
          @media (max-width: 768px)  {
            font-size: 24px;
          }
        }
        @media (max-width: 768px)  {
          width: 100%;
          margin-bottom: 10px;
        }
      }
      .action-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 280px;
        @media (max-width: 768px)  {
          width: 100%;
          flex-direction: column;
        }
      }
      .sub-action-buttons {
        display: flex;
        flex-direction: column;
        flex: 1;
        @media (max-width: 576px)  {
          width: 100%;
          flex-direction: row;
          justify-content: space-between;
        }
        button {
          padding-top: 3px;
          padding-bottom: 3px;
          width: 100%;
          @media (max-width: 576px)  {
            width: 48%;
            margin-right: 0;
          }
          &.btn-play {
            display: none;
            @media (max-width: 576px)  {
              display: block;
            }
          }
        }
        a {
          padding-top: 3px;
          padding-bottom: 3px;
          width: 100%;
          @media (max-width: 576px)  {
            width: 48%;
            margin-right: 0;
          }
        }
      }
    }
    h4.section-title {
      font-weight: 500;
      color: #000;
      margin-bottom: 20px;
      padding-left: 1.5rem;
      span {
        color: #999999;
      }
      @media (max-width: 768px)  {
        padding-left: 0;
      }
    }
    button {
      border-radius: 15px;
      border: 1px solid #CCCCCC;
      font-size: 12px;
      font-weight: normal;
      &.btn-outline-default {
        color: #000;
      }
      @media (max-width: 576px)  {
        margin-top: 10px;
      }
      &.btn-play {
        width: 102px;
        height: 102px;
        padding-top: 25px;
        padding-bottom: 10px;
        @media (max-width: 576px)  {
          width: 100%;
          height: fit-content;
          padding: 4px 0;
        }
      }
      &.btn-download {
        padding: 4px 0;
        @media (max-width: 576px)  {
          width: 150px;
        }
      }
      i.play {
        font-size: 40px;
        @media (max-width: 576px)  {
          font-size: 12px;
          padding-right: .75em;
        }
      }
      &:hover {
        color: #FFF;
      }
    }
    .link-button {
      border-radius: 15px;
      border: 1px solid #CCCCCC;
      font-size: 12px;
      font-weight: normal;
      &.btn-outline-default {
        color: #000;
      }
      @media (max-width: 576px)  {
        margin-top: 10px;
      }
      &.btn-play {
        width: 102px;
        height: 102px;
        padding-top: 25px;
        padding-bottom: 10px;
        @media (max-width: 576px)  {
          width: 150px;
          height: fit-content;
          padding: 4px 0;
        }
      }
      &.btn-download {
        padding: 4px 0;
        @media (max-width: 576px)  {
          width: 150px;
        }
      }
      i.play {
        font-size: 40px;
        @media (max-width: 576px)  {
          font-size: 12px;
          padding-right: .75em;
        }
      }
      &:hover {
        color: #FFF;
      }
    }
  }
</style>
