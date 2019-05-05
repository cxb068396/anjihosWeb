<template>
  <div class="personnel_app">
    <div class="content-nav">
      <el-breadcrumb
        class="breadcrumb"
        separator="/"
      >
        <el-breadcrumb-item :to="{path: '/dashboard'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>店铺管理</el-breadcrumb-item>
        <el-breadcrumb-item>店铺账单</el-breadcrumb-item>
        <el-breadcrumb-item>账单详情</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="operation-nav">
        <router-link to="/dashboard/shopbill">
          <el-button
            type="primary"
            icon="plus"
          >返回列表</el-button>
        </router-link>
      </div>
    </div>
    <div class='worker'>
      <span style='padding: 0 10px 0 10px;'><b>账单汇总</b></span>
      <span style='padding: 0 10px 0 0;'>公司名称:<b>{{company_name}}</b></span>
      <span style='padding: 0 10px 0 0;'>待付款:<b>{{price}}</b>/元</span>
      <span style='padding: 0 10px 0 0;'>是否付款:<b>{{payed===1?"是":"否"}}</b></span>
      <span style='padding: 0 10px 0 0;'>截至时间:<b>{{due_time*1000 | datetimeFilterDay}}</b></span>
    </div>
    <el-table
      stripe
      style="width: 100%;"
      :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
    >
      <el-table-column
        label="订单编号"
        prop="id"
        min-width="140"
      >
      </el-table-column>
      <el-table-column
        label="订单状态"
        prop="order_status_text"
        min-width="140"
      >
      </el-table-column>
      <el-table-column
        label="开始时间"
        min-width='160'
        prop='worker_started_time'
      >
        <template slot-scope="scope">
          {{scope.row.worker_started_time*1000 | datetimeFilter}}
        </template>
      </el-table-column>
      <el-table-column
        label="完成时间"
        min-width='160'
        prop='worker_finished_time'
      >
        <template slot-scope="scope">
          {{scope.row.worker_finished_time*1000 | datetimeFilter}}
        </template>
      </el-table-column>
      <el-table-column
        label="商品名称"
        prop="goodsInfos[0].name"
        min-width="200"
      >
      </el-table-column>
      <el-table-column
        label="接单人"
        prop="workerInfos.name"
        min-width="140"
      >
      </el-table-column>
      <el-table-column
        label="此单实付(元)"
        prop="goodsInfos[0].retail_price"
        min-width="200"
      >
      </el-table-column>
    </el-table>
    <div style="text-align: center;margin-top: 30px;">
      <el-pagination
        background
        layout="total, prev, pager, next, jumper"
        :total="total"
        @current-change="current_change"
        @size-change="handleSizeChange"
        :current-page="currentPage"
        :page-size="pagesize"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      total: 0, //默认数据总数
      pagesize: 10, //每页的数据条数
      currentPage: 1, //默认开始页面
      company_name: "",
      payed: "",
      price: "",
      due_time: ""
    };
  },
  methods: {
    handleFlatBillListInfo() {
      this.axios
        .get(
          "/companybill/info?id=" +
            this.$route.query.id
        )
        .then(response => {
          console.log(response.data.data.company_bill_orders.length);
          this.tableData = response.data.data.company_bill_orders;
          this.total = response.data.data.company_bill_orders.length;
        });
    },
    handleSizeChange(size) {
      this.pagesize = size;
      this.handleFlatBillListInfo();
    },
    current_change(currentPage) {
      this.currentPage = currentPage;
      this.handleFlatBillListInfo();
    }
  },
  components: {},
  mounted() {
    this.handleFlatBillListInfo();
    this.company_name = this.$route.query.company_name;
    this.price = this.$route.query.price;
    this.payed = this.$route.query.payed;
    this.due_time = this.$route.query.due_time;
  }
};
</script>

<style>
</style>
