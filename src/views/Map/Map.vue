<template>
  <div class="amap">
    <div class="doctor">
      <div class="buttons">
        <div>服务状态：</div>
        <template>
          <el-radio-group v-model="type" @change="typeChange">
            <el-radio :label="1">开始</el-radio>
            <el-radio :label="2">完成</el-radio>
          </el-radio-group>
        </template>
      </div>
      <div class="choose">
        <el-checkbox-group v-model="checkedCities1" @change="handleCheckedRolesChange">
          <el-checkbox v-for="city in cities" :label="city" :key="city">{{ city }}</el-checkbox>
        </el-checkbox-group>
        <div class="button">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="display">查看列表人员定位信息</el-button>
        </div>
      </div>
      <div class="searchWord">
        <el-input
          v-model="search"
          style="display: inline-block;width:50%;"
          size="small"
          v-on:input="onSubmitFilter"
          placeholder="请输入医生姓名"
        />
      </div>
      <el-table
        :data="tables.slice((currentPage - 1) * pagesize, currentPage * pagesize)"
        style="width: 100%"
        class="el-input--mini"
      >
        <el-table-column prop="worker_name" label="医生姓名" max-width="80" />
        <el-table-column
          prop="createdate"
          header-align="center"
          align="center"
          label="选择日期"
          class="el-input__inner"
        >
          <template scope="scope">
            <el-date-picker
              v-model="scope.row.createdate"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="位置" max-width="80">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="markerClick(scope.$index, scope.row)">查看</el-button>
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
    <div class="amap-page-container">
      <el-amap
        vid="amapDemo"
        :center="center"
        :amap-manager="AMapManager"
        :zoom="zoom"
        :events="events"
        class="amap-demo"
      ></el-amap>
    </div>
  </div>
</template>

<script>

