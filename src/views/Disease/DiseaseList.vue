<template>
  <div class="personnel_app">
    <div class="content-nav">
      <el-breadcrumb
        class="breadcrumb"
        separator="/"
      >
        <el-breadcrumb-item :to="{path: '/dashboard'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>病种管理</el-breadcrumb-item>
        <el-breadcrumb-item>服务列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        prop="那么"
        label="病种名称"
        min-width="120"
      >
      </el-table-column>
      <el-table-column
        prop="leave"
        label="病种等级"
        min-width="120"
      >
      </el-table-column>
      <el-table-column
        prop="defendplan"
        label="维护计划"
        min-width="120"
      >
      </el-table-column>
      <el-table-column
        prop="times"
        label="频次"
        min-width='120'
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
          >编辑</el-button>
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
        name: "personnelupdatepage",
        query: {
        name:row.name,
        leave:row.leave,
        defendplan:row.defendplan,
        times:row.times
        }
      });
    },

    getList() {
     
    },
    handleSizeChange(size) {
      this.pagesize = size;
    },
    current_change(currentPage) {
      this.currentPage = currentPage;
    },
 
  },
  components: {},
  mounted() {
    this.getList();
  }
};
</script>

<style>
</style>
