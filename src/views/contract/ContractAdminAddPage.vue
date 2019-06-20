<template>
  <div class="content-page">
    <div class="content-nav">
      <el-breadcrumb
        class="breadcrumb"
        separator="/"
      >
        <el-breadcrumb-item :to="{name: 'dashboard'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>医院详情</el-breadcrumb-item>
        <el-breadcrumb-item>添加医院</el-breadcrumb-item>
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
          ref="adminAddInfoForm"
          :rules="infoRules"
          :model="adminAddInfoForm"
          label-width="120px"
        >

          <el-form-item
            label="被签约人姓名"
            prop="real_name"

          >
            <el-input
              type="textarea"
              v-model.trim="adminAddInfoForm.real_name"
              :rows="1"
              style="width:30%"
            ></el-input>
          </el-form-item>

          <el-form-item
            label="被签约人地址"
            prop="second_address"
          >
            <el-input
              type="textarea"
              v-model.trim="adminAddInfoForm.second_address"
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
              v-model="adminAddInfoForm.mobile"
              :rows="1"
              style="width:30%"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="身份证号码"
            prop="id_card"
          >
            <el-input
              type="number"
              v-model="adminAddInfoForm.id_card"
              :rows="1"
              style="width:30%"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="性别"
            prop="sex"
          >
            <el-input
              type="textarea"
              v-model="adminAddInfoForm.sex"
              :rows="1"
              style="width:30%"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item label="医院照片">
            <el-upload
              class="avatar-uploader"
              ref="upload"
              name='pic'
              v-model="adminAddInfoForm.image_url"
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
                v-if="adminAddInfoForm.image_url"
                :src="adminAddInfoForm.image_url"
                class="avatar"
              >
              <i
                v-else
                class="el-icon-plus avatar-uploader-icon"
              ></i>
            </el-upload>
          </el-form-item> -->

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
      adminAddInfoForm: {
        real_name: "",
        second_address: "",
        sex: "",
        image_url: "",
        mobile:'',
        id_card:'',


      },
      headers: {
        "X-Anjishop-Token": localStorage.getItem("token") || ""
      },
      infoRules: {
        namreal_namee: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        second_address: [{ required: true, message: "请输入地址", trigger: "blur" }],
        mobile: [{ required: true, message: "请输入手机号码", trigger: "blur" }],
        sex: [{ required: true, message: "请输入性别", trigger: "blur" }],
        id_card: [{ required: true, message: "请输入身份证号", trigger: "blur" }],
      }
    };
  },
  methods: {
    goBackPage() {
      this.$router.go(-1);
    },
    onSubmitInfo() {
      console.log(this.adminAddInfoForm)
      this.$router.push({
        name: "contractsendcompany",
        query: {
          adminAddInfoForm: this.adminAddInfoForm
        }
      })
    },
    handleChange(item) {
      if (item === 0) {
        return;
      }
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
      this.adminAddInfoForm.image_url = response.data.fileUrl;
    }
  },
  components: {},
  mounted() {
  
  }
};
</script>

<style>
</style>