import VueAMap from 'vue-amap';
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
      zoom: 11,
      center: [119.6803085855,30.6383898649],
      AMapManager,
      lineArr :[],
      copyLineArr:[],
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
      cities: ['家庭医生', '健康管家', '服务人员', '护士', '药师'],
      currentPage: 1,
      count: 0,
      pagesize: 10,
      circles: [],
      markerList:[],
      type:'',
      infoWindow:{},
    }
  },
  created(){

  },
  mounted() {
    this.people()
  },
  computed:{
    tables(){
      if (this.search) {
        return this.circles.filter(item => {
          return Object.keys(item).some(key => {
            return String(item[key]).toLowerCase().indexOf(this.search) > -1
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
  methods: {
    markerClick(index,row){
      let map = AMapManager.getMap();
      map.remove(this.markerList)
      //判断this.marker，如果存在，则remove
      if(Object.keys(this.marker).length == 0){
        //donothing
      }else{
        let polyline = map.getAllOverlays(polyline)
        map.remove(polyline)
        map.remove(this.marker)
      }
      this.marker = new AMap.Marker({
        icon: new AMap.Icon({
          size: new AMap.Size(20, 30),
          image:yellow_drip,
          imageSize: new AMap.Size(20, 30),
        }),
        position: row.center,
        offset: new AMap.Pixel(-13, -30)
      });
      this.marker.company_name = row.company_name
      this.marker.createdat = row.createdat
      this.marker.worker_name = row.worker_name
      this.displayLabel(this.marker,row.center)
      this.marker.setMap(map);
      //如果选择时间了，则绘制路径，否则绘制标记
      if(row.createdate){
        //获取路径
        let that = this
        this.axios
          .get('https://api.anjihos.z-y.tech/admin/position',{
            params: {
              worker_id : row.worker_id,
              time_after : row.createdate[0],
              time_before : row.createdate[1]
            }
          })
          .then(res => {
            that.lineArr = []
            let i = []
            let p = []
            console.log(res.data.data)
            if(res.data.data.length == 0){
              that.$message({
                message: '您选中的时间段，没有路径信息',
                type: 'error'
              });
            }else{
              for (let index = 0; index < res.data.data.length; index++) {
                i.push(res.data.data[index].lng,res.data.data[index].lat)
              }
              i.forEach((item, index) => {
                  const page = Math.floor(index / 2)
                  if (!p[page]) {
                    p[page] = []
                  }
                  p[page].push(item)
              });
              that.lineArr = [...p] 
              //根据不同的lineArr,绘制不同路径方法
              this.polyClick()
            }
          })
      }
    },
    displayLabel(marker,position){
      let map = AMapManager.getMap()
      let that = this
      //鼠标悬浮事件
      marker.on('mousedown',function () {
        var info = 
        '<div className="custom-infowindow input-card">' +
            `<label style="color:grey">${marker.worker_name}</label>` +
            '<div class="input-item">' +
                '<div class="input-item-prepend">' +
                    '<span class="input-item-text" >记录时间</span>' +
                    `<span class="input-item-text" >${marker.createdat}</span>` +
                '</div>' +
                '<input id="lnglat" type="text" />' +
            '</div>' +
            // 为 infowindow 添加自定义事件
            '<input id="lnglat2container" type="button" class="btn" value="获取该位置经纬度" onclick="showMoreMessage()"/>' +
        '</div>';
        that.infoWindow = new AMap.InfoWindow({
            position:marker.getPosition(),
            content: info  //使用默认信息窗体框样式，显示信息内容
        });
        //使用其它坐标会有bug
        setTimeout(function(){
          that.infoWindow.open(map);
          var lnglatInput = document.getElementById('lnglat2container');
          var lnglatInputValue = document.getElementById('lnglat');
          //onclick事件
          let showMoreMessage = function(){
            lnglatInputValue.value = marker.Uh.position.lng + "," +marker.Uh.position.lat 
            console.log(marker)
          }
          lnglatInput.onclick = showMoreMessage
        },200)
      })
    },
    //展示所有人的位置信息
    display(){
      //将markerList中的人员展示到地图上
      let map = AMapManager.getMap()
      map.remove(this.markerList)
      this.markerList = []
      //根据不同的type，绘制不同的icon
      console.log(this.type)
      if(this.type == 1){
        this.circles.map(item => {
          let marker = new AMap.Marker({
            icon: new AMap.Icon({
              size: new AMap.Size(20, 30),
              image:blue_drip,
              imageSize: new AMap.Size(20, 30),
            }),
            position: new AMap.LngLat(item.lng, item.lat),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          });
          marker.company_name = item.company_name
          marker.createdat = item.createdat
          marker.worker_name = item.worker_name
          this.displayLabel(marker)
          this.markerList.push(marker)
        })
      }else{
        this.circles.map(item => {
          let marker = new AMap.Marker({
            icon: new AMap.Icon({
              size: new AMap.Size(20, 30),
              image:red_drip,
              imageSize: new AMap.Size(20, 30),
            }),
            position: new AMap.LngLat(item.lng, item.lat),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          });
          marker.company_name = item.company_name
          marker.createdat = item.createdat
          marker.worker_name = item.worker_name
          this.displayLabel(marker)
          this.markerList.push(marker)
        })
      }
      map.add(this.markerList)
    },
    polyClick: function() {
      let map = AMapManager.getMap();
      this.copyLineArr = JSON.parse(JSON.stringify(this.lineArr))
      console.log(this.lineArr)
      let polyline = new AMap.Polyline({
          map:map,
          path: this.copyLineArr,
          showDir:true,
          strokeColor: "#28F",  //线颜色
          strokeOpacity: 1,     //线透明度
          strokeWeight: 6,      //线宽
          strokeStyle: "solid"  //线样式
      });
      let passedPolyline = new AMap.Polyline({
          map:map,
          path: this.copyLineArr,
          strokeColor: "#AF5",  //线颜色
          strokeOpacity: 1,     //线透明度
          strokeWeight: 6,      //线宽
          strokeStyle: "solid"  //线样式
      });
      console.log(this.copyLineArr)
      this.marker.on('moving', function (e) {
          passedPolyline.setPath(e.passedPath);
      });

      // map.setFitView();
      //true跟false是动画是否循环，但是true有bug
      this.marker.moveAlong(this.copyLineArr, 100000,function(k){return k},false ),1000
    },
    onSubmitFilter(event) {
      // 已经做好，此处重复，故注释。
      // this.people()
    },
    people() {
      //如果搜索框有内容，则只显示所匹配的，否则显示所有。
      console.log(this.search)
      if(this.search.length == 0){
        this.axios
        .get('https://api.anjihos.z-y.tech/admin/position')
        .then(res => {
          this.circles = res.data.data
          this.count = this.circles.length
          this.circles.map(function(item){
            item.center = []
            // item.center.push(item.lng)
            // item.center.push(item.lat)
            item.center.push(item.lng,item.lat)
          })
          this.display()
        })
      }else{
        let that = this
         this.axios.get('https://api.anjihos.z-y.tech/admin/position')
        .then(res => {
          this.circles = res.data.data.filter(
            item => item.worker_name == that.search
          )
          this.display()
        })
      }
    },
    typeChange:function(val){
      this.type = val;
      this.axios.get('https://api.anjihos.z-y.tech/admin/position',{
            params: {
              type:this.type
            }
          })
      .then(res => {
        this.circles = res.data.data
        this.display()
      })
    },
    handleCheckedRolesChange(){
      this.checkedCities2 = this.checkedCities1.map(function(item){
        switch (item) {
          case '家庭医生':
            return 1 
            break;
          case '护士':
            return 2 
            break;
          case '药师':
            return 3 
            break;
          case '健康管家':
            return 4 
            break;
          case '服务人员':
            return 5 
            break;
          default:
          return item
        }
      }).join(',')
      let that = this
         this.axios.get('https://api.anjihos.z-y.tech/admin/position',{
            params: {
              worker_role_id:this.checkedCities2
            }
          })
        .then(res => {
          this.circles = res.data.data
          this.count = this.circles.length
          this.display()
        })
      console.log(this.checkedCities2)
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
.searchWord {
  padding: 5px 0 5px 5px;
  background-color: #fff;
}
.el-input--mini .el-input__inner {
  height: 28px;
  line-height: 28px;
  width: 100px;
}
.el-checkbox + .el-checkbox {
  margin-left: 0px;
}
.el-checkbox {
  margin-right: 25px;
}
.amap {
  display: flex;
  flex-direction: row;
}
.doctor {
  flex: 1;
}
.doctor .choose {
  padding: 20px;
  background-color: #fff;
  border-bottom: 1px solid rgb(220, 223, 230);
}
.choose .button {
  display: flex;
  justify-content: flex-end;
  flex-direction: row;
}
.buttons {
  padding: 20px;
  background-color: #fff;
  border-bottom: 1px solid rgb(220, 223, 230);
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  font-size: 14px;
  color: #606266;
}
.amap-page-container {
  height: 100vh;
  flex: 4;
}
.amapDemo {
  width: 100%;
  height: 100%;
}
</style>