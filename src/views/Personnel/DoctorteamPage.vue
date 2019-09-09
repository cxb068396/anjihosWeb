<template>
  <div class="personnel_app">
    <div class="content-nav">
      <el-breadcrumb class="breadcrumb" separator="/">
        <el-breadcrumb-item :to="{path: '/dashboard'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>人员管理</el-breadcrumb-item>
        <el-breadcrumb-item>人员列表</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="operation-nav">
        <router-link to="doctorteamaddpage">
          <el-button type="primary" icon="plus">添加新团队</el-button>
        </router-link>
      </div>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="id" label="团队编号" min-width="120"></el-table-column>
      <el-table-column prop="doctorInfo.name" label="医生姓名" min-width="120">
        <template slot-scope="scope">
          <span>{{scope.row.doctorInfo.name?scope.row.doctorInfo.name:'暂无'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="doctorInfo.mobile" label="医生电话" min-width="160">
        <template slot-scope="scope">
          <span>{{scope.row.doctorInfo.mobile?scope.row.doctorInfo.mobile:'暂无'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="nurseInfo.name" label="护士姓名" min-width="120">
        <template slot-scope="scope">
          <span>{{scope.row.nurseInfo.name?scope.row.nurseInfo.name:'暂无'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="nurseInfo.mobile" label="护士电话" min-width="120">
        <template slot-scope="scope">
          <span>{{scope.row.nurseInfo.mobile?scope.row.nurseInfo.mobile:'暂无'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="pharmacistInfo.name" label="药师姓名" min-width="120">
        <template slot-scope="scope">
          <span>{{scope.row.pharmacistInfo.name?scope.row.pharmacistInfo.name:'暂无'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="pharmacistInfo.mobile" label="药师电话" min-width="120">
        <template slot-scope="scope">
          <span>{{scope.row.pharmacistInfo.mobile?scope.row.pharmacistInfo.mobile:'暂无'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="healthManagerInfo.name" label="健康管家姓名" min-width="160">
        <template slot-scope="scope">
          <span>{{scope.row.healthManagerInfo.name?scope.row.healthManagerInfo.name:'暂无'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="healthManagerInfo.mobile" label="健康管家电话" min-width="160">
        <template slot-scope="scope">
          <span>{{scope.row.healthManagerInfo.mobile?scope.row.healthManagerInfo.mobile:'暂无'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="serviceStaffInfo.name" label="服务人员姓名" min-width="160">
        <template slot-scope="scope">
          <span>{{scope.row.serviceStaffInfo.name?scope.row.serviceStaffInfo.name:'暂无'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="serviceStaffInfo.mobile" label="服务人员电话" min-width="160">
        <template slot-scope="scope">
          <span>{{scope.row.serviceStaffInfo.mobile?scope.row.serviceStaffInfo.mobile:'暂无'}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
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
      </el-table-column>-->
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
      ></el-pagination>
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
        name: "personnelupdatepage",
        query: {
          id: row.id,
          address: row.address,
          age: row.age,
          name: row.name,
          sex: row.sex,
          hiredate: row.hiredate,
          mobile: row.mobile,
          worker_role_id: row.worker_role_id
        }
      });
    },

    getList() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      let company_id = userInfo.company_id;
      this.axios
        .get("/doctorteam?company_id=" + company_id, {
          params: {
            page: this.currentPage
          }
        })
        .then(response => {
          this.tableData = response.data.data.data;
          console.log(response.data.data.data);
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
