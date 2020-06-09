import axios from 'axios'

let baseUrl = process.env.API_URL

let config = {
  address: baseUrl,
  port: '',
  basePath: '',
  axiosConfig: {
    baseURL: baseUrl,
    headers: {},
    withCredentials: false,
    crossDomain: true,
  },
  getEndpointUrl () {
    return this.address + (this.basePath ? this.basePath : '')
  }
}

const access_token = process.browser ? localStorage.getItem('access_token') || sessionStorage.getItem('access_token') : null

if (access_token) {
  config.axiosConfig.headers['authorization'] = 'Bearer ' + access_token
}

let $http = axios.create(config.axiosConfig)

if (access_token) {
  $http.defaults.headers.common['authorization'] = 'Bearer ' + access_token
}

let sendPost = async (url, payload, headers = null) => {
  return $http.post(url, payload)
}

let sendPatch = async (url, payload = null, headers = null) => {
  return $http.patch(url, payload, headers)
}

let sendPut = async (url, payload, headers = null) => {
  return $http.put(url, payload, headers)
}

let sendGet = async (url, params) => {
  return $http.get(url, { params })
}

let sendDelete = async (url, payload = null, headers = null) => {
  return $http.delete(url, payload)
}

export default config

export { config }

export { sendPost }

export { sendGet }

export { sendPatch }

export { sendPut }

export { sendDelete }