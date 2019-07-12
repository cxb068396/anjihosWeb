<template>
  <div class="content-page">
    <div class="content-nav">
      <el-breadcrumb
        class="breadcrumb"
        separator="/"
      >
        <el-breadcrumb-item :to="{path: '/dashboard'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        <el-breadcrumb-item>订单评论</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="operation-nav">
        <el-button
          type="primary"
          @click="goBackPage"
          icon="arrow-left"
        >返回列表</el-button>
      </div>
    </div>
    <div class='styleCss'>
      <div style='display:inline-block;margin:50px 50px 20px 150px;'>
        <div> <img :src="avatar"></div>
        <div> <span class='csscomment'>{{nickname}}</span></div>
      </div>
      <div style='display:inline-block;margin:100px 50px 20px 50px;'>
        <div><span class='comment'>综合评分</span>: <span class='satr'>
            <el-rate
              v-model="value5"
              disabled
              show-score
              text-color="#ff9900"
              style='display:inline'
            >
            </el-rate>
          </span></div>
        <div style='display:flex;flex-direction:row;'><span class='comment'>用户评论</span>: <span
            class='csscomment'
            style='display:inline-block;width:300px;'
          >{{commentInfos.content}}</span></div>
        <div><span
            class='comment'
            style='font-size:14px;'
          >发表时间</span>: <span>{{commentInfos.add_time}}</span></div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      commentInfos: "",
      value5: 5,
      user_info: "",
      avatar: "",
      nickname: "",
      id: ""
    };
  },
  created() {},
  methods: {
    goBackPage() {
      this.$router.push({
        path: "merchantOrder",
        name:"merchantOrder",
        params:{
          xx:"xxx"
        }
      })
    },
    //已经完成的单子
    finishedOrderList() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      let company_id = userInfo.company_id;
      this.axios
        .get("/order/info?id=" + this.id)
        .then(response => {
          // console.log(response.data.data);
          this.commentInfos = response.data.data.commentInfos;
          this.value5 = response.data.data.commentInfos.star;
          this.avatar = response.data.data.commentInfos.user_info.avatar;
          this.nickname = response.data.data.commentInfos.user_info.nickname;
          //console.log(this.commentInfos);
        });
    }
  },

  mounted() {
    this.id = this.$route.query.id;
    this.finishedOrderList();

    console.log(this.$route.query.id);
  }
};
</script>
<style scoped>
.styleCss {
  width: 100%;
  height: 400px;
  background: #fff;
  display: flex;
  flex-direction: row;
}

.styleCss div {
  margin: 10px 0;
}
.comment {
  font-size: 14px;
  font-family: serif;
}
.csscomment {
  font-size: 18px;
  font-family: SimHei;
  margin-left: 20px;
}
.satr {
  color: red;
  font-size: 16px;
  font-style: bold;
}
.styleCss div img {
  border-radius: 50%;
}
</style>
