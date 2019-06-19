<template>
  <div class="personnel_updat">
    <div class="content-nav">
      <el-breadcrumb
        class="breadcrumb"
        separator="/"
      >
        <el-breadcrumb-item :to="{path: '/dashboard'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>人员管理</el-breadcrumb-item>
        <el-breadcrumb-item>资料编辑</el-breadcrumb-item>
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
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item
        label="姓名"
        prop="name"
      >
        <el-input v-model.trim="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item
        label="联系电话"
        prop="mobile"
        style='width:40%'
      >
        <el-input
          v-model="ruleForm.mobile"
          placeholder="请输入可以联系的手机号码"
          min="11"
          max="11"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="员工角色"
        prop="worker_role_id"
      >
        <!-- <template>
          <el-radio v-model="ruleForm.worker_role_id" label=1>医生</el-radio>
          <el-radio v-model="ruleForm.worker_role_id" label=2>护士</el-radio>
          <el-radio v-model="ruleForm.worker_role_id" label=3>药师</el-radio>
          <el-radio v-model="ruleForm.worker_role_id" label=4>健康管家</el-radio>
          <el-radio v-model="ruleForm.worker_role_id" label=5>上门服务人员</el-radio>
        </template> -->

        <template>
          <el-radio-group v-model="ruleForm.worker_role_id" @change="worker_rolr_idChange">
            <el-radio :label=1>医生</el-radio>
            <el-radio :label=2>护士</el-radio>
            <el-radio :label=3>药师</el-radio>
            <el-radio :label=4>健康管家</el-radio>
            <el-radio :label=5>上门服务人员</el-radio>
          </el-radio-group>
        </template>
      </el-form-item>
      <el-form-item
        label="年龄"
        prop="age"
      >
        <el-input-number
          v-model="ruleForm.age"
          :min='18'
          :max='60'
        ></el-input-number>
      </el-form-item>
      <el-form-item
        label="住址"
        prop="address"
      >
        <el-input v-model.trim="ruleForm.address"></el-input>
      </el-form-item>
      <el-form-item label="入职时间">
        <el-col :span="10">
          <el-form-item prop="hiredate">
            <el-date-picker
              value-format='timestamp'
              @change="logTimeChange"
              type="date"
              placeholder="选择日期"
              v-model="ruleForm.hiredate"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item
        label="性别"
        prop="sex"
      >
        <el-radio-group v-model="ruleForm.sex">
          <el-radio label="男"></el-radio>
          <el-radio label="女"></el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm"
        >确定保存</el-button>
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
        id: 0,
        name: "",
        company_id: "",
        sex: "",
        address: "",
        age: "",
        hiredate: "",
        mobile: "",
        worker_role_id:0,
      }
    };
  },
  methods: {
    worker_rolr_idChange(value){
      this.worker_role_id = value
      console.log(this.worker_role_id)
    },
    goBackPage() {
      this.$router.go(-1);
    },
    logTimeChange(val) {
      this.ruleForm.hiredate = val;
    },
    resetForm(ruleForm) {
      this.$refs["ruleForm"].resetFields();
    },
    submitForm() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      this.ruleForm.company_id = userInfo.company_id;
      const params = {
        name: this.ruleForm.name.trim(),
        company_id: this.ruleForm.company_id,
        sex: this.ruleForm.sex,
        address: this.ruleForm.address.trim(),
        age: this.ruleForm.age,
        mobile: this.ruleForm.mobile,
        hiredate: parseInt(this.ruleForm.hiredate / 1000),
        id: this.ruleForm.id,
        worker_role_id:this.worker_role_id
      };
      console.log(params)
      if (this.ruleForm.mobile == "" || !this.ruleForm.mobile) {
        this.$message({
          type: "error",
          message: "手机号码不能为空"
        });
      } else if (this.ruleForm.mobile.length != 11) {
        this.$message({
          type: "error",
          message: "手机号码长度只能11位"
        });
      } else if (!/^1[34578]\d{9}$/.test(this.ruleForm.mobile)) {
        this.$message({
          type: "error",
          message: "手机号码格式错误"
        });
      } else {
        //this.ruleForm.hiredate=parseInt(this.ruleForm.hiredate/1000)
        this.$refs["ruleForm"].validate(valid => {
          if (valid) {
            this.axios
              .post("/worker/store", params)
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
                    message: "取消"
                  });
                }
              });
          } else {
            //return false;
          }
        });
      }
    }
  },
  mounted() {
    this.ruleForm.id = this.$route.query.id || 0;
    this.ruleForm.name = this.$route.query.name || "";
    this.ruleForm.age = this.$route.query.age || "";
    this.ruleForm.address = this.$route.query.address || "";
    this.ruleForm.sex = this.$route.query.sex || "";
    this.ruleForm.hiredate = this.$route.query.hiredate * 1000 || "";
    this.ruleForm.mobile = this.$route.query.mobile || "";
    this.ruleForm.worker_role_id = this.$route.query.worker_role_id || 0;
  }
};
</script>

<style>
</style>
