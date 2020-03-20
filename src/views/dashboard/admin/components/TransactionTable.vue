<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;">
    <el-table-column label="滞留订单名称" min-width="200">
      <template slot-scope="scope">
        {{ scope.row.goods_name | orderNoFilter }}
      </template>
    </el-table-column>
    <el-table-column label="下单时间" width="195" align="center">
      <template slot-scope="scope">
        {{ scope.row.createdat }}
      </template>
    </el-table-column>
    <el-table-column label="地址" width="195" align="center">
      <template slot-scope="scope">
        {{ scope.row.address }}
      </template>
    </el-table-column>
    <el-table-column label="联系电话" width="195" align="center">
      <template slot-scope="scope">
        {{ scope.row.mobile }}
      </template>
    </el-table-column>
    <el-table-column label="价格" width="195" align="center">
      <template slot-scope="scope">
        ¥{{ scope.row.order_price | toThousandFilter }}
      </template>
    </el-table-column>
    <el-table-column label="订单状态" width="100" align="center">
      <template slot-scope="scope">
        <el-tag :type="scope.row.status | statusFilter" color="#ffff00" @click.native='dispatdispatch'>{{ scope.row.order_status === 11?'去派单':'去发货' }}</el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { fetchList } from '@/api/transaction'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    },
    orderNoFilter(str) {
      return str.substring(0, 30)
    }
  },
  data() {
    return {
      list: null
    }
  },
  created() {
    // this.fetchData()
    this.getOrderList()
  },
  methods: {
    fetchData() {
      fetchList().then(response => {
        console.log(response)
        this.list = response.items.slice(0, 8)
      })
    },
    getOrderList() {
      this.axios
        .get('/dashboard', {
          params: { type: 'orderlist' }
        })
        .then(response => {
          console.log(response.data.data)
          this.list = response.data.data
        })
    },
    dispatdispatch(){
       this.$router.push({
        name:'order'
      })
    }
  }
}
</script>
