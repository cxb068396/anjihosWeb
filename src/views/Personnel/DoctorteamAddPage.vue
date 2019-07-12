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
      label-width="150px"
      class="demo-ruleForm"
    >


      <el-form-item
        label="选择医生"
      >
        <template>
          <el-select v-model="choosed1" placeholder="请选择医生">
            <el-option
              v-for="item in role1"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </template>
      </el-form-item>


      <el-form-item
        label="选择护士"
      >
        <template>
          <el-select v-model="choosed2" placeholder="请选择护士">
            <el-option
              v-for="item in role2"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </template>
      </el-form-item>

      <el-form-item
        label="选择药师"
      >
        <template>
          <el-select v-model="choosed3" placeholder="请选择药师">
            <el-option
              v-for="item in role3"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </template>
      </el-form-item>

      <el-form-item
        label="选择健康管家"
      >
        <!-- <template>
          <el-select v-model="choosed4" placeholder="请选择健康管家">
            <el-option
              v-for="item in role4"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </template> -->
         <el-cascader
          :options="role4"
          v-model="choosed4"
          @change="handleChange4"
          >
        </el-cascader>
      </el-form-item>

      <el-form-item
        label="选择上门服务人员"
      >
        <!-- <template>
          <el-select v-model="choosed5" placeholder="请选择上门服务人员">
            <el-option
              v-for="item in role5"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </template> -->
        <el-cascader
          :options="role5"
          v-model="choosed5"
          @change="handleChange5"
          >
        </el-cascader>
      </el-form-item>
      

      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm"
        >立即创建</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      workers: [],
      role1:[],
      role2:[],
      role3:[],
      role4:[],
      role5:[],
      choosed1: '',
      choosed2: '',
      choosed3: '',
      choosed4: [],
      choosed5: [],
      

   
    };
  },

  methods: {
    //获取可重复的人员列表
    getRepeatableList(){
      let that = this
      this.axios
        .get(
          "/company?is_hospital=0",
          {
            params: {
              size:1000,
              page: this.currentPage
            }
          }
        )
        .then(response => {
          that.role4 = JSON.parse(JSON.stringify(response.data.data.data))
          that.role5 = JSON.parse(JSON.stringify(response.data.data.data))
          console.log(response.data.data.data)
          console.log(this.role5)
          that.role4.map(item => item.label = item.name)
          that.role4.map(item => item.value = item.name)
          that.role4.map(
            function(item){
              that.axios.get('worker?worker_role_id=4&company_id='+item.id)
              .then(res => {
                item.children = res.data.data.data
                // console.log(item.children)
                // item.children = item.children.filter(item4 => item4.worker_role_id == 4)
                // console.log(item.children)
                item.children.map(item => item.label = item.name)
                item.children.map(item => item.value = item.id)
              })
            }
          )
          console.log(this.role4)
          console.log(this.role5)
          that.role5.map(item => item.label = item.name)
          that.role5.map(item => item.value = item.name)
          that.role5.map(
            function(item){
              that.axios.get('worker?worker_role_id=5&company_id='+item.id)
              .then(res => {
                item.children = res.data.data.data
                // console.log(item.children)
                // item.children = item.children.filter(item5 => item5.worker_role_id == 5)
                // console.log(item.children)
                item.children.map(item => item.label = item.name)
                item.children.map(item => item.value = item.id)
              })
            }
          )
          
          // console.log(this.role5)
          
          
        });
    },
    getWorkerList(){

    },
    getList() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      let company_id = userInfo.company_id;
      this.axios
        .get(
          "/worker?company_id=" + company_id,
          {
            params: {
              size:1000,
              page: this.currentPage
            }
          }
        )
        .then(response => {
          // this.tableData = response.data.data.data;
          // console.log(response.data.data.data)
          this.workers = response.data.data.data
          this.getRoles()
          // this.total = response.data.data.count;
          // this.currentPage = response.data.data.currentPage;
          // this.pageSize=response.data.data.pageSize
        });
    },
    getRoles(){
      this.role1 = this.workers.filter(item=>item.worker_role_id == 1)
      this.role2 = this.workers.filter(item=>item.worker_role_id == 2)
      this.role3 = this.workers.filter(item=>item.worker_role_id == 3)
      // this.role4 = this.workers.filter(item=>item.worker_role_id == 4)
      // this.role5 = this.workers.filter(item=>item.worker_role_id == 5)
    },
    handleChange4(value){
      // console.log(value)
    },
    handleChange5(value){
      // console.log(value)
    },
    goBackPage() {
      this.$router.go(-1);
    },
  
    submitForm() {
      
      // this.choosed4 = this.choosed4[1]
      // this.choosed5 = this.choosed5[1]
      
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      
      const params = {
        doctor_id:this.choosed1,
        nurse_id:this.choosed2,
        pharmacist_id:this.choosed3,
        health_manager_id:this.choosed4[1],
        service_staff_id:this.choosed5[1],
        company_id :userInfo.company_id,
      };

      this.axios
        .post("/doctorteam/store", params)
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
              message: "创建失败"
            });
          }
        });
    },
  
  },

  components: {},
  mounted() {
    
  },
  created(){
    this.getList()
    this.getRepeatableList()
  }
};
</script>

<style scoped>
</style>
