<template>
  <div class="personnel_app">
    <div class="content-nav">
      <el-breadcrumb
        class="breadcrumb"
        separator="/"
      >
        <el-breadcrumb-item :to="{path: '/dashboard'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>账单管理</el-breadcrumb-item>
        <el-breadcrumb-item>医生列表</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="operation-nav">
        <el-button
          type="primary"
          @click="goBackPage"
          icon="arrow-left"
        > 返回列表</el-button>
      </div>
    </div>
    <div
      style="margin-bottom:5px"
      class='box'
    >
      <span style='font-size:18px;color:#666;margin:10px 10px;font-family:KaiTi'>您选择了{{length}}名医生</span>
      <el-date-picker
        v-model="date"
        type="date"
        placeholder="选择日期"
      >
      </el-date-picker>
      <span style='font-size:14px;color:#c0c4cc;margin:10px 10px;'>(仅生成选择日期之前的账单)</span>
      <el-button
        style="margin-left:25px"
        type="danger"
        @click="createBill"
        icon="arrow-left"
      > 确定生成</el-button>
    </div>
    <el-table
      :data='tableData'
      @selection-change="changeFun"
      style="width: 100%"
    >
      <el-table-column
        type="selection"
        width="55"
      >
      </el-table-column>
      <el-table-column
        prop="id"
        label="编号"
        min-width="120"
      >
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        min-width="120"
      >
      </el-table-column>
      <el-table-column
        prop="age"
        label="年龄"
        min-width="120"
      >
      </el-table-column>
      <el-table-column
        prop="sex"
        label="性别"
        min-width='120'
      >
      </el-table-column>
      <el-table-column
        label="入职日期"
        min-width='160'
        prop='hiredate'
        :formatter='formatDate'
      >
      </el-table-column>
      <el-table-column
        prop="address"
        label="住址"
        min-width="160"
      >
      </el-table-column>
    </el-table>
    <div style="text-align: center;margin-top: 30px;">
      <el-pagination
        background
        layout="total, prev,sizes, pager, next, jumper"
        :total="total"
        @current-change="current_change"
        @size-change="handleSizeChange"
        :current-page="currentPage"
        :page-size="pagesize"
        :page-sizes="pagesizes"
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
      // search: "", //搜索
      total: 0,
      currentPage: 1,
      pagesize: 10,
      multipleSelection: [],
      date: "",
      pagesizes: [10],
      length: ""
    };
  },
  methods: {
    goBackPage() {
      this.$router.go(-1);
    },

    changeFun(val) {
      this.multipleSelection = val;
      this.length = val.length;
    },
    getList() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      let company_id = userInfo.company_id;
      this.axios
        .get(
          "/worker?company_id=" + company_id,
          {
            params: {
              page: this.currentPage,
              size: this.pagesize
            }
          }
        )
        .then(response => {
          this.tableData = response.data.data.data;
          this.total = response.data.data.count;
          this.currentPage = response.data.data.currentPage;
          this.pagesizes[1] = response.data.data.count;
        });
      console.log(this.pagesizes);
    },
    //生成账单
    createBill() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      let arr = this.multipleSelection;
      let multis = [];
      for (var i = 0; i < arr.length; i++) {
        multis.push(arr[i].id);
      }
      const params = {
        workerIds: multis,
        company_id: userInfo.company_id,
        due_time: parseInt(this.date / 1000)
      };
      if (this.multipleSelection.length === 0 || !this.date) {
        this.$message({
          type: "error",
          message: "请将生成账单所需的医生姓名和截至时间填写完整"
        });
      } else {
        this.axios
          .post("/workerbill/store", params)
          .then(response => {
            console.log(response);
            if (response.data.data.workerHasOrdersNumber) {
              this.$message({
                type: "success",
                message:
                  "生成" + response.data.data.workerHasOrdersNumber + "张账单"
              });
              this.$router.go(-1);
            } else {
              this.$message({
                type: "error",
                message: "无账单可生成"
              });
            }
          });
      }
    },
    //时间过滤器
    formatDate(row) {
      var date = new Date(row.hiredate * 1000);
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m < 10 && (m = "0" + m);
      var d = date.getDate();
      d < 10 && (d = "0" + d);
      return `${y}-${m}-${d}`;
    },
    // handleRowConfirm(index, row) {
    //   console.log(row);
    //   this.$router.push({
    //     name: "merchantbill",
    //     query: {
    //       id: row.id,
    //       name: row.name
    //     }
    //   });
    // },
    handleSizeChange(size) {
      this.pagesize = size;
      this.getList();
    },
    current_change(currentPage) {
      this.currentPage = currentPage;
      this.getList();
    }
  },
  components: {},
  mounted() {
    this.getList();
  }
};
</script>

<style>
.content-nav {
  display: flex;
  flex-direction: row;
  overflow: hidden;
}
.box {
  display: flex;
  flex-direction: row;
  overflow: hidden;
  white-space: nowrap;
}
</style>
