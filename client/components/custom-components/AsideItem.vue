<template>
  <div class="aside" :class="[`${type}`]">
    <div class="title">
      <div>{{ title }}</div>
      <slot name="icon">
        <i class="fas fa-users" />
      </slot>
    </div>
    <div class="content">
      <slot />
    </div>
    <div class="left-arrow">
      <svg width="20px" height="100%" viewBox="0 0 20 10" preserveAspectRatio="none">
          <polygon fill=white stroke-width=0 points="0,0 20,5 0,10" />
      </svg>
    </div>
    <div class="right-arrow">
      <svg width="20px" height="100%" viewBox="0 0 20 10" preserveAspectRatio="none">
          <polygon fill=white stroke-width=0 points="20,0 0,5 20,10" />
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  name: "aside-item",
  props: {
    title: {
      type: String,
    },

    type: {
      type: String,
      default: 'left'
    }
  }
};
</script>

<style scoped lang="scss">
  .aside {
    position: relative;
    background: #FFFFFF;
    box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.1);
    max-width: 450px;
    border-radius: 10px;
    @media (max-width: 1200px) {
      max-width: unset;
    }
    @media (max-width: 992px) {
      box-shadow: none;
      background: transparent;
    }
    .title {
      display: flex;
      justify-content: space-between;
      font-size: 30px;
      font-weight: bold;
      line-height: 35px;
      color: #32325D;
      i {
        font-size: 40px;
        color: #F55E37;
        padding-left: 10px;
        @media (max-width: 992px) {
          display: none;
        }
      }
      @media (max-width: 1200px) {
        font-size: 24px;
        i {
          font-size: 32px;
        }
      }
      @media (max-width: 992px) {
        font-size: 20px;
        justify-content: center;
      }
    }
    .content {
      margin-top: 20px;
      line-height: 130%;
      @media (max-width: 1680px) {
        margin-top: 10px;
      }
      @media (max-width: 1200px) {
        margin-top: 5px;
      }
    }
    .left-arrow,
    .right-arrow {
      display: none;
    }
    &.left {
      padding: 40px 50px 40px 50px;
      @media (max-width: 1680px) {
        padding: 30px 30px 30px 20px;
      }
      @media (max-width: 1200px) {
        padding: 15px;
      }
      @media (max-width: 992px) {
        padding: 0 15px 5px;
      }
      @media (max-width: 576px) {
        padding: 0 0 15px;
      }
      .left-arrow {
        display: block;
        position: absolute;
        height: 98%;
        right: -19px;
        top: 1%;
        @media (max-width: 992px) {
          display: none;
        }
      }
    }
    &.right {
      padding: 40px 50px 40px 50px;
      margin-left: auto;
      @media (max-width: 1680px) {
        padding: 30px 20px 30px 30px;
      }
      @media (max-width: 1200px) {
        padding: 15px;
      }
      @media (max-width: 992px) {
        padding: 0 15px 5px;
      }
      @media (max-width: 576px) {
        padding: 0 0 15px;
      }
      .right-arrow {
        display: block;
        position: absolute;
        height: 98%;
        left: -19px;
        top: 1%;
        @media (max-width: 992px) {
          display: none;
        }
      }
    }
  }
</style>