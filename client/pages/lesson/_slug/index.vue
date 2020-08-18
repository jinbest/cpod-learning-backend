<template>
  <div class="bg-lighter lesson-page">
    <section class="section section-sm pt-4 row align-items-center">
      <div class="col-lg-3">
        <aside-item title="Relevant Content" class="invisible-tablet" icon="fas fa-exclamation">
          We'll always make sure you know exactly what the lesson is about. You will easily understand whether it is relevant for you.
        </aside-item>
      </div>
      <div class="col-lg-6">
        <div class="main-content pb-lg-3">
          <div class="text-center">
            <p class="lesson-title mb-0">{{ lessonInfo.title }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section section-sm row align-items-center lesson-image-container reverse-tablet">
      <div class="col-lg-6 offset-lg-3">
        <div class="main-content">
          <a href="#signup">
            <img :src="lessonInfo.thumbnail" class="img-fluid img-full-width floating-lg">
          </a>
        </div>
      </div>
      <div class="col-lg-3">
        <aside-item title="Great Hosts" type="right">
          Here at ChinesePod, all our lessons are presented in an entertaining manner by our great hosts. You'll find language learners, teachers, and even professors sharing their insights, ideas, and teaching methods in our video and audio lessons.
          <!--          Our teachers have established themselves as the best teachers of the Chinese language,-->
          <!--          each of them has a higher education as a teacher of the Chinese language and has been practicing in China for at least two years or is a native speaker.-->
        </aside-item>
      </div>
    </section>

    <section class="section section-sm row align-items-center">
      <div class="col-lg-3">
        <aside-item title="Brief Lesson Summaries" icon="fas fa-info-circle">
          A brief introduction of the lesson will always tell you what this lesson is about and what language level is the intended target.
          If you're interested in the subject, but might not be able to understand it in full, fear not; we have transcripts of lesson dialogues vocabulary so you can follow along.
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
          <div class="lesson-introduction" v-html="lessonInfo.introduction">
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
          <a href="#signup">
            <img src="/img/lessons/lesson_hero_alt.png" class="img-fluid img-full-width floating">
          </a>
        </div>
      </div>
      <div class="col-lg-3">
        <aside-item title="Awesome Materials" type="right" icon="fas fa-book">
          Our lessons contain <strong>natural communication</strong> in Chinese in video and audio format.
          We have have lessons focused on video or a podcast format and our lessons have transcripts of Lesson Dialogues, Important Vocabulary, Expanded Materials for a deep dive into the lesson topic and Exercises focused on testing your retention.
        </aside-item>
      </div>
    </section>

    <section v-if="vocabularies.length > 0" class="section section-sm row align-items-center">
      <div class="col-lg-3">
        <aside-item title="Detailed Vocabulary" icon="fas fa-quote-right">
          Each lesson has it's unique vocabulary and will provide you with definitions and recordings so you can practice the pronunciation.
          You will also be able to grasp the core material of a lesson at a glance. Here we're showing you the Simplified Chinese version.
        </aside-item>
      </div>
      <div class="col-lg-6">
        <card shadow class="main-content vocabulary-card p-2">
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

    <section v-if="sentences.length > 0" class="section section-sm row align-items-center reverse-tablet">
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
        <aside-item title="Natural Dialogues" type="right" icon="fas fa-comments">
          Each lesson is centered around a natural dialogue with key vocabulary directly prepared and translated for your use. You can also <strong>listen to each sentence as an individual recording</strong> to improve your listening and comprehension skills.
        </aside-item>
      </div>
    </section>

    <section id="signup" class="section section-sm row align-items-center">
      <div class="col-lg-3">
        <aside-item title="Try For Free" icon="fas fa-star">
          ChinesePod is <strong>100% Free to Try</strong>. Create an account today and get started!
        </aside-item>
      </div>
      <div class="col-lg-6">
        <card class="main-content signup-form-card" shadow>
          <template>
            <h2 class="text-center py-3">Sign Up</h2>
            <div class="mt-3 mb-3">
              <div class="row justify-content-center">
                <div class="col-sm-10 col-md-8 col-xl-6">
                  <base-input
                    type="email"
                    class="mb-4"
                    placeholder="Email"
                    :error="emailError"
                    addon-left-icon="ni ni-email-83"
                    @keyup.enter="signUp"
                    v-model="email">
                  </base-input>
                  <p v-show="emailError === 'There might already be an account with this email.'" class="py-2">If you already have an account, please go to <br/> <a href="https://www.chinesepod.com/login">Login Page</a> instead.</p>
                  <base-checkbox class="mb-4" v-model="optIn">
                    I want to hear the latest news from ChinesePod.
                  </base-checkbox>
                  <base-button :disabled="loading" type="primary" class="mb-2" block @click.prevent="signUp">Sign up</base-button>
                  <small>By signing up, you agree to the <a href="https://www.chinesepod.com/privacy">Privacy Policy</a> and <a href="https://www.chinesepod.com/terms">Terms</a> of Service of ChinesePod LLC.</small>
                  <div class="text-muted text-center pt-3 mb-1">
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
            </div>
          </template>
        </card>
      </div>
    </section>

  </div>
</template>

<script>
  import { sendGet, sendPost } from '@/util/api'
  import util from '@/util'
  import PlayAudioButton from '@/components/custom-components/PlayAudioButton'
  export default {
    name: "lessons",
    layout: 'default',
    components: { PlayAudioButton },
    validate({params}) {
      return params.slug && typeof params.slug === 'string'
    },
    data() {
      return {
        email: '',
        password: '',
        optIn: true,
        isRememberMe: false,
        emailError: '',
        loading: false
      };
    },
    head() {
      return {
        title: `${this.lessonInfo.title} | Lesson | ChinesePod.com`,
        meta: [
          {hid: 'description', name: 'description', content: `${this.lessonInfo.level} ChinesePod Lesson: ${this.lessonInfo.introduction}`}
        ]
      }
    },
    async asyncData ({ params, error, payload, redirect }) {
      const response = await sendGet('/lessons/get-details', { slug: params.slug })
        .catch(() => redirect('https://www.chinesepod.com'));

      if (!response) {
        redirect('https://www.chinesepod.com')
        return
      }

      const data = response.data
      if (!data) {
        redirect('https://www.chinesepod.com')
        return
      }

      try {

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
      } catch (e) {
        redirect('https://www.chinesepod.com')
      }
    },
    methods: {
      validateEmail (email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
      },
      async signUp () {
        this.loading = true;
        this.emailError = '';
        if(!this.validateEmail(this.email)) {
          this.emailError = 'Please enter a valid email.'
          this.loading = false;
          return
        }

        await sendPost('/entrance/signup', {
          emailAddress: this.email,
          optIn: this.optIn
        })
        .then(() => {
          window.location.href = 'https://www.chinesepod.com/home'
        })
        .catch((e) => {
          const errorData = e.response;
          if (errorData.status === 409) {
            this.emailError = `There might already be an account with this email.`
          } else {
            this.emailError = `Something went wrong. If this happens again, please contact support@chinesepod.com.`
          }
        })
        this.loading = false;
      }
    }
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
      padding: 1rem 0;
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
