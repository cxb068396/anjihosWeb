<template>
  <div class="left-box">
    <div class="log">
      <img
        src="../../assets/logo.png"
        alt="logo"
        id="logoImg"
      >
    </div>
    <el-menu
      class="sidebar"
      :unique-opened="true"
      :default-active="currentPagePath"
      @open="handleOpen"
      :router="true"
      theme="dark"
      @close="handleClose"
      text-color="#fff"
      active-text-color="#ffd04b"
      background-color="#324157"
    >

      <el-menu-item
        index="/dashboard"
        v-if="isPlatformAdmin == true"
      >
        <i class="fa fa-tachometer"></i>
        <span>后台主页</span>
      </el-menu-item>
      <el-submenu
        index="goods"
        v-if="isPlatformAdmin == true"
      >
        <template slot="title">
          <i calss="fa fa-product-hunt"></i>
          <span>商品管理</span>
        </template>
        <el-menu-item index="/dashboard/goods">
          <i class="fa fa-circle"></i>
          <span>商品列表</span>
        </el-menu-item>
        <el-menu-item index="/dashboard/category">
          <i class="fa fa-circle"></i>
          <span>商品分类</span>
        </el-menu-item>
      </el-submenu>
      <el-submenu
        index="operate"
        v-if="isPlatformAdmin == true"
      >
        <template slot="title">
          <i class="fa fa-large fa-truck"></i>
          <span>店铺管理</span>
        </template>
        <el-menu-item index="/dashboard/merchant">
          <i class="fa fa-circle"></i>
          <span>商家列表</span>
        </el-menu-item>
        <el-menu-item index="/dashboard/approval">
          <i class="fa fa-circle"></i>
          <span>商家入驻审批</span>
        </el-menu-item>
        <el-menu-item index="/dashboard/merchantgoods">
          <i class="fa fa-circle"></i>
          <span>商家商品审批</span>
        </el-menu-item>
      </el-submenu>

      <el-submenu
        index="order"
        v-if="isPlatformAdmin == true"
      >

        <template slot="title">
          <i class="fa fa-large fa-truck"></i>
          <span>订单中心</span>
        </template>
        <el-menu-item index="/dashboard/platformOrder">
          <i class="fa fa-circle"></i>
          <span>订单列表</span>
        </el-menu-item>
      </el-submenu>

      <el-submenu
        index="flatbill"
        v-if="isPlatformAdmin == true"
      >
        <template slot="title">
          <i class="fa fa-large fa-users"></i>
          <span>账单功能</span>
        </template>
        <el-menu-item index="/dashboard/flatbill">
          <i class="fa fa-circle"></i>
          <span>账单列表</span>
        </el-menu-item>
      </el-submenu>

      <!-- <el-submenu index="user" v-if="isPlatformAdmin == true">

        <template slot="title">
          <i class="fa fa-large fa-users"></i>
          <span>用户管理</span>
        </template>
        <el-menu-item index="/dashboard/user">
          <i class="fa fa-circle"></i>
          <span>会员列表</span>
        </el-menu-item>
      </el-submenu> -->
      <el-submenu
        index="service"
        v-if="isPlatformAdmin == true"
      >
        <template slot="title">
          <i class="fa fa-large fa-users"></i>
          <span>服务管理</span>
        </template>
        <el-menu-item index="/dashboard/service">
          <i class="fa fa-circle"></i>
          <span>资格列表</span>
        </el-menu-item>
        <el-menu-item index="/dashboard/qualification">
          <i class="fa fa-circle"></i>
          <span>资格申请管理</span>
        </el-menu-item>
      </el-submenu>

      <el-submenu
        index="personnel"
        v-if="isMerchatAdmin == true"
      >
        <template slot="title">
          <i calss="fa fa-product-hunt"></i>
          <span>人员管理</span>
        </template>
        <el-menu-item index="/dashboard/personnel">
          <i class="fa fa-circle"></i>
          <span>人员列表</span>
        </el-menu-item>
      </el-submenu>

      <!-- <el-submenu index="account" v-if="isMerchatAdmin == true">
        <template slot="title">
          <i class="fa fa-large fa-truck"></i>
          <span>账户管理</span>
        </template>
        <el-menu-item index="/dashboard/account">
          <i class="fa fa-circle"></i>
          <span>账户详情</span>
        </el-menu-item>
      </el-submenu>-->

      <el-submenu
        index="order"
        v-if="isMerchatAdmin == true"
      >
        <template slot="title">
          <i class="fa fa-large fa-truck"></i>
          <span>订单管理</span>
        </template>
        <el-menu-item index="/dashboard/merchantOrder">
          <i class="fa fa-circle"></i>
          <span>订单列表</span>
        </el-menu-item>
      </el-submenu>
      <el-submenu
        index="servecontent"
        v-if="isMerchatAdmin == true"
      >
        <template slot="title">
          <i class="fa fa-large fa-truck"></i>
          <span>服务管理</span>
        </template>
        <el-menu-item index="/dashboard/servecontent">
          <i class="fa fa-circle"></i>
          <span>服务列表</span>
        </el-menu-item>
        <el-menu-item index="/dashboard/serveaddpage">
          <i class="fa fa-circle"></i>
          <span>服务添加申请</span>
        </el-menu-item>
      </el-submenu>
      <el-submenu
        index="merchantbill"
        v-if="isMerchatAdmin == true"
      >
        <template slot="title">
          <i class="fa fa-large fa-truck"></i>
          <span>账单管理</span>
        </template>
        <el-menu-item index="/dashboard/merchantbill">
          <i class="fa fa-circle"></i>
          <span>员工账单</span>
        </el-menu-item>
        <el-menu-item index="/dashboard/shopbill">
          <i class="fa fa-circle"></i>
          <span>店铺账单</span>
        </el-menu-item>
      </el-submenu>

      <el-submenu
        index="advertisement"
        v-if="isPlatformAdmin == true"
      >
        <template slot="title">
          <i class="fa fa-large fa-users"></i>
          <span>广告管理</span>
        </template>
        <el-menu-item index="/dashboard/advertisement">
          <i class="fa fa-circle"></i>
          <span>小程序首页</span>
        </el-menu-item>
      </el-submenu>

      

    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isMerchatAdmin: false,
      isPlatformAdmin: true,
      currentPagePath: "/dashboard"
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    hasOwn() {}
  },
  mounted() {
    console.log(this.$route.path);
    if (localStorage.getItem("userInfo")) {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (userInfo.admin_role_id == 1) {
        //平台后台
        this.isMerchatAdmin = false;
        this.isPlatformAdmin = true;
      } else if (userInfo.admin_role_id == 2) {
        // 商家后台
        this.isMerchatAdmin = true;
        this.isPlatformAdmin = false;
      }
      console.log("this.isMerchatAdmin: " + this.isMerchatAdmin);
      console.log("this.isPlatformAdmin: " + this.isPlatformAdmin);
    }
  }
};
</script>

<style>
.left-box {
  width: 200px;
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 5;
  height: 100%;
  float: left;
  flex-direction: column;
  background: #324157;
}

.left-box .sidebar {
  width: 200px;
  flex: 1;
  border-radius: 0;
  background: #324157;
}

.left-box .fa {
  margin-right: 0px;
  font-size: 18px;
}

.left-box .el-submenu .el-menu-item .fa {
  margin-right: 10px;
  font-size: 10px;
}

.left-box .logo {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 120px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.5);
}

.left-box .logo img {
  height: 40px;
  width: 40px;
}
#logoImg {
  height: 100px;
  margin: 50px 0 0 50px;
}
</style>
