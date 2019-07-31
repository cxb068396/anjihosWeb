<template>
  <div class="modal-backdrop">
     <div class="modal" :style="mainStyles" v-if='show'>
        <div class="modal-header">
          <h3>签约人员列表</h3>
        </div>
        <div class="modal-body">
                <div class="searchWord">
        <el-input
          style="display: inline-block;width:35%;"
          size="small"
           v-model="search"
          placeholder="请输入医生姓名"/>
      </div>
      <el-table
        :data="tables.slice((currentPage - 1) * pagesize, currentPage * pagesize)"
        style="width: 100%">
        <el-table-column
          prop="worker_name"
          label="医生姓名"
          max-width="80"
        />
        <el-table-column prop="createdate" header-align="center" align="center" label="选择日期" >
          <template scope="scope">
            <el-date-picker 
            v-model="scope.row.createdate" 
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format='yyyy-MM-dd HH:mm:ss'
            />
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          max-width="80"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="info"
              @click="serviceClick(scope.$index, scope.row)"
            >服务记录</el-button>
              <el-button
              size="mini"
              type="success"
              @click="lifeClick(scope.$index, scope.row)"
            >生命体征</el-button>
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
        />
      </div>
        </div>
        <div class="modal-footer">
            <el-button type="primary"  @click="closeSelf">关闭</el-button>
        </div>
    </div>

  <!-- 这只是一个测试而已 -->
      <div class="modal" :style="mainStyles" v-if='service'>
        <div class="modal-header">
          <h3>服务记录</h3>
        </div>
        <div class="modal-body">
                <div class="searchWord">
        <el-input
          style="display: inline-block;width:35%;"
          size="small"
           v-model="search"
          placeholder="请输入医生姓名"/>
      </div>
      <el-table
        :data="tables.slice((currentPage - 1) * pagesize, currentPage * pagesize)"
        style="width: 100%">
        <el-table-column
          prop="worker_name"
          label="医生姓名"
          max-width="80"
        />
      </el-table>
       <div style="text-align: center;margin-top: 30px;">
        <el-pagination
          :page-size="pagesize"
          :total="total"
          layout="total, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
			    @size-change="handleSizeChange"
        />
      </div>
        </div>
        <div class="modal-footer">
            <el-button  type="primary"  @click="serviceClose">返回</el-button>
        </div>
    </div>


<!-- 这只是一个测试而已 -->
      <div class="modal" :style="mainStyles" v-if='life'>
        <div class="modal-header">
          <h3>生命体征</h3>
        </div>
        <div class="modal-body">
                <div class="searchWord">
        <el-input
          style="display: inline-block;width:35%;"
          size="small"
           v-model="search"
          placeholder="请输入医生姓名"/>
      </div>
      <el-table
        :data="tables.slice((currentPage - 1) * pagesize, currentPage * pagesize)"
        style="width: 100%">
        <el-table-column
          prop="worker_name"
          label="医生姓名"
          max-width="80"
        />
      </el-table>
       <div style="text-align: center;margin-top: 30px;">
        <el-pagination
          :page-size="pagesize"
          :total="total"
          layout="total, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
			    @size-change="handleSizeChange"
        />
      </div>
        </div>
        <div class="modal-footer">
            <el-button  type="primary"   @click="lifeClose">返回</el-button>
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
        life:false,
        currentPage: 1,
        count: 0,
        pagesize: 10,  
        search:'',
        circles:[]     
    }

  },
  computed:{
     //计算属性来响应width属性，实时绑定到相应DOM元素的style上
      mainStyles() {
          let style = {};
          style.width = `${parseInt(this.width)}px`;
          return style;
      }  ,
      tables(){
          var  search=this.search
      if (search) {
        return this.circles.filter(dataNews => {
          return Object.keys(dataNews).some(key => {
            return String(dataNews[key]).toLowerCase().indexOf(search) > -1
          })
        })
      }
      console.log(this.circles)
      return this.circles
    },
    total () {
      return this.tables.length
    }
  },
  mounted(){
       this.people();
  },
  methods:{
    //点击服务记录，关闭签约人员列表，展示服务记录的内容
    serviceClick(){
      this.show=false;
      this.service=true
    },
    //点击返回按钮，将服务记录隐藏，然后将签约列表显示出来
      serviceClose(){
      this.service=false
      this.show=true;
    },
    //点击生命体征按钮，关闭签约人员的列表，展示该人员的生命体征报告
    lifeClick(){
       this.show=false;
      this.life=true
    },
  //点击返回按钮，将生命体征报告隐藏，然后将签约人员的列表显示出来
    lifeClose(){
      this.life=false
      this.show=true;
    },
      //获取所有人的列表
        people() {
        this.axios
        .get('https://api.anjihos.newlioncity.com/admin/position')
        .then(res => {
          this.circles = res.data.data
          this.count = this.circles.length
          this.circles.map(function(item){
            item.center = []
            item.center.push(item.lng,item.lat)
          })
        })
      
    },
    //响应关闭按钮点击事件，通过$emit api通知父组件执行父组件的on-cancel方法
    closeSelf() {
        this.$emit('on-cancel');
    },
        // 分页
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    handleSizeChange(val) {
      this.pagesize = val;
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