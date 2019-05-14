<template>
  <div class="content-page">
    <div class="content-nav">
      <el-breadcrumb
        class="breadcrumb"
        separator="/"
      >
        <el-breadcrumb-item :to="{name: 'dashboard'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商家详情</el-breadcrumb-item>
        <el-breadcrumb-item>添加商家</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="operation-nav">
        <el-button
          type="primary"
          @click="goBackPage"
          icon="arrow-left"
        > 返回列表 </el-button>
      </div>
    </div>

    <div class="content-main">
      <div class="form-table-box">
        <el-form
          ref="infoForm"
          :rules="infoRules"
          :model="infoForm"
          label-width="120px"
        >

          <el-form-item
            label="店铺名称"
            prop="name"

          >
            <el-input
              type="textarea"
              v-model.trim="infoForm.name"
              :rows="1"
              style="width:25%"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="店铺类别"
            prop="is_hospital"
          >
            <template>
              <el-radio-group
                v-model="infoForm.is_hospital"
                @change="chang"
              >
                <el-radio :label="1">医院类</el-radio>
                <el-radio :label="0">非医院类</el-radio>
              </el-radio-group>
            </template>
          </el-form-item>
          <el-form-item
            label="店铺地址"
            prop="address"
          >
            <el-input
              type="textarea"
              v-model.trim="infoForm.address"
              :rows="1"
              style="width:50%"
            ></el-input>
          </el-form-item>
          

          <el-form-item
            label="手机号码"
            prop="mobile"
          >
            <el-input
              type="number"
              v-model="infoForm.mobile"
              :rows="1"
              style="width:25%"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="开户银行"
            prop="bank_name"
          >
            <el-input
              type="textarea"
              v-model="infoForm.bank_name"
              :rows="1"
              style="width:25%"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="银行账户"
            prop="bank_account"
          >
            <el-input
              type="number"
              v-model="infoForm.bank_account"
              :rows="1"
              style="width:50%"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="开户姓名"
            prop="bank_username"
          >
            <el-input
              type="textarea"
              v-model="infoForm.bank_username"
              :rows="1"
              style="width:25%"
            ></el-input>
          </el-form-item>
          <!--           <el-form-item label="店铺照片">
            <el-upload
              class="upload-demo"
              :headers="headers"
              name="pic"
              :limit = 1 
              :on-exceed="picLimitMes"
              action="https://api.anjihos.newlioncity.com/admin/upload/goodsPic"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="onloadPic"
              :before-upload="beforeAvatarUpload"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item> -->
          <el-form-item label="店铺照片">
            <el-upload
              class="avatar-uploader"
              ref="upload"
              name='pic'
              v-model="infoForm.image_url"
              action="https://api.anjihos.newlioncity.com/admin/upload/goodsPic"
              :headers='headers'
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success='onloadPic'
              list-type="picture-card"
              :before-upload="beforeAvatarUpload"
              :show-file-list="false"
            >
              <img
                v-if="infoForm.image_url"
                :src="infoForm.image_url"
                class="avatar"
              >
              <i
                v-else
                class="el-icon-plus avatar-uploader-icon"
              ></i>
            </el-upload>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              @click="onSubmitInfo"
            >确定保存</el-button>
            <el-button @click="goBackPage">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
// import api from '@/config/api';

export default {
  data() {
    return {
      // headers:{
      //   'X-Anjishop-Token':localStorage.getItem('token') || ''
      // },
      infoForm: {
        id: 0,
        name: "",
        address: "",
        verified: 1,
        image_url: "",
        mobile:'',
        bank_name:'',
        bank_account:'',
        bank_username:'',
        is_hospital:0

      },
      headers: {
        "X-Anjishop-Token": localStorage.getItem("token") || ""
      },
      infoRules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        address: [{ required: true, message: "请输入地址", trigger: "blur" }],
        mobile: [{ required: true, message: "请输入手机号码", trigger: "blur" }],
        bank_name: [{ required: true, message: "请输入开户银行", trigger: "blur" }],
        bank_account: [{ required: true, message: "请输入银行账户", trigger: "blur" }],
        bank_username: [{ required: true, message: "请输入开户者姓名", trigger: "blur" }]
      }
    };
  },
  methods: {
    goBackPage() {
      this.$router.go(-1);
    },
    onSubmitInfo() {
      this.$confirm('银行相关信息非常重要，请确保所填完全正确！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          this.$refs["infoForm"].validate(valid => {
          if (valid) {
            console.log(this.infoForm);
            this.axios
              .post(
                "/company/store",
                this.infoForm
              )
              .then(response => {
                if (response.data.errno === 0) {
                  this.$message({
                    type: "success",
                    message: "保存成功"
                  });
                  this.$router.go(-1);
                } else {
                  this.$message({
                    type: "error",
                    message: "店铺名称不允许重复,请重新填写"
                  });
                }
              });
          } else {
            return false;
          }
        });
      }).catch(() => {
        //取消的回调     
      });
    },
    handleChange(item) {
      if (item === 0) {
        return;
      }
    },
    getTopCategory() {
      this.axios.get("category/topCategory").then(response => {
        this.parentCategory = this.parentCategory.concat(response.data.data);
      });
    },
    getInfo() {
      if (this.infoForm.id <= 0) {
        return false;
      }

      let that = this;
      this.axios
        .get("category/info", {
          params: {
            id: that.infoForm.id
          }
        })
        .then(response => {
          let resInfo = response.data.data;
          resInfo.is_show = resInfo.is_show ? true : false;
          that.infoForm = resInfo;
        });
    },
    beforeAvatarUpload(file) {
      const isPNG = file.type === "image/png";
      const isJPG = file.type === "image/jpeg";
      const isLt1M = file.size / 1024 / 1024 / 2 < 0.5;

      if (!isJPG && !isPNG) {
        this.$message.error("上传头像图片只能是 JPG 或 PNG 格式!");
      }
      if (!isLt1M) {
        this.$message.error("上传头像图片大小不能超过512kB!");
      }
      return (isJPG || isPNG) && isLt1M;
    },
    picLimitMes() {
      this.$message({
        type: "error",
        message: "只允许上传一张图片。"
      });
    },
    picLimitMes() {
      this.$message({
        type: "error",
        message: "只允许上传一张图片。"
      });
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    onloadPic(response) {
      console.log(response.data.fileUrl);
      this.infoForm.image_url = response.data.fileUrl;
    }
  },
  components: {},
  mounted() {
    this.infoForm.id = this.$route.query.id || 0;
    this.infoForm.address = this.$route.query.address || "";
    this.infoForm.name = this.$route.query.name || "";
    this.infoForm.mobile = this.$route.query.mobile || "";
    this.infoForm.bank_name = this.$route.query.bank_name || "";
    this.infoForm.bank_account = this.$route.query.bank_account || "";
    this.infoForm.bank_username = this.$route.query.bank_username || "";
    // this.getTopCategory();
    // this.infoForm.id = this.$route.query.id || 0;
    // this.getInfo();
  }
};
</script>

<style>
</style>
