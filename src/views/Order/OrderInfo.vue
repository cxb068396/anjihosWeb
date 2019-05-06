<template>
  <div class="content-page">
    <div class="content-nav">
      <el-breadcrumb
        class="breadcrumb"
        separator="/"
      >
        <el-breadcrumb-item :to="{path: '/dashboard'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        <el-breadcrumb-item>订单详情</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="operation-nav">
        <el-button
          type="primary"
          @click="goBackPage"
          icon="arrow-left"
        >返回列表</el-button>
      </div>
    </div>
    <el-table
      stripe
      :data="OrderList"
      style="width: 100%"
    >
      <el-table-column label="订单详情">
        <template slot-scope="props">
          <el-form
            label-position="left"
            inline
            class="demo-table-expand"
          >
            <el-form-item
              label="订单编号"
              prop="id"
            >
              <span>{{ props.row.id }}</span>
            </el-form-item>

            <el-form-item
              label="用户昵称"
              prop="consignee"
            >
              <span>{{ props.row.consignee }}</span>
            </el-form-item>
            <el-form-item
              label="用户地址"
              prop="address"
            >
              <span>{{ props.row.address }}</span>
            </el-form-item>
            <el-form-item
              label="手机号码"
              prop="mobile"
            >
              <span>{{ props.row.mobile }}</span>
            </el-form-item>
            <el-form-item
              label="订单总价"
              prop="actual_price"
            >
              <span>{{ props.row.actual_price }}</span>
            </el-form-item>
            <el-form-item
              label="服务公司"
              prop="companyInfos"
            >
              <span>{{ props.row.companyInfos.name ? props.row.companyInfos.name : '暂无公司信息'}}</span>
            </el-form-item>
            <el-form-item
              label="订单状态"
              prop="order_status_text"
            >
              <span>{{ props.row.order_status_text }}</span>
            </el-form-item>
            <el-form-item
              label="下单时间"
              prop="add_time"
            >
              <span>{{ props.row.add_time*1000 |datetimeFilter }}</span>
            </el-form-item>
            <el-form-item
              label="预约时间"
              prop="service_need_time"
            >
              <span >{{ props.row.service_need_time }}</span>
            </el-form-item>
            <el-form-item label="接单人员">
              <span> {{ props.row.workerInfos.name ? props.row.workerInfos.name: '暂无接单人员'}} </span>
            </el-form-item>
      
          </el-form>
        </template>
      </el-table-column>
    </el-table>
    <el-table
      stripe
      :data="OrderList[0].goodsList"
      style="width: 100%"
    >
      <el-table-column
        prop="goods_name"
        label="商品名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="retail_price"
        label="商品单价"
        width="180">
      </el-table-column>
      <el-table-column

        prop="number"
        label="商品数量">
      </el-table-column>
      <el-table-column
        prop="list_pic_url"
        label="商品图片"
        min-width="180"
      >
        <template scope="scope">
          <img
            v-if="scope.row.list_pic_url"
            :src="scope.row.list_pic_url"
            class="image-show"
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      OrderList: [
        {
          id: 0,
          order_status: 0,
          consignee: "",
          address: "",
          mobile: "",
          actual_price: 0,
          order_status_text: "",
          worker_id: 0,
          goodsInfos: [],
          goodsList: [],
          service_need_time: 0,
          add_time: 0,
          companyInfos: {},
          workerInfos: {}
        }
      ]
    };
  },
  created() {
    // this.handleOrderList()
  },
  methods: {
    goBackPage() {
      this.$router.back(-1);
    },
     datetimeFilter(val) {
      val*=1000
      var date = new Date(val);
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m < 10 && (m = "0" + m);
      var d = date.getDate();
      d < 10 && (d = "0" + d);
      var h = date.getHours();
      // h > 12 && (h -= 12);
      // h < 10 && (h = "0" + h);
      var M = date.getMinutes();
      M < 10 && (M = "0" + M);
      return `${y}-${m}-${d} ${h}:${M}`;
  }

    // handleOrderList() {
    //   this.axios.get('/order',{params:{}}).then(response => {
    //     // console.log(response.data.data.data)
    //       // this.OrderList = response.data.data.data
    //   })
    // }
  },

  mounted() {
    this.OrderList[0].id = this.$route.query.id || 0;
    this.OrderList[0].order_status = this.$route.query.order_status || 0;
    this.OrderList[0].consignee = this.$route.query.consignee || "";
    this.OrderList[0].address = this.$route.query.address || "";
    this.OrderList[0].mobile = this.$route.query.mobile || "";
    this.OrderList[0].actual_price = this.$route.query.actual_price || 0;
    this.OrderList[0].order_status_text =
      this.$route.query.order_status_text || "";
    this.OrderList[0].workerInfos = this.$route.query.workerInfos
      ? this.$route.query.workerInfos
      : "";
    this.OrderList[0].goodsInfos = this.$route.query.goodsInfos;
    this.OrderList[0].goodsList = this.$route.query.goodsList;
    this.OrderList[0].service_need_time = this.$route.query.service_need_time;
    this.OrderList[0].companyInfos = this.$route.query.companyInfos;
    this.OrderList[0].add_time = this.$route.query.add_time;
    // console.log(this.OrderList[0])
    if(this.OrderList[0].service_need_time ==10000){
      this.OrderList[0].service_need_time = '无预约时间'
    }else{
      this.OrderList[0].service_need_time = this.datetimeFilter(this.OrderList[0].service_need_time)
    }
    console.log(this.OrderList[0])
  }
};
</script>
<style scoped>
.image-show{
  width:150px;
  height: 150px;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
