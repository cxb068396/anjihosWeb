<template>
  <div class="content-page">
    <div class="content-nav">
      <el-breadcrumb
        class="breadcrumb"
        separator="/"
      >
        <el-breadcrumb-item :to="{path: '/dashboard'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>店铺列表</el-breadcrumb-item>
        <el-breadcrumb-item>选择店铺</el-breadcrumb-item>
      </el-breadcrumb>

    </div>
    <template>   
      <span style="margin:0px 10px">你已选择 {{TCA_length}} 家商店</span>
    </template>


    <el-date-picker
      class="dateInput"
      v-model="datavalue"
      type="date"
      placeholder="选择日期"
      format="yyyy 年 MM 月 dd 日"
      value-format="timestamp">
    </el-date-picker>
    <span>(仅生成选择日期之前生成的账单)</span>
    <el-button
      style="margin-left:10px"
      @click="makeNewBill"
      type="primary"
      icon="plus"
    >生成账单</el-button>
      <el-button
        @click="goBackPage"
        type="primary"
        icon="plus"
      >返回列表</el-button>
    <el-table
      stripe
      style="width: 100%;"
      :data="MerchantList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        label="店铺编号"
        prop="id"
        min-width="180"
      >
      </el-table-column>
      <el-table-column
        label="店铺名称"
        prop="name"
        min-width="180"
      >
      </el-table-column>
      <el-table-column
        label="加入时间"
        prop="addtime"
        min-width="180"
      >
      </el-table-column>
      <el-table-column
        label="店铺地址"
        prop="address"
        min-width="200"
      >
      </el-table-column>
      
      
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handlePageChange"
      :current-page="currentPage"
      :page-size="pagesize"
      layout="total, sizes,prev, pager, next, jumper"
      :total="count"
      :page-sizes="[5, 10, count]"
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
      MerchantList: [],
      datavalue:'',
      company_id:'',
      multipleSelection: [],
      temCompany_idArr:[],
      TCA_length:0,
      allCompany_idArr:[]
    };
  },
  watch: {
    multipleSelection: function(){
      this.temCompany_idArr = this.multipleSelection.map(obj=>obj.id)
      this.TCA_length = this.temCompany_idArr.length
    }
  },
  created() {
    this.handleMerchantList();
  },
  methods: {
    goBackPage(){
      this.$router.push({name:"flatbill"});
    },
    //店铺选择

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
   
    // sendAllCompany_id(){
    //   console.log(this.count)
    //   let allCompany_idArr = []
    //   for(let i = 1;i <= this.count;i++){
    //     allCompany_idArr.push(i)
    //   }
    //   this.$router.push({name:"flatbill",query:{
    //     allCompany_idArr:allCompany_idArr
    //   }})
    // },
    //删除
    //详情
    
    //分页
    handlePageChange: function(val) {
      this.currentPage = val;
      this.handleMerchantList();
    },
    handleSizeChange(val){
      this.pagesize = val
      this.handleMerchantList()
    },
    handleMerchantList() {
      this.axios
        .get("/company", {
          params: { page: this.currentPage,size: this.pagesize }
        })
        .then(response => {
          this.MerchantList = response.data.data.data;
          this.count = response.data.data.count;
        });
    },
    makeNewBill(){
      if(!this.datavalue||!this.temCompany_idArr){
        this.$message({
          type: "warning",
          message: "请将日期和店铺编号补充完全"
        });
      }else{
        // console.log(this.temCompany_idArr)
        // console.log(this.datavalue)
        this.axios.post("/companybill/store", { due_time: (this.datavalue/1000), companyIds:this.temCompany_idArr}).then(response => {
          console.log(response.data)
            if(response.data.errno ==0){
              if(response.data.data.companyHasOrdersNumber>0){
                this.$message({
                  type: "success",
                  message: "账单生成!"
                });
                this.goBackPage()
              }else{
                this.$message({
                  type: "warning",
                  message: "无账单可生成"
                });
              }
            }else{
              this.$message({
                type: "error",
                message: "输入数据有误或已存在相关订单!"
              });
            }
          })
      }
    },
  }
};
</script>
<style scoped>
.goBackPage{
  float: right;
  margin-bottom:10px 
}
.dateInput{
  margin:0 10px 10px 10px 
}
</style>
