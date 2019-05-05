<template>
  <div class="personnel_app">
    <div class="content-nav">
      <el-breadcrumb
        class="breadcrumb"
        separator="/"
      >
        <el-breadcrumb-item :to="{path: '/dashboard'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>账单管理</el-breadcrumb-item>
        <el-breadcrumb-item>员工账单</el-breadcrumb-item>
        <el-breadcrumb-item>账单详情</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="operation-nav">
        <el-button
          type="primary"
          @click="goBackPage"
          icon="arrow-left"
        >返回列表</el-button>
      </div>
    </div>
    <div class='worker'>
      <span style='padding: 0 10px 0 10px;'><b>账单汇总</b></span>
      <span style='padding: 0 10px 0 0;'>员工姓名: <b>{{ worker_name}}</b></span>
      <span style='padding: 0 10px 0 0;'>待付款: <b>{{price}}</b> / 元</span>
      <span style='padding: 0 10px 0 0;'>是否付款: <b>{{payed===1?"是":"否"}}</b></span>
      <span style='padding: 0 10px 0 0;'>截至时间: <b>{{due_time*1000 | datetimeFilterDay}}</b></span>
    </div>

    <el-table
      :data="finishedData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
      style="width: 100%"
    >
      <el-table-column
        prop="consignee"
        label="下单客户"
        min-width="120"
      >
      </el-table-column>
      <el-table-column
        prop="goodsInfos[0].name"
        label="服务名称"
        min-width="120"
      >
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="联系方式"
        min-width='120'
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
        prop="address"
        label="住址"
        min-width='200'
      >
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
        prop="actual_price"
        label="价格(元)"
        min-width='120'
      >
      </el-table-column>
      <el-table-column
        prop="workerInfos.name"
        label="服务人员"
        min-width='120'
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
      finishedData: [],
      isDisabled: false,
      total: 0, //默认数据总数
      pagesize: 10, //每页的数据条数
      currentPage: 1, //默认开始页面
      worker_name: "",
      price: "",
      payed: "",
      due_time: ""
    };
  },
  methods: {
    goBackPage() {
      this.$router.go(-1);
    },
    getInfoBill() {
      let id = this.id;
      this.axios
        .get(
          "/workerbill/info?id=" +
            this.$route.query.id
        )
        .then(response => {
          console.log(response.data.data.worker_bill_orders);
          this.finishedData = response.data.data.worker_bill_orders;
          this.total = response.data.data.worker_bill_orders.length;
        });
    },
    handleSizeChange(size) {
      this.pagesize = size;
      this.getInfoBill();
    },
    current_change(currentPage) {
      this.currentPage = currentPage;
      this.getInfoBill();
    }
  },

  components: {},
  mounted() {
    this.getInfoBill();
    this.worker_name = this.$route.query.worker_name;
    this.price = this.$route.query.price;
    this.payed = this.$route.query.payed;
    this.due_time = this.$route.query.due_time;
    console.log(this.due_time);
  }
};
</script>

<style>
.worker {
  margin: 10px 0 20px 0;
  height: 48px;
  line-height: 48px;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  white-space: nowrap;
  width: 60%;
  justify-content: space-between;
  border-bottom: 1px solid #ebeef5;
  border-top: 1px solid #ebeef5;
  border-left: 1px solid #ebeef5;
  background-color: #fff;
}
.worker span {
  font-size: 14px;
  color: #909399;
  border-right: 1px solid #ebeef5;
  text-align: center;
}
.worker span b {
  font-size: 16px;
  color: #909399;
}
</style>
