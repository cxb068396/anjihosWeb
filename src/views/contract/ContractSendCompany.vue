<template>
  <div class="single_app">
    <div class="content-nav">
      <el-breadcrumb
        class="breadcrumb"
        separator="/"
      >
        <el-breadcrumb-item :to="{path: '/dashboard'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>可派商店</el-breadcrumb-item>
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
        prop="name"
        label="可签约机构"
      >
      </el-table-column>
      <el-table-column
        fixed="right"
        label="判单"
        width="100"
      >
        <template slot-scope="scope">
          <el-button
            @click="handleClickPost(scope.row)"
            type="danger"
            size="small"
          >签约此院</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handlePageChange"
      :current-page="currentPage"
      :page-size="pagesize"
      layout="total, prev, pager, next, jumper"
      :total="count"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentPage: 1,
      count: 0,
      pagesize: 10,
      contractid: 0,
      goods_id: 0,
      tableData: [],
      headers: {
        "X-Anjishop-Token": localStorage.getItem("token") || ""
      },
      infoForm: {
        company_id: 0, //公司id
        id: 0, //订单id
        order_status: 12, //派单状态
        worker_id: 0 //工作人员的id
      },
      adminAddInfoForm:{

      }
    };
  },
  created() {
    this.getList();
    this.contractid = this.$route.query.id
      ? this.$route.query.id
      : this.$route.query.contractid;
    this.infoForm.id = this.contractid;
    this.adminAddInfoForm = this.$route.query.adminAddInfoForm
    console.log(this.infoForm.id + "+" + this.contractid);
  },
  mounted() {},
  methods: {
    //分页
    handlePageChange: function(val) {
      this.currentPage = val;
      this.getList();
    },
    getList() {
      this.axios
        .get("/company?is_hospital=1", {
          params: { page: this.currentPage }
        })
        .then(response => {
          console.log(response)
          this.tableData = response.data.data.data;
          this.count = response.data.data.count;
        });
    },
    goBackPage() {
      this.$router.push({ name: "contractaddpage" });
    },
    //选择此医院
    handleClickPost(row) {
      console.log(this.$route.query);
      console.log(row);
      this.$router.push({
        name: "contractsendworker",
        query: {
          contractid: this.$route.query.contractid ? this.$route.query.contractid : this.contractid,
          company_id: row.id,
          importantId: this.contractid ? this.contractid : this.$route.query.importantId,
          adminAddInfoForm:this.adminAddInfoForm
        }
      });
    }
  }
};
</script>

<style>
</style>
