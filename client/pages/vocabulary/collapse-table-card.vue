<template>
  <card shadow class="collapse-table-card" :class="{'expanded-table': isOpened}">
    <table>
      <tbody>
        <tr v-for="(item, index) in availableList" :key="index"  striped :class="{'striped': index % 2 === 1}">
          <td class="simplified">{{ item.simplified }}</td>
          <td class="pinyin">{{ item.pinyin }}</td>
          <td class="english">{{ item.english }}</td>
        </tr>
      </tbody>
    </table>
    <template slot="footer">
      <div class="footer-action" :class="{'expanded': isOpened}" @click="collapseContent">
        <i class="fas fa-angle-down" />
      </div>
    </template>
  </card>
</template>

<script>
export default {
  name: "collapse-table-card",
  layout: 'default',
  components: {},
  props: {
    data: {
      type: Array,
      default: () => []
    },
    isExpanded: {
      type: Boolean,
      default: false
    },
    maxCount: {
      type: Number,
      default: 5
    }
  },
  computed: {
    availableList() {
      if (this.isOpened) {
        return this.data
      } else {
        const visibleList = this.data.filter((item, index) => index < this.maxCount)
        return visibleList
      }
    }
  },
  data() {
    return {
      isOpened: false
    };
  },
  mounted() {
    this.isOpened = this.isExpanded
  },
  methods: {
    collapseContent() {
      this.isOpened = !this.isOpened
    }
  }
}
</script>

<style lang="scss">
  .collapse-table-card {
    &.expanded-table {
      transition: width 600ms ease-out, height 600ms ease-out;
    }
    .card-body {
      padding: 0;
    }
    table {
      width: 100%;
      margin-top: 20px;
      tr.striped {
        background: #F2F2F2;
      }
      td {
        padding: 12px 1.5rem;
        font-size: 18px;
        &.simplified {
          width: 15%;
          font-size: 30px;
          min-width: 200px;
        }
        &.pinyin {
          width: 20%;
        }
      }
    }
    .footer-action {
      color: #999999;
      text-align: center;
      font-size: 18px;
      cursor: pointer;
      i {
        transition: transform .8s;
        &:hover {
          color: #000;
        }
      }
      &.expanded {
        i {
          transform: rotate(180deg);
        }
      }
    }
  }
</style>