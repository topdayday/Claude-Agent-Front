<template>
  <div class="his_container" v-if="!isHidden">
      <el-row class="tac">
          <el-col :span="24">
              <div  class="btn_new" @click="newSession()">
                  <svg width="24" height="24" style="margin-top: 8px;" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M11.54 2H9.09l4.46 12H16L11.54 2ZM4.46 2 0 14h2.5l.9-2.52h4.68L8.99 14h2.5L7.02 2H4.46Zm-.24 7.25 1.52-4.22 1.53 4.22H4.22Z"></path></svg>
                  <span style="display: inline-block;line-height: 38px;padding-top: 3px;padding-left: 5px;"> 新建对话</span>
              </div>
              <el-scrollbar style="height: 100vh;">
                  <el-menu
                          @close="handleClose"
                          background-color="#545c64"
                          text-color="#fff"
                          active-text-color="#ffd04b">
                      <el-menu-item @click="viewSession(item.session_id)" :index="index" v-for="(item, index) in conversation_list"  :key="index">{{item.content_in}}</el-menu-item>
                  </el-menu>
              </el-scrollbar>
          </el-col>
      </el-row>
  </div>
</template>

<script>
import {latest_session} from "@/utils/request";
import {generate_session} from "@/utils/request";

export default {
  name: 'AppLeftDrawer',
  props: {
    showDrawer: Boolean, session_id: String,
  },
  data(){
    return{
      conversation_list:[],
      show:true,
      pageNumber:0,
      loading:true,
      isHidden: false,
      windowWidth: window.innerWidth // 获取初始窗口宽度
    }
  },
  created() {
      this.latestSession();
  },
    mounted(){
        // 监听窗口大小变化事件
        window.addEventListener('resize', this.handleResize);
        // 初始检查窗口宽度
        this.checkWidth();
    },
    beforeDestroy() {
        // 在组件销毁前移除事件监听，避免内存泄漏
        window.removeEventListener('resize', this.handleResize);
    },
  watch:{

  },
  methods:{
      handleResize() {
          // 当窗口大小变化时更新窗口宽度，并检查是否需要隐藏 div
          this.windowWidth = window.innerWidth;
          this.checkWidth();
      },
      checkWidth() {
          // 检查当前窗口宽度是否小于 500px，并更新 isHidden 的值
          this.isHidden = this.windowWidth < 1300;
      },

    handleClose(){
      this.show=false;
    },

    latestSession(){
      let _this=this;
      let token=localStorage.getItem('token');
      this.loading=true;
      this.conversation_list=[]
      latest_session(token,this.pageNumber).then(data => {
        this.conversation_list= data;
        this.loading=false;
        console.log('latest_session:',data);
      }) .catch(error => {
        console.error(error);
        _this.loading=false;
      });
    },

    viewSession(session_id){
      localStorage.setItem('session_id',session_id);
      this.$emit('update:session_id', session_id); // 发出事件通知父组件
      this.handleClose();
    },

      newSession(){
          let token=localStorage.getItem('token');
          generate_session(token).then(data => {
              localStorage.setItem('session_id',data);
              this.$emit('update:session_id', data); //
              console.log('generate_session:',data);
              this.latestSession()
          }) .catch(error => {
              console.error(error);
              this.loading=false;
          });
      },
  },
}
</script>

<style scoped>
    .btn_new{
        height: 38px;
        line-height: 18px;
        color: white;
        font-size: 18px;
        background-color: black;
        display: flex;
        justify-content: center;
    }
    .btn_new:hover{
        color: white;
        font-size: 18px;
        background-color: #409EFF;
    }
    .his_container{
        width: 250px;
        height: 100vh;
        /*margin-top: 30px;*/
        background-color: #545c64;
    }
    ::v-deep   .el-menu-item{
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis;
        height: 48px;
    }
    ::v-deep    .el-menu{
        border: 0px;
    }
</style>
