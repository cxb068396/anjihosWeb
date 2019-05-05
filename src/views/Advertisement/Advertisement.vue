<template>
  <div class="content-page">
    <div class="content-nav">
      <el-breadcrumb
        class="breadcrumb"
        separator="/"
      >
        <el-breadcrumb-item :to="{ path: '/dashboard'}"> 首页</el-breadcrumb-item>
        <el-breadcrumb-item>广告管理</el-breadcrumb-item>
        <el-breadcrumb-item>小程序首页</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="operation-nav">
        <router-link to="/dashboard/adwxadd">
          <el-button
            type="primary"
            icon="plus"
          >添加广告</el-button>
        </router-link>
      </div>
    </div>
    <div class="content-main">
      <div class="form-table-box">
        <el-table
          :data="imgData"
          style="width: 100%"
          border
          stripe
        >
          <!--           <el-table-column prop="ad_position_id" label="位置排序" min-width="150">
          </el-table-column> -->
          <!--         <el-table-column prop="id" label="图片编号" min-width="150">
          </el-table-column> -->
          <el-table-column
            prop="name"
            label="广告名称"
            min-width="200"
          >
          </el-table-column>
          <el-table-column
            prop="media_id"
            label="商品编号"
            min-width="150"
          >
          </el-table-column>
          <el-table-column
            prop="image_url"
            label="图片"
            min-width="180"
          >
            <template scope="scope">
              <img
                :src="scope.row.image_url"
                class="image-show"
              >
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            min-width="200"
          >
            <template scope="scope">
              <el-button
                size="small"
                @click="handleRowEdit(scope.$index, scope.row)"
              >编辑</el-button>

              <el-button
                size="small"
                type="danger"
                @click="handleRowDelete(scope.$index, scope.row)"
              >删除</el-button>

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
      imgData: []
    };
  },
  methods: {
    handleRowEdit(index, row) {
      this.$router.push({
        name: "adwxupdate",
        query: {
          id: row.id,
          ad_position_id: row.ad_position_id,
          media_type: row.media_type,
          media_id: row.media_id,
          name: row.name,
          link: row.link,
          image_url: row.image_url,
          end_time: row.end_time,
          enabled: row.enabled
        }
      });
      console.log(row);
    },
    handleRowDelete(index, row) {
      this.$confirm("删除该图片,请谨慎操作。", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.axios
          .post("/banner/destroy", {
            id: row.id
          })
          .then(response => {
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
    },
    getList() {
      this.axios
        .get("/banner")
        .then(response => {
          console.log(response.data)
          this.imgData = response.data.data.data;
        });
    }
  },
  mounted() {
    this.isShowDelete = api.isShowDelete;
    this.getList();
    // console.log(picUrl)
  }
};
</script>

<style scoped>
</style>
