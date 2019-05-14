<template>
  <div class="content-page">
    <div class="content-nav">
      <el-breadcrumb
        class="breadcrumb"
        separator="/"
      >
        <el-breadcrumb-item :to="{path: '/dashboard'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="content-main">
      <div class="filter-box">
        <el-form
          :inline="true"
          :model="filterForm"
          class="demo-form-inline"
        >
          <el-form-item label="商品名称">
            <el-input
              v-model.trim="filterForm.name"
              placeholder="商品名称"
              v-on:input="onSubmitFilter"
            ></el-input>
          </el-form-item>
          <el-form-item label="所属分类">
            <el-cascader
              :options="categoryOptions"
              :props="categoryCascaderConfig"
              placeholder="请选择分类"
              v-model="categorySelected"
              @change="handleChange"
              @focus="onSubmitFilter"
            >
            </el-cascader>
          </el-form-item>

          <!--   <el-form-item label="排序类型">
            <el-radio-group v-model="filterForm.sortChecked">
              <el-radio-button label="0" :key="0">排序号</el-radio-button>
              <el-radio-button label="1" :key="1">添加时间</el-radio-button>
            </el-radio-group>
          </el-form-item> -->

          <!-- <el-form-item>
            <el-button type="primary" @click="onSubmitFilter">查询</el-button>
          </el-form-item> -->
        </el-form>
      </div>

      <div class="form-table-box">
        <el-table
          :data="tableData"
          style="width: 100%"
          border
          stripe
        >
          <el-table-column
            prop="id"
            label="ID"
            min-width="100"
          >
          </el-table-column>
          <el-table-column
            prop="name"
            label="商品名称"
            min-width="100"
          >
          </el-table-column>

          <el-table-column
            prop="list_pic_url"
            label="封面"
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
          <el-table-column
            prop="retail_price"
            label="售价¥"
            min-width="120"
          >
          </el-table-column>
          <el-table-column
            prop="is_show"
            label="上架"
            min-width="80"
          >
            <template scope="scope">
              {{ scope.row.is_on_sale == 1 ? '是' : '否'}}
            </template>
          </el-table-column>
          <!--          <el-table-column prop="sort_order" label="排序" min-width="80">
          </el-table-column>
 -->
          <el-table-column
            label="操作"
            min-width="80"
          >
            <template scope="scope">
              <el-button
                size="small"
                @click="handleRowEdit(scope.$index, scope.row)"
              >编辑</el-button>
              <!--              <el-button  size="small" type="danger" @click="handleRowDelete(scope.$index, scope.row)">删除</el-button> -->
            </template>
          </el-table-column>

        </el-table>

      </div>
      <div class="page-box">
        <el-pagination
          @current-change="handlePageChange"
          :current-page="page"
          :page-size="20"
          layout="total, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>

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
        name: "",
        category_id: "",
        sortChecked: 0,
        goodsTypeSelected: ""
      },
      tableData: [],

      categoryOptions: [{ value: "", label: "全部分类" }],
      categoryCascaderConfig: {
        value: "id",
        label: "name",
        children: "children"
      },
      categorySelected: []
    };
  },
  methods: {
    handleRowPush(){
      this.$router.push({
        name: "goodsaddpage",
      });
    },
    handleChange(item) {
      this.filterForm.category_id = item[item.length - 1];
    },
    getCascaderCategory() {
      this.axios.get("category/cascader").then(response => {
        this.categoryOptions = this.categoryOptions.concat(response.data.data);
        this.handleCategorySelected();
      });
    },
    handleCategorySelected() {
      if (this.categoryOptions.length > 0 && this.filterForm.category_id > 0) {
        this.categoryOptions.map(item => {
          if (item.children) {
            item.children.map(itemChild => {
              if (itemChild.id === this.filterForm.category_id) {
                this.categorySelected = [item.id, this.filterForm.category_id];
                return;
              }
            });
          }
        });
      }
    },

    handlePageChange(val) {
      this.page = val;

      localStorage.setItem("goodsPage", this.page);
      localStorage.setItem("goodsFilterForm", JSON.stringify(this.filterForm));
      this.getList();
    },
    handleRowEdit(index, row) {
      console.log(row);
      this.$router.push({ name: "agreeaddpage", query: {
         id: row.id ,
         company_id:row.company_id
         } });
    },
    handleRowDelete(index, row) {
      this.$confirm("确定要删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error"
      }).then(() => {
        this.axios.post("goods/destroy", { id: row.id }).then(response => {
          if (response.data.errno === 0) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });

            this.getList();
          }
        });
      });
    },
    onSubmitFilter(event) {
      console.log(event);
      localStorage.setItem("goodsFilterForm", JSON.stringify(this.filterForm));
      this.page = 1;
      this.getList();
    },
    getList() {
      this.axios
        .get("goods?verified=0", {
          params: {
            page: this.page,
            name: this.filterForm.name,
            category_id: this.filterForm.category_id,
            sortChecked: this.filterForm.sortChecked,
            goodsTypeSelected: this.filterForm.goodsTypeSelected
          }
        })
        .then(response => {
          this.tableData = response.data.data.data;
          this.page = response.data.data.currentPage;
          this.total = response.data.data.count;
          console.log(response);
        });
    }
  },
  components: {},
  mounted() {
    this.isShowDelete = api.isShowDelete;

    let savedFilterForm = localStorage.getItem("goodsFilterForm");

    if (savedFilterForm) {
      try {
        savedFilterForm = JSON.parse(savedFilterForm);
        Object.assign(this.filterForm, savedFilterForm);
      } catch (e) {}
    }

    this.getCascaderCategory();
    this.getList();
  }
};
</script>

<style>
.image-show {
  width: 150px;
}
</style>
