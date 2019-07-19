<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('userCounts')">
        <div class="card-panel-icon-wrapper icon-peoples">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">用户端人数</div>
          <count-to :start-val="0" :end-val="userCount" :duration="2600" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('contractCounts')">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="people" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">医养结合签约数</div>
          <count-to :start-val="0" :end-val="contractCount" :duration="3000" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('companyCounts')">
        <div class="card-panel-icon-wrapper icon-international">
          <svg-icon icon-class="international" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">服务机构数</div>
          <count-to :start-val="0" :end-val="companyCount" :duration="3200" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('workerCounts')">
        <div class="card-panel-icon-wrapper icon-user">
          <svg-icon icon-class="user" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">服务人员数</div>
          <count-to :start-val="0" :end-val="workerCount" :duration="3600" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('serviceCounts')">
        <div class="card-panel-icon-wrapper icon-example">
          <svg-icon icon-class="example" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">总服务次数</div>
          <count-to :start-val="0" :end-val="serviceCount" :duration="4000" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('sellCounts')">
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="shopping" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">总销售次数</div>
          <count-to :start-val="0" :end-val="sellCount" :duration="4400" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('moneyCounts')">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="money" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">平台总收入</div>
          <count-to :start-val="0" :end-val="moneyCount" :duration="4800" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('goodCounts')">
        <div class="card-panel-icon-wrapper icon-star">
          <svg-icon icon-class="star" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">满意评价次数</div>
          <count-to :start-val="0" :end-val="goodCount" :duration="5200" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import api from "@/config/api";

export default {
  components: {
    CountTo
  },
  data() {
    return {
      userCount: 0,
      companyCount: 0,
      workerCount: 0,
      moneyCount: 0,
      serviceCount: 0,
      sellCount: 0,
      contractCount: 0,
      goodCount: 0
    }
  },
  created() {
    this.handleGetLineChartData()
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    },
    handleGetLineChartData() {
      this.axios
        .get("/dashboard", {
          params: {}
        })
        .then(response => {
          // console.log(response.data.data)
          this.userCount = response.data.data.userCount
          this.companyCount = response.data.data.companyCount
          this.workerCount = response.data.data.workerCount
          this.moneyCount = response.data.data.moneyCount
          this.serviceCount = response.data.data.serviceCount
          this.sellCount = response.data.data.sellCount
          this.contractCount = response.data.data.contractCount
          this.goodCount = response.data.data.goodCount
        })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  .card-panel-col{
    margin-bottom: 32px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-people {
         background: #40c9c6;
      }
      .icon-message {
        background: #36a3f7;
      }
      .icon-money {
        background: #f4516c;
      }
      .icon-shopping {
        background: #34bfa3
      }
      .icon-star {
        background: #ff0000
      }
      .icon-peoples {
        background: #2ac06d
      }
      .icon-example {
        background: #ffaa00
      }
      .icon-international {
        background: #6666ff
      }
      .icon-user {
        background: #795da3;
      }
    }
    .icon-people {
      color: #40c9c6;
    }
    .icon-message {
      color: #36a3f7;
    }
    .icon-money {
      color: #f4516c;
    }
    .icon-shopping {
      color: #34bfa3
    }
    .icon-star {
      color: #ff0000
    }
    .icon-peoples {
      color: #2ac06d
    }
    .icon-example {
      color: #ffaa00
    }
    .icon-international {
      color: #6666ff
    }
    .icon-user {
      color: #795da3;
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>
