import Vue from 'vue'
import Axios from 'axios'
import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import { getToken } from '@/utils/auth' // getToken from cookie

import api from './config/api'
Vue.use(api)

NProgress.configure({ showSpinner: false })// NProgress Configuration

// permission judge function
function hasPermission(roles, permissionRoles) {
  if (roles.indexOf('admin') >= 0) return true // admin permission passed directly
  if (!permissionRoles) return true
  return roles.some(role => permissionRoles.indexOf(role) >= 0)
}

const whiteList = ['/login', '/auth-redirect']// no redirect whitelist

router.beforeEach((to, from, next) => {
  console.log('store.getters.roles.length = '+store.getters.roles.length)

  NProgress.start() // start progress bar
  console.log('router.beforeEach执行')
  console.log('cookie中的token值为' + getToken())
  if (getToken()) { // determine if there has token
    console.log('store.getters.roles.length = '+store.getters.roles.length)

    /* has token*/
    console.log(to.path)
    if (to.path === '/login') {
      store.dispatch('LogOut').then(()=>{
        console.log('去向路径为/login')
        next({ path: '/' })
        NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
      })
    } else {
    //   console.log('store.getters.roles.length = '+store.getters.roles.length)

    //   if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
    //     store.dispatch('GetUserInfo').then(res => { // 拉取user_info
    //       const roles = res.data.roles // note: roles must be a array! such as: ['editor','develop']
    //       console.log(roles)
    //       store.dispatch('GenerateRoutes', { roles }).then(() => { // 根据roles权限生成可访问的路由表
    //         router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
    //         next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
    //       })
    //     }).catch((err) => {
    //       store.dispatch('FedLogOut').then(() => {
    //         Message.error(err || 'Verification failed, please login again')
    //         next({ path: '/' })
    //       })
    //     })
    //   } else {
    //     // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
        // if (hasPermission(store.getters.roles, to.meta.roles)) {
        //   next()
        // } else {
        //   next({ path: '/401', replace: true, query: { noGoBack: true }})
        // }
    //     // 可删 ↑
    //   }
    // }


    //   const token = localStorage.getItem('token') || ''
    //   if (localStorage.getItem('userInfo')) {
    //     const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    //     var roles = []
    //     // roles.push(userInfo.admin_role_id)
    //     if (userInfo.admin_role_id == 1) {
    //       // 平台后台
    //       // console.log('add platform admin routers');
    //       // console.log(asyncPlatformAdminRouterMap);
    //       // console.log(router);
    //       // console.log(router.addRoutes);
    //       roles.push('admin')
    //       console.log(roles)
    //       // router.addRoutes(asyncPlatformAdminRouterMap); // 动态添加可访问路由表
    //     } else if (userInfo.admin_role_id == 2) {
    //       // 商家后台
    //       roles.push('editor')
    //       console.log(roles)
    //       // router.addRoutes(asyncMerchatAdminRouterMap); // 动态添加可访问路由表
    //     }
    //   }
    //   store.dispatch('setInfo').then(() => {
    //     store.dispatch('GenerateRoutes', { roles }).then(() => { // 根据roles权限生成可访问的路由表
    //       router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
    //       next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
    //     })
    //     console.log('setInfo执行了')
    //     Axios.defaults.baseURL = api.rootUrl
    //     Axios.defaults.headers.common['X-Anjishop-Token'] = token
    //     Axios.defaults.headers.common['x-api-key'] =
    //       '40bd001563085fc35165329ea1ff5c5ecbdbbeef'
    //     console.log('3')
    //     console.log(to)
    //     console.log(from)
    //     next()
    //   })
    // }





    console.log('store.getters.roles.length = '+store.getters.roles.length)

    if (store.getters.roles.length === 0) { 
      const token = localStorage.getItem('token') || ''
      if (localStorage.getItem('userInfo')) {
        console.log('执行roles.push')
        const userInfo = JSON.parse(localStorage.getItem('userInfo'))
        var roles = []
        // roles.push(userInfo.admin_role_id)
        if (userInfo.admin_role_id == 1) {
          // 平台后台
          // console.log('add platform admin routers');
          // console.log(asyncPlatformAdminRouterMap);
          // console.log(router);
          // console.log(router.addRoutes);
          roles.push('admin')
          console.log(roles)
          // router.addRoutes(asyncPlatformAdminRouterMap); // 动态添加可访问路由表
        } else if (userInfo.admin_role_id == 2) {
          // 商家后台
          roles.push('editor')
          console.log(roles)
          // router.addRoutes(asyncMerchatAdminRouterMap); // 动态添加可访问路由表
        }
      }// 拉取user_info
      store.dispatch('setInfo').then(() => {
        store.dispatch('GenerateRoutes', { roles }).then(() => { // 根据roles权限生成可访问的路由表
          router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
          next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
        })
        console.log('setInfo执行了')
        Axios.defaults.baseURL = api.rootUrl
        Axios.defaults.headers.common['X-Anjishop-Token'] = token
        Axios.defaults.headers.common['x-api-key'] =
          '40bd001563085fc35165329ea1ff5c5ecbdbbeef'
        console.log('3')
        console.log(to)
        console.log(from)
      })
    } else {
      // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
      console.log('store.getters.roles.length = '+store.getters.roles.length)
            if (hasPermission(store.getters.roles, to.meta.roles)) {
          next()
        } else {
          next({ path: '/401', replace: true, query: { noGoBack: true }})
        }
   
      // 可删 ↑
    }
  }



  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      store.dispatch('LogOut').then(()=>{
        console.log('去向路径为'+ to)
        next()
      })
    } else {
      console.log('重定向到登录页')
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
