<template>
  <div class="single_app">
    <div class="content-nav">
      <el-breadcrumb
        class="breadcrumb"
        separator="/"
      >
        <el-breadcrumb-item :to="{path: '/dashboard'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>可派商店</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="operation-nav">
        <el-button
          type="primary"
          @click="goBackPage"
          icon="arrow-left"
        > 返回列表 </el-button>
      </div>
    </div>
    <el-table
      stripe
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        fixed
        prop="add_time"
        label="订单时间"
      >
      </el-table-column>
      <el-table-column
        prop="company_name"
        label="可派商店"
      >
      </el-table-column>
      <el-table-column
        fixed="right"
        label="判单"
        width="100"
      >
        <template slot-scope="scope">
          <el-button
            @click="handleClickPost(scope.row)"
            type="danger"
            size="small"
          >选择此商家</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      order_id: 0,
      goods_id: 0,
      tableData: [],
      headers: {
        "X-Anjishop-Token": localStorage.getItem("token") || ""
      },
      infoForm: {
        company_id: 0, //公司id
        id: 0, //订单id
        order_status: 12, //派单状态
        worker_id: 0 //工作人员的id
      }
    };
  },
  created() {
    this.getList();
    this.order_id = this.$route.query.id
      ? this.$route.query.id
      : this.$route.query.order_id;
    this.infoForm.id = this.order_id;
    console.log(this.infoForm.id + "+" + this.order_id);
  },
  mounted() {},
  methods: {
    getList() {
      if (this.$route.query.importantId) {
        this.axios
          .get(
            "https://anji.newlioncity.com/admin/companygoods?goods_id=" +
              this.$route.query.importantId
          )
          .then(response => {
            this.tableData = response.data.data.data;
          });
      } else {
        console.log(this.$route.query);
        this.axios
          .get(
            "https://anji.newlioncity.com/admin/companygoods?goods_id=" +
              this.$route.query.goodsInfos[0].id
          )
          .then(response => {
            this.tableData = response.data.data.data;
          });
      }
    },
    goBackPage() {
      this.$router.push({ name: "platformOrder" });
    },
    //选择商家
    handleClickPost(row) {
      console.log(this.$route.query);
      this.$router.push({
        name: "ordersendworker",
        query: {
          id: this.$route.query.id ? this.$route.query.id : this.order_id,
          add_time: row.add_time,
          company_id: row.company_id,
          goods_id: row.goods_id,
          company_name: row.company_name,
          goods_name: row.goods_name,
          goodsInfos: row.goodsInfos,
          importantId: this.$route.query.goodsInfos
            ? this.$route.query.goodsInfos[0].id
            : this.$route.query.importantId
        }
      });

      // this.$router.push({name: 'ordersendworker'})
    }
  }
};
</script>

<style>
</style>
