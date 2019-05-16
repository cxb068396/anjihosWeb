<template>
  <div class="content-page">
    <div class="content-nav">
      <el-breadcrumb
        class="breadcrumb"
        separator="/"
      >
        <el-breadcrumb-item :to="{path: '/dashboard'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>账单功能</el-breadcrumb-item>
        <el-breadcrumb-item>账单列表</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- <div class="operation-nav">
        <router-link to="/dashboard/merchant/add">
          <el-button
            type="primary"
            icon="plus"
          >添加医院</el-button>
        </router-link>
      </div> -->

      
    </div>
    

    <!-- <el-button type="primary" @click="chooseMerchant" icon="arrow-left" class="">点击选择医院</el-button>
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
    </el-date-picker> -->

    <el-button type="primary" @click="chooseMerchant" icon="arrow-left" class="makeNewBillBtn">生成新账单</el-button>
    <el-table
      stripe
      style="width: 100%;"
      :data="FlatBillList"
    >
      <el-table-column
        label="账单编号"
        prop="id"
        min-width="140"
      >
      </el-table-column>
      
      <el-table-column
        label="截止时间"
        prop="due_time"
        min-width="140"
        :formatter="datetimeFilterDay"
      >
      </el-table-column>
<!--       <el-table-column
        label="加入时间"
        prop="add_time"
        min-width="180"
      >
      </el-table-column> -->
      <el-table-column
        label="医院名称"
        prop="company_name"
        min-width="200"
      >
      </el-table-column>
       <el-table-column
        label="账单总价"
        prop="price"
        min-width="200"
      >
      </el-table-column>
      <el-table-column
        label="是否打款"
        prop="payed"
        min-width="140"
      >
      <template slot-scope="scope">
      {{scope.row.payed == '1' ? '已打款 ✔' : '未打款 ✖'}}
      </template>
      </el-table-column>
<!--       <el-table-column
        prop="verified"
        label="资格状态"
        min-width="120"
        :filters="[{ text: '通过', value: 1 }, { text: '未通过', value: 0 }]"
        :filter-method="filterTag"
        filter-placement="bottom-end"
      >
        <template slot-scope="scope">
          <el-tag
            class="likeButton"
            :type="scope.row.verified == '1' ? 'primary' : 'success'"
            disable-transitions
          >{{scope.row.verified == '1' ? '已通过' : '未通过'}}</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column
        fixed="right"
        label="详情"
        min-width="100"
      >
        <template slot-scope="scope">
          <el-button  size="small" type='info' @click="handleRowInfo(scope.$index, scope.row)">详情</el-button>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        min-width="160"
      >
        <template slot-scope="scope">
          <el-button  size="small" 
          type="info" 
          @click="hasSendMoney(scope.$index, scope.row)" 
          v-bind:class="[scope.row.payed == 1 ? hasSend: goToSend]"
          >
          {{scope.row.payed == 1 ? '已打款' : '去打款'}}</el-button>
          <el-button  size="small" type="danger" @click="handleRowDelete(scope.$index, scope.row)" >删除</el-button>
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
      goToSend: "goToSend",
      hasSend: "hasSend",
      currentPage: 1,
      count: 0,
      pagesize: 10,
      FlatBillList: [],
      company_id:'',
      id:0,
    };
  },

  created() {
    this.handleFlatBillList();
  },
  mounted(){

  },
  methods: {

    chooseMerchant(){
      this.$router.push({name:'choosemerchant'})
    },
    //订单状态筛选
    // formatter(row) {
    //   return row.address;
    // },
    // filterTag(value, row) {
    //   return row.verified === value;
    // },
    // filterHandler(value, row, column) {
    //   const property = column["property"];
    //   return row[property] === value;
    // },
    //打款

    hasSendMoney(index, row){
      if(row.payed == 0){
        this.$confirm('将账单状态更改为已打款, 请谨慎操作', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.axios.post("/companybill/store", { id: row.id, payed:1,company_id:row.company_id}).then(response => {
            console.log(response.data)
            this.handleFlatBillList()
          })
          }).catch(() => {
                    
          });
      }else{
        this.$message({
          type: "warning",
          message: "此账单已经打过款了！"
        });
      }
    },
    //删除
    handleRowDelete(index, row) {
      this.$confirm("将此账单删除，操作不可撤回，请谨慎操作", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error"
      }).then(() => {
        this.axios.post("/companybill/destroy", { id: row.id }).then(response => {
          console.log(response.data)
          if (response.data.errno === 0) {
            this.handleFlatBillList()
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          }else{
            this.$message({
              type: "warning",
              message: "此账单已经支付，无法删除！"
            });
          }
        });
      });
    },
    //详情
    handleRowInfo(index, row) {
      console.log(row)
      this.$router.push({
        name: "flatbillinfo",
        query: {
          id: row.id,
          company_name:row.company_name,
          due_time:row.due_time,
          payed:row.payed,
          price:row.price
        }
      });
    },
    //分页
    handlePageChange: function(val) {
      this.currentPage = val;
      this.handleFlatBillList();
    },
    handleFlatBillList() {
      this.axios
        .get("/companybill", {
          params: { page: this.currentPage }
        })
        .then(response => {
          this.FlatBillList = response.data.data.data;
          this.count = response.data.data.count;
        });
    },
    datetimeFilterDay(row) {
      var date = new Date(row.due_time *1000);
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m < 10 && (m = "0" + m);
      var d = date.getDate();
      d < 10 && (d = "0" + d);
      return `${y}-${m}-${d}`;
    }
  }
};
</script>
<style scoped>
.makeNewBillBtn{
  margin-bottom: 10px ;
  float: right
}
.goToSend{
  background-color: rgb(245,108,108);
  border-color: rgb(245,108,108)
}
.goToSend:hover{
  background-color: rgba(245,108,108,0.7)
}
</style>
