<template>
  <div id="wrapper" class="d-flex flex-column">
    <header class="header-global">
      <starter-header></starter-header>
    </header>
    <main class="flex-fill position-relative">
      <nuxt />
    </main>
    <starter-footer></starter-footer>
  </div>
</template>

<script>
  import StarterHeader from "~/components/argon-layout/starter/StarterHeader";
  import StarterFooter from "~/components/argon-layout/starter/StarterFooter";

  export default {
    async fetch () {
      await this.$store.dispatch('auth/init');
    },
    components: {
      StarterHeader,
      StarterFooter
    }
  };
</script>

<style>
  body, #wrapper {
    min-height:100vh;
  }
</style>
