<template>
  <div>
    {{context}}
  </div>

</template>

<script>
  export default {
    name: 'redirect',
    asyncData ({ route, redirect, redirected }) {
      redirect(`https://www.chinesepod.com${ !redirected ? route.fullPath : ''}`)
    }
  }
</script>

<style scoped>

</style>
