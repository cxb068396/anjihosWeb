<template>
  <div class="content-page">
    <div class="content-nav">
      <el-breadcrumb class="breadcrumb" separator="/">
        <el-breadcrumb-item :to="{path: '/dashboard'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>服务管理</el-breadcrumb-item>
        <el-breadcrumb-item>服务资格</el-breadcrumb-item>
      </el-breadcrumb>
      </div>
     <el-table stripe style="width: 100%;":data="ServiceList" >
      <el-table-column label="商家名称" prop="company_name" min-width="220">    
      </el-table-column>
      <el-table-column label="服务名称" prop="goods_name" min-width="260">    
      </el-table-column>
<!--       <el-table-column label="店铺地址" prop="consignee" min-width="220">    
      </el-table-column> -->
<!--       <el-table-column label="具备资格" prop="goods_id" min-width="200">    
      </el-table-column> -->

      <el-table-column label="资格状态" prop="verified" min-width="180">   <!--  1，0转换成文字状态 -->
        <template slot-scope="scope">
          {{scope.row.verified == 1?'已通过':'未通过'}}
        </template>
      </el-table-column>

  <!--   <el-table-column
      fixed="right"
      label="订单详情"
      width="120">
      <template slot-scope="scope">
        <el-button size="small" type='info'  @click="handleRowInfo(scope.$index, scope.row)">详情</el-button>
      </template>
    </el-table-column> -->
     
    </el-table>
    <el-pagination @current-change="handlePageChange" :current-page="currentPage" :page-size="pagesize" layout="total, prev, pager, next, jumper" :total="count">
      </el-pagination>
  </div>
</template>

<script>
import api from '@/config/api';
export default {
  data () {
      return {
        currentPage:1,
        count:0,    
        pagesize:10,    
        ServiceList: []
      }
  },
  prop:{
    id:1
  },
  created() {
        this.handleServiceList()
    },
    methods: {
    //删除
    //    handleRowDelete(index, row) {
    //   this.$confirm('确定要删除？', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'error'
    //   }).then (() => {
    //     this.axios.post('https://anji.newlioncity.com/admin/order', { id: row.id }).then(response => {
    //       if (response.data.errno === 0) {
    //         this.$message({
    //           type: 'success',
    //           message: '删除成功!'
    //         });
    //      this.handleServiceList()
    //       }
    //     });
    //   });
    // },
    //详情
     handleRowInfo(index, row) {
      // this.$router.push({name: 'order_info', query: {id: row.id}});
    },
    //分页 
        handleSizeChange: function (size) {
                this.pagesize = size;
        },
        handlePageChange: function(val){      
          this.currentPage = val;
          this.handleServiceList()
        },
        handleServiceList() {

            this.axios.get('https://anji.newlioncity.com/admin/companygoods',{params:{page: this.currentPage}}).then(response => { 
              console.log(response.data.data.data)
                this.ServiceList = response.data.data.data
                this.count = response.data.data.count;
            })
        }
    }
}
 
</script>
<style scoped>

</style>
