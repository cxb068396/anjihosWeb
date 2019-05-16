<template>
  <div class="content-page">
    <div class="content-nav">
      <el-breadcrumb
        class="breadcrumb"
        separator="/"
      >
        <el-breadcrumb-item :to="{path: '/dashboard'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>医院列表</el-breadcrumb-item>
        <el-breadcrumb-item>医院详情</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="operation-nav">
          <el-button
            type="primary"
            icon="plus"
            @click="handleRowPush"
          >添加医院</el-button>
      </div>
    </div>
    <el-table
      stripe
      style="width: 100%;"
      :data="MerchantList"
    >
      <el-table-column
        label="医院编号"
        prop="id"
        min-width="100"
      >
      </el-table-column>
      <el-table-column
        label="医院名称"
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
        label="医院地址"
        prop="address"
        min-width="200"
      >
      </el-table-column>
      <el-table-column
        label="联系方式"
        prop="mobile"
        min-width="150"
      >
      </el-table-column>
      <el-table-column
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
      </el-table-column>
      <el-table-column
        fixed="right"
        label="医院详情"
        min-width="140"
      >
        <template slot-scope="scope">
          <el-button
            size="small"
            type='info'
            @click="handleRowInfo(scope.$index, scope.row)"
          >详情</el-button>
          <el-button size="small"  type="danger" @click="handleRowUpdate(scope.$index, scope.row)">更新</el-button>
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
      currentPage: 1,
      count: 0,
      pagesize: 10,
      MerchantList: []
    };
  },
  prop: {
    id: 1
  },
  created() {
    this.handleMerchantList();
  },
  methods: {
    handleRowPush(){
      this.$router.push({
        name:'merchantaddpage'
      })
    },
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
    //更新
    handleRowUpdate(index, row){
      this.$router.push({
        name: "merchantaddpage",
        query: {
          id: row.id,
          name: row.name,
          verified: row.verified,
          modifytime: row.modifytime,
          addtime: row.addtime,
          address: row.address,
          image_url: row.image_url,
          mobile:row.mobile,
          bank_name:row.bank_name,
          bank_account:row.bank_account,
          bank_username:row.bank_username,
        }
      });
    },
    //详情
    handleRowInfo(index, row) {
      this.$router.push({
        name: "merchantinfo",
        query: {
          id: row.id,
          name: row.name,
          verified: row.verified,
          modifytime: row.modifytime,
          addtime: row.addtime,
          address: row.address,
          image_url: row.image_url,
          mobile:row.mobile,
          bank_name:row.bank_name,
          bank_account:row.bank_account,
          bank_username:row.bank_username,
        }
      });
    },
    //分页
    handlePageChange: function(val) {
      this.currentPage = val;
      this.handleMerchantList();
    },
    handleMerchantList() {
      this.axios
        .get("/company", {
          params: { page: this.currentPage }
        })
        .then(response => {
          this.MerchantList = response.data.data.data;
          this.count = response.data.data.count;
        });
    }
  }
};
</script>
<style >
.likeButton {
  border: none;
  background-color: rgba(255, 255, 255, 0);
}
</style>
