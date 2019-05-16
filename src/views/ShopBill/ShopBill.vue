<template>
  <div class="personnel_app">
    <div class="content-nav">
      <el-breadcrumb
        class="breadcrumb"
        separator="/"
      >
        <el-breadcrumb-item :to="{path: '/dashboard'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>账单管理</el-breadcrumb-item>
        <el-breadcrumb-item>医院账单</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        prop="company_id"
        label="公司编号"
        min-width="120"
      >
      </el-table-column>
      <el-table-column
        prop="company_name"
        label="医院名称"
        min-width="120"
      >
      </el-table-column>
      <el-table-column
        prop="due_time"
        label="截止时间"
        min-width="120"
        :formatter='formatDate'
      >
      </el-table-column>
      <el-table-column
        prop="price"
        label="应打款金额(元)"
        min-width='120'
      >
      </el-table-column>
      <el-table-column
        label="是否打款"
        min-width='160'
        prop='payed'
        :formatter="ifendcase"
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
      pagesize: 10
    };
  },
  methods: {
    getShopbill() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      this.axios
        .get("/companybill", {
          params: {
            page: this.currentPage,
            company_id: userInfo.company_id
          }
        })
        .then(response => {
          this.tableData = response.data.data.data;
          this.total = response.data.data.count;
          this.currentPage = response.data.data.currentPage;
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
    handleRowCheck(index, row) {
      console.log(row);
      this.$router.push({
        name: "shopbillinfo",
        query: {
          id: row.id,
          company_name: row.company_name,
          price: row.price,
          payed: row.payed,
          due_time: row.due_time
        }
      });
    }
  },
  components: {},
  mounted() {
    this.getShopbill();
  }
};
</script>

<style>
</style>
