<template>
  <div class="personnel_app">
    <div class="content-nav">
      <el-breadcrumb
        class="breadcrumb"
        separator="/"
      >
        <el-breadcrumb-item :to="{path: '/dashboard'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>服务管理</el-breadcrumb-item>
        <el-breadcrumb-item>新增服务</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item
        label="服务名称"
        prop="name"
      >
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item
        label="服务详情"
        prop="info"
      >
        <el-col :span=12>
          <el-input
            type='textarea'
            :rows="3"
            placeholder="请输入服务详情"
            v-model="ruleForm.info"
          ></el-input>
        </el-col>
      </el-form-item>
      <el-form-item
        label="服务价格"
        prop="price"
      >
        <el-col :span=3>
          <el-input v-model="ruleForm.price"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item
        label="申请地址"
        prop="address"
      >
        <el-input v-model="ruleForm.address"></el-input>
      </el-form-item>
      <el-form-item
        label="申请时间"
        required
      >
        <el-col :span="10">
          <el-form-item prop="date">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="ruleForm.date"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">注册服务</el-button>
        <el-button>重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {},
      rules: {
        name: [
          { required: true, message: "请输入服务名称", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" }
        ],
        info: [
          { required: true, message: "请输入服务内容详情", trigger: "blur" },
          { min: 2, max: 50, message: "长度在 2 到50个字符", trigger: "blur" }
        ],
        address: [
          { required: true, message: "请输入贵公司地址", trigger: "blur" },
          { min: 2, max: 30, message: "长度在 2 到 30 个字符", trigger: "blur" }
        ],
        price: [
          { required: true, message: "价格不能为空" },
          { type: "number", message: "价格必须为数字值" }
        ],

        date: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {},
  components: {},
  mounted() {}
};
</script>

<style>
</style>
