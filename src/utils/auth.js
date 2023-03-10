// import Cookies from 'js-cookie'

export const TokenKey = 'Access-Token'

// 获取本地缓存token
export function getToken() {
  return localStorage.getItem(TokenKey)
}

// 设置本地缓存token
export function setToken(token) {
  return localStorage.setItem(TokenKey, token)
}

// 清除本地缓存token
export function removeToken() {
  return localStorage.removeItem(TokenKey)
}
