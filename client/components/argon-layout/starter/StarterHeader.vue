<template>
  <header class="header-global border-bottom">
    <base-nav class="navbar-main" type="secondary" effect="light" expand>
      <a slot="brand" class="navbar-brand mr-lg-5" href="https://www.chinesepod.com">
        <img class="img-fluid cpod-logo" src="/img/brand/logo.png">
      </a>

      <div class="row" slot="content-header" slot-scope="{closeMenu}">
        <div class="col-6 collapse-brand">
          <a href="/" title="ChinesePod">
            <img src="https://www.chinesepod.com/images/brand/brand.svg">
          </a>
        </div>
        <div class="col-6 collapse-close">
          <close-button @click="closeMenu"></close-button>
        </div>
      </div>

      <ul class="navbar-nav navbar-nav-hover align-items-lg-center">
        <li class="nav-item">
          <a href="/corporate" class="nav-link" role="button">
            <span class="nav-link-inner--text">For Companies</span>
          </a>
        </li>
        <li class="nav-item">
          <a href="/academic-offers" class="nav-link" role="button">
            <span class="nav-link-inner--text">For Schools</span>
          </a>
        </li>
        <li class="nav-item">
          <a href="/pricing" class="nav-link" role="button">
            <span class="nav-link-inner--text">Pricing</span>
          </a>
        </li>
        <li class="nav-item">
          <a href="/contact" class="nav-link" role="button">
            <span class="nav-link-inner--text">Contact Us</span>
          </a>
        </li>
        <li v-if="!isAuthenticated" class="nav-item d-lg-none">
          <a href="/signup" class="nav-link" role="button">
            <span class="nav-link-inner--text">Sign up</span>
          </a>
        </li>
        <li v-if="!isAuthenticated" class="nav-item d-lg-none">
          <a href="/login" class="nav-link" role="button">
            <span class="nav-link-inner--text">Log in</span>
          </a>
        </li>
        <li v-if="isAuthenticated" class="nav-item d-lg-none">
          <a href="/home" class="nav-link" role="button">
            <span class="nav-link-inner--text">Dashboard</span>
          </a>
        </li>
<!--        <li class="nav-item">-->
<!--          <a href="/affiliate" class="nav-link" role="button">-->
<!--            <span class="nav-link-inner&#45;&#45;text">Affiliate</span>-->
<!--          </a>-->
<!--        </li>-->
      </ul>
      <ul class="navbar-nav align-items-lg-center ml-lg-auto">
        <li class="nav-item">
          <a class="nav-link nav-link-icon" href="https://www.facebook.com/chinesepod" target="_blank"
             data-toggle="tooltip" title="Like us on Facebook">
            <i class="fab fa-facebook-square"></i>
            <span class="nav-link-inner--text d-lg-none">Facebook</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link nav-link-icon" href="https://www.instagram.com/chinesepod"
             target="_blank" data-toggle="tooltip" title="Follow us on Instagram">
            <i class="fab fa-instagram"></i>
            <span class="nav-link-inner--text d-lg-none">Instagram</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link nav-link-icon" href="https://twitter.com/chinesepod" target="_blank"
             data-toggle="tooltip" title="Follow us on Twitter">
            <i class="fab fa-twitter-square"></i>
            <span class="nav-link-inner--text d-lg-none">Twitter</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link nav-link-icon" href="https://www.youtube.com/user/ChinesePodTV" target="_blank"
             data-toggle="tooltip" title="Subscribe on Youtube">
            <i class="fab fa-youtube-square"></i>
            <span class="nav-link-inner--text d-lg-none">Youtube</span>
          </a>
        </li>
        <li v-if="!isAuthenticated" class="nav-item d-none d-lg-block ml-lg-4">
          <a href="/signup"
             class="btn btn-success btn-icon">
            <span class="nav-link-inner--text">Sign up</span>
          </a>
        </li>
        <li v-if="!isAuthenticated" class="nav-item d-none d-lg-block ml-lg-4">
          <a href="/login"
             class="btn btn-outline-primary btn-icon">
            <span class="nav-link-inner--text">Log in</span>
          </a>
        </li>
        <li v-if="isAuthenticated" class="nav-item d-none d-lg-block ml-lg-4">
          <a href="/home"
             class="btn btn-outline-primary btn-icon">
            <span class="nav-link-inner--text">Dashboard</span>
          </a>
        </li>
      </ul>
    </base-nav>
  </header>
</template>
<script>
  import BaseNav from "~/components/argon/BaseNav";
  import CloseButton from "~/components/argon/CloseButton";

  export default {
    computed: {
      isAuthenticated () {
        return this.$store.getters['auth/isAuthenticated']
      }
    },
    components: {
      BaseNav,
      CloseButton
    }
  };
</script>
<style lang="scss">
  .cpod-logo {
    max-width: 160px !important;
  }
</style>
