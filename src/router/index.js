import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/* Router Modules */
import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import nestedRouter from './modules/nested'

/** note: Submenu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
      }
    ]
  },
  {
    path: '/documentation',
    component: Layout,
    redirect: '/documentation/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/documentation/index'),
        name: 'Documentation',
        meta: { title: 'documentation', icon: 'documentation', noCache: true }
      }
    ]
  },
  {
    path: '/guide',
    component: Layout,
    redirect: '/guide/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/guide/index'),
        name: 'Guide',
        meta: { title: 'guide', icon: 'guide', noCache: true }
      }
    ]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/index',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: 'permission',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/permission/page'),
        name: 'PagePermission',
        meta: {
          title: 'pagePermission',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'directive',
        component: () => import('@/views/permission/directive'),
        name: 'DirectivePermission',
        meta: {
          title: 'directivePermission'
          // if do not set roles, means: this page does not require permission
        }
      }
    ]
  },
  {
    path: '/goods',
    component: Layout,
    name: '商品管理',
    meta: {
      title: '商品管理',
      icon: 'peoples',
      roles:['admin'] 
    },
    children: [
      {
        path: 'Goods',
        component: () => import('@/views/Goods/GoodsPage'),
        name: '商品列表',
        meta: { title: '商品列表', icon: 'user' }
      },
      {
        path: 'add',
        component: () => import('@/views/Goods/GoodsAddPage'),
        name: 'goodsaddpage',
        meta: { title: '商品添加', icon: 'user' },
        hidden:true
      },
      {
        path: 'Category',
        component: () => import('@/views/Category/CategoryPage'),
        name: '商品分类',
        meta: { title: '商品分类', icon: 'user' }
      },
      {
        path: 'add',
        component: () => import('@/views/Category/CategoryAddPage'),
        name: 'categoryaddpage',
        meta: { title: '分类添加', icon: 'user' },
        hidden:true
      },
    ]
  },
  {
    path: '/merchant',
    component: Layout,
    name: '店铺管理',
    meta: {
      title: '店铺管理',
      icon: 'peoples',
      roles:['admin'] 
    },
    children: [
      {
        path: 'merchant',
        component: () => import('@/views/Merchant/Merchant'),
        name: '商家列表',
        meta: { title: '商家列表', icon: 'user' }
      },
      {
        path: 'approval',
        component: () => import('@/views/Merchant/Approval'),
        name: '商家入驻审批',
        meta: { title: '商家入驻审批', icon: 'user' }
      },
      {
        path: 'merchantgoods',
        component: () => import('@/views/Merchant/MerchantGoods'),
        name: '商家商品审批',
        meta: { title: '商家商品审批', icon: 'user' }
      },
      {
        path: 'merchantinfo',
        component: () => import('@/views/Merchant/MerchantInfo'),
        name: 'merchantinfo',
        meta: { title: '商家详情', icon: 'user' },
        hidden: true    
      },
      {
        path: 'add',
        component: () => import('@/views/Merchant/MerchantAddPage'),
        name: 'merchantaddpage',
        meta: { title: '添加商家', icon: 'user' },
        hidden: true    
      },
  
    ]
  },
  {
    path: '/order',
    component: Layout,
    meta: {
      title: '订单中心',
      icon: 'peoples',
      roles:['admin'] 
    },
    children: [
      {
        path: 'order',
        component: () => import('@/views/Order/Order'),
        name: 'order',
        meta: { title: '订单列表', icon: 'money', noCache: true }
      },
      {
        path: 'ordercommentpage',
        component: () => import('@/views/Order/OrderCommentPage'),
        name: 'ordercommentpage',
        meta: { title: '订单评价', icon: 'user' },
        hidden: true    
      },
      {
        path: 'orderinfo',
        component: () => import('@/views/Order/OrderInfo'),
        name: 'orderinfo',
        meta: { title: '订单详情', icon: 'user' },
        hidden: true    
      },
      {
        path: 'ordersendcompany',
        component: () => import('@/views/Order/OrderSendCompany'),
        name: 'ordersendcompany',
        meta: { title: '公司指派', icon: 'user' },
        hidden: true    
      },
      {
        path: 'ordersendworker',
        component: () => import('@/views/Order/OrderSendWorker'),
        name: 'ordersendworker',
        meta: { title: '员工指派', icon: 'user' },
        hidden: true    
      }
    ]
  },
  {
    path: '/flatbill',
    component: Layout,
    meta: {
      title: '账单功能',
      icon: 'peoples',
      roles:['admin'] 
    },
    children: [
      {
        path: 'flatbill',
        component: () => import('@/views/FlatBill/FlatBill'),
        name: '账单列表',
        meta: { title: '账单列表', icon: 'money', noCache: true }
      },
      {
        path: 'choosemerchant',
        component: () => import('@/views/FlatBill/ChooseMerchant'),
        name: 'choosemerchant',
        meta: { title: '选择商店', icon: 'user' },
        hidden: true    
      },
      {
        path: 'flatbillinfo',
        component: () => import('@/views/FlatBill/FlatBillInfo'),
        name: 'flatbillinfo',
        meta: { title: '账单详情', icon: 'user' },
        hidden: true    
      }
    ]
  },
  {
    path: '/service',
    component: Layout,
    meta: {
      title: '服务管理',
      icon: 'peoples',
      roles:['admin'] 
    },
    children: [
      {
        path: 'service',
        component: () => import('@/views/Service/Service'),
        name: 'service',
        meta: { title: '资格列表', icon: 'user' },
      },
      {
        path: 'qualification',
        component: () => import('@/views/Service/Qualification'),
        name: 'qualification',
        meta: { title: '资格申请管理', icon: 'money', noCache: true }
      }
    ]
  },
  {
    path: '/advertisement',
    component: Layout,
    meta: {
      title: '广告管理',
      icon: 'peoples',
      roles:['admin'] 
    },
    children: [
      {
        path: 'advertisement',
        component: () => import('@/views/Advertisement/Advertisement'),
        name: 'advertisement',
        meta: { title: '广告管理', icon: 'user' },
      },
      {
        path: 'adwxadd',
        component: () => import('@/views/Advertisement/AdWxAdd'),
        name: 'adwxadd',
        meta: { title: '小程序广告添加', icon: 'money', noCache: true },
        hidden: true 
      },
      {
        path: 'adwxupdate',
        component: () => import('@/views/Advertisement/AdWxUpdate'),
        name: 'adwxupdate',
        meta: { title: '小程序广告更新', icon: 'money', noCache: true },
        hidden: true 
      }
    ]
  },
  {
    path: '/Personnel',
    component: Layout,
    meta: {
      title: '人员管理',
      icon: 'peoples',
      roles:['editor'] 
    },
    children: [
      {
        path: 'personnelpage',
        component: () => import('@/views/Personnel/PersonnelPage'),
        name: 'personnelpage',
        meta: { title: '人员列表', icon: 'user' },
      },
      {
        path: 'personneladdpage',
        component: () => import('@/views/Personnel/PersonnelAddPage'),
        name: 'personneladdpage',
        meta: { title: '人员添加', icon: 'money', noCache: true },
        hidden: true 
      },
      {
        path: 'personnelupdatepage',
        component: () => import('@/views/Personnel/PersonnelUpdatPage'),
        name: 'personnelupdatepage',
        meta: { title: '人员更新', icon: 'money', noCache: true },
        hidden: true 
      }
    ]
  },
  {
    path: '/MerchantOrderPage',
    component: Layout,
    meta: {
      title: '订单管理',
      icon: 'peoples',
      roles:['editor'] 
    },
    children: [
      {
        path: 'merchantorderpage',
        component: () => import('@/views/MerchantOrder/MerchantOrderPage'),
        name: 'merchantorderpage',
        meta: { title: '订单列表', icon: 'user' },
      },
      {
        path: 'merchantordercommentpage',
        component: () => import('@/views/MerchantOrder/MerchantOrderCommentPage'),
        name: 'merchantordercommetpage',
        meta: { title: '订单评论', icon: 'money', noCache: true },
        hidden: true 
      },
      {
        path: 'merchantorderpostpage',
        component: () => import('@/views/MerchantOrder/MerchantOrderPostPage'),
        name: 'merchantorderpostpage',
        meta: { title: '订单操作', icon: 'money', noCache: true },
        hidden: true 
      }
    ]
  },
  {
    path: '/Serve',
    component: Layout,
    meta: {
      title: '服务管理',
      icon: 'peoples',
      roles:['editor'] 
    },
    children: [
      {
        path: 'servecontent',
        component: () => import('@/views/Serve/ServeContent'),
        name: 'servecontent',
        meta: { title: '服务列表', icon: 'user' },
      },
      {
        path: 'serveaddpage',
        component: () => import('@/views/Serve/ServeAddPage'),
        name: 'serveaddpage',
        meta: { title: '服务添加申请', icon: 'money', noCache: true },
      }
    ]
  },
  {
    path: '',
    component: Layout,
    meta: {
      title: '账单管理',
      icon: 'peoples',
      roles:['editor'] 
    },
    children: [
      {
        path: '/MerchantBill/billgeneration',
        component: () => import('@/views/MerchantBill/BillGeneration'),
        name: 'billgeneration',
        meta: { title: '服务列表', icon: 'user' },
        hidden:true
      },
      {
        path: '/MerchantBill/merchantbill',
        component: () => import('@/views/MerchantBill/MerchantBill'),
        name: 'merchantbill',
        meta: { title: '员工账单', icon: 'money', noCache: true },
      },
      {
        path: '/MerchantBill/workerbill',
        component: () => import('@/views/MerchantBill/WorkerBill'),
        name: 'workerbill',
        meta: { title: '员工账单', icon: 'money', noCache: true },
        hidden:true
      },
      {
        path: '/ShopBill/shopbill',
        component: () => import('@/views/ShopBill/ShopBill'),
        name: 'shopbill',
        meta: { title: '店铺账单', icon: 'money', noCache: true },
      },
      {
        path: '/ShopBill/shopbillinfo',
        component: () => import('@/views/ShopBill/ShopBillInfo'),
        name: 'shopbillinfo',
        meta: { title: '店铺账单详情', icon: 'money', noCache: true },
        hidden:true
      }
    ]
  },
  {
    path: '/icon',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/svg-icons/index'),
        name: 'Icons',
        meta: { title: 'icons', icon: 'icon', noCache: true }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    children: [
      {
        path: 'user',
        component: () => import('@/views/user/user'),
        name: '用户',
        meta: { title: '用户', icon: 'people', noCache: true }
      }
    ]
  },
  // {
  //   path: '/position',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'position',
  //       component: () => import('@/views/position/position'),
  //       name: '定位查看',
  //       meta: { title: '定位查看', icon: 'example', noCache: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/satisfaction',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'satisfaction',
  //       component: () => import('@/views/satisfaction/satisfaction'),
  //       name: '满意度',
  //       meta: { title: '满意度', icon: 'star', noCache: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/record',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'record',
  //       component: () => import('@/views/record/record'),
  //       name: '监管记录',
  //       meta: { title: '监管记录', icon: 'password', noCache: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/order',
  //   component: Layout,
  //   meta: {
  //     roles:['editor'] 
  //   },
  //   children: [
  //     {
  //       path: 'order',
  //       component: () => import('@/views/order/order'),
  //       name: '预约管理',
  //       meta: { title: '预约管理', icon: 'tab', noCache: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/bill',
  //   component: Layout,
  //   meta: {
  //     roles:['editor'] 
  //   },
  //   children: [
  //     {
  //       path: 'bill',
  //       component: () => import('@/views/bill/bill'),
  //       name: '账单管理',
  //       meta: { title: '账单管理', icon: 'money', noCache: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/sign',
  //   component: Layout,
  //   meta: {
  //     roles:['editor'] 
  //   },
  //   children: [
  //     {
  //       path: 'sign',
  //       component: () => import('@/views/sign/sign'),
  //       name:'签约管理',
  //       meta: { title: '签约管理', icon: 'tab', noCache: true }
  //     }
  //   ]
  // },

  /** When your routing table is too long, you can split it into small modules**/
  componentsRouter,
  chartsRouter,
  nestedRouter,
  tableRouter,
  // {
  //   path: '/localhospital',
  //   component: Layout,
  //   redirect: '/localhospital/localhospital',
  //   name: '卫生院',
  //   meta: {
  //     title: '卫生院',
  //     icon: 'tree',
  //     roles:['admin'] 
  //   },
  //   children: [
  //     {
  //       path: 'localhospital',
  //       component: () => import('@/views/localhospital/localhospital'),
  //       name: '卫生院管理',
  //       meta: { title: '卫生院管理', icon: 'tree' }
  //     }
  //   ]
  // },
  // {
  //   path: '/employee',
  //   component: Layout,
  //   redirect: '/employee/doctor',
  //   name: '人员管理',
  //   meta: {
  //     title: '人员管理',
  //     icon: 'peoples',
  //     roles:['editor'] 
  //   },
  //   children: [
  //     {
  //       path: 'doctor',
  //       component: () => import('@/views/employee/Doctor'),
  //       name: '医生管理',
  //       meta: { title: '医生管理', icon: 'user' }
  //     },
  //     {
  //       path: 'nurse',
  //       component: () => import('@/views/employee/Nurse'),
  //       name: '护理员管理',
  //       meta: { title: '护理员管理', icon: 'user' }
  //     }
  //   ]
  // },
  {
    path: '/example',
    component: Layout,
    redirect: '/example/list',
    name: 'Example',
    meta: {
      title: 'example',
      icon: 'example',
      roles:['admin'] 
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/example/create'),
        name: 'CreateArticle',
        meta: { title: 'createArticle', icon: 'edit' }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/example/edit'),
        name: 'EditArticle',
        meta: { title: 'editArticle', noCache: true },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/views/example/list'),
        name: 'ArticleList',
        meta: { title: 'articleList', icon: 'list' }
      }
    ]
  },
  {
    path: '/tab',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/tab/index'),
        name: 'Tab',
        meta: { title: 'tab', icon: 'tab' }
      }
    ]
  },

  {
    path: '/error',
    component: Layout,
    redirect: 'noredirect',
    name: 'ErrorPages',
    meta: {
      title: 'errorPages',
      icon: '404'
    },
    children: [
      {
        path: '401',
        component: () => import('@/views/errorPage/401'),
        name: 'Page401',
        meta: { title: 'page401', noCache: true }
      },
      {
        path: '404',
        component: () => import('@/views/errorPage/404'),
        name: 'Page404',
        meta: { title: 'page404', noCache: true }
      }
    ]
  },

  {
    path: '/error-log',
    component: Layout,
    redirect: 'noredirect',
    children: [
      {
        path: 'log',
        component: () => import('@/views/errorLog/index'),
        name: 'ErrorLog',
        meta: { title: 'errorLog', icon: 'bug' }
      }
    ]
  },

  {
    path: '/excel',
    component: Layout,
    redirect: '/excel/export-excel',
    name: 'Excel',
    meta: {
      title: 'excel',
      icon: 'excel'
    },
    children: [
      {
        path: 'export-excel',
        component: () => import('@/views/excel/exportExcel'),
        name: 'ExportExcel',
        meta: { title: 'exportExcel' }
      },
      {
        path: 'export-selected-excel',
        component: () => import('@/views/excel/selectExcel'),
        name: 'SelectExcel',
        meta: { title: 'selectExcel' }
      },
      {
        path: 'upload-excel',
        component: () => import('@/views/excel/uploadExcel'),
        name: 'UploadExcel',
        meta: { title: 'uploadExcel' }
      }
    ]
  },

  {
    path: '/zip',
    component: Layout,
    redirect: '/zip/download',
    alwaysShow: true,
    meta: { title: 'zip', icon: 'zip' },
    children: [
      {
        path: 'download',
        component: () => import('@/views/zip/index'),
        name: 'ExportZip',
        meta: { title: 'exportZip' }
      }
    ]
  },

  {
    path: '/theme',
    component: Layout,
    redirect: 'noredirect',
    children: [
      {
        path: 'index',
        component: () => import('@/views/theme/index'),
        name: 'Theme',
        meta: { title: 'theme', icon: 'theme' }
      }
    ]
  },

  {
    path: '/clipboard',
    component: Layout,
    redirect: 'noredirect',
    children: [
      {
        path: 'index',
        component: () => import('@/views/clipboard/index'),
        name: 'ClipboardDemo',
        meta: { title: 'clipboardDemo', icon: 'clipboard' }
      }
    ]
  },

  {
    path: '/i18n',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/i18n-demo/index'),
        name: 'I18n',
        meta: { title: 'i18n', icon: 'international' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://github.com/PanJiaChen/vue-element-admin',
        meta: { title: 'externalLink', icon: 'link' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]
