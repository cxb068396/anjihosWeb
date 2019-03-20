<template>
  <div class="dashboard-container">
    <component :is="currentRole"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'

export default {
  name: 'Dashboard',
  components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    console.log('dashboard页面的roles为' + this.roles)
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))

    if (userInfo.admin_role_id === 1) {
      this.currentRole = 'adminDashboard'
    } else {
      this.currentRole = 'editorDashboard'
    }
    // if (!this.roles.includes('admin')) {
    //   this.currentRole = 'editorDashboard'
    // }
  }
}
</script>
