<template>
  <div class="row align-items-center">
    <div class="col-auto characters">
      {{
      phrase.simplified === phrase.traditional
      ? phrase.simplified
      : charSet === 'simplified'
      ? phrase.simplified + ' | ' + phrase.traditional
      : phrase.traditional + ' | ' + phrase.simplified
      }}
    </div>
    <div class="col ml--2 pinyin">
      {{ cleanPinyin(phrase.pinyin) }}
    </div>
    <div class="col-12 english">
      <ol class="list-inline">
        <li class="list-inline-item" v-for="(definition, index) in cleanDefinitions(phrase.definition)" :key="index">
          <div v-if="definition instanceof Object">
            <strong>{{ index + 1}}</strong> <strong class="small font-weight-bold">{{ definition.type }}:</strong> <router-link :to="`/dictionary/${definition[charSet]}`" :title="definition[charSet]">{{definition[charSet]}} {{ cleanPinyin(definition.pinyin) }}</router-link>
          </div>
          <div v-else>
            <strong>{{ index + 1}}</strong> {{definition}}
          </div>
        </li>
      </ol>
    </div>
  </div>
</template>

<script>
  import {cleanPinyin, cleanDefinitions} from '@/util/dictionary'

  export default {
    name: "SearchItem",
    data () {
      return {
        charSet: 'simplified'
      }
    },
    props: {
      phrase: Object
    },
    methods: {
      cleanPinyin: cleanPinyin,
      cleanDefinitions: cleanDefinitions
    },
  }
</script>

<style scoped>
  .characters {
    font-size: 30px;
    font-family: 'Noto Sans SC', sans-serif;
    color: black;
  }
  .pinyin {
    font-family: 'Noto Sans SC', sans-serif;
  }
  .pinyin, .english {
    font-size: 24px;
    color: black;
  }
</style>
