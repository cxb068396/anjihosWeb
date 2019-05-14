<template>
  <div class="order_app">
    <div class="content-nav">
      <el-breadcrumb
        class="breadcrumb"
        separator="/"
      >
        <el-breadcrumb-item :to="{path: '/dashboard'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>服务管理</el-breadcrumb-item>
        <el-breadcrumb-item>服务列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="operation-nav">
        <router-link to="serveaddpage">
          <el-button
            type="primary"
            icon="plus"
          >申请服务</el-button>
        </router-link>
      </div>
    <el-tabs
      v-model="activeName"
      @tab-click="clickTab"
    >
      <el-tab-pane
        label="已接入服务"
        name="first"
      >
        <el-table
          stripe
          :data="contentData"
          style="width: 100%"
        >
          <el-table-column
            prop="company_name"
            label="公司名称"
            min-width="200"
          >
          </el-table-column>
          <el-table-column
            prop="goods_name"
            label="服务名称"
            min-width="200"
          >
          </el-table-column>
          <el-table-column
            prop="add_time"
            label="注册时间"
            min-width="200"
          >
          </el-table-column>
          <el-table-column
            prop="tag"
            label="状态"
            min-width="200"
            :filters="[{ text: '已通过', value: 1}, { text: '待通过', value:0}]"
            :filter-method="filterTag"
            filter-placement="bottom-end"
          >
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.verified === 1 ? 'success' : 'primary'"
                disable-transitions
              >{{scope.row.verified===1?"已通过":'待通过'}}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane
        label="可申请服务"
        name="second"
      >
        <el-table
          :data="submitData"
          style="width: 100%"
        >
          <el-table-column
            prop="name"
            label="服务名称"
            min-width="200"
          >
          </el-table-column>
          <el-table-column
            prop="retail_price"
            label="服务价格"
            min-width="200"
          >
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            min-width="120"
          >
            <template slot-scope="scope">
              <el-button
                size="small"
                type="danger"
                @click="submit(scope.row)"
              >提交审核</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: "first",
      contentData: [],
      submitData: []
    };
  },
  mounted() {
    this.getContentList();
    this.auditClick();
  },
  methods: {
    //状态判定
    filterTag(value, row) {
      return row.verified === value;
    },
    clickTab(tab) {
      if (tab.label == "已接入服务") {
        this.getContentList();
      } else if (tab.label == "可申请服务") {
        this.auditClick();
      }
    },
    //已接入服务
    getContentList() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      let company_id = userInfo.company_id;
      this.axios
        .get(
          "/goods?company_id=" + company_id
        )
        .then(response => {
          var result = response.data.data.company_has_goods.reverse();
          this.contentData = result;
        });
    },
    //可申请服务
    auditClick() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      let company_id = userInfo.company_id;
      this.axios
        .get(
          "/goods?company_id=" + company_id
        )
        .then(response => {
          this.submitData = response.data.data.company_has_not_goods.reverse();
        });
    },

    //提交申请
    submit(row) {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      let company_id = userInfo.company_id;
      this.axios
        .post("/companygoods/store", {
          goods_id: row.id,
          company_id: company_id
        })
        .then(response => {
          if (response.data.errno === 0) {
            this.$message({
              type: "success",
              message: "提交成功"
            });
            this.activeName = "first";
            this.getContentList();
          } else {
            this.$message({
              type: "error",
              message: "提交失败"
            });
          }
        })
        .catch(() => {});
    }
  }
};
</script>

<style>
.el-tag {
  border: none;
  background-color: rgba(255, 255, 255, 0);
}
</style>
