<template>
  <div class="order_app">
    <div class="content-nav">
      <el-breadcrumb
        class="breadcrumb"
        separator="/"
      >
        <el-breadcrumb-item :to="{path: '/dashboard'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
    >
      <!--新接单子-->
      <el-tab-pane
        label="可派订单"
        name="first"
      >
        <el-table
          :data="tableData"
          style="width: 100%"
        >
          <el-table-column
            prop="consignee"
            label="下单客户"
          >
          </el-table-column>
          <el-table-column
            prop="goodsInfos[0].name"
            label="服务名称"
          >
          </el-table-column>
          <el-table-column
            prop="mobile"
            label="联系方式"
          >
          </el-table-column>
          <el-table-column
            prop="postscript"
            label="留言"
          >
          </el-table-column>
          <el-table-column
            prop='add_time'
            label="下单时间"
          >
            <template slot-scope="scope">
              {{scope.row.add_time*1000 | datetimeFilter}}
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            label="住址"
          >
          </el-table-column>
          <el-table-column
            prop="service_need_time"
            label="预约时间"
          >
            <template slot-scope="scope">
              {{scope.row.service_need_time*1000| datetimeFilter}}
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button
                size="small"
                type="danger"
                @click='handOut(scope.row)'
              >派单</el-button>
            </template>
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
      </el-tab-pane>

      <!--已经派单-->
      <el-tab-pane
        label="已派订单"
        name="second"
      >
        <el-table
          :data="postData"
          style="width: 100%"
        >
          <el-table-column
            prop="consignee"
            label="下单客户"
          >
          </el-table-column>
          <el-table-column
            prop="goodsInfos[0].name"
            label="服务名称"
          >
          </el-table-column>
          <el-table-column
            prop="mobile"
            label="联系方式"
          >
          </el-table-column>
          <el-table-column
            prop="postscript"
            label="留言"
          >
          </el-table-column>
          <el-table-column
            prop='add_service_need_timetime'
            label="预定时间"
          >
            <template slot-scope="scope">
              {{scope.row.service_need_time*1000 | datetimeFilter}}
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            label="住址"
          >
          </el-table-column>
          <el-table-column
            label="接单时间"
            prop='order_accepted_time'
          >
            <template slot-scope="scope">
              {{scope.row.order_accepted_time*1000 | datetimeFilter}}
            </template>
          </el-table-column>
          <el-table-column
            prop="workerInfos.name"
            label="接单人"
          >
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button
                size="small"
                type="danger"
                @click='handOut(scope.row)'
              >改派单</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="text-align: center;margin-top: 30px;">
          <el-pagination
            background
            layout="total, prev, pager, next, jumper"
            :total="total1"
            @current-change="current_change1"
            @size-change="handleSizeChange1"
            :current-page="currentPage1"
            :page-size="pagesize1"
          >
          </el-pagination>
        </div>

      </el-tab-pane>

      <!--服务订单中-->
      <el-tab-pane
        label="订单服务中"
        name="third"
      >
        <el-table
          :data="startData"
          style="width: 100%"
        >
          <el-table-column
            prop="consignee"
            label="下单客户"
          >
          </el-table-column>
          <el-table-column
            prop="goodsInfos[0].name"
            label="服务名称"
          >
          </el-table-column>
          <el-table-column
            prop="mobile"
            label="联系方式"
          >
          </el-table-column>
          <el-table-column
            prop="postscript"
            label="留言"
          >
          </el-table-column>
          <el-table-column
            prop='接单时间'
            label="接单时间"
          >
            <template slot-scope="scope">
              {{scope.row.order_accepted_time*1000 | datetimeFilter}}
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            label="住址"
          >
          </el-table-column>
          <el-table-column
            label="开始时间"
            prop='worker_started_time'
          >
            <template slot-scope="scope">
              {{scope.row.worker_started_time*1000 | datetimeFilter}}
            </template>
          </el-table-column>
          <el-table-column
            prop="workerInfos.name"
            label="接单人"
          >
          </el-table-column>
        </el-table>
        <div style="text-align: center;margin-top: 30px;">
          <el-pagination
            background
            layout="total, prev, pager, next, jumper"
            :total="total2"
            @current-change="current_change2"
            @size-change="handleSizeChange2"
            :current-page="currentPage2"
            :page-size="pagesize2"
          >
          </el-pagination>
        </div>
      </el-tab-pane>

      <!--订单完成-->
      <el-tab-pane
        label="完成订单"
        name="fourth"
      >
        <el-table
          :data="finishedData"
          style="width: 100%"
        >
          <el-table-column
            prop="consignee"
            label="下单客户"
          >
          </el-table-column>
          <el-table-column
            prop="goodsInfos[0].name"
            label="服务名称"
          >
          </el-table-column>
          <el-table-column
            prop="mobile"
            label="联系方式"
          >
          </el-table-column>
          <el-table-column
            prop="postscript"
            label="留言"
          >
          </el-table-column>
          <el-table-column
            label="开始时间"
            prop='worker_started_time'
          >
            <template slot-scope="scope">
              {{scope.row.worker_started_time*1000 | datetimeFilter}}
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            label="住址"
          >
          </el-table-column>
          <el-table-column
            label="完成时间"
            prop='worker_finished_time'
          >
            <template slot-scope="scope">
              {{scope.row.worker_finished_time*1000 | datetimeFilter}}
            </template>
          </el-table-column>
          <el-table-column
            prop="workerInfos.name"
            label="接单人"
          >
          </el-table-column>
          <el-table-column
            fixed="right"
            label="评论"
          >
            <template slot-scope="scope">
              <el-button
                size="small"
                type="button"
                v-if="scope.row.commentInfos !=null"
                @click="handleRowComment(scope.$index, scope.row)"
              >详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="text-align: center;margin-top: 30px;">
          <el-pagination
            background
            layout="total, prev, pager, next, jumper"
            :total="total3"
            @current-change="current_change3"
            @size-change="handleSizeChange3"
            :current-page="currentPage3"
            :page-size="pagesize3"
          >
          </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
