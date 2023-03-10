import { apiLogin, apiLogout } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
const menus = [
  {
    PkMenu: 1,
    ParentId: 0,
    MenuName: '驾驶舱',
    MenuLink: '/home',
    MenuIcon: 'documentation',
    MenuOrder: 999,
    Disabled: '',
    Sub: null
  },
  {
    PkMenu: 2,
    ParentId: 0,
    MenuName: '数据统计',
    MenuLink: '#',
    MenuIcon: 'documentation',
    MenuOrder: 899,
    Disabled: '',
    Sub: [
      {
        PkMenu: 3,
        ParentId: 2,
        MenuName: '劳务考勤',
        MenuLink: '/data/report-person',
        MenuIcon: 'documentation',
        MenuOrder: 0,
        Disabled: '',
        Sub: null
      },
      {
        PkMenu: 4,
        ParentId: 2,
        MenuName: '机械台班',
        MenuLink: '/data/report-mechanices',
        MenuIcon: 'documentation',
        MenuOrder: 0,
        Disabled: '',
        Sub: null
      }
    ]
  }
]

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],

  menuRoutes: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },

  // 设置路由
  SET_ROUTES: (state, routes) => {
    state.menuRoutes = routes
  }
}

// 格式化menus
function transformMenus(menus) {
  const updatedMenus = []
  menus.forEach((menu) => {
    const updatedMenu = {
      path: menu.MenuLink,
      name: menu.MenuLink,
      meta: {
        title: menu.MenuName,
        icon: menu.MenuIcon
      },
      children: []
    }
    if (menu.Sub) {
      updatedMenu.children = menu.Sub.map((subMenu) => ({
        path: subMenu.MenuLink,
        name: subMenu.MenuLink,
        meta: { title: subMenu.MenuName, icon: 'documentation' }
      }))
    }
    updatedMenus.push(updatedMenu)
  })
  return updatedMenus
}

const actions = {
  // 登录方法
  async login({ commit }, userInfo) {
    const { username, password } = userInfo
    const res = await apiLogin({ username: username.trim(), password: password })
    if (res.errcode === 0) {
      commit('SET_TOKEN', res.token)
      setToken(res.token)
      const formatMenu = transformMenus(menus)
      localStorage.setItem('FORMAT_MENU', JSON.stringify(formatMenu))
      commit('SET_ROUTES', formatMenu)
    }
  },
  async logout({ commit }) {
    const res = await apiLogout({})
    if (res.errcode === 0) {
      removeToken()
      commit('SET_TOKEN', '')
      return true
    }
    return false
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
