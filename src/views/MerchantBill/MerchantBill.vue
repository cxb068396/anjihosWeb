<template>
  <div class="personnel_app">
    <div class="content-nav">
      <el-breadcrumb
        class="breadcrumb"
        separator="/"
      >
        <el-breadcrumb-item :to="{path: '/dashboard'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>账单管理</el-breadcrumb-item>
        <el-breadcrumb-item>员工账单</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div style="float:right; margin-bottom:5px">
      <el-button
        type="primary"
        icon="plus"
        class='button'
        @click="goWorkerList"
      >生成账单</el-button>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        prop="worker_id"
        label="编号"
        min-width="120"
      >
      </el-table-column>
      <el-table-column
        prop="worker_name"
        label="姓名"
        min-width="120"
      >
      </el-table-column>
      <el-table-column
        prop="payed"
        label="是否打款"
        min-width="160"
        :formatter="ifendcase"
      >
      </el-table-column>
      <el-table-column
        prop="due_time"
        label="截至时间"
        min-width="160"
        :formatter='formatDate'
      >
      </el-table-column>
      <el-table-column
        prop="price"
        label="打款金额(元)"
        min-width="160"
      >
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        min-width="250"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="button"
            @click="handleRowCheck(scope.$index, scope.row)"
          >详情</el-button>
          <el-button
            size="mini"
            type="primary"
            :disabled="scope.row.payed === 1"
            @click="handleRowPay(scope.$index, scope.row)"
          >打款</el-button>
          <el-button
            size="mini"
            type="danger"
            :disabled="scope.row.payed === 1"
            @click="handleRowDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: center;margin-top: 30px;">
      <el-pagination
        background
        layout="total, prev, pager, next, jumper"
        :total="total"
        @current-change="current_change"
        @size-change="handleSizeChange"
        :current-page="currentPage"
        :page-size="pagesize"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      total: 0,
      currentPage: 1,
      pagesize: 10,
      workerIds: []
    };
  },
  methods: {
    handleRowCheck(index, row) {
      console.log(row);
      this.$router.push({
        name: "billgeneration",
        query: {
          id: row.id,
          price: row.price,
          worker_name: row.worker_name,
          payed: row.payed,
          due_time: row.due_time
        }
      });
    },
    //员工账单列表
    getWorkerList() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      this.axios
        .get("https://anji.newlioncity.com/admin/workerbill", {
          params: {
            page: this.currentPage,
            company_id: userInfo.company_id
          }
        })
        .then(response => {
          console.log(response.data.data.data);
          this.tableData = response.data.data.data;
          this.total = response.data.data.count;
          this.currentPage = response.data.data.currentPage;
        });
    },
    //跳转到员工列表
    goWorkerList() {
      this.$router.push({
        name: "workerbill"
      });
    },

    handleSizeChange(size) {
      this.pagesize = size;
      this.getWorkerList();
    },
    current_change(currentPage) {
      this.currentPage = currentPage;
      this.getWorkerList();
    },
    //时间过滤器
    formatDate(row) {
      var date = new Date(row.due_time * 1000);
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m < 10 && (m = "0" + m);
      var d = date.getDate();
      d < 10 && (d = "0" + d);
      return `${y}-${m}-${d}`;
    },
    ifendcase(val) {
      if (val.payed == "1 ") {
        return "是";
      } else if (val.payed == "2") {
        return "打款中";
      } else {
        return "否";
      }
    },
    //打款
    handleRowPay(index, row) {
      let params = {
        id: row.id,
        payed: 1,
        worker_id: row.worker_id
      };
      this.axios
        .post("https://anji.newlioncity.com/admin/workerbill/store", params)
        .then(response => {
          // console.log(response.data);
          if (response.data.errno === 0) {
            this.$message({
              type: "success",
              message: "打款成功"
            });
            this.getWorkerList();
          } else {
            this.$message({
              type: "error",
              message: "打款失败"
            });
          }
        });
    },
    //删除
    handleRowDelete(index, row) {
      this.axios
        .post("https://anji.newlioncity.com/admin/workerbill/destroy", {
          id: row.id
        })
        .then(response => {
          if (response.data.errno === 0) {
            this.$message({
              type: "success",
              message: "删除成功"
            });
            this.getWorkerList();
          } else {
            this.$message({
              type: "error",
              message: "删除失败"
            });
          }
        });
    }
  },

  components: {},
  mounted() {
    this.getWorkerList();
    this.workerIds = this.$route.query.workerIds;
  }
};
</script>

<style>
</style>
