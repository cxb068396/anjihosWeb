<template>
  <div class="modal-backdrop">
     <div class="modal" :style="mainStyles">
        <div class="modal-header">
          <h3>健康档案</h3>
        </div>
        <div class="modal-body">
           <el-table
        :data="message"
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
        </div>
        <div class="modal-footer">
            <el-button type="primary"  @click="closehealth">关闭</el-button>
        </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Helthdoc',
  //接收父组件传递的width属性
  props: {
      message:{},
    width:{
        type:[Number,String],//类型检测
        default:300 //父组件没传width时的默认值
    },
  },
  data() {
    return { 
     
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
  },
  methods:{

    //点击返回按钮，将服务记录隐藏，然后将签约列表显示出来
      serviceClose(){
      this.service=false
      this.show=true;
    },

    //响应关闭按钮点击事件，通过$emit api通知父组件执行父组件的on-cancel方法
    closehealth() {
        this.$emit('on-close');
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