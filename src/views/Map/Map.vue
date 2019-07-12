<template>
  <div class="amap">
    <div class="doctor">
      <div class="choose">
        <el-checkbox-group
          v-model="checkedCities1"
        >
          <el-checkbox v-for="city in cities" :label="city" :key="city" >{{ city }}</el-checkbox>
        </el-checkbox-group>
        <div class="button">
          <el-button type="primary" icon="el-icon-search" size="mini"/>
        </div>
      </div>
      <div class="searchWord">
        <el-input
          v-model="search"
          style="display: inline-block;width:50%;"
          size="small"
          placeholder="请输入医生姓名"/>
      </div>
      <el-table
        :data="circles"
        style="width: 100%">
        <el-table-column
          prop="name"
          label="医生姓名"
          max-width="80"
        />
        <el-table-column prop="createdate" header-align="center" align="center" label="选择日期" >
          <template scope="scope">
            <el-date-picker v-model="scope.row.createdate" type="date" placeholder="日期" size="mini" />
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="位置"
          max-width="80"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="handleRowAgree(scope.$index, scope.row)"
            >查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: center;margin-top: 30px;">
        <el-pagination
          :current-page="currentPage"
          :page-size="pagesize"
          :total="count"
          layout="total, prev, pager, next, jumper"
          @current-change="handlePageChange"
        />
      </div>

    </div>
    <div class="amap-page-container">
      <div id="map" style="width:100%;height:1000px"/>
    </div>
  </div>
</template>

  <style>
  .searchWord{
    padding: 5px 0 5px 5px;
    background-color: #fff;
  }
.el-input--mini .el-input__inner {
    height: 28px;
    line-height: 28px;
    width: 100px;
    }
  .el-checkbox+.el-checkbox {
margin-left: 0px;
}
.el-checkbox {
margin-right: 25px;
}
  .amap{
    display:flex;
    flex-direction: row;
  }
  .doctor{
    flex: 1;

  }
  .doctor .choose{
    padding: 20px;
    background-color: #fff;
    border-bottom: 1px solid rgb(220, 223, 230);
  }
  .choose .button{
    display: flex;
    justify-content: flex-end;
    flex-direction: row;
  }

    .amap-page-container {
      height: 1000px;
      flex: 4
    }
  </style>
<script>
export default {
  data() {
    return {
      map: {},
      search: '',
      checkedCities1: [],
      cities: ['家庭医生', '健康管家', '服务人员', '护士', '药师'],
      currentPage: 1,
      count: 0,
      pagesize: 10,
      circles: [
        {
          name: '张医生',
          center: [116.397428, 39.90923]
        },
        {
          name: '张医生',
          center: [116.397428, 39.90923]
        },
        {
          name: '张医生',
          center: [116.397428, 39.90923]
        },
        {
          name: '张医生',
          center: [116.397428, 39.90923]
        },
        {
          name: '张医生',
          center: [116.397428, 39.90923]
        }
      ]
    }
  },
  mounted() {
    this.peopele()
    // 间隔3分钟发送一次请求
    //     window.setInterval(() => {
    //   setTimeout(console.log('123'), 0)
    //     }, 30000)
    //     /**一辆小车的运动轨迹* */
    //  var marker, lineArr = [[116.478935,39.997761],[116.478939,39.997825],[116.478912,39.998549],[116.478912,39.998549],[116.478998,39.998555],[116.478998,39.998555],[116.479282,39.99856],[116.479658,39.998528],[116.480151,39.998453],[116.480784,39.998302],[116.480784,39.998302],[116.481149,39.998184],[116.481573,39.997997],[116.481863,39.997846],[116.482072,39.997718],[116.482362,39.997718],[116.483633,39.998935],[116.48367,39.998968],[116.484648,39.999861]];

    //   this.map = new AMap.Map("map", {
    //       resizeEnable: true,
    //       center: [116.397428, 39.90923],
    //       zoom: 17,
    //       layers: [
    //           // 卫星
    //           new AMap.TileLayer.Satellite(),
    //           // 路网
    //           new AMap.TileLayer.RoadNet()
    //       ],
    //   });

    //   marker = new AMap.Marker({
    //       map: this.map,
    //       position: [116.478935,39.997761],
    //       icon: "https://webapi.amap.com/images/car.png",
    //       offset: new AMap.Pixel(-26, -13),
    //       autoRotation: true,
    //       angle:-90,
    //   });

    //   // 绘制轨迹
    //   var polyline = new AMap.Polyline({
    //       map: this.map,
    //       path: lineArr,
    //       showDir:true,
    //       strokeColor: "#28F",  //线颜色
    //       // strokeOpacity: 1,     //线透明度
    //       strokeWeight: 6,      //线宽
    //       // strokeStyle: "solid"  //线样式
    //   });

    //   var passedPolyline = new AMap.Polyline({
    //       map: this.map,
    //       // path: lineArr,
    //       strokeColor: "#AF5",  //线颜色
    //       // strokeOpacity: 1,     //线透明度
    //       strokeWeight: 6,      //线宽
    //       // strokeStyle: "solid"  //线样式
    //   });

    //   marker.on('moving', function (e) {
    //       passedPolyline.setPath(e.passedPath);
    //   });
    //   this.map.setFitView();
    //  marker.moveAlong(lineArr, 100);

    //  简单的轨迹图

    /** 弹跳的marker* */
    //   var map = new AMap.Map('map', {
    //     resizeEnable: true,
    //     center: [116.397428, 39.90923],
    //     zoom: 13
    // });

    // var marker = new AMap.Marker({
    //     position: map.getCenter(),
    //     icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
    //     offset: new AMap.Pixel(-13, -30),
    //     // 设置是否可拖拽
    //     draggable: true,
    //     cursor: 'move'
    // });

    // marker.setMap(map);

    // // 设置点标记的动画效果，此处为弹跳效果
    // marker.setAnimation('AMAP_ANIMATION_BOUNCE');
    //     map.on("complete", function(){
    //    console.log("地图加载完成！");
    // });
    /** 区域掩膜* */
    var map = new AMap.Map('map', {
      zoom: 13,
      center: [116.43, 39.92],
      resizeEnable: true
    })

    var lnglats = [[116.39, 39.92], [116.41, 39.93], [116.43, 39.91], [116.46, 39.93], [116.40, 39.93], [116.4, 39.93]]
    var markers = []

    for (var i = 0; i < lnglats.length; i++) {
      var lnglat = lnglats[i]
      // 创建点实例
      var marker = new AMap.Marker({
        position: new AMap.LngLat(lnglat[0], lnglat[1]),
        icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b' + (i + 1) + '.png',
        extData: {
          id: i + 1
        }
      })

      markers.push(marker)
    }

    // 将点添加到地图
    map.add(markers)
  },

  methods: {
    handleRowAgree: function() {
      this.map && this.map.destroy()
      console.log('地图已销毁')
      this.map = new AMap.Map('map')
    },
    peopele() {
      this.axios
        .get('https://api.anjihos.newlioncity.com/admin/position')
        .then(res => {
          console.log(res.data.data)
        })
    },

    // 分页
    handleSizeChange: function(size) {
      this.pagesize = size
    },
    handlePageChange: function(val) {
      this.currentPage = val
      this.handleApprovalList()
    }
  }
}
</script>
