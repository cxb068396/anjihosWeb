<template>
  <div class="modal-backdrop">
     <div class="modal" :style="mainStyles" v-show='show'>
        <div class="modal-header">
          <h3>签约人员列表</h3>
        </div>
        <div class="modal-body">
                <div class="searchWord">
        <el-input
          style="display: inline-block;width:45%;"
          size="small"
           v-model="search"
           suffix-icon="el-icon-search"
          placeholder="请输入签约人姓名或电话或身份证号进行搜索"/>
      </div>
      <el-table
        :data="circles"
        style="width: 100%"
         height="500"
        >
        <el-table-column
         fixed
          prop="JBXX_XM"
          label="真实姓名"
          
        />
         <el-table-column
          prop="HEALTH_ID"
          label="身份证号"
         
        />
         <el-table-column
          prop="JBXX_BRDH"
          label="联系方式"
         
        />
         <el-table-column
          prop="JBXX_HJXXDZ"
          label="家庭住址"
       
        />
        <el-table-column
          fixed="right"
          label="操作"
          min-width="80"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="info"
              @click="serviceClick(scope.$index, scope.row)"
            >健康档案</el-button>
          </template>
        </el-table-column>
      </el-table>
       <div style="text-align: center;margin-top: 30px;">
        <el-pagination
          :page-size="pagesize"
          :total="total"
          layout="total, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
			    @size-change="handleSizeChange"
           :current-page="currentPage"
        />
      </div>
        </div>
        <div class="modal-footer">
            <el-button type="primary"  @click="closeSelf">关闭</el-button>
        </div>
    </div>

  <!-- 这只是一个测试而已 -->
      <div class="modal" :style="mainStyles" v-show='service'>
        <div class="modal-header">
          <h3>健康档案</h3>
        </div>
        <div class="modal-body">
      <el-table
        :data="helthdoc"
        height="500"
        style="width: 100%">
        <el-table-column
          fixed
          prop="create_time"
          label="就诊时间" 
        />
          <el-table-column
          prop="condition"
          label="症状"
        />
          <el-table-column
          prop="blood_pressure_high"
          label="最高血压"
        />
          <el-table-column
          prop="blood_pressure_low"
          label="最低血压"
      
        />
         <el-table-column
          prop="blood_oxygen"
          label="血氧（%）"
        />
          <el-table-column
          prop="blood_sugar"
          label="血糖（%）"
        />
          <el-table-column
          prop="heart_rate"
          label="心率"
        />
          <el-table-column
          prop="body_temperature"
          label="体温（摄氏度）"
        />
          <el-table-column
          prop="height"
          label="身高（cm）"
        />
         <el-table-column
          prop="weight"
          label="体重（kg）"
        />
          <el-table-column
          prop="breathe"
          label="呼吸频次"
        />
      
      </el-table>
       <div style="text-align: center;margin-top: 30px;">
        <el-pagination
          :page-size="pagesizes"
          :total="totals"
          layout="total, prev, pager, next, jumper"
          @current-change="handleCurrentChanges"
			    @size-change="handleSizeChanges"
          :current-page="currentPages"
        />
      </div>
        </div>
        <div class="modal-footer">
            <el-button  type="primary"  @click="serviceClose">返回</el-button>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Modal',
  //接收父组件传递的width属性
  props: {
    width:{
        type:[Number,String],//类型检测
        default:300 //父组件没传width时的默认值
    },
  },
  data() {
    return { 
        show:true,
        service:false,
        currentPage: 1,
        total: 0,
        pagesize:20, 
        search:'',
        circles:[],
        helthdoc:[] ,
        totals:0 ,
        currentPages:1,
        pagesizes:10,
        health_doc_id:''
    }

  },
  computed:{
     //计算属性来响应width属性，实时绑定到相应DOM元素的style上
      mainStyles() {
          let style = {};
          style.width = `${parseInt(this.width)}px`;
          return style;
      }  ,

  },
  mounted(){
       this.people();
  },
  methods:{
    //点击服务记录，关闭签约人员列表，展示健康档案的内容
    serviceClick(index,row){
      this. health_doc_id=row.id
      this.show=false;
      this.service=true
   this.helthdangan()
    },
    helthdangan(){
         this.axios.get('https://api.anjihos.newlioncity.com/admin/vitalsign?health_doc_id='+this.health_doc_id).then(res=>{
         this.helthdoc = res.data.data.data;
          this.totals = res.data.data.count;
          this.currentPages = res.data.data.currentPage;
      })
    },
    //点击返回按钮，将服务记录隐藏，然后将签约列表显示出来
      serviceClose(){
      this.service=false
      this.show=true;
    },
      //获取所有人的列表
        people() {
        this.axios
        .get('https://api.anjihos.newlioncity.com/admin/healthdoc',
        {
          params: {
            page: this.currentPage
          }
        }
        )
        .then(res => {
          console.log(res)
          this.circles = res.data.data.data;
          this.total = res.data.data.count;
          this.currentPage = res.data.data.currentPage;
          // this.circles = res.data.data
          // console.log(res.data.data)
          // this.count = this.circles.length
          // this.circles.map(function(item){
          //   item.center = []
          //   item.center.push(item.lng,item.lat)
          // })
        })
      
    },
    //响应关闭按钮点击事件，通过$emit api通知父组件执行父组件的on-cancel方法
    closeSelf() {
        this.$emit('on-cancel');
    },
        // 分页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.people();
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.people();
    },
        handleCurrentChanges(val) {
      this.currentPages = val;
      this.helthdangan()
    },
    handleSizeChanges(val) {
      this.pagesizes = val;
      this.helthdangan()
    
    },
  }
}
</script>
<style scoped>
.modal-backdrop { 
    position: fixed; 
    top: 0; 
    right: 0; 
    bottom: 0; 
    left: 0; 
    background-color: rgba(0,0,0,.3); 
    display: flex; 
    justify-content: center; 
    align-items: center; 
    z-index: 1;
}
.modal { 
    background-color: #fff; 
    box-shadow: 2px 2px 20px 1px; 
    overflow-x:auto; 
    display: flex; 
    flex-direction: column;
    border-radius: 16px;
} 
.modal-header { 
    border-bottom: 1px solid #eee; 
    color: #313131; 

    padding: 15px; 
 text-align: center
} 
.modal-footer { 
    border-top: 1px solid #eee; 
    justify-content: flex-end;
    padding: 15px; 
    display: flex; 
} 
.modal-body { 
    position: relative; 
    padding: 20px 10px; 
}
.btn-close, .btn-confirm {    
    border-radius: 8px;
    margin-left:16px;
    width:56px;
    height: 36px;
    border:none;
    cursor: pointer;
}
.btn-close {
    color: #313131;
    background-color:transparent;
}
.btn-confirm {
    color: #fff; 
    background-color: #2d8cf0;
}
</style>