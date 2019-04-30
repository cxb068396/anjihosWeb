<template>
  <div class="content-page">
    <div class="content-nav">
      <el-breadcrumb
        class="breadcrumb"
        separator="/"
      >
        <el-breadcrumb-item :to="{path: '/dashboard'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-tabs @tab-click="handleClick">
      <el-tab-pane label="服务类订单">
        <el-table
          stripe
          style="width: 100%;"
          :data="OrderListService"
        >
          <el-table-column
            label="下单时间"
            prop="add_time"
            min-width="130"
          >
            <template slot-scope="scope">
              {{scope.row.add_time*1000 | datetimeFilter}}
            </template>
          </el-table-column>
          <el-table-column
            label="预约时间"
            prop="service_need_time"
            min-width="130"
          >
            <template slot-scope="scope">
              {{scope.row.service_need_time*1000 | datetimeFilter}}
            </template>

          </el-table-column>
          <el-table-column
            label="用户姓名"
            prop="consignee"
            min-width="80"
          >

          </el-table-column>
          <el-table-column
            label="服务名称"
            prop="goodsInfos[0].name"
            min-width="140"
          >
          </el-table-column>
          <el-table-column
            label="评价"
            min-width="70"
          >

            <template slot-scope="scope">
              <el-button
                @click="commentsRowInfo(scope.$index, scope.row)"
                v-if="scope.row.commentInfos !=null"
                size="small"
              >
                评价
              </el-button>
            </template>

            <!-- <template slot-scope="scope">
      <el-button 
      v-if="scope.row.comment == 1"
      @click="commentsRowInfo(scope.$index, scope.row)"
      size="small">
      评价
      </el-button>
    </template> -->

          </el-table-column>
          <el-table-column
            label="地址"
            prop="address"
            min-width="180"
          >
          </el-table-column>
          <el-table-column
            prop="order_status_text"
            label="订单状态"
            min-width="130"
            :filters="[ { text: '待付款', value: '待付款' },{ text: '已付款，待接单', value: '已付款，待接单' },{ text: '已接单', value: '已接单' },{ text: '服务已完成', value: '服务已完成' },{ text: '已取消', value: '已取消' } ]"
            :filter-method="filterTag"
            filter-placement="bottom-end"
          >
            <template slot-scope="scope">
              <el-tag
                class="likeButton"
                :type="scope.row.order_status_text === '已下单' ? 'primary' : 'success'"
                disable-transitions
              >{{scope.row.order_status_text}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="订单详情"
            min-width="80"
          >
            <template slot-scope="scope">
              <el-button
                size="small"
                type='info'
                @click="handleRowInfo(scope.$index, scope.row)"
              >详情</el-button>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            min-width="150"
          >
            <template slot-scope="scope">
              <el-button
                size="small"
                type="danger"
                @click="orderSend(scope.$index, scope.row)"
                v-bind:class="[scope.row.order_status == 11 ? goToSend: scope.row.order_status == 12 ? changeSend: hasSend]"
              >
                {{scope.row.order_status == 11 ? '去派单' : scope.row.order_status == 12 ? '改派单' : '服务完成或其它'}}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="handlePageChangeService"
          :current-page="currentPage0"
          :page-size="pagesize"
          layout="total, prev, pager, next, jumper"
          :total="count"
        >
        </el-pagination>
      </el-tab-pane>

      <el-tab-pane label="商品类订单">
        <el-table
          stripe
          style="width: 100%;"
          :data="OrderListGoods"
        >
          <el-table-column
            label="下单时间"
            prop="add_time"
            min-width="130"
          >
            <template slot-scope="scope">
              {{scope.row.add_time*1000 | datetimeFilter}}
            </template>
          </el-table-column>
          <el-table-column
            label="预约时间"
            prop="service_need_time"
            min-width="130"
          >
            <template slot-scope="scope">
              {{'暂无预约时间'}}
            </template>

          </el-table-column>
          <el-table-column
            label="用户姓名"
            prop="consignee"
            min-width="80"
          >

          </el-table-column>
          <el-table-column
            label="商品名称"
            prop="goodsInfos[0].name"
            min-width="140"
          >
          </el-table-column>
          <el-table-column
            label="评价"
            min-width="70"
          >
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.comment == 1"
                @click="commentsRowInfo(scope.$index, scope.row)"
                size="small"
              >
                评价
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="地址"
            prop="address"
            min-width="180"
          >
          </el-table-column>
          <el-table-column
            prop="order_status_text"
            label="订单状态"
            min-width="130"
            :filters="[ { text: '待付款', value: '待付款' },{ text: '已付款，待发货', value: '已付款，待发货' },{ text: '已发货，待收货', value: '已发货，待收货' },{ text: '已收货', value: '已收货' },{ text: '已取消', value: '已取消' } ]"
            :filter-method="filterTag"
            filter-placement="bottom-end"
          >
            <template slot-scope="scope">
              <el-tag
                class="likeButton"
                :type="scope.row.order_status_text === '已下单' ? 'primary' : 'success'"
                disable-transitions
              >{{scope.row.order_status_text}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="订单详情"
            min-width="80"
          >
            <template slot-scope="scope">
              <el-button
                size="small"
                type='info'
                @click="handleRowInfo(scope.$index, scope.row)"
              >详情</el-button>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            min-width="150"
          >
            <template slot-scope="scope">
              <el-button
                size="small"
                type="danger"
                @click="orderSend(scope.$index, scope.row)"
                v-bind:class="[scope.row.order_status == 11 ? goToSend: scope.row.order_status == 12 ? changeSend: hasSend]"
              >
                {{scope.row.order_status == 11 ? '去派单' : scope.row.order_status == 12 ? '改派单' : '服务完成或其它'}}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="handlePageChangeGoods"
          :current-page="currentPage1"
          :page-size="pagesize"
          layout="total, prev, pager, next, jumper"
          :total="count"
        >
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import api from "@/config/api";
export default {
  data() {
    return {
      changeSend: "changeSend",
      goToSend: "goToSend",
      hasSend: "hasSend",
      currentPage0: 1,
      currentPage1: 1,
      count: 0,
      pagesize: 10,
      OrderListService: [],
      OrderListGoods: []
    };
  },
  created() {
    this.handleOrderListService();
  },
  mounted() {},
  methods: {
    //订单状态筛选
    formatter(row) {
      return row.address;
    },
    filterTag(value, row) {
      return row.order_status_text === value;
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    //派单
    orderSend(index, row) {
      if (row.order_status == 11 || row.order_status == 12) {
        // 有bug。先注释
        console.log(row)
        this.$router.push({
          name: "ordersendcompany",
          query: {
            id: row.id,
            add_time: row.add_time,
            company_id: row.company_id,
            goods_id: row.goods_id,
            company_name: row.company_name,
            goods_name: row.goods_name,
            name: row.goodsInfos[0].name,
            goodsInfos: row.goodsInfos
          }
        });
      } else {
        this.$message({
          type: "error",
          message: "此单可能未付款、已取消或已完成等。"
        });
      }
    },
    //详情
    handleRowInfo(index, row) {
      console.log(row);
      this.$router.push({
        name: "orderinfo",
        query: {
          id: row.id,
          order_status: row.order_status,
          consignee: row.consignee,
          address: row.address,
          mobile: row.mobile,
          actual_price: row.actual_price,
          order_status_text: row.order_status_text,
          worker_id: row.worker_id,
          goodsInfos: row.goodsInfos,
          goodsList: row.goodsList,
          add_time: row.add_time,
          workerInfos: row.workerInfos,
          service_need_time: row.service_need_time,
          companyInfos: row.companyInfos
        }
      });
    },

    handleClick(tab) {
      if (tab.label == "服务类订单") {
        this.handleOrderListService();
      } else {
        this.handleOrderListGoods();
      }
    },
    commentsRowInfo(index, row) {
      console.log(row);
      this.$router.push({
        name: "ordercommentpage",
        query: {
          id: row.id
        }
      });
    },
    //分页
    handleSizeChange: function(size) {
      this.pagesize = size;
    },
    handlePageChangeService: function(val) {
      this.currentPage0 = val;
      this.handleOrderListService();
    },
    handlePageChangeGoods: function(val) {
      this.currentPage1 = val;
      this.handleOrderListGoods();
    },

    handleOrderListService() {
      this.axios
        .get("https://anji.newlioncity.com/admin/order", {
          params: { page: this.currentPage0, is_service: 1 }
        })
        .then(response => {
          //this.OrderList = response.data.data.data;
          //  console.log(response.data.data.data);
          this.OrderListService = response.data.data.data;

          this.count = response.data.data.count;
        });
    },
    handleOrderListGoods() {
      this.axios
        .get("https://anji.newlioncity.com/admin/order", {
          params: { page: this.currentPage1, is_service: 0 }
        })
        .then(response => {
          // console.log(response.data.data.data);
          this.OrderListGoods = response.data.data.data;
          this.count = response.data.data.count;
        });
    }
    //时间过滤
    // datetimeFilterAdd_time(row) {
    //   var date = new Date(row.add_time * 1000);
    //   var y = date.getFullYear();
    //   var m = date.getMonth() + 1;
    //   m < 10 && (m = "0" + m);
    //   var d = date.getDate();
    //   d < 10 && (d = "0" + d);
    //   var h = date.getHours();
    //   h > 12 && (h -= 12);
    //   h < 10 && (h = "0" + h);
    //   var M = date.getMinutes();
    //   M < 10 && (M = "0" + M);
    //   return `${y}-${m}-${d} ${h}:${M}`;
    // },
    // datetimeFilterService_need_time(row) {
    //   var date = new Date(row.service_need_time * 1000);
    //   var y = date.getFullYear();
    //   var m = date.getMonth() + 1;
    //   m < 10 && (m = "0" + m);
    //   var d = date.getDate();
    //   d < 10 && (d = "0" + d);
    //   var h = date.getHours();
    //   h > 12 && (h -= 12);
    //   h < 10 && (h = "0" + h);
    //   var M = date.getMinutes();
    //   M < 10 && (M = "0" + M);
    //   return `${y}-${m}-${d} ${h}:${M}`;
    // }
  }
};
</script>
<style scoped>
.likeButton {
  border: none;
  background-color: rgba(255, 255, 255, 0);
}
.hasSend {
  color: black;
  background-color: rgba(255, 255, 255, 0);
}
.changeSend {
  color: white;
  border-color: green;
  background-color: rgba(0, 128, 0, 1);
}
.changeSend:hover {
  background-color: rgba(0, 128, 0, 0.6);
}
</style>
