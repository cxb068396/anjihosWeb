<template>
  <div class="content-page">
    <div class="content-nav">
      <el-breadcrumb
        class="breadcrumb"
        separator="/"
      >
        <el-breadcrumb-item :to="{path: '/dashboard'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>机构管理</el-breadcrumb-item>
        <el-breadcrumb-item>机构详情</el-breadcrumb-item>
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
      :data="MerchantList"
      style="width: 100%"
    >
      <el-table-column label="机构详情">
        <template slot-scope="props">
          <el-form
            label-position="left"
            inline
            class="demo-table-expand"
          >
            <el-form-item
              label="机构名称"
              prop="name"
            >
              <span>{{ props.row.name }}</span>
            </el-form-item>

            <el-form-item
              label="联系方式"
              prop="mobile"
            >
              <span>{{ props.row.mobile }}</span>
            </el-form-item>            <el-form-item
              label="开户银行"
              prop="bank_name"
            >
              <span>{{ props.row.bank_name }}</span>
            </el-form-item>            <el-form-item
              label="开户账号"
              prop="bank_account"
            >
              <span>{{ props.row.bank_account }}</span>
            </el-form-item>            <el-form-item
              label="开户姓名"
              prop="bank_username"
            >
              <span>{{ props.row.bank_username }}</span>
            </el-form-item>

            <el-form-item
              label="机构编号"
              prop="id"
            >
              <span>{{ props.row.id }}</span>
            </el-form-item>
            <el-form-item label="机构资格">
              <span>{{ props.row.verified== 1?'通过':'未通过'}}</span>
            </el-form-item>
            <el-form-item label="添加时间">
              <span>{{ props.row.addtime }}</span>
            </el-form-item>
            <el-form-item label="机构地址">
              <span>{{ props.row.address }}</span>
            </el-form-item>
            <el-form-item label="机构照片">
              <template>
                <img
                  :src="props.row.image_url"
                  :onerror="defaultImg"
                  class="shop_img"
                >
              </template>
            </el-form-item>
          </el-form>

        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      defaultImg: 'this.src="' + require("../../assets/noPictures.jpg") + '"',
      MerchantList: [
        {
          id: "",
          name: "",
          verified: 1,
          modifytime: "",
          addtime: "",
          address: "",
          image_url: "",
          mobile:'',
          bank_name:'',
          bank_account:'',
          bank_username:'',

        }
      ]
    };
  },
  methods: {
    goBackPage() {
      this.$router.go(-1);
      // this.$router.push({name:'merchant'})
    }
  },
  mounted() {
    this.MerchantList[0].id = this.$route.query.id || 0;
    this.MerchantList[0].name = this.$route.query.name || "";
    this.MerchantList[0].verified = this.$route.query.verified 
    this.MerchantList[0].modifytime = this.$route.query.modifytime || "";
    this.MerchantList[0].addtime = this.$route.query.addtime || "";
    this.MerchantList[0].address = this.$route.query.address || "";
    this.MerchantList[0].image_url = this.$route.query.image_url || "";
    this.MerchantList[0].mobile = this.$route.query.mobile || ""
    this.MerchantList[0].bank_name = this.$route.query.bank_name || ""
    this.MerchantList[0].bank_account = this.$route.query.bank_account || ""
    this.MerchantList[0].bank_username = this.$route.query.bank_username || ""
    console.log(this.MerchantList);
  }
};
</script>
<style scoped>
.shop_img {
  width: 200px;
  height: 200px;
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
