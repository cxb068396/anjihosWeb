<template>
  <div class="content-page">
    <div class="content-nav">
      <el-breadcrumb
        class="breadcrumb"
        separator="/"
      >
        <el-breadcrumb-item :to="{ path: '/dashboard'}"> 首页</el-breadcrumb-item>
        <el-breadcrumb-item>服务包管理</el-breadcrumb-item>
        <el-breadcrumb-item>服务包添加</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="operation-nav">
        <el-button
          type="primary"
          @click="goBackPage"
          icon="arrow-left"
        > 返回列表 </el-button>
      </div>
    </div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
           <el-form-item
        label="服务包名称"
        prop="name"
        style="width: 300px;"
      >
        <el-input  v-model.trim="ruleForm.name"></el-input>
      </el-form-item>
           <el-form-item
        label="服务包描述"
        prop="desc"
        style="width: 500px;"
      >
        <el-input rows='3' type="textarea" v-model.trim="ruleForm.desc"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm"
        >立即创建</el-button>
        <el-button @click="resetForm">重置</el-button>
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
        desc:'',
      },

      rules: {
        name: [
          { required: true, message: "请输服务包名称", trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到20个字符", trigger: "blur" }
        ],
       
          desc: [
          { required: true, message: "请输服务包描述", trigger: "blur" },
          { min: 2, max: 50, message: "长度在 2 到50个字符", trigger: "blur" }
        ],
      }
    };
  },

  methods: {
    goBackPage() {
      this.$router.go(-1);
    },
    submitForm() {
      const params = {
        name: this.ruleForm.name.trim(),
        desc: this.ruleForm.desc.trim(),
        type:'addpackge'    
      };
        //this.ruleForm.hiredate=parseInt(this.ruleForm.hiredate/1000)
        this.$refs["ruleForm"].validate(valid => {
          if (valid) {
            this.axios
              .post("https://api.anjihos.z-y.tech/admin/service/store", params)
              .then(response => {
                console.log(response.data)
                if (response.data.errno === 0) {
                  this.$message({
                    type: "success",
                    message: "创建成功"
                  });
                  this.$router.go(-1);
                } else {
                  this.$message({
                    type: "error",
                    message: "已经存在该服务包编号的员工，请重新填写！"
                  });
                }
              });
          } else {
            //return false;
          }
        });
      
    },
    resetForm() {
      this.$refs["ruleForm"].resetFields();
    }
  },

  components: {},
  mounted() {}
};
</script>

<style scoped>
</style>