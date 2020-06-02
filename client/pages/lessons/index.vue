<template>
  <div class="bg-lighter">
    <section class="section section-sm">
      <div class="container">
        <div class="row row-grid align-items-center">
          <div class="col-12">
            <div class="text-center">
              <icon name="fa fa-user" class="mb-5" size="lg" type="light" shadow
                    rounded></icon>
              <h1>Lesson Title</h1>
              <p>Lesson Description</p>
            </div>
          </div>
          <div class="col-12 mt-1">
            <img src="/img/lessons/lesson_materials.png" class="img-fluid floating">
          </div>
        </div>
      </div>
    </section>
    <section class="section section-sm">
      <div class="container">
        <div class="row row-grid align-items-center">
          <div class="col-12">
            <div class="text-center">
              <icon name="fa fa-user" class="mb-5" size="lg" type="light" shadow
                    rounded></icon>
              <h3>Dialogues</h3>
              <p>Each of our lessons comes packed with dialogue recordings and sentence transcripts.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section section-sm">
      <div class="container">
        <div class="row row-grid align-items-center">
          <div class="col-12">
            <div class="text-center">
              <icon name="ni ni-lg icon-vocabulary" class="mb-5" size="lg" type="light" shadow
                    rounded></icon>
              <h3>Vocabulary</h3>
              <p>Every lesson will teach you new words and help your long-term retention.
                We record key vocabulary separately; so you can really focus on the pronunciation.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section section-sm">
      <div class="container">
        <div class="row row-grid align-items-center">
          <div class="col-md-6 order-md-2">
            <img src="/img/lessons/lesson_sentences.png" class="img-fluid floating">
            <img src="/img/lessons/lesson_vocabulary.png" class="img-fluid floating">
          </div>
          <div class="col-md-6 order-md-1">
            <div class="pr-md-5">
              <icon name="ni ni-settings-gear-65" class="mb-5" size="lg" type="success" shadow
                    rounded></icon>
              <h3>Awesome features</h3>
              <p>Our lessons are packed with examples, recordings, exercises and much, much more!
                You can focus your learning experience on achieving a specific language goal or just focus on
                lessons about a topic you're interested in.</p>
              <ul class="list-unstyled mt-5">
                <li class="py-2">
                  <div class="d-flex align-items-center">
                    <badge type="success" circle class="mr-3" icon="ni ni-settings-gear-65"></badge>
                    <h6 class="mb-0">Example sentences with recordings</h6>
                  </div>
                </li>
                <li class="py-2">
                  <div class="d-flex align-items-center">
                    <badge type="success" circle class="mr-3" icon="ni ni-html5"></badge>
                    <h6 class="mb-0">Expanded vocabulary and grammar rules</h6>
                  </div>
                </li>
                <li class="py-2">
                  <div class="d-flex align-items-center">
                    <badge type="success" circle class="mr-3" icon="ni ni-satisfied"></badge>
                    <h6 class="mb-0">Interactive exercises</h6>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section section-sm">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-5">
            <card type="secondary" shadow
                  header-classes="bg-white pb-5"
                  body-classes="px-lg-5 py-lg-5"
                  class="border-0">
              <h4 class="mb-1 text-center">Signup today!</h4>
              <template>
                <form role="form" class="mt-3">
                  <base-input alternative
                              class="mb-3"
                              placeholder="Email"
                              addon-left-icon="ni ni-email-83">
                  </base-input>
                  <div class="text-center">
                    <base-button type="primary" class="my-4">Sign up</base-button>
                  </div>
                </form>
              </template>
              <template>
                <div class="text-muted text-center mb-3">
                  <small>Or sign up with</small>
                </div>
                <div class="btn-wrapper text-center">
                  <a  href="https://www.chinesepod.com/api/v1/auth/facebook">
                    <base-button type="neutral">
                      <img slot="icon" src="/argon/img/icons/common/facebook.svg">
                      Facebook
                    </base-button>
                  </a>
                  <a href="https://www.chinesepod.com/api/v1/auth/google">
                    <base-button type="neutral">
                      <img slot="icon" src="/argon/img/icons/common/google.svg">
                      Google
                    </base-button>
                  </a>
                </div>
              </template>
            </card>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script>
  export default {
    name: "lessons",
    layout: 'default',
    components: {}
  };
</script>
