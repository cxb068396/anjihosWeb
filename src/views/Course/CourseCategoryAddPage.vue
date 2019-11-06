<template>
  <div class="content-page">

    <div class="content-nav">
      <el-breadcrumb
        class="breadcrumb"
        separator="/"
      >
        <el-breadcrumb-item :to="{name: 'dashboard'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>课程管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{infoForm.id ? '编辑更新' : '添加分类'}}</el-breadcrumb-item>
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
            label="上级分类"
            prop="name"
          >
            <el-select
              v-model="infoForm.parent_id"
              placeholder="请选择上级分类"
              @change="handleChange"
            >
              <el-option
                v-for="item in parentCategory"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            lable="分类名称"
            prop="name"
          >
            <el-input
              @input="descInputCategory"
              v-model="infoForm.name"
              id="maxLength"
              placeholder="请输入1-4个中文字符"
              maxlength="4"
            ></el-input>
            <span
              class="text"
              style="float: right;color: #909399;margin-right: 55px;"
            >已输入{{categorynamelength}}/{{categorynamelengthall}}字以内</span>
          </el-form-item>

          <!--           <el-form-item>
            <el-upload
              class="upload-demo"
              :headers="headers"
              name="pic"
              action="https://api.anjihos.z-y.tech/admin/upload/goodsPic"
              :limit = 1 
              :on-exceed="picLimitMes"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="onloadPic"
              :file-list="fileList2"
              :before-upload="beforeAvatarUpload"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item> -->
          <el-form-item
            label="分类照片"
            :rules="[{  required: true}]"
          >
            <el-upload
              class="avatar-uploader"
              ref="upload"
              name='pic'
              v-model="infoForm.wap_banner_url"
              action="https://api.anjihos.z-y.tech/admin/upload/goodsPic"
              :headers='headers'
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success='onloadPic'
              :on-change='judgeIsImgIn'
              list-type="picture-card"
              :before-upload="beforeAvatarUpload"
              :show-file-list="false"
            >
              <img
                v-if="infoForm.wap_banner_url"
                :src="infoForm.wap_banner_url"
                class="avatar"
              >
              <i
                v-else
                class="el-icon-plus avatar-uploader-icon"
              ></i>
            </el-upload>
            <span class="imgHuge-1">主分类请放入750*246的图片</span>
            <span class="imgHuge-2">次分类请放入320*320的图片</span>
          </el-form-item>

          <el-form-item
            label="简短介绍"
            prop="front_name"
          >
            <el-input
             
              @input="descInput"
              v-model="infoForm.front_name"
              :rows="1"
              maxlength='30'
              placeholder='最多输入30个字'
            ></el-input>
            <span
              class="text"
              style="float: right;color: #909399;margin-right: 55px;"
            >已输入{{remnant}}/30字以内</span>
            <div class="form-tip"></div>
          </el-form-item>
          <el-form-item label="排序">
            <el-input-number
              v-model="infoForm.sort_order"
              :min="1"
              :max="1000"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="启用">
            <el-switch v-model="infoForm.is_show"></el-switch>
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
      categorynamelengthall: 4,
      categorynamelength: 0,
      isImgIn: false,
      remnant: 0,
      parentCategory: [
        {
          id: 0,
          name: "顶级分类"
        }
      ],
      headers: {
        "X-Anjishop-Token": localStorage.getItem("token") || ""
      },

      fileList2: [],
      infoForm: {
        id: 0,
        name: "",
        parent_id: 0,
        front_name: "",
        wap_banner_url: "",
        icon_url: "",
        img_url: "",
        sort_order: 1,
        is_show: true,
        is_course:1,
      },
      infoRules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        front_name: [{ required: true, message: "请输入简介", trigger: "blur" }]
      }
    };
  },
  methods: {
    descInput() {
      var txtVal = this.infoForm.front_name.length;
      this.remnant = txtVal;
    },
    descInputCategory() {
      this.categorynamelength = this.infoForm.name.length;
    },
    judgeIsImgIn() {
      this.isImgIn = true;
    },
    goBackPage() {
      this.$router.go(-1);
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
    onSubmitInfo() {
      if (this.isImgIn || this.$route.query.id) {
        let inputId = document.getElementById("maxLength");
        if (inputId.value.length > inputId.getAttribute("maxlength")) {
          this.$message({
            message: "分类名称不符合字数要求，请重新输入",
            type: "error"
          });
        } else {
          this.$refs["infoForm"].validate(valid => {
            if (valid) {
              this.axios
                .post("category/store", this.infoForm)
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
                      message: "保存失败,请检查相关内容"
                    });
                  }
                });
            } else {
              return false;
            }
          });
        }
      } else {
        this.$message({
          type: "error",
          message: "保存失败,请放入图片"
        });
      }
    },
    handleChange(item) {
      let inputId = document.getElementById("maxLength");
      if (this.infoForm.parent_id > 0) {
        inputId.setAttribute("placeholder", "请输入1-6个中文字符");
        inputId.setAttribute("maxlength", "6");
        this.categorynamelengthall = 6;
      } else {
        inputId.setAttribute("placeholder", "请输入1-4个中文字符");
        inputId.setAttribute("maxlength", "4");
        this.categorynamelengthall = 4;
      }
    },

    getTopCategory() {
      this.axios.get("category/topCategory",{ 
        params: {
            is_course:1
        }
        }).then(response => {
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
          console.log(response.data.data)
          let resInfo = response.data.data;
          resInfo.is_show = resInfo.is_show ? true : false;
          that.infoForm = resInfo;
          that.handleChange()
          that.descInputCategory()
        });
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    onloadPic(response) {
      console.log(response);
      this.infoForm.wap_banner_url = response.data.fileUrl;
    }
  },
  components: {},
  mounted() {
    this.getTopCategory();
    this.infoForm.id = this.$route.query.id || 0;
    this.getInfo();
  }
};
</script>

<style>
.imgHuge-1 {
  position: absolute;
  left: 160px;
  bottom: 4px;
}
.imgHuge-2 {
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
