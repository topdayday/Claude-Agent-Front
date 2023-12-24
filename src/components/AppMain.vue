<template>
  <div class="app_mian">
    <div class="fixed-top" v-if="token">
        <AppTop :showDrawer.sync="showDrawer" :showMember.sync="showMember" :session_id.sync="session_id"  :token.sync="token"  />
    </div>
    <div class="AppCenter"  v-if="token" >
      <AppCenter  :session_id.sync="session_id"/>
    </div>
    <div class="" v-if="token">
      <AppDrawer  :showDrawer.sync="showDrawer" :token.sync="token"  :session_id.sync="session_id" />
    </div>
    <div class=""  v-if="token">
      <AppMember :showMember.sync="showMember" />
    </div>
    <div class=""  v-if="!token">
      <AppLogin :token.sync="token" :session_id.sync="session_id" />
    </div>

  </div>
</template>

<script>
  import AppTop from './AppTop.vue'
  import AppCenter from './AppCenter.vue'
  import AppLogin from './AppLogin.vue'
  import AppDrawer from './AppDrawer.vue'
  import AppMember from './AppMember.vue'
export default {
  name: 'AppMain',
  components: {
    AppTop,
    AppCenter,
    AppLogin,
    AppDrawer,
    AppMember,
  },
  data(){
    return{
      token:'',
      session_id:'',
      showDrawer:false,
      showMember:false,
    }
  },
  mounted(){
     this.token=localStorage.getItem('token');
  },
  methods:{

  },
  watch:{
    session_id(){
      // alert('session_id:'+ this.session_id)
    },
    token(){
      // alert('token:'+ this.token)
    },
    showMember(){
      // alert('showMember:'+ this.showMember)
    }
  }

}
</script>

<style scoped>
  .app_mian{
    width: 100vw;
  }

   content-center{
     margin: 20px auto;
   }
  .fixed-top {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 999;
  }
  .fixed-bottom {
    position: fixed;
    bottom: 0px;
    width: 100%;
    z-index: 999;
    margin: 2px auto;
    max-width: 786px;
    left: 50%;
    transform: translateX(-50%);
  }
</style>
