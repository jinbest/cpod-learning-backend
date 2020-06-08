<template>
  <div class="bg-lighter lesson-page">
    <section class="section section-sm pt-4 row align-items-center">
      <div class="col-lg-3">
        <aside-item title="Lesson Title" class="invisible-tablet">
          Here you will always see the title of the lesson and you will easily understand whether it is relevant to you.
        </aside-item>
      </div>
      <div class="col-lg-6">
        <div class="main-content">
          <div class="text-center">
            <p class="lesson-title mb-0">{{ lessonInfo.title }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section section-sm row align-items-center lesson-image-container reverse-tablet">
      <div class="col-lg-6 offset-lg-3">
        <div class="main-content">
          <img :src="lessonInfo.thumbnail" class="img-fluid img-full-width">
        </div>
      </div>
      <div class="col-lg-3">
        <aside-item title="Hosts" type="right">
          Our leading excellent professionals have established themselves as the best teachers of the Chinese language,
          each of them has a higher education as a teacher of the Chinese language and has been practicing in China for at least two years or is a native speaker.
        </aside-item>
      </div>
    </section>

    <section class="section section-sm row align-items-center">
      <div class="col-lg-3">
        <aside-item title="Lesson Introduction text">
          A brief description of the lesson will always tell you the context of the lesson. And you will always be in the subject of the lesson.
        </aside-item>
      </div>
      <div class="col-lg-6">
        <card shadow class="main-content lesson-introduction-card">
          <div class="introduction-header">
            <div class="title">
              IN THIS LESSON
            </div>
            <div class="lesson-info">
              <badge type="success">ID: {{ lessonInfo.id }}</badge>
              <badge type="success">{{ lessonInfo.level }}</badge>
            </div>
          </div>
          <div class="lesson-introduction">
            {{ lessonInfo.introduction }}
          </div>
          <div class="introduction-copyright text-right">
            {{ lessonInfo.publishDate }} | {{ lessonInfo.hosts }}
          </div>
        </card>
      </div>
    </section>

    <section class="section section-sm row align-items-center reverse-tablet">
      <div class="col-lg-6 offset-lg-3">
        <div class="main-content">
          <img src="/img/lessons/lesson_hero.png" class="img-fluid img-full-width">
        </div>
      </div>
      <div class="col-lg-3">
        <aside-item title="Lesson Audio/Video Samples" type="right">
          Our lessons contain live communication in Chinese in video and audio format.
          We have four categories: Video Tutorial, Audio Tutorial, Dialogue, and Browse.
          You will help you more accurately understand each aspect of this lesson.
        </aside-item>
      </div>
    </section>

    <section class="section section-sm row align-items-center">
      <div class="col-lg-3">
        <aside-item title="Vocabulary">
          You can also consider translating the most basic words used in the dialogue and not miss anything.
        </aside-item>
      </div>
      <div class="col-lg-6">
        <card shadow class="main-content vocabulary-card">
          <table class="table vocabulary-table mb-0">
            <thead>
              <tr>
                <th class="text-center">SIMPLIFIED</th>
                <th class="text-center">PINYIN</th>
                <th class="text-center">ENGLISH</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(vocabulary, index) in vocabularies" :key="index">
                <td class="text-center">{{ vocabulary.simplified }}</td>
                <td class="text-center">{{ vocabulary.pinyin }}</td>
                <td class="text-center">{{ vocabulary.english }}</td>
                <td class="td-actions text-center">
                  <play-audio-button v-if="vocabulary.audioUrl" :audio-url="vocabulary.audioUrl" />
                </td>
              </tr>
            </tbody>
          </table>
        </card>
      </div>
    </section>

    <section class="section section-sm row align-items-center reverse-tablet">
      <div class="col-lg-6 offset-lg-3">
        <card class="main-content sentences-card" shadow header-classes="sentences-header-class bg-white border-0">
          <template>
            <div class="sentences" v-for="(sentence, index) in sentences" :key="index">
              <div class="sentence chinese">
                <span>{{ sentence.simplified }}</span>
                <play-audio-button v-if="sentence.audioUrl" :audio-url="sentence.audioUrl" />
              </div>

              <div class="sentence">
                <span>{{ sentence.pinyin }}</span>
              </div>

              <div class="sentence border-0">
                <span>{{ sentence.english }}</span>
              </div>
            </div>
          </template>
        </card>
      </div>
      <div class="col-lg-3">
        <aside-item title="Sentences" type="right">
          You can study the translation of individual phrases and test yourself by listening to them and view the translation.
        </aside-item>
      </div>
    </section>

    <section class="section section-sm row align-items-center">
      <div class="col-lg-3">
        <aside-item title="Try for free">
          Try a free registration to familiarize yourself with ChinesePod
        </aside-item>
      </div>
      <div class="col-lg-6">
        <card class="main-content signup-form-card" shadow>
          <template>
            <form role="form" class="mt-3 mb-3">
              <div class="row justify-content-center">
                <div class="col-sm-10 col-md-8 col-xl-6">
                  <base-input alternative
                            type="email"
                            class="mb-4"
                            placeholder="Email"
                            addon-left-icon="ni ni-email-83"
                            v-model="email">
                  </base-input>
                  <base-input alternative
                            type="password"
                            class="mb-4"
                            placeholder="Password"
                            addon-left-icon="ni ni-email-83"
                            v-model="password">
                  </base-input>
                  <base-checkbox class="mb-4" v-model="isRememberMe">
                    Remember Me
                  </base-checkbox>
                  <base-button type="primary" class="mb-2" block>Sign up</base-button>

                  <div class="text-muted text-center mb-1">
                    <small>Forgot Password</small>
                  </div>
                  <div class="text-muted text-center mb-1">
                    <small>- or -</small>
                  </div>
                  <div class="text-muted text-center">
                    <small>Sign up with</small>
                  </div>
                  <hr class="my-4" />

                  <a href="https://www.chinesepod.com/api/v1/auth/google">
                    <base-button type="neutral" block class="mb-4">
                      <img slot="icon" src="/argon/img/icons/common/google.svg">
                      Google
                    </base-button>
                  </a>

                  <a href="https://www.chinesepod.com/api/v1/auth/facebook">
                    <base-button type="neutral" block>
                      <img slot="icon" src="/argon/img/icons/common/facebook.svg">
                      Facebook
                    </base-button>
                  </a>
                </div>
              </div>
            </form>
          </template>
        </card>
      </div>
    </section>

  </div>
</template>

<script>
  import { sendGet } from '@/util/api'
  import util from '@/util'
  import PlayAudioButton from '@/components/custom-components/PlayAudioButton'
  export default {
    name: "lessons",
    layout: 'default',
    components: { PlayAudioButton },
    data() {
      return {
        email: '',
        password: '',
        isRememberMe: false
      };
    },
    async asyncData ({ params, error, payload, redirect }) {
      const { data } = await sendGet('/lessons/get-details', { slug: params.slug })
        .catch(() => redirect('https://www.chinesepod.com'));
      const vocabularies = data.vocabulary.map(vocabulary => vocabulary)
      const sentences = data.dialogue.map(sentence => sentence)
      return {
        lessonInfo: {
          id: data.lessonInfo.id,
          title: data.lessonInfo.title,
          level: data.lessonInfo.level,
          introduction: data.lessonInfo.introduction,
          publishDate: util.formatDateTime(data.lessonInfo.publication_timestamp, 'ddd MMM DD YYYY'),
          hosts: data.lessonInfo.hosts.split(',').join(', '),
          thumbnail: data.lessonInfo.image
        },
        vocabularies,
        sentences
      }
    },
  };
</script>

<style lang="scss">
  .lesson-page {
    @media (max-width: 992px) {
      padding-left: 30px;
      padding-right: 30px;
    }
    @media (max-width: 576px) {
      padding-left: 15px;
      padding-right: 15px;
    }
    section {
      @media (max-width: 992px) {
        &.reverse-tablet {
          flex-direction: column-reverse;
        }
        .invisible-tablet {
          display: none;
        }
      }
    }
    .card {
      border-radius: 10px;
    }
    .main-content {
      margin-left: 20px;
      margin-right: 20px;
      .img-full-width {
        width: 100%;
      }
      @media (max-width: 992px) {
        margin-left: 0;
        margin-right: 0;
      }
    }
    .lesson-title {
      font-size: 30px;
      font-weight: bold;
      color: #32325D;
    }
    .lesson-image-container {
      margin-top: -90px;
      @media (max-width: 992px) {
        margin-top: 0;
        padding-top: 0;
      }
    }
    .lesson-introduction-card {
      .introduction-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .title {
          font-size: 16px;
          font-weight: bold;
          line-height: 19px;
          color: #8898AA;
        }
        .lesson-info {
          .badge-success {
            padding: 6px 10px;
            color: #FFF;
            background: #35C567;
            font-size: 12px;
          }
        }
      }
      .lesson-introduction {
        margin-top: 20px;
        font-size: 18px;
        line-height: 150%;
      }
      .introduction-copyright {
        margin-top: 10px;
        color: #8898AA;
        font-size: 14px;
        line-height: 16px;
      }
    }
    .vocabulary-card {
      .card-body {
        padding: 0;
      }
      table.vocabulary-table {
        thead th {
          padding: 10px 0;
          border-bottom: 0 solid #dee2e6;
          font-size: 12px;
          @media (max-width: 576px) {
            &:first-child {
              padding-left: 10px;
            }
          }
        }
        td {
          vertical-align: middle;
          border-top: 1px solid #dee2e6;
        }
        .td-actions {
          width: 50px;
          padding: 10px 0;
        }
      }
    }
    .sentences-card {
      .card-body {
        padding: 0;
      }
      .sentences-header-class {
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        padding: 10px 20px 0;
        font-size: 28px;
        font-weight: bold;
        color: #32325D;
      }
      .sentences {
        margin: 10px 20px 20px;
        background: #e9ecef;
        border-radius: 10px;
        &:last-child {
          margin-bottom: 5px;
        }
        .sentence {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 12px 10px;
          border-bottom: 1px solid #dee2e6;
          &.chinese {
            span {
              font-size: 20px;
            }
          }
          button {
            width: 32px !important;
          }
        }
      }
    }
    .signup-form-card {
      .custom-checkbox {
        padding-left: 30px;
        .custom-control-label::before,
        .custom-control-label::after {
          left: -30px;
          top: 0px;
        }
      }
      input {
        color: #000;
      }
    }
  }
</style>
