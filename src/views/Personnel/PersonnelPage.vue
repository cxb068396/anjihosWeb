<template>
  <div class="personnel_app">
    <div class="content-nav">
      <el-breadcrumb
        class="breadcrumb"
        separator="/"
      >
        <el-breadcrumb-item :to="{path: '/dashboard'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>人员管理</el-breadcrumb-item>
        <el-breadcrumb-item>人员列表</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="operation-nav">
        <router-link to="/dashboard/personnel/add">
          <el-button
            type="primary"
            icon="plus"
          >添加成员</el-button>
        </router-link>
      </div>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        prop="id"
        label="编号"
        min-width="120"
      >
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        min-width="120"
      >
      </el-table-column>
      <el-table-column
        prop="age"
        label="年龄"
        min-width="120"
      >
      </el-table-column>
      <el-table-column
        prop="sex"
        label="性别"
        min-width='120'
      >
      </el-table-column>
      <el-table-column
        label="入职日期"
        min-width='160'
        prop='hiredate'
        :formatter='formatDate'
      >
      </el-table-column>
      <el-table-column
        prop="address"
        label="住址"
        min-width="160"
      >
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="联系方式"
        min-width="160"
      >
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        min-width="120"
      >
        <template slot-scope="scope">
          <el-button
            size="small"
            type="button"
            @click="handleRowUpdated(scope.$index, scope.row)"
          >更新</el-button>
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
      total: 0,
      currentPage: 1,
      pagesize: 10,
      tableData: []
    };
  },
  methods: {
    handleRowUpdated(index, row) {
      this.$router.push({
        name: "personnel_updat",
        query: {
          id: row.id,
          address: row.address,
          age: row.age,
          name: row.name,
          sex: row.sex,
          hiredate: row.hiredate,
          mobile: row.mobile
        }
      });
    },

    getList() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      let company_id = userInfo.company_id;
      this.axios
        .get(
          "https://anji.newlioncity.com/admin/worker?company_id=" + company_id,
          {
            params: {
              page: this.currentPage
            }
          }
        )
        .then(response => {
          this.tableData = response.data.data.data;
          // console.log(response.data.data.data)
          this.total = response.data.data.count;
          this.currentPage = response.data.data.currentPage;
          // this.pageSize=response.data.data.pageSize
        });
    },
    handleSizeChange(size) {
      this.pagesize = size;
      this.getList();
    },
    current_change(currentPage) {
      this.currentPage = currentPage;
      this.getList();
    },
    //时间过滤器
    formatDate(row) {
      var date = new Date(row.hiredate * 1000);
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m < 10 && (m = "0" + m);
      var d = date.getDate();
      d < 10 && (d = "0" + d);
      return `${y}-${m}-${d}`;
    }
  },
  components: {},
  mounted() {
    this.getList();
  }
};
</script>

<style>
</style>
