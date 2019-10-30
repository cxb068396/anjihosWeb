<template>
  <div class="personnel_updat">
    <div class="content-nav">
      <el-breadcrumb class="breadcrumb" separator="/">
        <el-breadcrumb-item :to="{path: '/dashboard'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>服务包管理</el-breadcrumb-item>
        <el-breadcrumb-item>服务包更新</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="operation-nav">
        <router-link to="servicepacklist">
          <el-button type="primary" icon="plus">返回列表</el-button>
        </router-link>
      </div>
    </div>
    <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="详情名称" prop="name" style="width: 300px;">
        <el-input v-model.trim="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="详情描述" prop="desc" style="width: 600px;">
        <el-input rows="5" type="textarea" v-model.trim="ruleForm.desc"></el-input>
      </el-form-item>
      <el-form-item label="服务频次" prop="frequency" style="width: 300px;">
        <el-input v-model.trim="ruleForm.frequency"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm">确定保存</el-button>
        <el-button @click="resetForm(ruleForm)">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        name: "",
        desc: "",
        frequency: "",
        id:''

      }
    };
  },
  methods: {
    resetForm(ruleForm) {
      this.$refs["ruleForm"].resetFields();
    },
    submitForm() {
      const params = {
        name: this.ruleForm.name.trim(),
        desc: this.ruleForm.desc.trim(),
        frequency: this.ruleForm.frequency.trim(),
        id:this.ruleForm.id,
        type:'modifypackgedetail'
      };
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.axios
            .post(
              "https://api.anjihos.z-y.tech/admin/service/store",
              params
            )
            .then(response => {
              if (response.data.errno === 0) {
                this.$message({
                  type: "success",
                  message: "更新成功"
                });
                this.$router.push({
                  name: "servicepacklist"
                });
              } else {
                this.$message({
                  type: "error",
                  message: "取消"
                });
              }
            });
        } else {
          //return false;
        }
      });
    }
  },
  mounted() {
    this.ruleForm.name = this.$route.query.name || "";
    this.ruleForm.desc = this.$route.query.desc || "";
    this.ruleForm.frequency = this.$route.query.frequency || "";
    this.ruleForm.id = this.$route.query.id || "";
    console.log(this.$route.query.id)
  }
};
</script>

<style>
</style>