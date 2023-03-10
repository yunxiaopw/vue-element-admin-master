import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken, TokenKey } from '@/utils/auth'

const instance = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 120 * 1000, // 超时
  withCredentials: true
})

// 请求错误处理
const err = (error) => {
  if (error.message.includes('timeout')) {
    Message({
      message: '请求超时，请刷新网页重试',
      type: 'error'
    })
  }
  if (error.response) {
    const data = error.response.data
    if (error.response.status === 403) {
      Message({
        message: 'Forbidden',
        type: 'error'
      })
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      Message({
        message: 'Unauthorized',
        type: 'error'
      })
    }
  }
  return error
}

// 请求拦截
instance.interceptors.request.use((config) => {
  if (store.getters.token) {
    config.headers['Authorization'] = `Bearer ${getToken(TokenKey)}`
  }
  return config
}, err)

// 响应拦截
instance.interceptors.response.use((response) => {
  const res = response.data
  if (res.errcode === 0) {
    return res || {}
  }
  // 这里可做统一错误判断
}, err)

const request = async(config) => {
  const res = await instance(config)
  return res
}

const commonRequset = function(method, url, params, errNotice = true, successNotice = false) {
  return request({
    url,
    method,
    data: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    errNotice,
    successNotice
  })
}

const post = function(url, params, errNotice = true, successNotice = false) {
  return commonRequset('post', url, params, errNotice, successNotice)
}

const put = function(url, params, errNotice = true, successNotice = false) {
  return commonRequset('put', url, params, errNotice, successNotice)
}

const del = function(url, params, errNotice = true, successNotice = false) {
  return commonRequset('delete', url, params, errNotice, successNotice)
}

const get = function(url, params, errNotice = true, successNotice = false) {
  return request({
    url,
    method: 'get',
    params,
    errNotice,
    successNotice
  })
}

export { request, get, post, put, del }
