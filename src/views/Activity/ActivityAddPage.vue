<template>
  <div class="content-page">
    <div class="content-nav">
      <el-breadcrumb
        class="breadcrumb"
        separator="/"
      >
        <el-breadcrumb-item :to="{ name: 'dashboard'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{infoForm.id ? '编辑商品' : '添加商品'}}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="operation-nav">
        <el-button
          type="primary"
          @click="goBackPage"
          icon="arrow-left"
        >返回列表</el-button>
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
            label="活动标题"
            prop="name"
          >
            <el-input v-model="infoForm.name" style="width:30%"></el-input>
          </el-form-item>
          <el-form-item
            label="承办方"
            prop="organizer"
          >
            <el-input v-model="infoForm.organizer" style="width:30%"></el-input>
          </el-form-item>
          <el-form-item
            label="活动地点"
            prop="address"
          >
            <el-input v-model="infoForm.address"></el-input>
          </el-form-item>
          <el-form-item
            label="联系方式"
            prop="contact"
          >
            <el-input v-model="infoForm.contact" style="width:30%"></el-input>
          </el-form-item>
          <el-form-item
            label="活动简单描述"
            name="brief"
          >
            <el-input
              type="textarea"
              @input="descInput"
              v-model="infoForm.brief"
              maxlength='100'
              placeholder="填写后会在活动详情页的活动名称下展现，非必填"
            ></el-input>
            <span
              class="text"
              style="float: right;color: #909399;margin-right: 55px;"
            >已输入{{remnant}}/100字以内</span>
          </el-form-item>

          <el-form-item
          label="选择时间"
          name="time1"
          >
            <el-date-picker
              value-format="timestamp"
              v-model="time1"
              type="datetimerange"
              range-separator="至"
              unlink-panels
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="choosetime1">
            </el-date-picker>
          </el-form-item>

          <!-- <el-form-item
            label="所属分类"
            prop="categorySelected"
          >
            <el-cascader
              :options="categoryOptions"
              :props="categoryCascaderConfig"
              placeholder="请选择分类"
              v-model="categorySelected"
              @change="handleChange"
            >
            </el-cascader>
          </el-form-item> -->
          <!-- <el-form-item
            label="产品类别"
            prop="is_service"
          >
            <template>
              <el-radio-group
                v-model="infoForm.is_service"
                @change="chang"
              >
                <el-radio :label="1">服务类</el-radio>
                <el-radio :label="0">商品类</el-radio>
              </el-radio-group>
            </template>
          </el-form-item> -->
          <!-- <el-form-item
            label="价格¥"
            prop="retail_price"
            :rules="[{ type:'number', required: true, message: '请填写价格', trigger: 'blur'}]"
          >
            <el-input
              @change="numberLimt"
              type="number"
              v-model.number="infoForm.retail_price"
            ></el-input>
          </el-form-item>
          <el-form-item label="上架">
            <el-switch
              on-text=""
              off-text=""
              v-model="infoForm.is_on_sale"
            >
            </el-switch>
          </el-form-item> -->
          <!--         <el-form-item label="排序">
            <el-input-number v-model="infoForm.sort_order" :min="1" :max="1000"></el-input-number>
          </el-form-item> -->

          <el-form-item label="列表图片">
            <el-upload
              class="avatar-uploader"
              ref="upload"
              name='pic'
              v-model="infoForm.list_pic_url"
              action="https://api.anjihos.newlioncity.com/admin/upload/goodsPic"
              :headers='header'
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success='listPicUrl'
              :on-change='judgeIsImgIn_1'
              list-type="picture-card"
              :before-upload="beforeAvatarUpload"
              :show-file-list="false"
            >
              <img
                v-if="infoForm.list_pic_url"
                :src="infoForm.list_pic_url"
                class="avatar"
              >
              <i
                v-else
                class="el-icon-plus avatar-uploader-icon"
              ></i>
            </el-upload>
            <span class="imgHuge-list">请放入320*320的图片</span>
          </el-form-item>

          <!-- <el-form-item label="详情图片">
              <el-upload

              :limit='10'
               class="upload-uploader"
                ref="upload"
                name='pic'
                v-model="infoForm.desc[0]"
                action="https://api.anjihos.newlioncity.com/admin/upload/goodsPic"
                :headers='header'
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-success='goodsDesc'
                list-type="picture-card"
                :file-list="fileList"
                :before-upload="beforeAvatarUpload"

                >
                <img width="100%" v-if="infoForm.desc[0]" :src="infoForm.desc[0]" alt="">
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-upload

              :limit='10'
               class="upload-uploader"
                ref="upload"
                name='pic'
                v-model="infoForm.desc[1]"
                action="https://api.anjihos.newlioncity.com/admin/upload/goodsPic"
                :headers='header'
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-success='goodsDesc'
                list-type="picture-card"
                :file-list="fileList"
                :before-upload="beforeAvatarUpload"
                >
                <img width="100%" v-if="infoForm.desc[1]" :src="infoForm.desc[1]" alt="">
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible"></el-dialog>
          </el-form-item> -->

          <el-form-item
            label="活动banner"
            prop="gallery"
          >
            <div
              v-for="(item, curIndex) in infoForm.gallery"
              :key="item.img_url"
              class='image-div'
            >
              <el-upload
                class="image-uploader"
                name="pic"
                :action="actionGoodsPic"
                :show-file-list="false"
                :on-success="handleUploadImageSuccess"
                :headers="header"
                :data="{index:curIndex, type:'banner', preUrl: item.img_url}"
              >
                <img
                  v-if="item.img_url"
                  :src="item.img_url"
                  class="image-show"
                >
                <i
                  v-else
                  class="el-icon-plus image-uploader-icon"
                ></i>
              </el-upload>
              <el-button
                class="image-delete"
                size="small"
                type="danger"
                @click="handleDeleteImg('banner', curIndex)"
              >删除</el-button>
            </div>

            <el-upload
              v-if="infoForm.gallery.length < 8"
              class="image-uploader"
              name="pic"
              :action="actionGoodsPic"
              :show-file-list="false"
              :on-success="handleUploadImageSuccess"
              :headers="header"
              :on-change='judgeIsImgIn_2'
              :data="{index: infoForm.gallery.length, type: 'banner'}"
            >
              <i class="el-icon-plus image-uploader-icon"></i>
            </el-upload>

            <span class="imgHuge-banner">请放入800*800的图片</span>
            <!-- <el-upload
              multiple
              :limit='10'
               class="upload-uploader"
                ref="upload"
                name='pic'
                v-model="infoForm.gallery"
                action="https://api.anjihos.newlioncity.com/admin/upload/goodsPic"
                :headers='header'
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-success='banner'
                list-type="picture-card"
                :file-list="fileList"
                :before-upload="beforeAvatarUpload"

                >
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
             <img width="100%" :src="infoForm.gallery" alt="">
             </el-dialog> -->
          </el-form-item>

          <el-form-item label="活动详情">
            <div
              v-for="(item, curIndex) in infoForm.desc"
              :key="item"
              class='image-div'
            >
              <el-upload
                class="image-uploader"
                name="pic"
                :action="actionGoodsPic"
                :show-file-list="false"
                :on-success="handleUploadImageSuccess"
                :headers="header"
                :data="{index:curIndex, type: 'desc', preUrl: item}"
              >
                <img
                  v-if="item"
                  :src="item"
                  class="image-show"
                >
                <i
                  v-else
                  class="el-icon-plus image-uploader-icon"
                ></i>
              </el-upload>
              <el-button
                class="image-delete"
                size="small"
                type="danger"
                @click="handleDeleteImg('desc', curIndex)"
              >删除</el-button>
              <el-button
                v-if="curIndex != 0"
                class="image-delete"
                size="small"
                type="primary"
                @click="handleImgSort('desc', curIndex, true)"
              >↑上移</el-button>
              <el-button
                v-if="curIndex != infoForm.desc.length - 1"
                class="image-delete"
                size="small"
                type="primary"
                @click="handleImgSort('desc', curIndex, false)"
              >↓下移</el-button>
            </div>

            <el-upload
              class="image-uploader"
              name="pic"
              :on-change='judgeIsImgIn_3'
              :action="actionGoodsPic"
              :show-file-list="false"
              :on-success="handleUploadImageSuccess"
              :headers="header"
              :data="{index: infoForm.desc.length, type: 'desc'}"
            >
              <i class="el-icon-plus image-uploader-icon"></i>
            </el-upload>
            <span class="imgHuge-info">请放入800*800的图片</span>
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
        id: 0,
        list_pic_url: "",
        contact:'',
        desc: [],
        name: "",
        organizer:'',
        brief: "",
        sort_order: 1,
        sort_order: 100,
        is_show: true,
        is_on_sale: 1,
        start_time:123,
        end_time:456,
        gallery: [],
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
      this.$router.push({
        name:'activity'
      });
    },
    //上传之前的图片限制
    beforeAvatarUpload(file) {
      var testmsg = /^image\/(jpeg|png|jpg)$/.test(file.type);
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!testmsg) {
        this.$message({
          type: "error",
          message: "上传的格式只能为jpg,png,jpeg格式!"
        });
      }
      if (!isLt2M) {
        this.$message({
          type: "error",
          message: "总上传的图片超过10M!"
        });
        return;
      }
      return testmsg && isLt2M;
    },
    handleChange(item) {
      this.infoForm.category_id = item[item.length - 1];
    },
    handlePreview(file) {
      //预览图片时调用
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleRemove(file, fileList) {
      //移除图片
    },
    //后台列表图片
    listPicUrl(response, file, fileList) {
      this.infoForm.list_pic_url = response.data.fileUrl;
    },
    //详情图片
    goodsDesc(response, file, fileList) {
      // console.log(this.infoForm.desc);
      this.infoForm.desc.push(response.data.fileUrl);
    },
    //轮播图片
    banner(response, file, fileList) {
      //this.infoForm.gallery[0].img_url=(response.data.fileUrl)
      //this.infoForm.gallery[1].img_url=(response.data.fileUrl)
      if (response.data.fileUrl) {
        let a = {
          id: "",
          img_url: ""
        };
        a.img_url = response.data.fileUrl;
        this.infoForm.gallery.push(a);
      }
    },

    handleImgSort(type, index, upOrDown) {
      switch (type) {
        case "desc":
          {
            let arr = this.infoForm.desc;
            if (index >= 0 && index < arr.length) {
              if (upOrDown) {
                if (index === 0) {
                  return;
                }
                [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
              } else {
                if (index === arr.length - 1) {
                  return;
                }
                [arr[index + 1], arr[index]] = [arr[index], arr[index + 1]];
              }
            }
            this.infoForm.desc = [];
            this.infoForm.desc = arr;
          }

          break;
        default:
      }
    },

    handleDeleteImg(type, index) {
      switch (type) {
        case "banner":
          {
            if (index >= 0 && index < this.infoForm.gallery.length) {
              let deletedObj = this.infoForm.gallery.splice(index, 1);
              this.infoForm.deletedGalleries.push(deletedObj[0]);
            }
          }
          break;

        case "desc":
          {
            if (index >= 0 && index < this.infoForm.desc.length) {
              let deletedUrls = this.infoForm.desc.splice(index, 1);
              this.infoForm.deletedDescPics.push(deletedUrls[0]);
            }
          }

          break;
        default:
      }
    },

    handleUploadImageSuccess(res, file) {
      if (res.errno === 0) {
        switch (res.data.params.type) {
          case "banner":
            {
              let index = parseInt(res.data.params.index);

              let preUrl = res.data.params.preUrl;
              if (preUrl) {
                this.infoForm.deletedDescPics.push(preUrl);
              }

              if (index >= this.infoForm.gallery.length) {
                let galleryObj = new Object();
                galleryObj.id = 0;
                galleryObj.goods_id = this.infoForm.id;
                galleryObj.img_url = res.data.fileUrl;
                this.infoForm.gallery.push(galleryObj);
              } else {
                this.infoForm.gallery[index].img_url = res.data.fileUrl;
              }
            }
            break;

          case "desc":
            {
              let index = parseInt(res.data.params.index);
              let preUrl = res.data.params.preUrl;

              if (preUrl) {
                this.infoForm.deletedDescPics.push(preUrl);
              }

              if (index >= this.infoForm.desc.length) {
                this.infoForm.desc.push(res.data.fileUrl);
              } else {
                this.infoForm.desc.splice(index, 1, res.data.fileUrl);
              }
            }

            break;

          default:
        }
      }
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
      if (
        (this.isImgIn_1 && this.isImgIn_2 && this.isImgIn_3) ||
        this.$route.query.id
      ) {
        this.$refs["infoForm"].validate(valid => {
          if (valid) {
            this.axios.post("activity/store", this.infoForm).then(response => {
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
      } else {
        this.$message({
          type: "error",
          message: "保存失败,请放入必要的图片"
        });
      }
    },

    getCascaderCategory() {
      this.axios.get("category/cascader").then(response => {
        this.categoryOptions = this.categoryOptions.concat(response.data.data);
        this.handleCategorySelected();
      });
    },

    handleCategorySelected() {
      if (this.categoryOptions.length > 0 && this.infoForm.category_id > 0) {
        this.categoryOptions.map(item => {
          item.children.map(itemChild => {
            if (itemChild.id === this.infoForm.category_id) {
              this.categorySelected = [item.id, this.infoForm.category_id];
              return;
            }
          });
        });
      }
    },

    getInfo() {
      if (this.infoForm.id <= 0) {
        return false;
      }

      let that = this;
      this.axios
        .get("activity/info", {
          params: {
            id: that.infoForm.id
          }
        })
        .then(response => {
          console.log(response)
          let resInfo = response.data.data;
          resInfo.is_on_sale = resInfo.is_on_sale ? true : false;

          that.infoForm = Object.assign(that.infoForm, resInfo);

          this.handleCategorySelected();
          console.log(that.time1)
          that.time1.push(that.infoForm.start_time * 1000)
          that.time1.push(that.infoForm.end_time * 1000)
          // console.log(this.infoForm.list_pic_url);
          // console.log(this.infoForm.desc[0]);
        });
    }
  },
  components: {},
  mounted() {
    this.getCascaderCategory();
    this.infoForm.id = this.$route.query.id || 0;
    this.getInfo();
    // console.log(this.infoForm.list_pic_url);
    // console.log(this.infoForm.desc);
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
