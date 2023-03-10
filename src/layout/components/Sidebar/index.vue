<template>
  <div :class="{'has-logo':showLogo}">
    <logo :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in menuRoutes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
import { constantRoutes } from '@/router/index'
export default {
  components: { SidebarItem, Logo },
  data() {
    return {
      constantRoutes,
      menuRoutes: []
    }
  },
  computed: { // sidebar
    ...mapState({
      sidebar: state => state.app.sidebar
    }),

    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  // 获取store 里面的menuRouotes 如果没有就去localStorage 去取
  created() {
    const menuStore = this.$store.state.user.menuRoutes
    if (!menuStore.length) {
      const data = localStorage.getItem('FORMAT_MENU')
      const menus = data && JSON.parse(data)
      this.$store.commit('user/SET_ROUTES', menus)
      this.menuRoutes = menus
    } else {
      this.menuRoutes = menuStore
    }
  }
}
</script>
