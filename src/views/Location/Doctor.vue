<template>
  <div class="modal-backdrop">
     <div class="modal" :style="mainStyles" v-show='show'>
        <div class="modal-header">
          <h3>医疗团队列表</h3>
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
         <el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="left" inline>
          <el-form-item label="护士">
            <span>{{ props.row.nurseInfo.name}}</span>
          </el-form-item>
          <el-form-item label="性别">
           <span>{{ props.row.nurseInfo.sex }}</span>
          </el-form-item>
          <el-form-item label="联系方式">
               <span>{{ props.row.nurseInfo.mobile }}</span>
          </el-form-item>
          <el-form-item label="联系住址">
             <span>{{ props.row.nurseInfo.address }}</span>
          </el-form-item>
        </el-form>
         <el-form label-position="left" inline>
          <el-form-item label="药剂师">
            <span>{{ props.row.pharmacistInfo.name }}</span>
          </el-form-item>
          <el-form-item label="性别">
           <span>{{ props.row.pharmacistInfo.sex }}</span>
          </el-form-item>
          <el-form-item label="联系方式">
               <span>{{ props.row.pharmacistInfo.mobile }}</span>
          </el-form-item>
          <el-form-item label="联系住址">
             <span>{{ props.row.pharmacistInfo.address }}</span>
          </el-form-item>
        </el-form>
           <el-form label-position="left" inline>
          <el-form-item label="健康管家">
            <span>{{ props.row.healthManagerInfo.name }}</span>
          </el-form-item>
          <el-form-item label="性别">
           <span>{{ props.row.healthManagerInfo.sex }}</span>
          </el-form-item>
          <el-form-item label="联系方式">
               <span>{{ props.row.healthManagerInfo.mobile }}</span>
          </el-form-item>
          <el-form-item label="联系住址">
             <span>{{ props.row.healthManagerInfo.address }}</span>
          </el-form-item>
        </el-form>
         <el-form label-position="left" inline>
          <el-form-item label="服务人员">
            <span>{{ props.row.serviceStaffInfo.name }}</span>
          </el-form-item>
          <el-form-item label="性别">
           <span>{{ props.row.serviceStaffInfo.sex }}</span>
          </el-form-item>
          <el-form-item label="联系方式">
               <span>{{ props.row.serviceStaffInfo.mobile }}</span>
          </el-form-item>
          <el-form-item label="联系住址">
             <span>{{ props.row.serviceStaffInfo.address }}</span>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
    <el-table-column
      label="医生姓名"
      prop="doctorInfo.name">
    </el-table-column>
     <el-table-column
      label="性别"
      prop="doctorInfo.sex">
    </el-table-column>
       <el-table-column
      label="联系方式"
      prop="doctorInfo.mobile">
    </el-table-column>
         <el-table-column
      label="联系地址"
      prop="doctorInfo.address">
    </el-table-column>
        <el-table-column
          fixed="right"
          label="签约人员"
          min-width="120"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="info"
              @click="serviceClick(scope.$index, scope.row)"
            >人员列表</el-button>
              <el-button
              size="mini"
              type="primary"
              @click="peopleLocationClick(scope.$index, scope.row)"
            >人员位置</el-button>
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
        <div id="container"></div>
        <div class="modal-header">
          <h3>签约人员</h3>
        </div>
        <div class="modal-body">
                <div class="searchWord">
        <el-input
          style="display: inline-block;width:35%;"
          size="small"
           v-model="search"
          placeholder="请输入签约人姓名"/>
      </div>
      <el-table
        :data="peoples"
        height="500"
        style="width: 100%">
        <el-table-column
          prop="healthdocInfo.JBXX_XM"
          label="签约人姓名"
      
        />
         <el-table-column
          prop="healthdocInfo.JBXX_BRDH"
          label="联系方式"
       
        />
         <el-table-column
          prop="healthdocInfo.JBXX_XB"
          label="性别"
          :formatter="formatter"
         
        >
        </el-table-column>
         <el-table-column
          prop="healthdocInfo.JBXX_CSRQ"
          label="出生年月"
          min-width="100"
        />
          <el-table-column
          prop="healthdocInfo.JBXX_SFZH"
          label="身份证号"
          min-width="100"
        />
           <el-table-column
          prop="healthdocInfo.JBXX_JZDZXX"
          label="家庭住址"
        />
            <el-table-column
          fixed="right"
          label="所在位置"
          max-width="80"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="medium"
              plain
              icon='el-icon-location-outline'
              @click="locationClick(scope.$index, scope.row)"
            ></el-button>
          </template>
        </el-table-column>
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
  name: 'Doctor',
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
        pagesize: 20,  
        search:'',
        circles:[],
        peoples:[],
          currentPages: 1,
        totals: 0,
        pagesizes: 10,
        doctor_team_id:'' ,
        address:'',
        location:'',
        contractPeople:'',
        contractPeoplelist:'',
        arr:[]
    }

  },
  computed:{
     //计算属性来响应width属性，实时绑定到相应DOM元素的style上
      mainStyles() {
          let style = {};
          style.width = `${parseInt(this.width)}px`;
          return style;
      }  ,
    //   tables(){
    //       var  search=this.search
    //   if (search) {
    //     return this.circles.filter(dataNews => {
    //       return Object.keys(dataNews).some(key => {
    //         return String(dataNews[key]).toLowerCase().indexOf(search) > -1
    //       })
    //     })
    //   }
    //   console.log(this.circles)
    //   return this.circles
    // },
    // total () {
    //   return this.tables.length
    // }
  },
  mounted(){
       this.people();
  },
  methods:{
      locationClick(index,row){
        console.log(row)
       this.address=row.healthdocInfo.JBXX_JZDZXX
       this.contractPeople=row
       this.getLocation()
       var str=this.location.split(',')
       this.contractPeople.lng_=str[0]
       this.contractPeople.lat_=str[1]
       var arr=[]
   arr.push(this.contractPeople)
   console.log(arr)
       //console.log(this.location)
       //这里因为有请求延迟，所以做一个判断
      if(this.location){
        this.$emit('func',arr) //子组件获得的经纬度传递给父组件
        }else{
          return
        }
      },
    peopleLocationClick(index, row){
    var that=this
      this.doctor_team_id=row.doctorInfo.doctor_team_id
      // this.peoplelist()
      //console.log(this.peoples)
       this.axios
        .get('https://api.anjihos.newlioncity.com/admin/contract?completed=1&doctor_team_id='+this.doctor_team_id).then(res=>{
           this.contractPeoplelist=res.data.data.data  //得到所有签约对象
            if( this.contractPeoplelist.length>0){
            this.$emit('funcs',that.contractPeoplelist)
          }else{
            this.$message({
              type: "error",
              message: "人数不足。"
            });
          }
        })
    },

    getLocation () {
            let vthis = this
            $.ajax({
                url: 'https://restapi.amap.com/v3/place/text',
                type: 'get',
                dataType: 'jsonp',
                data: {
                    key: '8019e23202f5bdce37f98aeacf909cc6',
                    keywords: this.address,
                    extensions:'base'
                },
                success: function (data) {
                  // console.log(data.pois[0].location)
                  vthis.location=data.pois[0].location
                }
            })
        },
        initAMap (data) {
            let map = new AMap.Map('container', {
                resizeEnable: true,
                zoom: 20,
                center: data.split(',')
            })
            AMap.plugin('AMap.Geocoder', function () {
                let marker = new AMap.Marker({
                    map: map,
                    bubble: true
                })
            })
        },
      //判断男女
       formatter(row, column) {
        return row.healthdocInfo.JBXX_XB== '1' ? "男" : "女";
      },
    //点击服务记录，关闭签约人员列表，展示服务记录的内容
    serviceClick(index, row){
      this.show=false;
      this.service=true;
      this.doctor_team_id=row.doctorInfo.doctor_team_id
      this.peoplelist()
      
    },
    peoplelist(){
        this.axios
        .get('https://api.anjihos.newlioncity.com/admin/contract?doctor_team_id='+this.doctor_team_id,
        {
          params: {
            page: this.currentPages
          }
        }
        ).then(res=>{
         // console.log(res)
         this.peoples = res.data.data.data;
        // console.log( this.peoples)
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
        .get('https://api.anjihos.newlioncity.com/admin/doctorteam',
        {
          params: {
            page: this.currentPage
          }
        }
        )
        .then(res => {
         // console.log(res)
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
        this.$emit('on-close');
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
    this.peoplelist()
    },
    handleSizeChanges(val) {
      this.pagesizes = val
       this.peoplelist()
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