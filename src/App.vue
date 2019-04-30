<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default{
  name: 'App'
}
</script>

<style>
body {
  margin: 0;
}
html,
body,
#app {
  height: 100%;
  width: 100%;
  background: #f5f7f9;
  font-family: Lato, Helvetica, sans-serif;
}

.content-nav {
  height: 40px;
  background: #f5f7fa;
  margin: 0 0 0px 0;
  display: flex;
}


/* 面包屑重复，故，display:none */
.content-nav .breadcrumb {
  height: 40px;
  line-height: 40px;
  flex: 1;
  color: #8492a6;
  display: none
}

.content-nav .operation-nav {
  width: auto;
  display: flex;
  align-items: center;
}

.content-main {
  padding: 20px;
  background: #fff;
}
</style>
