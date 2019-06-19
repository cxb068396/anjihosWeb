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
        prop="id"
        label="团队编号"
        min-width="120"
      >
      </el-table-column>
      <el-table-column
        prop="doctorInfo.name"
        label="医生姓名"
        min-width="120"
      >
      </el-table-column>
      <el-table-column
        prop="nurseInfo.name"
        label="护士姓名"
        min-width="120"
      >
      </el-table-column>
      <el-table-column
        prop="pharmacistInfo.name"
        label="药师姓名"
        min-width='120'
      >
      </el-table-column>
      <el-table-column
        prop="healthManagerInfo.name"
        label="健康管家姓名"
        min-width='160'
      >
      </el-table-column>
      <el-table-column
        prop="serviceStaffInfo.name"
        label="服务人员姓名"
        min-width="160"
      >
      </el-table-column>
      <el-table-column
        prop="doctorInfo.mobile"
        label="医生电话"
        min-width="160"
      >
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="160"
      >
        <template slot-scope="scope">
          <el-button
            @click="handleClickPost(scope.$index, scope.row)"
            type="danger"
            size="small"
          >签约此团队</el-button>
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
      importantId: 0 //contractid
    };
  },
  methods: {
    //人员列表
    getList() {
      this.importantId = this.$route.query.contractid ? this.$route.query.contractid : this.$route.query.importantId
      this.axios
        .get(
          "/doctorteam?company_id=" +
            this.$route.query.company_id
        )
        .then(response => {
          this.tableData = response.data.data.data;
        });
    },
    goBackPage() {
      this.$router.push({
        name: "contractsendcompany",
        query: {
          importantId: this.importantId,
          order_id: this.order_id
        }
      });
    },
    //可派单
    // handleClickPost(row) {
    //   this.infoForm.worker_id = row.id;
    //   this.infoForm.company_id = row.company_id;
    //   this.axios
    //     .post("/order/store", this.infoForm)
    //     .then(response => {
    //       if (response.data.errno == 0) {
    //         this.$message({
    //           type: "success",
    //           message: "派单成功"
    //         });
    //         this.$router.push({ name: "platformOrder" });
    //       } else {
    //         this.$message({
    //           type: "error",
    //           message: "派单失败，请重新派单"
    //         });
    //       }
    //     })
    //     .catch(response => {});
    // }

    handleClickPost(index, row) {
      console.log(row)
      this.$confirm("通过签约请求？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error"
      }).then(() => {
        this.axios
          .post("/contract/store", {
            id: this.$route.query.contractid ? this.$route.query.contractid : this.$route.query.importantId,
            completed: 1,
            doctor_team_id:row.id
          })
          .then(response => {
            if (response.data.errno === 0) {
              this.$message({
                type: "success",
                message: "签约完成!"
              });
              this.$router.push({ name: "contractlist" });
            }
          });
      });
    },
  },
  mounted() {
    this.getList();
  }
};
</script>

<style>
</style>
