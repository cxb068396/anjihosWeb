<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"/>
    <sidebar class="sidebar-container"/>
    <div class="main-container">
      <el-button round class='triangle' @click="showOrNot" id='btn'>隐藏</el-button>
      <el-collapse-transition>
        <div v-show="openOrNot">
          <navbar id="navbar"/>
          <tags-view id="tags"/>
        </div>
      </el-collapse-transition>
      <app-main/>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'

export default {
data() {
    return {
      openOrNot:true
    };
  },
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('closeSideBar', { withoutAnimation: false })
    },
    showOrNot(){
      if(this.openOrNot){
        document.getElementById('btn').innerHTML = "显示"
        this.openOrNot = !this.openOrNot
      }else{
        document.getElementById('btn').innerHTML = "隐藏"
        this.openOrNot = !this.openOrNot
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
  .triangle{
    text-align: center;
    position: absolute;
    font-size: 10px;
    left:47.5%;
    top:50px;
    z-index: 9999;
  }
</style>
