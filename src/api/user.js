import { post, del } from '@/utils/request'

/**
 * @param {string} username
*  @param {string} password
 * @returns
 */
export const apiLogin = (params) => {
  return post('/API/Login', params)
}

// 退出登录
export function apiLogout() {
  return del('/API/Login')
}

