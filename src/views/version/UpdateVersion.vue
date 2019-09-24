<template>
  <div class="content-page">
    <div class="content-nav">
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
            label="上传新的版本号"
            prop="vscode"
          >
            <el-input type='number' v-model="infoForm.vscode" style="width:30%"></el-input>
          </el-form-item>
          <el-form-item
            label="更新内容"
            prop="commit"
          >
            <el-input v-model="infoForm.commit"></el-input>
          </el-form-item>
          <el-form-item
            label="更新文件"
            prop="apk"
          >
            <el-upload
              class="upload-demo"
              drag
              action="http://47.97.251.68:8361/admin/upload/upversion"
              multiple
              :on-success='fileUpload'
              :headers="header">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onSubmitInfo"
            >确定保存</el-button>
            <el-button @click="goBackPage">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import api from "@/config/api";
export default {
  data() {
    return {
      time1:[],
      remnant: 0,
      isImgIn_1: false,
      isImgIn_2: false,
      isImgIn_3: false,
      fileList: [],
      dialogVisible: false,
      categoryOptions: [],
      categoryCascaderConfig: {
        value: "id",
        label: "name",
        children: "children"
      },
      categorySelected: [],
      header: {
        "X-Anjishop-Token": localStorage.getItem("token") || ""
      },

      actionGoodsPic: api.rootUrl + "/upload/goodsPic",

      infoForm: {
        vscode:0,
        commit:'',
        apk:'',
      },

      infoRules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        time1:[{required: true, message: "请选择时间段", trigger: "blur"}],
        is_service: [
          { required: true, message: "请选择类别", trigger: "blur" }
        ],
        categorySelected: [
          {
            type: "array",
            required: true,
            message: "请选择所属分类",
            validator: (rule, value, callback) => {
              if (this.categorySelected.length <= 0) {
                callback(new Error());
              } else {
                callback();
              }
            },
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    fileUpload(res,file){
      console.log(res)
      console.log(file)
      this.infoForm.apk = file.raw
    },
    choosetime1(){
      this.infoForm.start_time = this.time1[0]/1000
      this.infoForm.end_time = this.time1[1]/1000
      console.log(this.infoForm)
    },
    chang(value) {
      this.infoForm.is_service = value;
    },
    descInput() {
      var txtVal = this.infoForm.brief.length;
      this.remnant = txtVal;
    },
    judgeIsImgIn_1() {
      this.isImgIn_1 = true;
    },
    judgeIsImgIn_2() {
      this.isImgIn_2 = true;
    },
    judgeIsImgIn_3() {
      this.isImgIn_3 = true;
    },

    blurText(e) {
      let boolean = new RegExp("/^[+]{0,1}(d+)$/").test(e.target.value);
      if (!boolean) {
        this.$message.warning("价格请输入正数");
        e.target.value = "";
      }
    },
    goBackPage() {
      this.infoForm.vscode = 0
      this.infoForm.commmit = ''
      this.infoForm.apk = ''
    },
    handleChange(item) {
      this.infoForm.activity_category_id = item[item.length - 1];
    },
  

    numberLimt() {
      if (this.infoForm.retail_price < 0) {
        this.$message({
          type: "error",
          message: "请输入大于0的数"
        });
        this.infoForm.retail_price = 0;
      }
    },
    onSubmitInfo() {

      this.infoForm.vscode = Number(this.infoForm.vscode)
      console.log(this.infoForm)
      let params = new FormData()
      params.append('apk',this.infoForm.apk)
      params.append('commit',this.infoForm.commit)
      params.append('vscode',this.infoForm.vscode)
      this.$refs["infoForm"].validate(valid => {
        if (valid) {
          this.axios.post("upload/upversion", params,{headers: {'Content-Type': 'multipart/form-data'}}).then(res => {
            console.log('res', res)
            if (res.data.errno === 0) {
              this.$message({
                type: "success",
                message: "保存成功"
              });
            } else {
              this.$message({
                type: "error",
                message: "新版本号小于旧版本号"
              });
            }
          });
        } else {
          this.$message({
            type: "error",
            message: "新版本号小于旧版本号"
          });
        }
      });
    },


    handleCategorySelected() {
      if (this.categoryOptions.length > 0 && this.infoForm.activity_category_id > 0) {
        this.categoryOptions.map(item => {
          item.children.map(itemChild => {
            if (itemChild.id === this.infoForm.activity_category_id) {
              this.categorySelected = [item.id, this.infoForm.activity_category_id];
              return;
            }
          });
        });
      }
    },

  },
  components: {},
  mounted() {
  
  }
};
</script>

<style>
.demonstration{
  color: #606266;
  font-size:14px;
  font-weight: bold;
}
.imgHuge-list {
  position: absolute;
  bottom: -10px;
  left: 160px;
}
.imgHuge-banner {
  position: absolute;
  bottom: 16px;
  left: 200px;
}
.imgHuge-info {
  position: absolute;
  bottom: 16px;
  left: 200px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 148px;
  height: 148px;
  line-height: 148px;
  text-align: center;
}
.avatar {
  width: 148px;
  height: 148px;
  display: block;
}

.image-uploader {
  height: 130px;
  display: inline-block;
}

.image-uploader .el-upload {
  border: 1px solid #d9d9d9;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.image-uploader .el-upload:hover {
  border-color: #20a0ff;
}

.image-uploader .image-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 187px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.image-uploader .image-show {
  width: 187px;
  height: 100px;
  display: block;
  float: left;
}

.image-delete {
  overflow: hidden;
  position: relative;
  bottom: 12px;
}

.image-uploader.new-image-uploader {
  font-size: 28px;
  color: #8c939d;
  width: 165px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.image-uploader.new-image-uploader .image-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 165px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.image-uploader.new-image-uploader .image-show {
  width: 165px;
  height: 100px;
  display: block;
}
.image-div {
  position: relative;
}
</style>
