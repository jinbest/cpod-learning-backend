import { sendPost } from '@/util/api'

export const state = () => ({
  token: ''
})

export const getters = {
  isAuthenticated: state => !!state.token
}

export const mutations = {
  SET_TOKEN(state, token) {
    state.token = token
  }
}

export const actions = {
  async init ({ commit, state }) {
    // const { data } = await sendPost(process.env.API_URL + '/token/auth',
    //   {
    //     type: 'landing',
    //     key: process.env.API_KEY
    //   });
    // console.log(data ? data : 'No Data')
    // console.log({state: state.token})
    // if (data && data.token && !state.token) {
    //   console.log({token: data.token})
    //   commit('SET_TOKEN', data.token);
    // } else {
    //   commit('SET_TOKEN', '');
    // }
  },
  async getToken ({ commit }) {
    // let { data } = await this.$axios
    //   .post(
    //     process.env.API_URL +
    //     '/token/auth',
    //     {
    //       type: 'landing',
    //       key: process.env.API_KEY
    //     }
    //   );
    // if (data && data.token) {
    //   commit('SET_TOKEN', data.token);
    // } else {
    //   commit('SET_TOKEN', '');
    // }
  }
}