export default {
  data() {
    return {
      total: 0,
      currentPage: 1,
      pagesize: 10,
      total1: 0,
      currentPage1: 1,
      pagesize1: 10,
      total2: 0,
      currentPage2: 1,
      pagesize2: 10,
      total3: 0,
      currentPage3: 1,
      pagesize3: 10,
      activeName: "",
      tableData: [],
      postData: [],
      finishedData: [],
      startData: []
    };
  },
  mounted() {
    this.getOrderList();
    this.postOrderList();
    this.finishedOrderList();
    this.getParam();
  },
  methods: {
    //可派单列表
    getOrderList() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      let company_id = userInfo.company_id;
      this.axios
        .get(
          "/order?company_id=" + company_id,
          {
            params: {
              page: this.currentPage
            }
          }
        )
        .then(response => {
          // console.log(response.data.data.data);
          this.tableData = response.data.data.data;
          this.total = response.data.data.count;
          this.currentPage = response.data.data.currentPage;
        });
    },
    //已经派单
    postOrderList() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      let company_id = userInfo.company_id;
      this.axios
        .get(
          "/order?order_status=12&company_id=" +
            company_id,
          {
            params: {
              page: this.currentPage1
            }
          }
        )
        .then(response => {
          //console.log(response.data.data.data);
          this.postData = response.data.data.data;
          this.total1 = response.data.data.count;
          this.currentPage1 = response.data.data.currentPage;
        });
    },
    //正在进行中的单子
    startOrderList() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      let company_id = userInfo.company_id;
      this.axios
        .get(
          "/order?order_status=13&company_id=" +
            company_id,
          {
            params: {
              page: this.currentPage2
            }
          }
        )
        .then(response => {
          this.startData = response.data.data.data;
          this.total2 = response.data.data.count;
          this.currentPage2 = response.data.data.currentPage;
          // console.log(response.data.data.data.worker_finished_time);
        });
    },
    //已经完成的单子
    finishedOrderList() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      let company_id = userInfo.company_id;
      this.axios
        .get(
          "/order?order_status=14&company_id=" +
            company_id,
          {
            params: {
              page: this.currentPage3
            }
          }
        )
        .then(response => {
          // console.log(response.data.data.data);
          this.finishedData = response.data.data.data;
          this.total3 = response.data.data.count;
          this.currentPage3 = response.data.data.currentPage;
        });
    },
    handleClick(tab) {
      if (tab.label == "可派订单") {
        this.getOrderList();
      } else if (tab.label == "已派订单") {
        this.postOrderList();
      } else if (tab.label == "订单服务中") {
        this.startOrderList();
      } else {
        this.finishedOrderList();
      }
    },
    //判断跳转的时候是否留在当前页面
    getParam() {
      if (this.$route.params.xx == "xxx") {
        this.activeName = "fourth";
      } else {
        this.activeName = "first";
      }
    },
    handOut(row) {
      this.$router.push({
        name: "merchatOrder_post",
        query: {
          id: row.id
        }
      });
    },
    handleSizeChange(size) {
      this.pagesize = size;
      this.getOrderList();
    },
    current_change(currentPage) {
      this.currentPage = currentPage;
      this.getOrderList();
    },
    handleSizeChange1(size) {
      this.pagesize1 = size;
      this.postOrderList();
    },
    current_change1(currentPage) {
      this.currentPage1 = currentPage;
      this.postOrderList();
    },
    handleSizeChange2(size) {
      this.pagesize2 = size;
      this.startOrderList();
    },
    current_change2(currentPage) {
      this.currentPage2 = currentPage;
      this.startOrderList();
    },
    handleSizeChange3(size) {
      this.pagesize3 = size;
      this.finishedOrderList();
    },
    current_change3(currentPage) {
      this.currentPage3 = currentPage;
      this.finishedOrderList();
    },
    handleRowComment(index, row) {
      console.log(row);
      this.$router.push({
        name: "merchantordercommetpage",
        query: {
          id: row.id
        }
      });
    }
    //时间过滤器
    // datetimeFilter (row) {
    //   var date=new Date(row.add_time*1000);
    // var y=date.getFullYear();
    //   var m=date.getMonth()+1;
    //  m<10&&(m="0"+m);
    //  var d=date.getDate();
    //  d<10&&(d="0"+d);
    //   var h=date.getHours();
    // h>12&&(h-=12);
    //  h<10&&(h="0"+h);
    //  var M=date.getMinutes()
    // M<10&&(M="0"+M);
    //  return `${y}-${m}-${d} ${h}:${M}`;
    //},
  }
};
</script>

<style>
</style>
