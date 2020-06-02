<template>
  <div class="bg-lighter vocabulary-page">
    <section class="section main-word-section">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-sm-6">
            <div class="main-word">鱼 (魚)</div>
            <div class="pronounciation">
              <div>yú</div>
              <div class="pronounciation-comment">Pinyin</div>
            </div>
          </div>

          <div class="col-sm-6 animation-audio-container">
            <div class="animation">
              <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" id="grid-background-target" preserveAspectRatio="none">
                <line x1="0" y1="0" x2="200" y2="200" class="line" />
                <line x1="200" y1="0" x2="0" y2="200" class="line" />
                <line x1="100" y1="0" x2="100" y2="200" class="line" />
                <line x1="0" y1="100" x2="200" y2="100" class="line" />
              </svg>
            </div>

            <div class="audio-buttons mr-4">
              <base-button outline class="text-center text-capitalize btn-play mr-sm-0">
                <i class="fa fa-play mr-0 play" /><br />
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
          <ol>
            <li>
              fish
              <div class="content pt-2">
                <div class="chinese-sentence">昨天妈妈买了几条活鱼。</div>
                <div class="english-sentence">My mother bought several live fish yesterday.</div>
              </div>
            </li>
            <li>meaning component <span>(fish, fresh)</span></li>
            <li>radical <span>(Kang Xi 195)</span></li>
          </ol>
        </card>
      </div>
    </section>

    <section class="section section-sm decomposition-section">
      <div class="container">
        <h4 class="section-title">Character Decomposition</h4>
        <card shadow>
          <div class="content">
            <div class="composition-text">
              <div class="decomposition-item ml-0">
                鱼
              </div>
            </div>

            <div class="decomposition-container">
              <div class="decomposition-item">
                ⺈
              </div>

              <div class="decomposition-item">
                田
              </div>

              <div class="decomposition-item">
                一
              </div>
            </div>
          </div>
        </card>
      </div>
    </section>

    <section class="section section-sm compounds-section">
      <div class="container">
        <h4 class="section-title">Compounds <span>({{ compoundsList.length }})</span></h4>
        <collapse-table-card :data="compoundsList" />
      </div>
    </section>

    <section class="section section-sm">
      <div class="container">
        <h4 class="section-title">Related Words <span>({{ relatedWordsList.length }})</span></h4>
        <collapse-table-card :data="relatedWordsList" />
      </div>
    </section>

    <section class="section section-sm">
      <div class="container">
        <h4 class="section-title">Idioms <span>({{ idiomsList.length }})</span></h4>
        <collapse-table-card :data="idiomsList" />
      </div>
    </section>

    <section class="section section-sm sample-sentence-section">
      <div class="container">
        <h4 class="section-title">Sample Sentences</h4>
        <card shadow class="sample-sentence-card" v-for="(sentence, index) in sampleSentenceList" :key="index">
          <div class="content">
            <div class="sentence-content">
              <div class="simplified-sentence">{{ sentence.simplified }}</div>
              <div class="pinyin-sentence">{{ sentence.pinyin }}</div>
              <div class="english-sentence">{{ sentence.english }}</div>
            </div>
            <div class="action-content">
              <base-button outline class="text-center text-capitalize btn-play mr-sm-4">
                <i class="fa fa-play mr-0 play" /><br />
                Play
              </base-button>
              <div class="sub-action-buttons">
                <base-button class="text-capitalize" :type="getButtonType(sentence.type)">
                  {{ sentence.type }}
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
  import CollapseTableCard from './collapse-table-card'
  export default {
    name: "vocabulary",
    layout: 'default',
    components: {
      CollapseTableCard
    },
    data() {
      return {
        compoundsList: [
          { simplified: '鲁', pinyin: 'lǔ', english: 'crass; stupid; rude' },
          { simplified: '鲜', pinyin: 'xiān', english: 'fresh; bright (in color); delicious; tasty; delicacy; aquatic foods' },
          { simplified: '鲜', pinyin: 'xiǎn', english: 'few; rare' },
          { simplified: '鲍', pinyin: 'bào', english: 'abalone' },
          { simplified: '渔', pinyin: 'yú', english: 'fisherman; to fish' },
          { simplified: '鲜', pinyin: 'xiān', english: 'fresh; bright (in color); delicious; tasty; delicacy; aquatic foods' },
          { simplified: '鲜', pinyin: 'xiǎn', english: 'few; rare' },
          { simplified: '鲍', pinyin: 'bào', english: 'abalone' },
          { simplified: '渔', pinyin: 'yú', english: 'fisherman; to fish' }
        ],

        relatedWordsList: [
          { simplified: '魣鱼', pinyin: 'yú yú', english: 'perch' },
          { simplified: '鱼丸', pinyin: 'yú wán', english: 'fish ball' },
          { simplified: '鱼刺', pinyin: 'yú cì', english: 'fishbone' },
          { simplified: '鱼叉', pinyin: 'yú chā', english: 'harpoon' },
          { simplified: '鱼夫', pinyin: 'yú fū', english: 'fisher; fisherman' },
          { simplified: '鱼刺', pinyin: 'yú cì', english: 'fishbone' },
          { simplified: '鱼叉', pinyin: 'yú chā', english: 'harpoon' },
          { simplified: '鱼夫', pinyin: 'yú fū', english: 'fisher; fisherman' },
          { simplified: '魣鱼', pinyin: 'yú yú', english: 'perch' },
          { simplified: '鱼丸', pinyin: 'yú wán', english: 'fish ball' },
          { simplified: '鱼刺', pinyin: 'yú cì', english: 'fishbone' },
          { simplified: '鱼叉', pinyin: 'yú chā', english: 'harpoon' },
          { simplified: '鱼夫', pinyin: 'yú fū', english: 'fisher; fisherman' }
        ],

        idiomsList: [
          { simplified: '鱼死网破', pinyin: 'yú sǐ wǎng pò', english: '(lit.) either the fish dies or the net splits; a life and death struggle (idiom)' },
          { simplified: '鱼水之欢', pinyin: 'yú shuǐ zhī huān', english: 'the pleasure of close intimacy in a couple (idiom); sexual intercourse' },
          { simplified: '鱼沉雁杳', pinyin: 'yú chén yàn yǎo', english: '(lit.) the fish sinks, the goose vanishes into the distance (idiom); a letter does not arrive; lost in transmission' },
          { simplified: '鱼目混珠', pinyin: 'yú mù hùn zhū', english: 'to pass off fish eyes for pearls; to pass off fake products as genuine (idiom)' },
          { simplified: '鱼沉雁杳', pinyin: 'yú chén yàn yǎo', english: '(lit.) fish and dragons mixed in together (idiom); fig. crooks mixed in with the honest folk' },
          { simplified: '鱼水之欢', pinyin: 'yú shuǐ zhī huān', english: 'the pleasure of close intimacy in a couple (idiom); sexual intercourse' },
          { simplified: '鱼沉雁杳', pinyin: 'yú chén yàn yǎo', english: '(lit.) the fish sinks, the goose vanishes into the distance (idiom); a letter does not arrive; lost in transmission' },
          { simplified: '鱼目混珠', pinyin: 'yú mù hùn zhū', english: 'to pass off fish eyes for pearls; to pass off fake products as genuine (idiom)' },
          { simplified: '鱼沉雁杳', pinyin: 'yú chén yàn yǎo', english: '(lit.) fish and dragons mixed in together (idiom); fig. crooks mixed in with the honest folk' },
          { simplified: '鱼死网破', pinyin: 'yú sǐ wǎng pò', english: '(lit.) either the fish dies or the net splits; a life and death struggle (idiom)' },
          { simplified: '鱼水之欢', pinyin: 'yú shuǐ zhī huān', english: 'the pleasure of close intimacy in a couple (idiom); sexual intercourse' },
          { simplified: '鱼沉雁杳', pinyin: 'yú chén yàn yǎo', english: '(lit.) the fish sinks, the goose vanishes into the distance (idiom); a letter does not arrive; lost in transmission' },
          { simplified: '鱼目混珠', pinyin: 'yú mù hùn zhū', english: 'to pass off fish eyes for pearls; to pass off fake products as genuine (idiom)' },
          { simplified: '鱼沉雁杳', pinyin: 'yú chén yàn yǎo', english: '(lit.) fish and dragons mixed in together (idiom); fig. crooks mixed in with the honest folk' },
          { simplified: '鱼水之欢', pinyin: 'yú shuǐ zhī huān', english: 'the pleasure of close intimacy in a couple (idiom); sexual intercourse' },
          { simplified: '鱼沉雁杳', pinyin: 'yú chén yàn yǎo', english: '(lit.) the fish sinks, the goose vanishes into the distance (idiom); a letter does not arrive; lost in transmission' },
          { simplified: '鱼目混珠', pinyin: 'yú mù hùn zhū', english: 'to pass off fish eyes for pearls; to pass off fake products as genuine (idiom)' },
          { simplified: '鱼沉雁杳', pinyin: 'yú chén yàn yǎo', english: '(lit.) fish and dragons mixed in together (idiom); fig. crooks mixed in with the honest folk' },
        ],

        sampleSentenceList: [
          { simplified: '我喜欢吃鱼。', pinyin: 'wǒ xǐhuan chī yú。', english: 'I like to eat fish.', audioUrl: 'https://test.audio.com/audio1.mp3', type: 'Newbie' },
          { simplified: '他不喜欢吃鱼。', pinyin: 'tā bù xǐhuan chī yú。', english: 'He doesn\'t like to eat fish.', audioUrl: 'https://test.audio.com/audio2.mp3', type: 'Intermediate' },
          { simplified: '西湖醋鱼。', pinyin: 'Xīhúcùyú。', english: 'West Lake Vinegar Fish.', audioUrl: 'https://test.audio.com/audio3.mp3', type: 'Elementary' },
          { simplified: '我要吃鱼！', pinyin: 'wǒ yào chī yú！', english: 'I would like to have some fish.', audioUrl: 'https://test.audio.com/audio4.mp3', type: 'Newbie' },
        ]
      };
    },
    mounted() {
      const writer = HanziWriter.create('grid-background-target', '我', {
        width: 200,
        height: 200,
        padding: 5,
        delayBetweenLoops: 3000
      })

      document.getElementById('grid-background-target').addEventListener('click', () => {
        writer.animateCharacter()
      })
    },
    methods: {
      getButtonType(type) {
        if (type === 'Newbie') return 'primary'
        if (type === 'Intermediate') return 'warning'
        if (type === 'Elementary') return 'success'
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
          .line {
            stroke: #DDD;
            stroke-dasharray: 2 2;
          }
        }
        .audio-buttons {
          display: flex;
          flex-direction: column;
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
    }
    .definition-section {
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
          padding-top: 24px;
          &:first-child {
            padding-top: 0;
          }
        }
      }
    }
    .decomposition-section {
      .content {
        display: flex;
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
        margin-left: 25px;
        margin-right: 20px;
        &::after {
          content: '+';
          position: absolute;
          right: -30px;
          font-size: 24px;
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
        align-items: center;
      }
      .sample-sentence-card {
        margin-top: 15px;
        &:first-child {
          margin-top: 0;
        }
      }
      .simplified-sentence {
        font-size: 30px;
      }
      .action-content {
        display: flex;
        align-items: center;
      }
      .sub-action-buttons {
        display: flex;
        flex-direction: column;
        button {
          padding-top: 3px;
          padding-bottom: 3px;
          width: 100%;
        }
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
      &.btn-play {
        width: 102px;
        height: 102px;
        padding-top: 25px;
        padding-bottom: 10px;
      }
      &.btn-download {
        padding: 4px 0;
      }
      i.play {
        font-size: 40px;
      }
      &:hover {
        color: #FFF;
      }
    }
  }
</style>
