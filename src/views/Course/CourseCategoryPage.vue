<template>

  <div class="content-page">
    <div class="content-nav">
      <el-breadcrumb
        class="breadcrumb"
        separator="/"
      >
        <el-breadcrumb-item :to="{ path: '/dashboard'}"> 首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="operation-nav">
          <el-button
            type="primary"
            icon="plus"
            @click="handleRowPush"
          >添加分类</el-button>
      </div>
    </div>
    <div class="content-main">
      <div class="form-table-box">
        <el-table
          :data="tableData"
          style="width: 100%"
          border
          stripe
        >
          <el-table-column
            prop="level"
            label="分类"
            min-width="80"
            :filters="[{ text: '一级', value: '1' },{ text: '次级', value: '2' }]"
            :filter-method="filterTag"
            filter-placement="bottom-end"
          >
            <template slot-scope="scope">
              <el-tag
                disable-transitions
                class="likeButton"
              >{{scope.row.level == 1 ?'一级' : '次级'}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="分类名称"
            min-width="200"
          >
            <template scope="scope">
              {{ scope.row.level == 2 ? '——': ''}} {{scope.row.name}}
            </template>
          </el-table-column>
          <el-table-column
            prop="wap_banner_url"
            label="图片"
            min-width="200"
          >
            <template scope="scope">
              <img
                :src="scope.row.wap_banner_url"
                class="image-show"
                style="width:200px"
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="is_show"
            label="是否显示"
            min-width="200"
          >
            <template scope="scope">
              {{ scope.row.is_show == 1 ? '是' : '否'}}
            </template>
          </el-table-column>
          <el-table-column
            prop="sort_order"
            label="排序"
            min-width="200"
          >
          </el-table-column>
          <el-table-column
            label="操作"
            min-width="80"
          >
            <template scope="scope">
              <el-button
                size="small"
                @click="handleRowEdit(scope.$index, scope.row)"
              >编辑</el-button>
              <!--      <el-button size="small" v-fi="isShowDelete" type="danger" @click="handleRowDelete(scope.$index, scope.row)">删除</el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/config/api";

export default {
  data() {
    return {
      page: 1,
      total: 0,
      isShowDelete: false,
      filterForm: {
        name: ""
      },
      tableData: []
    };
  },
  methods: {
    handleRowPush(){
      this.$router.push({
        name: "coursecategoryaddpage",
      });
    },
    handleRowEdit(index, row) {
      console.log(row);
      this.$router.push({ name: "coursecategoryaddpage", query: { id: row.id } });
    },
    handleRowDelete(index, row) {
      console.log(row.parent_id);
      if (row.parent_id == 0) {
        this.$confirm("删除一级分类将删除其下所有子分类,请谨慎操作。", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.axios.post("category/destroy", { id: row.id }).then(response => {
            console.log(response.data);
            if (response.data.errno === 0) {
              this.$message({
                type: "success",
                message: "删除成功"
              });

              this.getList();
            }
          });
        });
      } else {
        this.$confirm("确定要删除？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.axios.post("category/destroy", { id: row.id }).then(response => {
            console.log(response.data);
            if (response.data.errno === 0) {
              this.$message({
                type: "success",
                message: "删除成功"
              });

              this.getList();
            }
          });
        });
      }
    },
    getList() {
      this.axios
        .get("category", {
          params: {
            page: this.page,
            name: this.filterForm.name,
            is_course:1
          }
        })
        .then(response => {
          console.log(response.data.data)
          this.tableData = response.data.data;
        });
    },
    filterTag(value, row) {
      return row.level == value;
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    }
  },
  components: {},
  mounted() {
    this.isShowDelete = api.isShowDelete;
    this.getList();
    // console.log(picUrl)
  }
};
</script>

<style >
.likeButton {
  border: none;
  background-color: rgba(255, 255, 255, 0);
}
</style>
