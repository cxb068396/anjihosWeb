import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    console.log(store.getters.token)
    if (store.getters.token) {
      // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    /**
     * code为非20000是抛错 可结合自己业务进行修改
     */
    console.log(response)
    const res = response.data

    // if (res.errno !== 0&&res.code !== 20000 &&res.status !== 200) {
    //   Message({
    //     message: res.errmsg,
    //     type: 'error',
    //     duration: 5 * 1000
    //   })

    // // if (res.code !== 20000) {
    // //   Message({
    // //     message: res.message,
    // //     type: 'error',
    // //     duration: 5 * 1000
    // //   })

    //   // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
    //   if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
    //     MessageBox.confirm(
    //       '你已被登出，可以取消继续留在该页面，或者重新登录',
    //       '确定登出',
    //       {
    //         confirmButtonText: '重新登录',
    //         cancelButtonText: '取消',
    //         type: 'warning'
    //       }
    //     ).then(() => {
    //       console.log('FedLogOut执行了')
    //       store.dispatch('FedLogOut').then(() => {
    //         location.reload() // 为了重新实例化vue-router对象 避免bug
    //       })
    //     })
    //   }

    //   return Promise.reject('error')
    // } else {

    //   return response.data
    // }
    if (response.data.errno === 0 || response.data.code == 20000||response.status==200) {
      console.log('return response')
      return response
    } else {
      Message({
        message: response.data.errmsg,
        type: 'error',
        duration: 5 * 1000
      })

      // if (response.data.code !== 20000) {
      //   Message({
      //     message: response.data.message,
      //     type: 'error',
      //     duration: 5 * 1000
      //   })

      // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      if (response.data.code === 50008 || response.data.code === 50012 || response.data.code === 50014) {
        MessageBox.confirm(
          '你已被登出，可以取消继续留在该页面，或者重新登录',
          '确定登出',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          console.log('FedLogOut执行了')
          store.dispatch('FedLogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      }
      console.log('promise返回状态码不对，reject')
      return Promise.reject('error')
    }
  },
  // response => {
  //   console.log(response)
  //   return response
  // },
  // /**
  //  * 下面的注释为通过在response里，自定义code来标示请求状态
  //  * 当code返回如下情况则说明权限有问题，登出并返回到登录页
  //  * 如想通过 xmlhttprequest 来状态码标识 逻辑可写在下面error中
  //  * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
  //  */
  // // response => {
  // //   const res = response.data
  // //   if (res.code !== 20000) {
  // //     Message({
  // //       message: res.message,
  // //       type: 'error',
  // //       duration: 5 * 1000
  // //     })
  // //     // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
  // //     if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
  // //       // 请自行在引入 MessageBox
  // //       // import { Message, MessageBox } from 'element-ui'
  // //       MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
  // //         confirmButtonText: '重新登录',
  // //         cancelButtonText: '取消',
  // //         type: 'warning'
  // //       }).then(() => {
  // //         store.dispatch('FedLogOut').then(() => {
  // //           location.reload() // 为了重新实例化vue-router对象 避免bug
  // //         })
  // //       })
  // //     }
  // //     return Promise.reject('error')
  // //   } else {
  // //     return response.data
  // //   }
  // // },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
