<template>
  <div class="content-page">
    <div class="content-nav">
      <el-breadcrumb
        class="breadcrumb"
        separator="/"
      >
        <el-breadcrumb-item :to="{path: '/dashboard'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>服务管理</el-breadcrumb-item>
        <el-breadcrumb-item>资格管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-table
      stripe
      style="width: 100%;"
      :data="QualificationList"
    >
      <el-table-column
        label="服务名称"
        prop="goods_name"
        min-width="190"
      >
      </el-table-column>
      <el-table-column
        label="申请机构"
        prop="company_name"
        min-width="220"
      >
      </el-table-column>
      <!--       <el-table-column label="门店照片" prop="" min-width="250">    
      </el-table-column> -->
      <!--       <el-table-column label="申请资格" prop="goods_id" min-width="190">    
      </el-table-column> -->

      <el-table-column
        fixed="right"
        label="操作"
        min-width="120"
      >
        <template slot-scope="scope">
          <el-button
            size="small"
            type="danger"
            @click="handleRowAgree(scope.$index, scope.row)"
          >通过</el-button>
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
import api from "@/config/api";
export default {
  data() {
    return {
      currentPage: 1,
      count: 0,
      pagesize: 10,
      QualificationList: []
    };
  },
  prop: {
    id: 1
  },
  created() {
    this.handleQualificationList();
  },
  methods: {
    //删除
    handleRowAgree(index, row) {
      this.$confirm("通过该申请？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error"
      }).then(() => {
        this.axios
          .post("/companygoods/store", {
            id: row.id,
            verified: 1
          })
          .then(response => {
            if (response.data.errno === 0) {
              this.$message({
                type: "success",
                message: "已通过!"
              });
              this.handleQualificationList();
            }
          });
      });
    },
    //详情
    handleRowInfo(index, row) {
      // this.$router.push({name: 'order_info', query: {id: row.id}});
    },
    //分页
    handleSizeChange: function(size) {
      this.pagesize = size;
    },
    handlePageChange: function(val) {
      this.currentPage = val;
      this.handleQualificationList();
    },
    handleQualificationList() {
      this.axios
        .get("/companygoods?verified=0", {
          params: { page: this.currentPage }
        })
        .then(response => {
          // console.log(response.data.data.data)
          this.QualificationList = response.data.data.data;
          // .filter((x)=>x.verified==0)
          this.count = response.data.data.count;
        });
    }
  }
};
</script>
<style scoped>
</style>
