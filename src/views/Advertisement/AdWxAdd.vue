<template>
  <div class="content-page">
    <div class="content-nav">
      <el-breadcrumb
        class="breadcrumb"
        separator="/"
      >
        <el-breadcrumb-item :to="{name: 'dashboard'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>广告管理</el-breadcrumb-item>
        <el-breadcrumb-item>添加广告</el-breadcrumb-item>
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
          ref="imgForm"
          :rules="imgRules"
          :model="imgForm"
          label-width="120px"
        >

          <el-form-item
            label="广告名称"
            prop="name"
          >
            <el-input
              type="textarea"
              v-model="imgForm.name"
              :rows="1"
            ></el-input>
            <div class="form-tip"></div>
          </el-form-item>
          <el-form-item
            label="链接商品编号"
            prop="media_id"
          >
            <el-input
              type='number'
              v-model="imgForm.media_id"
              :rows="1"
              :min="1"
            ></el-input>
            <div class="form-tip"></div>
          </el-form-item>

          <!--      <el-form-item>
            <el-upload
              class="upload-demo"
              name="pic"
              :headers="headers"
              action="http://47.97.251.68:8361/admin/upload/goodsPic"
              :limit = 1 
              :on-exceed="picLimitMes"
              :on-success="onloadPic"
              :before-upload="beforeAvatarUpload"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传1440*800的jpg/png文件，且不超过512KB</div>
            </el-upload>
          </el-form-item> -->

          <el-form-item
            label="广告图片"
            :rules="[{  required: true}]"
          >
            <el-upload
              class="avatar-uploader"
              ref="upload"
              name='pic'
              v-model="imgForm.image_url"
              action="http://47.97.251.68:8361/admin/upload/goodsPic"
              :headers='headers'
              :on-success='onloadPic'
              :on-change='judgeIsImgIn'
              list-type="picture-card"
              :before-upload="beforeAvatarUpload"
              :show-file-list="false"
            >
              <img
                v-if="imgForm.image_url"
                :src="imgForm.image_url"
                class="avatar"
              >
              <i
                v-else
                class="el-icon-plus avatar-uploader-icon"
              ></i>
            </el-upload>
            <span class="imgHuge-ad-banner">请放入1440*800的图片</span>
          </el-form-item>
          <!--     <el-form-item label="广告位置" prop="ad_position_id">
            <el-input  v-model="imgForm.ad_position_id" :rows="1"></el-input>
            <div class="form-tip"></div>
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
      isImgIn: false,
      headers: {
        "X-Anjishop-Token": localStorage.getItem("token") || ""
      },
      imgForm: {
        ad_position_id: 1,
        media_type: 1,
        media_id: '',
        name: "",
        link: "",
        image_url: "",
        content: "",
        end_time: 0,
        enabled: 1
      },
      imgRules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        media_id: [
          { required: true, message: "请输入商品编号", trigger: "blur" }
        ]
        // ad_position_id: [
        //   { required: true, message: '请输入广告位置', trigger: 'blur'},
        // ],
      }
    };
  },

  methods: {
    goBackPage() {
      this.$router.go(-1);
    },
    judgeIsImgIn() {
      this.isImgIn = true;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 1;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 1MB!");
      }
      return isJPG && isLt2M;
    },
    picLimitMes() {
      this.$message({
        type: "error",
        message: "只允许上传一张图片。"
      });
    },

    onSubmitInfo() {
      if(this.isImgIn || this.$route.query.image_url){
        this.$refs['imgForm'].validate((valid) => {

          if (valid) {
            this.axios
              .post(
                "/banner/store",
                this.imgForm
              )
              .then(response => {
                if (response.data.errno === 0) {
                  console.log(this.imgForm);
                  this.$message({
                    type: "success",
                    message: "保存成功"
                  });
                  this.$router.go(-1);
                } else {
                  this.$message({
                    type: "error",
                    message: "保存失败"
                  });
                }
              });
          } else {
            return false;
          }
        });
      } else {
        this.$message({
          type: "error",
          message: "保存失败,请放入图片"
        });
      }
    },
    handleChange(item) {
      if (item === 0) {
        return;
      }
    },
    // getTopCategory() {
    //   this.axios.get('category/topCategory').then((response) => {
    //     this.parentCategory = this.parentCategory.concat(response.data.data);
    //   })
    // },
    // getInfo() {
    //   if (this.infoForm.id <= 0) {
    //     return false
    //   }

    //   let that = this
    //   this.axios.get('category/info', {
    //     params: {
    //       id: that.infoForm.id
    //     }
    //   }).then((response) => {
    //     let resInfo = response.data.data;
    //     resInfo.is_show = resInfo.is_show ? true : false;
    //     that.infoForm = resInfo;
    //   })
    // },
    onloadPic(response) {
      console.log(response);
      this.imgForm.image_url = response.data.fileUrl;
    }
  },
  components: {},
  mounted() {
    // this.getTopCategory();
    // this.infoForm.id = this.$route.query.id || 0;
    // this.getInfo();
  }
};
</script>

<style>
.imgHuge-ad-banner {
  position: absolute;
  left: 160px;
  bottom: -12px;
}
.avatar {
  width: 148px;
  height: 148px;
  display: block;
}
</style>
