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
      stripe
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
      order_id: 333,
      tableData: [],
      headers: {
        "X-Anjishop-Token": localStorage.getItem("token") || ""
      },
      infoForm: {
        company_id: 0, //公司id
        id: 0, //订单id
        order_status: 12 //派单状态
        // worker_id:0 //工作人员的id
      },
      importantId: 0 //商品id
    };
  },
  methods: {
    //人员列表
    getList() {
      this.infoForm.id = this.$route.query.id
        ? this.$route.query.id
        : this.order_id;
      console.log(this.infoForm.id + "+" + this.order_id);
      this.importantId = this.$route.query.importantId;
      this.axios
        .get(
          "https://anji.newlioncity.com/admin/worker?company_id=" +
            this.$route.query.company_id
        )
        .then(response => {
          this.tableData = response.data.data.data;
        });
    },
    goBackPage() {
      this.$router.push({
        name: "ordersendcompany",
        query: {
          importantId: this.importantId,
          order_id: this.order_id
        }
      });
    },
    //可派单
    handleClickPost(row) {
      this.infoForm.worker_id = row.id;
      this.infoForm.company_id = row.company_id;
      this.axios
        .post("https://anji.newlioncity.com/admin/order/store", this.infoForm)
        .then(response => {
          if (response.data.errno == 0) {
            this.$message({
              type: "success",
              message: "派单成功"
            });
            this.$router.push({ name: "platformOrder" });
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
    this.order_id = this.$route.query.id;
  }
};
</script>

<style>
</style>
