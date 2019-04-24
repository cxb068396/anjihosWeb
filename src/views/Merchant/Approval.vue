<template>
  <div class="content-page">
    <div class="content-nav">
      <el-breadcrumb
        class="breadcrumb"
        separator="/"
      >
        <el-breadcrumb-item :to="{path: '/dashboard'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>店铺管理</el-breadcrumb-item>
        <el-breadcrumb-item>商家入驻审批</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-table
      stripe
      style="width: 100%;"
      :data="ApprovalList"
    >
      <el-table-column
        label="申请商家"
        prop="name"
        min-width="180"
      >
      </el-table-column>
      <el-table-column
        label="申请时间"
        prop="addtime"
        min-width="180"
      >
      </el-table-column>
      <el-table-column
        label="目前状态"
        prop="verified"
        min-width="180"
      >
      <template slot-scope="scope">
        {{scope.row.verified == 1?'已通过':'未通过'}}
      </template>
      </el-table-column>
      <el-table-column
        label="商家编号"
        prop="id"
        min-width="200"
      >
      </el-table-column>
      <el-table-column
        prop="id"
        label="申请资格"
        min-width="120"
        :filters="[{ text: '已通过', value: '1' }, { text: '0', value: '未通过' }]"
        :filter-method="filterTag"
        filter-placement="bottom-end"
      >
        <template slot-scope="scope">
          <el-tag
            class="likeButton"
            :type="scope.row.verified == '1' ? 'primary' : 'success'"
            disable-transitions
          >{{scope.row.verified== '1' ? '已通过' : '未通过'}}</el-tag>
        </template>
      </el-table-column>

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
      ApprovalList: []
    };
  },
  created() {
    this.handleApprovalList();
  },
  methods: {
    //订单状态筛选
    formatter(row) {
      return row.address;
    },
    filterTag(value, row) {
      return row.verified === value;
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    //删除
    handleRowAgree(index, row) {
      this.$confirm("通过该申请？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error"
      }).then(() => {
        this.axios
          .post("https://anji.newlioncity.com/admin/company/store", {
            id: row.id,
            verified: 1
          })
          .then(response => {
            if (response.data.errno === 0) {
              this.$message({
                type: "success",
                message: "已通过!"
              });
              this.handleApprovalList();
            }
          });
      });
    },

    //分页
    handleSizeChange: function(size) {
      this.pagesize = size;
    },
    handlePageChange: function(val) {
      this.currentPage = val;
      this.handleApprovalList();
    },
    handleApprovalList() {
      this.axios
        .get("https://anji.newlioncity.com/admin/company?verified=0", {
          params: { page: this.currentPage }
        })
        .then(response => {
          // console.log(response.data.data.data)
          this.ApprovalList = response.data.data.data;
          this.count = response.data.data.count;
        });
    }
  }
};
</script>
<style scoped>
.likeButton {
  border: none;
  background-color: rgba(255, 255, 255, 0);
}
</style>
