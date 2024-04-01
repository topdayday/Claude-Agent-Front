<template>
  <div class="his_container" v-if="!smallWidth&&showLeftMenu">
      <el-row class="tac">
          <el-col :span="24">
              <div  class="btn_new" @click="newSession()">
<!--                  <svg width="24" height="24" style="margin-top: 8px;" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M11.54 2H9.09l4.46 12H16L11.54 2ZM4.46 2 0 14h2.5l.9-2.52h4.68L8.99 14h2.5L7.02 2H4.46Zm-.24 7.25 1.52-4.22 1.53 4.22H4.22Z"></path></svg>-->
<!--                <span style="display: inline-block;line-height: 38px;padding-top: 3px;padding-left: 5px;"> </span>-->
                <el-button style="width: 260px;border-radius:0px;font-size: 14px;"
                           icon="el-icon-circle-plus"
                           size="medium "
                           type="primary" >新建对话</el-button>
              </div>
              <el-scrollbar style="height: 100vh;">
                  <el-menu
                          @close="handleClose"
                          background-color="#000000"
                          text-color="#fff"
                          active-text-color="#ffd04b">
                      <el-menu-item @click="viewSession(item.session_id)" :index="index.toString()" v-for="(item, index) in conversation_list"  :key="index">{{item.content_in}}</el-menu-item>
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
    showDrawer: Boolean, session_id: String,smallWidth:Boolean,showLeftMenu:Boolean
  },
  data(){
    return{
      conversation_list:[],
      show:true,
      pageNumber:0,
      loading:true,
    }
  },
  created() {
      this.latestSession();
  },

  methods:{
    handleClose(){
      this.show=false;
    },
    addConversation(data){
      this.conversation_list.unshift(data);
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
              // this.latestSession()
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
        font-weight: bold;
        background-color: #000000;
        display: flex;
        justify-content: center;
        /*border-bottom: rgba(255,255,255,0.5) 1px solid;*/
    }
    /*.btn_new:hover{*/
    /*    color: white;*/
    /*    font-size: 18px;*/
    /*    background-color: #409EFF;*/
    /*}*/
    .his_container{
        width: 260px;
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
