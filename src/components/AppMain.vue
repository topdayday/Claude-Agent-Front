<template>
  <div class="app_mian">
    <div class="fixed-top" v-if="token">
      <AppTop  :smallWidth.sync="smallWidth"
               :showDrawer.sync="showDrawer"
               :showMember.sync="showMember"
               :session_id.sync="session_id"
               :token.sync="token"
               :selectedModel.sync="selectedModel"
               :showLeftMenu.sync="showLeftMenu"
               :llmsModelInfo.sync="llmsModelInfo"
               @selectModel="selectModel"
               @setLeftMenu="setLeftMenu"/>
    </div>
    <div class="AppCenter"  v-if="token" >
      <AppCenter :smallWidth.sync="smallWidth"
                 :session_id.sync="session_id"
                 :showLeftMenu.sync="showLeftMenu"
                 @selectModel="selectModel"
                 @addConversation="addConversation"
                 :selectedModel.sync="selectedModel"
                 :scrollBottom="scrollBottom"
                 :llmsModelInfo.sync="llmsModelInfo" />
    </div>
    <div class="" v-if="token">
      <AppDrawer  :showDrawer.sync="showDrawer"
                  :token.sync="token"
                  :session_id.sync="session_id" />
    </div>
    <div class=""  v-if="token">
      <AppMember :showMember.sync="showMember" />
    </div>
    <div class=""  v-if="!token">
      <AppLogin :smallWidth.sync="smallWidth"
                :token.sync="token"
                :session_id.sync="session_id" 
                :llmsModelInfo.sync="llmsModelInfo"/>
    </div>
    <div class="letf_his" v-if="token">
      <AppLeftDrawer ref="leftMenu" :smallWidth.sync="smallWidth"
                      :showDrawer.sync="showDrawer"
                      :showLeftMenu.sync="showLeftMenu"
                      :token.sync="token"
                      :session_id.sync="session_id" />
    </div>
  </div>
</template>

<script>
  import AppTop from './AppTop.vue'
  import AppCenter from './AppCenter.vue'
  import AppLogin from './AppLogin.vue'
  import AppDrawer from './AppDrawer.vue'
  import AppMember from './AppMember.vue'
  import AppLeftDrawer from './AppLeftDrawer.vue'
  import {list_llm} from "@/utils/request";
export default {
  name: 'AppMain',
  components: {
    AppTop,
    AppCenter,
    AppLogin,
    AppDrawer,
    AppMember,
    AppLeftDrawer,
  },
  data(){
    return{
      token:'',
      session_id:'',
      showDrawer:false,
      showMember:false,
      selectedModel:0,
      smallWidth:false,
      scrollBottom:false,
      showLeftMenu:localStorage.getItem('showLeftMenu')==='false'?false:true,
      windowWidth: window.innerWidth,  
      llmsModelInfo:[],
    }
  },
  created(){
    this.getLlmsModelInfo();
  },
  mounted(){
    this.token=localStorage.getItem('token');
    // 监听窗口大小变化事件
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('scroll', this.checkScrollBottom);
    // 初始检查窗口宽度
    this.checkWidth();
    setTimeout(() => {  
      this.checkScrollBottom();
    }, 1000);
  },
  beforeDestroy() {
    // 在组件销毁前移除事件监听，避免内存泄漏
    window.removeEventListener('resize', this.handleResize);
  },
  methods:{
    throttle(func, delay) {
        let lastCall = 0;
        return function(...args) {
        const now = new Date().getTime();
        if (now - lastCall < delay) return;
        lastCall = now;
        func.apply(this, args);
      };
    },
    checkScrollBottom() {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const documentHeight = document.documentElement.scrollHeight;
      if (scrollTop + windowHeight >= documentHeight - 20) {
        this.scrollBottom=true;
      }else{
         this.scrollBottom=false;
      }
    },
    addConversation(data){
      this.$refs.leftMenu.addConversation(data);
    },
    selectModel(model){
      localStorage.setItem('model_type',model);
      this.selectedModel=model;
    },
    setLeftMenu(show){
      if(show){
        localStorage.setItem('showLeftMenu',true);
        this.showLeftMenu=true;
      }else{
        localStorage.setItem('showLeftMenu',false);
        this.showLeftMenu=false;
      }
    },
    handleResize() {
      // 当窗口大小变化时更新窗口宽度，并检查是否需要隐藏 div
      this.windowWidth = window.innerWidth;
      this.checkWidth();
      this.checkScrollBottom();
    },
    checkWidth() {
      // 检查当前窗口宽度是否小于 500px，并更新 isHidden 的值
      this.smallWidth = this.windowWidth < 1300;
    },
    getLlmsModelInfo(){
        list_llm().then(data => {
         this.llmsModelInfo= data;
        })
    },
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

  .letf_his {
    position: fixed;
    left: 0px;
    top: 0px;
    z-index: 1000;
  }
</style>
