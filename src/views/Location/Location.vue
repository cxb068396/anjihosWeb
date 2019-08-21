<template>
  <div class="amap">
    <div class="amap-page-container" :style="{ height: screenHeight + 'px' }">
      <el-amap vid="amapDemo"  
      :center="center" 
      :amap-manager="AMapManager" 
      :zoom="zoom" 
      :events="events" 
      :plugin="plugins"
      class="amap-demo">
      </el-amap>
    </div>
    <div class='selects'>
    <div class='select'>
      <el-button type="primary" size="mini" @click="updatetimer2" icon="el-icon-refresh">自动刷新</el-button>
      <el-button type="primary" size="mini" @click="allPeople">签约人员</el-button>
      <el-button type="primary" size="mini" @click="allDoctor">医疗团队</el-button>
    </div>
      <Modal 
        v-show="showModal" 
        width="1000"
        @on-cancel="cancel"
        >
      </Modal>
       <Doctor 
        v-show="showDoctor" 
        width="1000"
        @on-close="close"
        @func="getLocation"
        @funcs='getAllpeople'>
      </Doctor>
          <Healthdoc 
        v-show="showHealth" 
        width="1000"
        @on-close="closehealth"
       v-bind:message="healthdoc">
      </Healthdoc>
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
      <div class='icon1'>
        <img src='../../assets/red-drip.png' width="20" height="30"/>
        <span style="font-size:10px">{{numbercode11}}个未接单</span>
      </div>
      <div class='icon1'>
        <img src='../../assets/yellow-drip.png' width="20" height="30"/>
        <span style="font-size:10px">{{numbercode12}}个已接单</span>
      </div>
      <div class='icon1'>
        <img src='../../assets/blue-drip.png' width="20" height="30"/>
        <span style="font-size:10px">{{numbercode13}}个正在服务</span>
      </div>
    </div>  
  </div>
</template>

<script>
import Modal from '../Location/Model.vue'
import Doctor from '../Location/Doctor.vue'
import Healthdoc from '../Location/Healthdoc.vue'
import VueAMap from 'vue-amap';
import { lazyAMapApiLoaderInstance } from 'vue-amap';

