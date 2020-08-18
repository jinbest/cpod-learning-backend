<!--
  - Copyright © 2020. Ugis Rozkalns. All Rights Reserved.
  -->

<template>
  <card shadow class="collapse-table-card" :class="{'expanded-table': isOpened}">
    <div class="table-container" role="table" aria-label="Destinations">
      <div class="flex-table row" role="rowgroup" v-for="(item, index) in availableList" :key="index">
        <div class="flex-row simplified" role="cell">
          <nuxt-link v-if="links" :to="`/dictionary/${item.simplified}`" :title="item.simplified">{{ item.simplified }}</nuxt-link>
          <span v-else>{{ item.simplified }}</span>
        </div>
        <div class="flex-row pinyin" role="cell">{{ cleanPinyin(item.pinyin) }}</div>
        <div class="flex-row english" role="cell">
          <ol class="list-inline">
            <li class="list-inline-item" v-for="(definition, index) in cleanDefinitions(item.definition)" :key="index">
              <div v-if="definition instanceof Object">
                <strong>{{ index + 1}}</strong> <strong class="small font-weight-bold">{{ definition.type }}:</strong> <router-link :to="`/dictionary/${definition[charSet]}`" :title="definition[charSet]" class="chinese-font">{{definition[charSet]}} {{ cleanPinyin(definition.pinyin) }}</router-link>
              </div>
              <div v-else>
                <strong>{{ index + 1}}</strong> {{definition}}
              </div>
            </li>
          </ol>
        </div>
      </div>
    </div>
    <template slot="footer" v-if="data.length > maxCount">
      <div class="footer-action" :class="{'expanded': isOpened}" @click="collapseContent">
        <i class="fas fa-angle-down" />
      </div>
    </template>
  </card>
</template>

<script>

  import { cleanPinyin, cleanDefinitions } from "@/util/dictionary";

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
    },
    links: {
      type: Boolean,
      default: false
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
      isOpened: false,
      charSet: 'simplified'
    };
  },
  mounted() {
    this.isOpened = this.isExpanded
  },
  methods: {
    cleanPinyin: cleanPinyin,
    cleanDefinitions: cleanDefinitions,
    collapseContent() {
      this.isOpened = !this.isOpened
    }
  }
}
</script>

<style lang="scss">
  .collapse-table-card {
    $table-border: #d9d9d9;
    .card-body {
      padding: 20px 15px 0;
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

    .table-container {
      div {
        box-sizing: border-box;
        font-size: 18px;
        &.simplified {
          font-size: 30px;
        }
      }
      .flex-table {
        display: flex;
        flex-flow: row wrap;
        transition: 0.5s;
        align-items: center;
        padding-left: 1.5rem;
        padding-right: 1.5rem;
        border-top: 1px solid #ddd;
        &:first-child {
          border-top: 0;
        }
        &.row:nth-child(even) {
          background: #F2F2F2;
        }
      }

      .flex-row {
        width: calc(100% / 4);
        text-align: left;
        padding: 12px 0 12px 10px;
        &:first-child {
          width: calc(100% / 4);
          padding-left: 0;
        }
        &:last-child {
          width: calc(100% / 2);
        }
      }

      .rowspan {
        display: flex;
        flex-flow: row wrap;
        align-items: flex-start;
        justify-content: center;
      }

      @media (max-width: 768px) {
        .flex-row {
          width: 45%;
          padding-bottom: 0;
          &:first-child {
            width: 55%;
            font-size: 24px;
          }
          &:last-child {
            width: 100%;
            border-top: solid 1px $table-border;
            padding: 12px 0;
          }
        }
      }

      @media (max-width: 430px) {
        .flex-row {
          width: 100%; //1px = border right
          padding: 10px 0 0;
          &:first-child {
            width: 100%;
            border-bottom: solid 1px $table-border;
          }
          &:last-child {
            border-top: 0;
            padding-top: 5px;
          }
        }
      }
    }
  }
</style>
