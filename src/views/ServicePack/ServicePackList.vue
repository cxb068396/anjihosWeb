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
          packge_detail: row.packge_detail,
        }
      });
    },
    handleRowDelete(index,row){
        console.log(row)
        this.id=row.id
        this.axios
        .post('https://api.anjihos.newlioncity.com/admin/service/store?type=delpackge&id='+this.id).then(res=>{
           console.log(res)
        })
        
    },

    getList() {
   this.axios
        .get('https://api.anjihos.newlioncity.com/admin/service').then(res=>{
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