import oldman from '../../assets/oldman.jpg';
import doctor from '../../assets/doctor.jpeg';
import yellow_drip from '../../assets/yellow-drip.png';
import blue_drip from '../../assets/blue-drip.png';
import red_drip from '../../assets/red-drip.png';
import green_drip from '../../assets/green-drip.png';
import fakevideo from '../../assets/aaa.mp4';
VueAMap.initAMapApiLoader({
  key: '39da57de3a8b0eb2ac9595631193b611',
  plugin: ['AMap.DistrictSearch'],
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
      showHealth:false,
      type:'',
      options:[],
      selectedOptions: [],
      defaultParams: {
        label: 'name',
        value: 'id',
        children: 'company'
      },
      plugins: ['AMap.DistrictSearch'],
      zoom: 11,
      center: [119.6803085855,30.6383898649],
      AMapManager,
      lineArr :[],
      copyLineArr:[],
      screenHeight: document.body.clientHeight,
      marker:{},
      createdate:'',
      events: {
        init:(map)=> {
          console.log('init事件')
          new AMap.DistrictSearch({
            extensions:'all',
            subdistrict:0
          }).search('安吉县',function(status,result){
            // 外多边形坐标数组和内多边形坐标数组
            var outer = [
                new AMap.LngLat(-360,90,true),
                new AMap.LngLat(-360,-90,true),
                new AMap.LngLat(360,-90,true),
                new AMap.LngLat(360,90,true),
            ];
            var holes =result.districtList[0].boundaries
            var pathArray = [
                outer
            ];
            pathArray.push.apply(pathArray,holes)
            var polygon = new AMap.Polygon( {
                pathL:pathArray,
                strokeColor: '#00eeff',
                strokeWeight: 1,
                fillColor: '#71B3ff',
                fillOpacity: 0.5
            });
            polygon.setPath(pathArray);
            map.add(polygon)
          })
        }
      },
      map: {},
      search: '',
      circles: [],
      markerList:[],
      type:'',
      lng:[],
      infoWindow:{},
      timer:'',
      location:'',
      healthdocid:'',
      healthdoc:[],
      timer1:0,
      // timer2:0,
      numbercode11:0,
      numbercode12:0,
      numbercode13:0,
    }
  },
  components:{
    'Modal':Modal,
    'Doctor':Doctor,
    'Healthdoc':Healthdoc
  },
  created(){
    const that = this
    setTimeout(function () {
      that.people();
    },400)
  },
  mounted() {
    
    const that = this
    window.onresize = () => {
      return (() => {
        window.screenHeight = document.body.clientHeight
        that.screenHeight = window.screenHeight
      })()
    }
    that.getStreet();
    this.timer1 = setInterval(function(){
        setTimeout( that.people,0)
      },20000)
  },
  beforeDestroy(){
    clearInterval(this.timer1)
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
    //接受子组件传递过来的一个人经纬度
    getLocation(data){
      //清空轮询，防止地图返回初始页面
      clearInterval(this.timer1);
      this.circles = data;
      console.log(this.circles )
      this.showDoctor=false
      //获得经纬度之后将其渲染到地图上
      this.peopleLocation();
    },
     //接受子组件传递过来的所有人经纬度
    getAllpeople(data){
      console.log(this.timer1)
      //清空轮询，防止地图返回初始页面
      this.circles = data;
      clearInterval(this.timer1);
      console.log(this.timer1)
      this.showDoctor = false
      //获得经纬度之后将其渲染到地图上
      this.peopleLocation();
    },
    peopleLocation(){
      let map = AMapManager.getMap()
      //如果有，则清空数组，没有则添加
      if(this.markerList.length !== 0 ){
        map.remove(this.markerList)
        this.markerList = []
      }
      this.circles.map(item => {
        let marker = new AMap.Marker({
          icon: new AMap.Icon({
            size: new AMap.Size(30,40),
            //根据不同状态展示不同icon
            image:blue_drip,
            imageSize: new AMap.Size(30,40),
          }),
          position: new AMap.LngLat(item.lng_ + Math.random()/5000,item.lat_ + Math.random()/5000),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        });
        marker.setAnimation('AMAP_ANIMATION_NONE')
        // marker.setTitle('我是marker的title');
        marker.healthdocid = item.health_doc_id
        this.healthdocid = marker.healthdocid
        marker.real_name = item.real_name
        marker.setLabel({
            offset: new AMap.Pixel(30, 15),  //设置文本标注偏移量
            content: `<div class='info'>${ marker.real_name }</div>`, //设置文本标注内容
            direction: 'right' //设置文本标注方位
        });
        this.peopleLocationwindow(marker)
        this.markerList.push(marker)
      })
      // console.log(this.markerList)
      map.add(this.markerList)
   //  map.setFitView();

    },
    peopleLocationwindow(marker,position){
      let map = AMapManager.getMap()
      let that = this
      marker.on('mousedown',function () {
        that.axios
        .get('https://api.anjihos.newlioncity.com/admin/contract/?health_doc_id='+marker.healthdocid).then(res=>{
            let data = res.data.data.data[0]
            marker.JBXX_BRDH = data.healthdocInfo.JBXX_BRDH //联系方式
            marker.JBXX_XM = data.healthdocInfo.JBXX_XM //真实姓名
            marker.JBXX_CSRQ = data.healthdocInfo.JBXX_CSRQ //出生日期
            marker.JBXX_LXRXM = data.healthdocInfo.JBXX_LXRXM //联系人姓名
            marker.JBXX_HJXXDZ = data.healthdocInfo.JBXX_HJXXDZ //地址
            marker.JBXX_XB = data.healthdocInfo.JBXX_XB //性别
            marker.JBXX_LXRDH = data.healthdocInfo.JBXX_LXRDH //联系人电话
            marker.doctorname = data.teamInfo.doctorInfo? data.teamInfo.doctorInfo.name:'未签约'
            marker.nursename = data.teamInfo.nurseInfo ?data.teamInfo.nurseInfo.name :'未签约'
            marker.pharmacistname = data.teamInfo.pharmacistInfo ?data.teamInfo.pharmacistInfo.name:'未签约'
            marker.serviceStaffname = (data.teamInfo.serviceStaffInfo? data.teamInfo.serviceStaffInfo.name :'未签约')
            marker.healthManagername = (data.teamInfo.healthManagerInfo ?  data.teamInfo.healthManagerInfo.name:'未签约')


            var info = 
                  '<div className="custom-infowindow input-card" style="width:300px;border-radius:20px;font-size:10px;">' +
                    '<div style="text-align:center;font-weight: bold;margin:10px 0">服务对象信息</div>' +
                    '<div>' +
                      `<img src=${oldman} style="width:100px;height:100px;border-radius:4em;display:inline-block;float:left;margin-right:20px;margin-right:20px"/ >` +
                      '<div class="input-item" style="margin-bottom:10px">' +
                          '<div class="input-item-prepend">' +
                            `<div class="input-item-text" >真实姓名：${marker.JBXX_XM == null ? marker.consignee: marker.JBXX_XM }</div>` +
                            `<div class="input-item-text" >下单时间：${marker.createdat}</div>` +
                            `<div class="input-item-text" >订单状态：${marker.order_status == 11? '未接单' :(marker.order_status == 12? '已接单，未服务' :'正在服务')}</div>` +
                            `<div class="input-item-text" >联系人姓名：${marker.JBXX_LXRXM == null?'未填写联系人':marker.JBXX_LXRXM}</div>` +
                            `<div class="input-item-text" >联系人电话：${marker.JBXX_LXRDH == null?'未填写联系人电话':marker.JBXX_LXRDH}</div>` +
                          '</div>' +
                      '</div>' +

                      '<input id="contractpeople_healthfile" type="button" class="btn" value="健康档案" onclick="contractpeopleHealthfileClick()" style="margin-right:40px"/>' +
                    '</div>' +
                    '<div style="width:100%;height:3px;background-color:grey;margin:16px 0">' +
                    '</div>' +

                    '<div style="text-align: center;font-weight: bold;margin:10px 0">医疗团队信息</div>' +
                    '<div>' +
                      `<img src=${doctor} style="width:100px;height:100px;border-radius:4em;display:inline-block;float:left;margin-top:-10px"/>` +
                      '<div class="input-item" style="margin:0 0 0 120px">' +
                          '<div class="input-item-prepend">' +                 
                            `<div class="input-item-text" >医生：${marker.doctorname}</div>` +
                            `<div class="input-item-text" >护士：${marker.nursename}</div>` + 
                            `<div class="input-item-text" >健康管家：${marker.serviceStaffname }</div>` +
                            `<div class="input-item-text" >药师：${marker.pharmacistname}</div>` +
                            `<div class="input-item-text" >服务人员：${marker.serviceStaffname}</div>`+
                          '</div>' +
                      '</div>' +
                      // '<input id="contractpeople_healthfile" type="button" class="btn" value="服务记录" onclick="showMoreMessage3()"/>' +
                    '</div>' +
                  '</div>';
              that.infoWindow = new AMap.InfoWindow({
                  position:marker.getPosition(),
                  content: info , //使用默认信息窗体框样式，显示信息内容
                  closeWhenClickMap:true,
              });
              //使用其它坐标会有bug
              setTimeout(function(){
                that.infoWindow.open(map);
                var contractpeople_healthfile = document.getElementById('contractpeople_healthfile');
                let contractpeopleHealthfileClick = function(){
                  that.showHealth = true;
                  that.infoWindow.close()
                  that.getHealth(marker)
                }
                contractpeople_healthfile.onclick = contractpeopleHealthfileClick
              },200)
        })
            })
      //鼠标点击事件
      
    },

    getHealth(marker){
      var healthdocid = marker.healthdocid
      let health_doc_id = marker.health_doc_id
      console.log(marker)
      this.axios.get('https://api.anjihos.newlioncity.com/admin/vitalsign?health_doc_id='+healthdocid).then(res=>{
      console.log(res.data.data.data)
      this.healthdoc = res.data.data.data
    })
  },
/***************************************************/

  //获得所有的街道
    getStreet(){
      this.axios.get('https://api.anjihos.newlioncity.com/admin/position/group',{param:{size:999}}).then(res=>{
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
     closehealth () {
      this.showHealth = false;
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
    updatetimer2(){
      this.people()
      if(this.timer1){
        clearInterval(this.timer1)
      }
      let that = this 
      this.timer1 = setInterval(function(){
        setTimeout( that.people,0)
      },20000)
    },
    people() {
      this.axios.get('https://api.anjihos.newlioncity.com/admin/position/user')
      .then(res => {
        this.circles = res.data.data
        this.display();
        //  this.buildMarkers();
      })
    },
      //展示所有人的位置信息
    display(){
      console.log('this.circles',this.circles)
      let map = AMapManager.getMap()
      //如果有，则清空数组，没有则添加
      if(this.markerList.length !== 0 ){
        map.remove(this.markerList)
        this.markerList = []
      }
      this.numbercode11 = 0
      this.numbercode12 = 0
      this.numbercode13 = 0
      this.circles.map(item => {
        let marker = new AMap.Marker({
          icon: new AMap.Icon({
            size: new AMap.Size(30,40),
            //根据不同状态展示不同icon
            image:item.order_status == 11? red_drip :(item.order_status == 12? yellow_drip :blue_drip),
            imageSize: new AMap.Size(30,40),
          }),
          position: new AMap.LngLat(item.lng + Math.random()/5000,item.lat + Math.random()/5000),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        });
        marker.setAnimation(item.order_status == 11? 'AMAP_ANIMATION_BOUNCE':'AMAP_ANIMATION_NONE')
        // marker.setTitle('我是marker的title');
        if(item.order_status == 11){
          this.numbercode11++
        }else if(item.order_status == 12){
          this.numbercode12++
        }else if(item.order_status == 13){
          this.numbercode13++
        }
        marker.goods_name = item.goods_name//服务内容
        marker.consignee = item.consignee //昵称
        // marker.address = item.address //详细住址
        // marker.JBXX_BRDH = item.JBXX_BRDH //联系方式
        marker.createdat = item.createdat //记录时间
        marker.JBXX_XM = item.JBXX_XM //真实姓名
        // marker.JBXX_CSRQ = item.JBXX_CSRQ //出生日期
        marker.JBXX_LXRXM = item.JBXX_LXRXM //联系人姓名
        // marker.JBXX_HJXXDZ = item.JBXX_HJXXDZ //地址
        // marker.JBXX_XB = item.JBXX_XB //性别
        marker.JBXX_LXRDH = item.JBXX_LXRDH //联系人电话

        // marker.doctor_team_id = item.doctor_team_id //医疗团队编号
        // marker.health_doc_id = item.health_doc_id //医疗团队医生编号
        // marker.company_id = item.company_id //机构编号
        marker.order_status = item.order_status //订单状态
        // marker.worker_sex = item.worker_sex //医生性别
        // marker.worker_address = item.worker_address //机构位置
        // marker.worker_mobile = item.worker_mobile //医生电话
        // marker.worker_address = item.worker_address //机构位置

        marker.contract_id = item.contract_id 
        marker.user_id = item.user_id 
        marker.id = item.id 

        
        marker.setLabel({
            offset: new AMap.Pixel(30, 15),  //设置文本标注偏移量
            content: `<div class='info'>${marker.consignee}</div>`, //设置文本标注内容
            direction: 'right' //设置文本标注方位
        });
        this.displayLabel(marker)
        this.markerList.push(marker)
      })
      map.add(this.markerList)
     // map.setFitView();

    },
    displayLabel(marker,position){
      let map = AMapManager.getMap()
      let that = this
      //鼠标点击事件
      marker.on('mousedown',function () {
        let info 
        if(marker.order_status == 11){


          
        that.axios.get(
          `/position/user?order_id=${marker.id}`
        ).then(res=>{
          marker.photo = res.data.data[0].photo
          marker.goods_name = res.data.data[0].goods_name
           info =

          '<div className="custom-infowindow input-card" style="width:300px;border-radius:20px;font-size:10px;">' +
            '<div style="text-align: center;font-weight: bold;margin:10px 0">服务对象信息</div>' +
            '<div>' +
              `<img src="${marker.photo || oldman}" style="width:100px;height:100px;border-radius:4em;display:inline-block;float:left;margin-right:20px"/>` +

              '<div class="input-item" style="margin-bottom:10px">' +
                  '<div class="input-item-prepend" >' +
                      `<div class="input-item-text" >真实姓名：${marker.JBXX_XM == null ? marker.consignee: marker.JBXX_XM }</div>` +
                      `<div class="input-item-text" >服务内容：${marker.goods_name}</div>` +
                      `<div class="input-item-text" >下单时间：${marker.createdat}</div>` +
                      `<div class="input-item-text" >订单状态：${marker.order_status == 11? '未接单' :(marker.order_status == 12? '已接单，未服务' :'正在服务')}</div>` +
                      `<div class="input-item-text" >联系人姓名：${marker.JBXX_LXRXM == null?'未填写联系人':marker.JBXX_LXRXM}</div>` +
                      `<div class="input-item-text" >联系人电话：${marker.JBXX_LXRDH == null?'未填写联系人电话':marker.JBXX_LXRDH}</div>` +
                  '</div>' +
              '</div>' +
              // '<input id="btn1" type="button" class="btn" value="服务记录" onclick="showMoreMessage1()"/>' +
             '<input id="withoutdoctorinfo_healthfile" type="button" class="btn" value="健康档案" onclick="withoutdoctorinfoHealthfileClick()" />' +
              '<input id="voice_requirement" type="button" class="btn" value="语音需求"  onclick="sendOrder()" style="margin-left:40px" />' +
            '</div>' +
          '</div>';
          that.infoWindow = new AMap.InfoWindow({
              position:marker.getPosition(),
              content: info , //使用默认信息窗体框样式，显示信息内容
              closeWhenClickMap:true,
          });
          setTimeout(function(){
            that.infoWindow.open(map);
            var withoutdoctorinfo_healthfile = document.getElementById('withoutdoctorinfo_healthfile');
            var voice_requirement = document.getElementById('voice_requirement');
            //onclick事件
            let withoutdoctorinfoHealthfileClick = function(){
              that.showHealth=true;
              that.infoWindow.close()
              that.getallHealth(marker)
            }
            let sendOrder = function(){
              //that.showHealth=true;
              that.$router.push({
                name: "order",
              });
            }
            withoutdoctorinfo_healthfile.onclick = withoutdoctorinfoHealthfileClick
            voice_requirement.onclick = sendOrder
        
          },100)
        })
         
        }else{
          async function getRes(){
            const res = await that.axios.get(
              `/doctorteam?${marker.contract_id?`contract_id=${marker.contract_id}`:`user_id=${marker.user_id}`}`
            )
            // console.log(res)
            that.handleRes(marker, res)
          }
          getRes()
          // that.axios.get(
          //   `/doctorteam?${marker.contract_id?`contract_id=${marker.contract_id}`:`user_id=${marker.user_id}`}`
          // ).then(res =>{that.handleRes(marker,res)})
        }
      })
    },
    handleRes(marker,res){
      let map = AMapManager.getMap()
      let that = this
      let teamInfo = res.data.data.data
      console.log(teamInfo)
      let doctorName,nurseName,healthManagerName,pharmacistName,serviceStafName
      if(teamInfo.length > 0){
        doctorName = teamInfo[0].doctorInfo.name
        nurseName = teamInfo[0].nurseInfo.name
        healthManagerName = teamInfo[0].healthManagerInfo.name
        pharmacistName = teamInfo[0].pharmacistInfo.name
        serviceStafName = teamInfo[0].serviceStaffInfo.name
      }
      that.axios.get(
          `/position/user?order_id=${marker.id}`
        ).then(res=>{
          marker.photo = res.data.data[0].photo
          let info = 
          '<div className="custom-infowindow input-card" style="width:300px;border-radius:20px;font-size:10px;">' +
            '<div style="text-align:center;font-weight: bold;margin:10px 0">服务对象信息</div>' +
            '<div>' +
              `<img src="${marker.photo || oldman}" style="width:100px;height:100px;border-radius:4em;display:inline-block;float:left;margin-right:20px;margin-right:20px"/ >` +
              '<div class="input-item" style="margin-bottom:10px">' +
                  '<div class="input-item-prepend">' +
                    `<div class="input-item-text" >真实姓名：${marker.JBXX_XM == null ? marker.consignee: marker.JBXX_XM }</div>` +
                    `<div class="input-item-text" >下单时间：${marker.createdat}</div>` +
                    `<div class="input-item-text" >订单状态：${marker.order_status == 11? '未接单' :(marker.order_status == 12? '已接单，未服务' :'正在服务')}</div>` +
                    `<div class="input-item-text" >联系人姓名：${marker.JBXX_LXRXM == null?'未填写联系人':marker.JBXX_LXRXM}</div>` +
                    `<div class="input-item-text" >联系人电话：${marker.JBXX_LXRDH == null?'未填写联系人电话':marker.JBXX_LXRDH}</div>` +
                  '</div>' +
              '</div>' +
              // '<input id="btn1" type="button" class="btn" value="服务记录" onclick="showMoreMessage1()" />' +
              '<input id="withdoctorinfo_healthfile" type="button" class="btn" value="健康档案" onclick="withdoctorinfoHealthfileClick()" />' +
            '</div>' +
            '<div style="width:100%;height:3px;background-color:grey;margin:16px 0">' +
            '</div>' +


            '<div style="text-align: center;font-weight: bold;margin:10px 0">医疗团队信息</div>' +
            '<div>' +
              `<img src=${doctor} style="width:100px;height:100px;border-radius:4em;display:inline-block;float:left;margin-top:-10px"/>` +
              '<div class="input-item" style="margin:0 0 0 120px">' +
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
              '<input id="online_live" type="button" class="btn" value="实时记录" onclick="showMoreMessage13()"/>' + 
            '</div>' +
          '</div>';
          that.infoWindow = new AMap.InfoWindow({
              position:marker.getPosition(),
              content: info , //使用默认信息窗体框样式，显示信息内容
              closeWhenClickMap:true,
          })

          setTimeout(function(){
            that.infoWindow.open(map);
            var online_live = document.getElementById('online_live');
            var withdoctorinfo_healthfile = document.getElementById('withdoctorinfo_healthfile')
            //onclick事件
            let withdoctorinfoHealthfileClick = function(){
              that.showHealth=true;
              that.infoWindow.close()
              that.getallHealth(marker)
            }
            withdoctorinfo_healthfile.onclick = withdoctorinfoHealthfileClick
            let showMoreMessage13 = function(){
              that.infoWindow.close()
              let info13 =  
              '<div>' +
                `<video src=${fakevideo} autoplay >`+
                '</video>'
              '</div>'
              that.infoWindow = new AMap.InfoWindow({
                  position:marker.getPosition(),
                  content:info13,
                  closeWhenClickMap:true,
              });
              that.infoWindow.open(map)
            }
            online_live.onclick = showMoreMessage13
          },200)
        })
    },
    getallHealth(marker){
      let health_doc_id = marker.health_doc_id
      console.log(marker)
      this.axios.get('https://api.anjihos.newlioncity.com/admin/vitalsign?health_doc_id='+health_doc_id).then(res=>{
        console.log(res.data.data.data)
        this.healthdoc = res.data.data.data
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
  .explain{
    position:absolute;
    width:500px;
    height:50px;
    right:50px;
    bottom:100px;
    background-color: #fff;
    z-index: 1;
    display: flex;
    flex-direction: row;
    justify-content:space-around ;
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