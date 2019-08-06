<template>
  <div class="amap">
    <div class="amap-page-container" :style="{ height: screenHeight + 'px' }">
      <el-amap vid="amapDemo"  
      :center="center" 
      :amap-manager="AMapManager" 
      :zoom="zoom" 
      :events="events" 
      class="amap-demo">
      </el-amap>
    </div>
    <div class='selects'>
    <div class='select'>
        <el-button type="primary" size="mini" @click="people" icon="el-icon-refresh">刷新</el-button>
      <el-button type="primary"  size="mini" @click="allPeople">签约人员</el-button>
       <el-button type="primary"  size="mini" @click="allDoctor" >医疗团队</el-button>
    </div>
      <Modal 
        v-show="showModal" 
        width="1000"
        @on-cancel="cancel">
      </Modal>
       <Doctor 
        v-show="showDoctor" 
        width="1000"
        @on-close="close">
      </Doctor>
      <template>
        <el-cascader
        placeholder="选乡镇服务站点"
        :change-on-select="true"
        :props="defaultParams"
        :options="options"
        v-model="selectedOptions"
        :clearable="true"
        @change="handleChange">
        </el-cascader>
      </template>
    </div>  
  </div>
</template>

<script>
import Modal from '../Location/Model.vue'
import Doctor from '../Location/Doctor.vue'
import VueAMap from 'vue-amap';

