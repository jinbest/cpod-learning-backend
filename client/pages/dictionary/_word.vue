<template>
  <div class="bg-lighter vocabulary-page">
    <section class="section main-word-section">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-6 col-sm-5 col-lg-6">
            <div class="main-word">{{ simplified }} ({{ traditional }})</div>
            <div class="pronounciation">
              <div>{{ pinyin }}</div>
              <div class="pronounciation-comment">Pinyin</div>
            </div>
          </div>

          <div class="col-6 col-sm-7 col-lg-6 animation-audio-container">
            <div class="animation" id="animation-hanz-container">
              <svg class="grid-background" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%" id="grid-background-target" preserveAspectRatio="xMidYMid meet">
                <line x1="0" y1="0" x2="200" y2="200" class="line" />
                <line x1="200" y1="0" x2="0" y2="200" class="line" />
                <line x1="100" y1="0" x2="100" y2="200" class="line" />
                <line x1="0" y1="100" x2="200" y2="100" class="line" />
              </svg>
            </div>

            <div class="audio-buttons mr-md-4">
              <base-button outline class="text-center text-capitalize btn-play mr-0">
                <i class="fa fa-play mr-0 pb-sm-2 play" /><br class="d-none d-sm-inline-block" />
                Play
              </base-button>
              <base-button outline class="text-capitalize btn-download mt-sm-2" icon="fa fa-download">
                Download
              </base-button>
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
              <div class="simplified pr-3">{{ definition.simplified }} ({{ definition.traditional }})</div>&nbsp;-&nbsp;
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
            <div class="composition" v-for="(decomposition, index) in decompositionList" :key="index">
              <div class="composition-text">
                <div class="decomposition-item ml-0">
                  {{ decomposition.character }}
                </div>
              </div>

              <div class="decomposition-container row ml-0">
                <div class="decomposition-item" v-for="(item, index1) in decomposition.components" :key="index1">
                  {{ item }}
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
        <collapse-table-card :data="compoundsList" />
      </div>
    </section>

    <section  v-if="relatedWordsList.length > 0" class="section section-sm">
      <div class="container">
        <h4 class="section-title">Related Words <span>({{ relatedWordsList.length }})</span></h4>
        <collapse-table-card :data="relatedWordsList"/>
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
              <div class="simplified-sentence">{{ sentence.simplified }}</div>
              <div class="pinyin-sentence pt-2">{{ sentence.pinyin }}</div>
              <div class="english-sentence pt-3">{{ sentence.english }}</div>
            </div>
            <div class="action-content">
              <base-button outline class="text-center text-capitalize btn-play mr-sm-4 d-none d-sm-inline-block">
                <i class="fa fa-play mr-0 play" /><br />
                Play
              </base-button>
              <div class="sub-action-buttons">
                <base-button outline class="text-center text-capitalize btn-play mr-sm-4">
                  <i class="fa fa-play mr-0 play" /><br class="d-none d-sm-inline-block" />
                  Play
                </base-button>
                <base-button class="text-capitalize" :type="getButtonType(sentence.lessonInfo && sentence.lessonInfo.level)">
                  {{ sentence.lessonInfo && sentence.lessonInfo.level }}
                </base-button>
                <base-button outline class="text-capitalize mt-sm-2">
                  Go to Lesson&nbsp;<i class="fa fa-angle-right" />
                </base-button>
                <base-button outline class="text-capitalize mt-sm-2" icon="fa fa-download">
                  Download
                </base-button>
              </div>
            </div>
          </div>
        </card>
      </div>
    </section>
  </div>
</template>

<script>
  import HanziWriter from 'hanzi-writer'
  import { sendGet } from '@/util/api'
  import CollapseTableCard from './collapse-table-card'
  export default {
    name: "dictionary",
    layout: 'default',
    components: {
      CollapseTableCard
    },
    data() {
      return {
        writer: null
      };
    },
    async asyncData ({ params, error, payload, redirect }) {
      const word = params.word
      const { data } = await sendGet('/dictionary/get-details', { word })
        .catch(() => redirect('https://www.chinesepod.com'));

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
        const animationCharacters = Array.from(word)

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
        redirect('https://www.chinesepod.com')
      }

    },
    mounted() {
      this.writer = HanziWriter.create('animation-hanz-container', this.animationCharacters[0], {
        padding: 5,
        delayBetweenLoops: 3000
      })

      document.getElementById('animation-hanz-container').addEventListener('click', () => {
        this.playAnimation(0, true)
      })
    },
    methods: {
      getButtonType(type) {
        if (type === 'Newbie') return 'primary'
        if (type === 'Intermediate') return 'warning'
        if (type === 'Elementary') return 'success'
        return 'danger'
      },
      playAnimation(index, isStartAnimation = false) {
        this.writer.setCharacter(this.animationCharacters[index])

        if (index === 0 && !isStartAnimation) return

        this.writer.animateCharacter({
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
        @media (max-width: 768px)  {
          width: 100%;
          justify-content: space-between;
        }
      }
      .sub-action-buttons {
        display: flex;
        flex-direction: column;
        @media (max-width: 576px)  {
          width: 100%;
          flex-wrap: wrap;
          flex-direction: unset;
          justify-content: space-around;
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
