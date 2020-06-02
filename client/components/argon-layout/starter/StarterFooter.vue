<template>
  <footer class="footer">
    <div class="container">
      <div class="row align-items-center justify-content-md-between">
        <div class="col-md-6">
          <div class="copyright text-center text-lg-left text-muted">
            © {{year}} ChinesePod LLC
          </div>
        </div>
        <div class="col-md-6">
          <ul class="nav nav-footer justify-content-end">
            <li class="nav-item">
              <a href="/pricing" class="nav-link">Pricing</a>
            </li>
            <li class="nav-item">
              <a href="/corporate" class="nav-link">Corporate</a>
            </li>
            <li class="nav-item">
              <a href="/why-choose-us" class="nav-link">About Us</a>
            </li>
            <li class="nav-item">
              <a href="/blog" class="nav-link">Blog</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>
<script>
  export default {
    name: 'chinesepod-footer',
    data() {
      return {
        year: new Date().getFullYear()
      }
    }
  };
</script>
<style>
</style>
