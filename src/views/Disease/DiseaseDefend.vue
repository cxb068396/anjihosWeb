<template>
  <div class="content-page">
    <div class="content-nav">
      <el-breadcrumb
        class="breadcrumb"
        separator="/"
      >
        <el-breadcrumb-item :to="{ path: '/dashboard'}"> 首页</el-breadcrumb-item>
        <el-breadcrumb-item>病种管理</el-breadcrumb-item>
        <el-breadcrumb-item>病种维护</el-breadcrumb-item>
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
        label="病种名称"
        prop="name"
        style='width:30%'
      >
        <el-input v-model.trim="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item
        label="病种等级"
        prop="leave"
      >
       <template>
          <el-radio-group v-model="ruleForm.leave" @change="leaveChange">
            <el-radio :label=1>一级</el-radio>
            <el-radio :label=2>二级</el-radio>
            <el-radio :label=3>三级</el-radio>
          </el-radio-group>
        </template>
      </el-form-item>
       <el-form-item
        label="维护计划"
        prop="defendplan"
        style='width:40%'
      >
       <el-input v-model="ruleForm.defendplan" type='textarea' rows='2'></el-input>
      </el-form-item>
      <el-form-item
        label="频次"
        prop="times"
      >
       <template>
          <el-radio-group v-model="ruleForm.times" @change="timesChange">
            <el-radio :label=1>一次/每周</el-radio>
            <el-radio :label=2>一次/每月</el-radio>
            <el-radio :label=3>二次/每月</el-radio>
            <el-radio :label=4>二次/每月</el-radio>
            <el-radio :label=5>一次/季度</el-radio>
            <el-radio :label=6>五次/半年</el-radio>
            <el-radio :label=7>6次/全年</el-radio>
          </el-radio-group>
        </template>
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
        leave: "",
        defendplan: "",
        times:''
      },
      rules: {
        name: [
          { required: true, message: "请输入病种名称", trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到20个字符", trigger: "blur" }
        ],
         defendplan: [
          { required: true, message: "请输入病种名称", trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到20个字符", trigger: "blur" }
        ],     
         leave: [
            { required: true, message: '请选择该病种等级', trigger: 'change' }
          ],
            times: [
            { required: true, message: '请选择该病种的维护频次', trigger: 'change' }
          ]
      }
    };
  },

  methods: {
    leaveChange(value){
      this.leave = value
      
    },
    timesChange(val){
        this.times=val
    },
    goBackPage() {
      this.$router.go(-1);
    },
 
    submitForm() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const params = {
        name: this.ruleForm.name,
        leave: this.ruleForm.leave,
        defendplan: this.ruleForm.defendplan,
        times:this.ruleForm.times
      };
        this.$refs["ruleForm"].validate(valid => {
          if (valid) {
            this.axios
              .post("/worker/store", params)
              .then(response => {
                console.log(response.data)
                if (response.data.errno === 0) {
                  this.$message({
                    type: "success",
                    message: "服务计划创建成功"
                  });
                  this.$router.go(-1);
                } else {
                  this.$message({
                    type: "error",
                    message: "服务计划创建失败"
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