import oldman from '../../assets/oldman.jpg';
import doctor from '../../assets/doctor.jpeg';
import yellow_drip from '../../assets/yellow-drip.png';
import blue_drip from '../../assets/blue-drip.png';
import red_drip from '../../assets/red-drip.png';
VueAMap.initAMapApiLoader({
  key: '8b8f50d6273a3793e7f2e353861bb427',
  plugin: [],
  v: '1.4.4'
});
let AMapManager = new VueAMap.AMapManager();
export default {
  data() {
    return {
      //  position: {},
      //   pos: [116.397428, 39.90923],
      // info:'',
      // visible: false,
      showModal:false,
      showDoctor:false,
      type:'',
      options:[],
      selectedOptions: [],
      defaultParams: {
        label: 'name',
        value: 'id',
        children: 'company'
      },
      zoom: 18,
      center: [120.130001,30.030001],
      AMapManager,
      lineArr :[],
      copyLineArr:[],
      screenHeight: document.body.clientHeight,
      marker:{},
      createdate:'',
      events: {
        init:(map)=> {
          console.log('init事件')
        }
      },
      map: {},
      search: '',
      circles: [],
      markerList:[],
      type:'',
      lng:[],
      infoWindow:{},
    }
  },
  components:{
    'Modal':Modal,
    'Doctor':Doctor
  },
  mounted() {
    const that = this
    window.onresize = () => {
      return (() => {
        window.screenHeight = document.body.clientHeight
        that.screenHeight = window.screenHeight
      })()
    }
    this.people();
    this.getStreet();
  },
  watch: {
    screenHeight (val) {
      // 为了避免频繁触发resize函数导致页面卡顿，使用定时器
      if (!this.timer) {
        // 一旦监听到的screenWidth值改变，就将其重新赋给data里的screenWidth
        this.screenHeight = val
        this.timer = true
        let that = this
        setTimeout(function () {
          that.timer = false
        }, 400)
      }
    }
  },
  methods: {
  //获得所有的街道
    getStreet(){
      this.axios.get('https://api.anjihos.newlioncity.com/admin/position/group').then(res=>{
        this.options = res.data.data
      })
    },
    allPeople() {
      let map = AMapManager.getMap()
      map.clearInfoWindow( )
      this.showModal = !this.showModal; 
    },
      allDoctor() {
      let map = AMapManager.getMap()
      map.clearInfoWindow( )
      this.showDoctor = !this.showDoctor; 
    },
    //响应on-cancel事件，来把弹出框关闭
    cancel() {
      this.showModal = false;
    },
      //响应on-close事件，来把弹出框关闭
    close() {
      this.showDoctor = false;
    },
    handleChange(val){
      var that = this
      var street_id = val[0]
      var company_id = val[1]
      this.circles = []
      console.log(street_id,company_id  )
      if(street_id && company_id == undefined){
        this.axios.get('https://api.anjihos.newlioncity.com/admin/position/user?street_id='+street_id).then(res=>{
          if(res.data.data.length>0){
            this.circles = res.data.data
          }else{
            this.$message({
              type: "error",
              message: "该乡镇附近还没有签约人员!"
            });
          }
          that.display();
        })
      }else if(street_id && company_id){
        this.axios.get('https://api.anjihos.newlioncity.com/admin/position/user?company_id='+company_id).then(res=>{
          if(res.data.data.length>0){
            this.circles = res.data.data
          }else{
            this.$message({
              type: "error",
              message: "该服务站点还没有签约人员!"
            });
          }
          that.display();
        })
      }else if(street_id == undefined && company_id == undefined){
        this.$message({
          type: "error",
          message: "您还未选择机构站点!"
        });
      }
    },
    people() {
      this.axios.get('https://api.anjihos.newlioncity.com/admin/position/user')
      .then(res => {
        this.circles = res.data.data
  
    //             var peopleList=res.data.data;
    //     //数据的简单
    //     var list=[];
    //     var list1 = [];  
    //      for (var i = 0; i<peopleList.length; i++) {
    //     list.push(parseInt(peopleList[i].lng), peopleList[i].lat);
    // }
    //  for(var j=0;j<list.length;j+=2){
    //     list1.push(list.slice(j,j+2));
    // } 
    //  this.lng=list1
        this.display();
        //  this.buildMarkers();
      })
    },
  //   buildMarkers(){
  //     var that=this
  //    this.map = new AMap.Map('map', {
  //     zoom: 13,
  //     center: [120, 30],
  //       layers: [
  //             // 卫星
  //             new AMap.TileLayer.Satellite(),
  //             // 路网
  //             new AMap.TileLayer.RoadNet()
  //         ],
  //     resizeEnable: true
  //   })
    
  //   var markers=[]
  // for(var i=0;i<this.lng.length;i++){
  //           that.pos=this.lng[i]
  //          var marker = new AMap.Marker({
  //              position: this.lng[i],
  //              icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
  //       });
  //       /** 这里是获得每一个marker的下标**/
  //      marker.index=i
  //      marker.on('click',function(e){
  //      that.visible=true
  //      that.info=that.circles[e.target.index]
  //     //  console.log(that.info)
  //     //   console.log(e.target.index)
  //     })
  //     markers.push(marker)
  //   //                   AMap.event.addListener(marker, 'click', function () {
  //   //      console.log(i)
  //   // });
  // } 
  // //console.log(this.markers)
  //   this.map.add(markers)
  //     this.map.setFitView();
  //   }
      //展示所有人的位置信息
    display(){
      console.log(this.circles)
      let map = AMapManager.getMap()
      //如果有，则清空数组，没有则添加
      if(this.markerList.length == 0 ){
        
      }else{
        map.remove(this.markerList)
        this.markerList = []
      }
      this.circles.map(item => {
          let marker = new AMap.Marker({
            icon: new AMap.Icon({
              size: new AMap.Size(20, 30),
              //根据不同状态展示不同icon
              image:item.order_status == 11? red_drip :(item.order_status == 12? yellow_drip :blue_drip),
              imageSize: new AMap.Size(20, 30),
            }),
            position: new AMap.LngLat(item.lng,item.lat),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          });
          marker.setAnimation(item.order_status == 11? 'AMAP_ANIMATION_BOUNCE':'AMAP_ANIMATION_NONE')
          // marker.setTitle('我是marker的title');
          marker.consignee = item.consignee //昵称
          marker.address = item.address //详细住址
          marker.JBXX_BRDH = item.JBXX_BRDH //联系方式
          marker.createdat = item.createdat //记录时间
          marker.JBXX_XM = item.JBXX_XM //真实姓名
          marker.JBXX_CSRQ = item.JBXX_CSRQ //出生日期
          marker.JBXX_LXRXM = item.JBXX_LXRXM //联系人姓名
          marker.JBXX_HJXXDZ = item.JBXX_HJXXDZ //地址
          marker.JBXX_XB = item.JBXX_XB //性别
          marker.JBXX_LXRDH = item.JBXX_LXRDH //联系人电话

          marker.doctor_team_id = item.doctor_team_id //医疗团队编号
          marker.health_doc_id = item.health_doc_id //医疗团队医生编号
          marker.company_id = item.company_id //机构编号
          marker.order_status = item.order_status //订单状态
          marker.worker_sex = item.worker_sex //医生性别
          marker.worker_address = item.worker_address //机构位置
          marker.worker_mobile = item.worker_mobile //医生电话
          marker.worker_address = item.worker_address //机构位置

          
          marker.setLabel({
              offset: new AMap.Pixel(20, 20),  //设置文本标注偏移量
              content: `<div class='info'>${marker.consignee}</div>`, //设置文本标注内容
              direction: 'right' //设置文本标注方位
          });
          this.displayLabel(marker)
          this.markerList.push(marker)
        })
      map.add(this.markerList)
      map.setFitView();
    },
    displayLabel(marker,position){
      let map = AMapManager.getMap()
      let that = this
      //鼠标点击事件
      marker.on('mousedown',function () {
        var info 
        if(marker.order_status == 11){
          info =
          '<div className="custom-infowindow input-card" style="width:300px;border-radius:20px;font-size:10px;">' +
            '<div style="text-align: center;font-weight: bold;margin:10px 0">服务对象信息</div>' +
            '<div>' +
              `<img src=${oldman} style="width:100px;height:100px;border-radius:4em;display:inline-block;float:left;margin-right:20px"/ >` +
              '<div class="input-item" style="margin-bottom:10px">' +
                  '<div class="input-item-prepend" >' +
                      `<div class="input-item-text" >真实姓名：${marker.JBXX_XM}</div>` +
                      `<div class="input-item-text" >下单时间：${marker.createdat}</div>` +
                      `<div class="input-item-text" >订单状态：${marker.order_status == 11? '未接单' :(marker.order_status == 12? '已接单，未服务' :'正在服务')}</div>` +
                      `<div class="input-item-text" >联系人姓名：${marker.JBXX_LXRXM}</div>` +
                      `<div class="input-item-text" >联系人电话：${marker.JBXX_LXRDH}</div>` +
                  '</div>' +
              '</div>' +
              '<input id="btn1" type="button" class="btn" value="去派单" onclick="showMoreMessage1()" style="margin-right:40px"/>' +
              '<input id="btn3" type="button" class="btn" value="生命体征" onclick="showMoreMessage1()"/>' +
            '</div>' +
          '</div>';
          that.infoWindow = new AMap.InfoWindow({
              position:marker.getPosition(),
              content: info , //使用默认信息窗体框样式，显示信息内容
              closeWhenClickMap:true,
          });
        }else{
          that.axios
          .get(
            "/doctorteam?company_id=" + marker.company_id,
          )
          .then(res => {
            let teamInfo = res.data.data.data.filter(item => item.id == marker.doctor_team_id)
            console.log(teamInfo)
            let doctorName,nurseName,healthManagerName,pharmacistName,serviceStafName
            if(teamInfo.length > 0){
              doctorName = teamInfo[0].doctorInfo.name
              nurseName = teamInfo[0].nurseInfo.name
              healthManagerName = teamInfo[0].healthManagerInfo.name
              pharmacistName = teamInfo[0].pharmacistInfo.name
              serviceStafName = teamInfo[0].serviceStaffInfo.name
            }
            info = 
            '<div className="custom-infowindow input-card" style="width:300px;border-radius:20px;font-size:10px;">' +
              '<div style="text-align:center;font-weight: bold;margin:10px 0">服务对象信息</div>' +
              '<div>' +
                `<img src=${oldman} style="width:100px;height:100px;border-radius:4em;display:inline-block;float:left;margin-right:20px;margin-right:20px"/ >` +
                '<div class="input-item" style="margin-bottom:10px">' +
                    '<div class="input-item-prepend">' +
                      `<div class="input-item-text" >真实姓名：${marker.JBXX_XM}</div>` +
                      `<div class="input-item-text" >下单时间：${marker.createdat}</div>` +
                      `<div class="input-item-text" >订单状态：${marker.order_status == 11? '未接单' :(marker.order_status == 12? '已接单，未服务' :'正在服务')}</div>` +
                      `<div class="input-item-text" >联系人姓名：${marker.JBXX_LXRXM}</div>` +
                      `<div class="input-item-text" >联系人电话：${marker.JBXX_LXRDH}</div>` +
                    '</div>' +
                '</div>' +
                '<input id="btn1" type="button" class="btn" value="服务记录" onclick="showMoreMessage1()" style="margin-right:40px"/>' +
                '<input id="btn3" type="button" class="btn" value="生命体征" onclick="showMoreMessage1()"/>' +
              '</div>' +
              '<div style="width:100%;height:3px;background-color:grey;margin:16px 0">' +
              '</div>' +


              '<div style="text-align: center;font-weight: bold;margin:10px 0">医疗团队信息</div>' +
              '<div>' +
                `<img src=${doctor} style="width:100px;height:100px;border-radius:4em;display:inline-block;float:left"/>` +
                '<div class="input-item" style="margin-bottom:10px">' +
                    '<div class="input-item-prepend">' +
                    //当没有teamInfo信息的时候，显示固定信息；有则显示成员信息
                    (teamInfo.length == 0 ?('此单非医疗团队医生接单'):(
                      `<div class="input-item-text" >医生：${doctorName}</div>` +
                      `<div class="input-item-text" >护士：${nurseName}</div>` + 
                      `<div class="input-item-text" >健康管家：${healthManagerName}</div>` +
                      `<div class="input-item-text" >药师：${pharmacistName}</div>` +
                      `<div class="input-item-text" >服务人员：${serviceStafName}</div>` )) +
                    '</div>' +
                '</div>' +
                '<input id="btn2" type="button" class="btn" value="服务记录" onclick="showMoreMessage2()"/>' +
              '</div>' +
            '</div>';
            that.infoWindow = new AMap.InfoWindow({
                position:marker.getPosition(),
                content: info , //使用默认信息窗体框样式，显示信息内容
                closeWhenClickMap:true,
            });
          });
        }
        //使用其它坐标会有bug
        setTimeout(function(){
          that.infoWindow.open(map);
          // var btn1 = document.getElementById('btn1');
          // var btn2 = document.getElementById('btn2');
          // //onclick事件
          // let showMoreMessage1 = function(){
          //   // lnglatInputValue.value = marker.Uh.position.lng + "," +marker.Uh.position.lat 
          //   console.log(marker)
          // }
          // btn1.onclick = showMoreMessage1
          // let showMoreMessage2 = function(){
          //   // lnglatInputValue.value = marker.Uh.position.lng + "," +marker.Uh.position.lat 
          //   console.log(marker)
          // }
          // btn1.onclick = showMoreMessage2
        },200)
      })
    },
  }
}
</script>
<style scoped>
  .amap{
    position:relative;
  }
  .selects{
    position:absolute;
    width:800px;
    right:50px;
    top:20px;
    background-color: #fff;
    z-index: 1;
    display: flex;
    flex-direction: row;
    justify-content:space-between ;
    align-items: center;
    padding: 10px 20px;
    
  }
  /* .select .buttons{
    width:250px;
    padding: 20px 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size:14px;
    color:#606266
  } */
</style>