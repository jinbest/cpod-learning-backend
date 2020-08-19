<template>
  <div>
    <div class="container-fluid">
      <div id="searchArea" class="col-12 col-lg-8 offset-lg-2 col-xl-6 offset-xl-3 pb-3">
        <h1 class="pt-5 display-3">
          Search ChinesePod Dictionary
        </h1>
        <base-input group prepend-icon="fas fa-search">
          <input type="search" class="form-control" placeholder="Search in English or Chinese" aria-label="Search in English or in Chinese" aria-describedby="button-addon2" v-model.trim="searchTerm" @search="runSearch()">
          <div class="input-group-append">
            <base-button class="btn btn-outline-primary is-loading" type="button" id="button-addon2" @click="runSearch()" :loading="isLoading">Search</base-button>
          </div>
        </base-input>
      </div>
      <div id="vocabulary">
        <transition name="fade">
          <div v-if="results && results.length" class="pb-2 col-12 col-lg-8 offset-lg-2 col-xl-6 offset-xl-3">
            <nuxt-link v-for="result in results" :key="result.simplified + result.traditional + result.pinyin" :to="`/dictionary/${result[charSet]}`" class="list-group-item list-group-item-action">
              <search-item :phrase="result" />
            </nuxt-link>
          </div>
        </transition>
        <transition name="fade">
          <div id="controls" class="text-center">
            <base-pagination
              v-show="showPagination"
              :page-count="pages"
              :per-page="16"
              :value="page"
              align="center"
              @input="listener($event)"
            ></base-pagination>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>

  import SearchItem from "@/components/dictionary/SearchItem";

  import {sendGet} from "../../util/api";

  export default {
    name: "dictionary-search",
    components: {SearchItem},

    watchQuery: true,

    key: to => to.fullPath,

    async asyncData ({query, redirect}) {

      if(!query.page) {
        query.page = 1
      }

      if (!query.search) {
        query.search = ''
      }

      const response = await sendGet(`/search/search-dictionary/${query.search}`,
        { skip: ((query.page - 1) * 20) })
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

      let pages = Math.ceil(data.count / 20);

      return {
        pages: pages,
        showPagination: pages > 1,
        results: data.results,
        page: query.page ? parseInt(query.page) : 1,
        searchTerm: query.search ? query.search : '',
      }
    },

    data () {
      return {
        isLoading: false,
        searchTerm: '',
        charSet: 'simplified',
        results: [],
        searching: false,
        enableCourseSearch: true,
        hideButtons: false,
        fullPage: true,
        perPage: 20,
        pages: 1,
        showLoadMore: false,
        showPagination: false,
        showAdvancedOptions: false
      }
    },
    methods: {
      async runSearch () {
        this.isLoading = true;

        if (this.searchTerm) {

          await this.$router.push({path: '/dictionary', query: {search: this.searchTerm}})

        } else {

          await this.$router.push({path: '/dictionary'});

        }
        this.isLoading = false;

      },
      async listener (event) {
        if (!this.isLoading) {

          if(this.searchTerm) {

            await this.$router.push({ path: '/dictionary', query: {search: this.searchTerm, page: event }})

          } else {

            await this.$router.push({ path: '/dictionary', query: { page: event }})

          }

        }
      },
      async searchVocabulary () {
        this.searching = true;

        await sendGet('/search/search-dictionary/'
          + this.searchTerm
          + `?skip=${(this.page - 1) * this.perPage}`)
          .then(({data}) => {

            this.pages = Math.ceil(data.count / this.perPage);

            this.showPagination = this.pages > 1;

            this.results = data.results;

          })
          .catch((e) => {console.log(e)});
        this.searching = false;
      }
    },
    async mounted () {

      // if (this.$route.query && this.$route.query.search) {
      //
      //   this.searchTerm = this.$route.query.search;
      //
      // }
      //
      // if (this.$route.query && this.$route.query.page) {
      //
      //   this.page = parseInt(this.$route.query.page);
      //   this.pages = this.page;
      //
      // }
      //
      // await this.searchVocabulary();

    },
    // async beforeRouteUpdate(to, from, next) {
    //
    //   let queryData = to.query;
    //
    //   if (queryData && queryData.search) {
    //     this.searchTerm = queryData.search;
    //   } else {
    //     this.searchTerm = '';
    //   }
    //
    //   if (queryData && queryData.page) {
    //     this.page = parseInt(queryData.page);
    //   } else {
    //     this.page = 1;
    //     this.pages = 1;
    //   }
    //
    //   await this.searchVocabulary();
    //
    //   next()
    // }
  }
</script>

<style scoped lang="scss">
</style>
