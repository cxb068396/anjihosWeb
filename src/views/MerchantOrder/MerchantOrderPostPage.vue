<template>
  <div class="single_app">
    <div class="content-nav">
      <el-breadcrumb
        class="breadcrumb"
        separator="/"
      >
        <el-breadcrumb-item :to="{path: '/dashboard'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>可派人员</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="operation-nav">
        <el-button
          type="primary"
          @click="goBackPage"
          icon="arrow-left"
        > 返回列表 </el-button>
      </div>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        fixed
        prop="id"
        label="员工编号"
      >
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
      >
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100"
      >
        <template slot-scope="scope">
          <el-button
            @click="handleClickPost(scope.row)"
            type="danger"
            size="small"
          >确认派单</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: []
    };
  },
  methods: {
    goBackPage() {
      this.$router.go(-1);
    },
    //人员列表
    getList() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      let company_id = userInfo.company_id;
      this.axios
        .get(
          "/worker?company_id=" + company_id
        )
        .then(response => {
          this.tableData = response.data.data.data;
        });
    },
    //可派单
    handleClickPost(row) {
      let id = this.$route.query.id;
      this.axios
        .post("/order/store", {
          company_id: row.company_id, //公司id
          id: id, //订单id
          order_status: 12, //派单状态
          worker_id: row.id //工作人员的id
        })
        .then(response => {
          if (response.data.errno == 0) {
            this.$message({
              type: "success",
              message: "派单成功"
            });
            this.$router.go(-1);
          } else {
            this.$message({
              type: "error",
              message: "派单失败，请重新派单"
            });
          }
        })
        .catch(response => {});
    }
  },
  mounted() {
    this.getList();
  }
};
</script>

<style>
</style>
