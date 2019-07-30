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
    <div class='select'>
      <div class="buttons">
        <div>服务状态：</div>
        <template>
          <el-radio-group v-model="type" @change="typeChange">
            <el-radio :label=1>开始</el-radio>
            <el-radio :label=2>完成</el-radio>
          </el-radio-group>
        </template>
      </div>
        <template>
          <el-select v-model="value" clearable  placeholder="服务站点">
            <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
          </el-select>
        </template>
        <template>
          <el-select v-model="value1" clearable  placeholder="服务街道">
            <el-option
            v-for="item in options1"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
          </el-select>
        </template>
    </div>
  </div>
</template>

<script>

import VueAMap from 'vue-amap';
VueAMap.initAMapApiLoader({
  key: '8b8f50d6273a3793e7f2e353861bb427',
  plugin: [],
  v: '1.4.4'
});
let AMapManager = new VueAMap.AMapManager();
export default {
  data() {
    return {
      type:'',
      options: [
        {
          value: 1,
          label: '1号站点'
        }, {
          value: 2,
          label: '2号站点'
        }
        ],
          options1: [
            {
          value: 1,
          label: '昌硕街道'
        }, {
          value: 2,
          label: '递铺街道'
        }
      ],
      value:'',
      value1:'',
      zoom: 10,
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
      checkedCities1: [],
      checkedCities2: [],
      currentPage: 1,
      count: 0,
      pagesize: 10,
      circles: [],
      markerList:[],
      type:'',
     
    }
  },
  created(){
    
  },
  mounted() {
    this.people();
  },
  watch: {
  },
  methods: {
    people() {
      this.axios
      .get('https://api.anjihos.newlioncity.com/admin/position/user')
      .then(res => {
        this.circles = res.data.data
        this.circles.map(function(item){
          item.center = []
          // item.center.push(item.lng)
          // item.center.push(item.lat)
          item.center.push(item.lng,item.lat)
        })
        console.log(this.circles)
        this.display();
      })
    },
      //展示所有人的位置信息
    display(){
      let map = AMapManager.getMap()
      //如果有，则清空数组，没有则添加
      if(this.markerList.length == 0 ){
        this.circles.map(item => {
          let marker = new AMap.Marker({
              position: new AMap.LngLat(item.center[0], item.center[1]),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          });
          this.markerList.push(marker)
          this.displayLabel(marker)
        })
        map.add(this.markerList)
      }else{
        map.remove(this.markerList)
        this.markerList = []
      }
    },
    displayLabel(marker,position){
      let map = AMapManager.getMap()
      //鼠标悬浮事件
      marker.on('mousedown',function () {
        let that = this
        var info = [];
        info.push("<div class='input-card content-window-card'><div><img style=\"float:left;\" src=\" https://webapi.amap.com/images/autonavi.png \"/></div> ");
        info.push("<div style=\"padding:7px 0px 0px 0px;\"><h4>高德软件</h4>");
        info.push("<p class='input-item'>电话 : 010-84107000   邮编 : 100102</p>");
        info.push("<p class='input-item'>地址 :北京市朝阳区望京阜荣街10号首开广场4层</p><button onclick=console.log(this) id='btn'>点击展示更多</button></div></div>");
        console.log(info)
        console.log(info.join(""))
        this.infoWindow = new AMap.InfoWindow({
            content: info.join("")  //使用默认信息窗体框样式，显示信息内容
        });
        
        // this.infoWindow.setAnchor('top-left')
        console.log(map.getCenter())
        //使用其它坐标会有bug
        setTimeout(function(){
            that.infoWindow.open(map, marker.getPosition());
        },200)
      })
      // marker.on('mousedown',function () {
      //   console.log('mousedown或moving执行')
      //   var info = [];
      //   info.push("<div class='input-card content-window-card'><div><img style=\"float:left;\" src=\" https://webapi.amap.com/images/autonavi.png \"/></div> ");
      //   info.push("<div style=\"padding:7px 0px 0px 0px;\"><h4>高德软件</h4>");
      //   info.push("<p class='input-item'>电话 : 010-84107000   邮编 : 100102</p>");
      //   info.push("<p class='input-item'>地址 :北京市朝阳区望京阜荣街10号首开广场4层</p></div></div>");

      //   this.infoWindow = new AMap.InfoWindow({
      //       content: info.join("")  //使用默认信息窗体框样式，显示信息内容
      //   });

      //   this.infoWindow.open(map, map.getCenter());
      // })
      // marker.on('mouseout',function () {
      //   this.infoWindow.close()
      // })
    },
    showMore(){
      console.log('test')
    },
    typeChange:function(val){
      this.type = val;
    },
  }
}
</script>
<style>
  .amap{
    position:relative;
  }
  .select{
    position:absolute;
    width:800px;
    right:50px;
    top:20px;
    background-color: #fff;
    z-index: 99;
    display: flex;
    flex-direction: row;
    justify-content:space-between;
    align-items: center;
    padding: 0 20px;
  }
  .select .buttons{
    width:250px;
    padding: 20px 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size:14px;
    color:#606266
  }
  </style>