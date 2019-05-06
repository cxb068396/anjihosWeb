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
        <el-breadcrumb-item>账单详情</el-breadcrumb-item>
      </el-breadcrumb>

      <div class="operation-nav">
          <el-button
            type="primary"
            icon="plus"
            @click="goBackPage"
          >返回列表</el-button>
      </div>

      
    </div>
    
    <div class='billTotal'>
      <span>账单编号:<b>{{FlatBillInfo[0].id}}</b></span>
      <span>
      截止时间:<b>{{FlatBillInfo[0].due_time*1000 | datetimeFilterDay}}</b>
      </span>
      <span>
      店铺名称:<b>{{FlatBillInfo[0].company_name}}</b>
      </span>
      <span>
      账单总价:<b>{{FlatBillInfo[0].price}}</b>
      </span>
      <span>
      是否打款:<b>{{FlatBillInfo[0].payed == '1' ? '已打款 ✔' : '未打款 ✖'}}</b>
      </span>
    </div>

    <el-table
      stripe
      style="width: 100%;"
      :data="FlatBillListInfo"
    >
      <el-table-column
        label="订单编号"
        prop="id"
        min-width="100"
      >
      </el-table-column>
      <el-table-column
        label="下单客户"
        prop="consignee"
        min-width="200"
      >
      </el-table-column>
      <el-table-column
        label="订单状态"
        prop="order_status_text"
        min-width="140"
      >
      </el-table-column>
      <el-table-column
        label="服务人员"
        prop="workerInfos.name"
        min-width="140"
      >
      </el-table-column>
      <el-table-column
        label="订单完成时间"
        prop="order_accepted_time"
        min-width="140"
      >
        <template slot-scope="scope">
          {{scope.row.order_accepted_time*1000 | datetimeFilterDay}}
        </template>
      </el-table-column>
<!--       <el-table-column
        label="加入时间"
        prop="add_time"
        min-width="180"
      >
      </el-table-column> -->
      <el-table-column
        label="订单服务商品"
        prop="goodsInfos[0].name"
        min-width="200"
      >
      </el-table-column>
       <el-table-column
        label="此单实付"
        prop="goodsInfos[0].retail_price"
        min-width="100"
      >
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
      <!-- <el-table-column
        fixed="right"
        label="详情"
        min-width="120"
      >
        <template slot-scope="scope">
          <el-button
            size="small"
            type='info'
            @click="handleRowInfo(scope.$index, scope.row)"
          >详情</el-button>
        </template>
      </el-table-column> -->
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
      FlatBillListInfo: [],
      id:0,
      FlatBillInfo:[{}],

    };
  },
  created() {
    this.id = this.$route.query.id
    this.FlatBillInfo[0].id = this.id
    this.FlatBillInfo[0].company_name = this.$route.query.company_name
    this.FlatBillInfo[0].due_time = this.$route.query.due_time
    this.FlatBillInfo[0].payed = this.$route.query.payed
    this.FlatBillInfo[0].price = this.$route.query.price
    this.handleFlatBillListInfo();
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
    goBackPage(){
      this.$router.push({name:"flatbill"});
    },
    //删除
    //详情
    // handleRowInfo(index, row) {
    //   this.$router.push({
    //     name: "flatbillinfo",
    //     query: {
    //       id: row.id,
    //       name: row.name,
    //       verified: row.verified,
    //       modifytime: row.modifytime,
    //       addtime: row.addtime,
    //       address: row.address,
    //       image_url: row.image_url
    //     }
    //   });
    // },
    //分页
    handlePageChange: function(val) {
      this.currentPage = val;
      this.handleFlatBillListInfo();
    },
    handleFlatBillListInfo() {
      this.axios.get("/companybill/info?id="+this.id, {
        params: { page: this.currentPage }
      }).then(response => {
        this.FlatBillListInfo = response.data.data.company_bill_orders;
        console.log(response.data)
        this.count = response.data.data.company_bill_orders.length;
      });
    },

  },
  mounted(){

  }
};
</script> 
<style >
.likeButton {
  border: none;
  background-color: rgba(255, 255, 255, 0);
}
.billTotal{
  display: inline-block;
  border: black 1px solid;
  padding: 10px;
  margin-bottom: 10px
}
.billTotal span{
  border-right: black 1px solid;
  padding: 14px 10px 11px 10px;
  margin-bottom: 1px
}
.billTotal span:last-child{
  border-right:none;
}
</style>
