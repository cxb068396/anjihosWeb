<template>
  <div class="personnel_app">
    <div class="content-nav">
      <el-breadcrumb
        class="breadcrumb"
        separator="/"
      >
        <el-breadcrumb-item :to="{path: '/dashboard'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>服务包管理</el-breadcrumb-item>
        <el-breadcrumb-item>服务包内容详情</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="operation-nav">
        <router-link to="servicepacklist">
          <el-button
            type="primary"
            icon="plus"
          >返回列表</el-button>
        </router-link>
      </div>
        <div class="operation-nav" style='margin-left:50px'>
        <router-link :to="{path:'servicepackdetailadd',query:{packge_id:this.$route.query.packge_id}}">
          <el-button
            type="primary"
            icon="plus"
          >添加服务详情</el-button>
        </router-link>
      </div>
    </div>
    <el-table
      :data="InfoData"
      style="width: 100%"
    >
      <el-table-column
        prop="id"
        label="编号"   
      >
      </el-table-column>
      <el-table-column
        prop="name"
        label="服务包具体内容"      
      >
      </el-table-column>
      <el-table-column
        prop="desc"
        label="内容描述"   
      >
      </el-table-column>
      <el-table-column
        prop="frequency"
        label="服务频次"       
      >
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            size="small"
            type="primary"
            @click="handleRowUpdated(scope.$index, scope.row)"
          >更新</el-button>
           <el-button
            size="small"
            type="danger"
            @click="handleRowDeleted(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
    
      InfoData: []
    };
  },
  methods: {
    handleRowUpdated(index, row) {
        console.log(row)
      this.$router.push({
        name: "servicepackdetailupdat",
        query: {
          name: row.name,
          desc:row.desc,
          frequency:row.frequency,
          id:row.id
        }
      });
    },

    handleRowDeleted(index,row){
        console.log(row)
        const params = {
        id: row.id,
        type:'delpackgedetail'    
      };
       this.$confirm('此操作将永久删除该条服务详情, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        this.axios
        .post('http://api.anjihos.z-y.tech/admin/service/store',params).then(res=>{
            this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.$router.go(-1);
        })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
        
    },
 

  },
  components: {},
  mounted() {
    this.InfoData = this.$route.query.packge_detail
  }
};
</script>

<style>
</style>