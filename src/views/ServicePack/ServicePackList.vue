<template>
  <div class="personnel_app">
    <div class="content-nav">
      <el-breadcrumb
        class="breadcrumb"
        separator="/"
      >
        <el-breadcrumb-item :to="{path: '/dashboard'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>服务包管理</el-breadcrumb-item>
        <el-breadcrumb-item>服务包列表</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="operation-nav">
        <router-link to="servicepackadd">
          <el-button
            type="primary"
            icon="plus"
          >添加服务包</el-button>
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
      >
      </el-table-column>
      <el-table-column
        prop="name"
        label="服务包名称"      
      >
      </el-table-column>
      <el-table-column
        prop="desc"
        label="服务包描述"   
      >
      </el-table-column>
      <el-table-column
        prop="createdat"
        label="创建时间"       
      >
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            size="small"
            type="info"
            @click="handleRowInfo(scope.$index, scope.row)"
          >详情</el-button>
            <el-button
            size="small"
            type="primary"
            @click="handleRowUpdated(scope.$index, scope.row)"
          >更新</el-button>
           <el-button
            size="small"
            type="danger"
            @click="handleRowDelete(scope.$index, scope.row)"
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
      tableData: [],
      id:''
    };
  },
  methods: {
    handleRowInfo(index, row) {
        console.log(row)
      this.$router.push({
        name: "servicepackinfo",
        query: {
          packge_id:row.id,
          packge_detail: row.packge_detail,
        }
      });
    },
      handleRowUpdated(index, row) {
        console.log(row)
      this.$router.push({
        name: "servicepackupdat",
        query: {
          name: row.name,
          desc:row.desc,
          id:row.id
        }
      });
    },
    handleRowDelete(index,row){
        console.log(row)
        this.id=row.id
        const params = {
        id: this.id,
        type:'delpackge'    
      };
       this.$confirm('此操作将永久删除该服务包, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        this.axios
        .post('https://api.anjihos.z-y.tech/admin/service/store',params).then(res=>{
            this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getList();
        })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
        
    },

   getList() {
   this.axios
        .get('https://api.anjihos.z-y.tech/admin/service').then(res=>{
            this.tableData=res.data.data
        })
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
