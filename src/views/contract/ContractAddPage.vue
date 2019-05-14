<template>
  <div class="content-page">
    <div class="content-nav">
      <el-breadcrumb
        class="breadcrumb"
        separator="/"
      >
        <el-breadcrumb-item :to="{path: '/dashboard'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>签约管理</el-breadcrumb-item>
        <el-breadcrumb-item>签约申请</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-table
      stripe
      style="width: 100%;"
      :data="QualificationList"
    >
      <el-table-column
        prop="id"
        label="签约编号"
        min-width="100"
      >
      </el-table-column>
      <el-table-column
        prop="addressInfo.full_region"
        label="地址"
        min-width="100"
      >
      </el-table-column>
      <el-table-column
        prop="addressInfo.address"
        label="详细地址"
        min-width="100"
      >
      </el-table-column>
      <el-table-column
        prop="addressInfo.name"
        label="姓名"
        min-width="80"
      >
      </el-table-column>
      <el-table-column
        prop="age"
        label="年龄"
        min-width="180"
      >
        <!-- <template scope="scope">
          <img
            v-if="scope.row.list_pic_url"
            :src="scope.row.list_pic_url"
            class="image-show"
          >
        </template> -->
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="签约时间"
        min-width="120"
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
            @click="contractSend(scope.$index, scope.row)"
          >选择签约</el-button>
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
    //通过签约请求
    // handleRowAgree(index, row) {
    //   this.$confirm("通过签约请求？", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "error"
    //   }).then(() => {
    //     this.axios
    //       .post("/contract/store", {
    //         id: row.id,
    //         completed: 1,
    //         workerId:1
    //       })
    //       .then(response => {
    //         if (response.data.errno === 0) {
    //           this.$message({
    //             type: "success",
    //             message: "已通过!"
    //           });
    //           this.$router.push({ name: "contractlist" });
    //         }
    //       });
    //   });
    // },
    contractSend(index, row) {
      console.log(row)
      this.$router.push({
        name: "contractsendcompany",
        query: {
          contractid: row.id,
          workerId:row.workerId
        }
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
        .get("/contract?completed=0", {
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
