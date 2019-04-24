<template>
  <div class="content-page">
    <div class="content-nav">
      <el-breadcrumb
        class="breadcrumb"
        separator="/"
      >
        <el-breadcrumb-item :to="{ path: '/dashboard'}"> 首页</el-breadcrumb-item>
        <el-breadcrumb-item>人员管理</el-breadcrumb-item>
        <el-breadcrumb-item>成员添加</el-breadcrumb-item>
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
          type='number'
          v-model="ruleForm.mobile"
          placeholder="请输入可以联系的手机号码"
        ></el-input>
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
      <el-form-item
        label="入职时间"
        required
      >
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
        company_id: "",
        sex: "",
        address: "",
        age: "",
        hiredate: "",
        mobile: ""
      },

      rules: {
        name: [
          { required: true, message: "请输成员名称", trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到20个字符", trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入联系方式", trigger: "blur" },
          { min: 11, max: 11, message: "长度仅为11位", trigger: "blur" }
        ],
        address: [
          { required: true, message: "请输成员住址", trigger: "blur" },
          { min: 2, max: 30, message: "长度在 2 到 30 个字符", trigger: "blur" }
        ],
        hiredate: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],

        sex: [{ required: true, message: "请选择性别", trigger: "change" }]
      }
    };
  },

  methods: {
    goBackPage() {
      this.$router.go(-1);
    },
    logTimeChange(val) {
      this.ruleForm.hiredate = val;
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
        hiredate: parseInt(this.ruleForm.hiredate / 1000)
      };

      // const self = this;
      if (this.ruleForm.mobile == "" || !this.ruleForm.mobile) {
        this.$message({
          type: "error",
          message: "手机号码不能为空"
        });
      } else if (!/^1[34578]\d{9}$/.test(this.ruleForm.mobile)) {
        this.$message({
          type: "error",
          message: "电话号码格式错误"
        });
      } else {
        //this.ruleForm.hiredate=parseInt(this.ruleForm.hiredate/1000)
        this.$refs["ruleForm"].validate(valid => {
          if (valid) {
            this.axios
              .post("https://anji.newlioncity.com/admin/worker/store", params)
              .then(response => {
                if (response.data.errno === 0) {
                  this.$message({
                    type: "success",
                    message: "创建成功"
                  });
                  this.$router.go(-1);
                } else {
                  this.$message({
                    type: "error",
                    message: "员工姓名不允许重复,请重新填写"
                  });
                }
              });
          } else {
            //return false;
          }
        });
      }
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
