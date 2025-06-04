<template>
  <div class="his_container" v-if="!smallWidth&&showLeftMenu">
      <el-row class="tac">
          <el-col :span="24">
              <div  class="btn_new" @click="newSession()">
                <el-button class="new_button"
                           size="mini" round
                           ><span style="line-height:24px;">新建对话</span>
                </el-button>
              </div>
              <el-scrollbar style="height: 100vh;" class="my-custom-scrollbar">
                  <el-menu
                          :default-active="activeMenuIndex"
                          @close="handleClose"
                          background-color="##fdfcf8"
                          text-color="#000"
                          active-text-color="#000">
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
      activeMenuIndex:"0",
    }
  },
  created() {
      this.latestSession();
  },
  watch:{
    session_id(){
      this.setActiveIndex()
    },
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
        this.setActiveIndex();
        console.log('latest_session:',data);
      }) .catch(error => {
        console.error(error);
        _this.loading=false;
      });
    },

    setActiveIndex() {
      let targetSessionId=localStorage.getItem('session_id');
      if (!targetSessionId||!this.conversation_list || this.conversation_list.length === 0) {
          this.activeMenuIndex =  "0";
          console.log('activeMenuIndex:0',0);
         return;
      }
      console.log('activeMenuIndex:targetSessionId',targetSessionId);
      const index = this.conversation_list.findIndex(
        item => item.session_id === targetSessionId
      );
       console.log('activeMenuIndex:index',index);
      if (index !== -1) {
        this.activeMenuIndex = index.toString();
      } else {
        this.activeMenuIndex = "0"; // Reset if not found
      }
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
        height: 30px;
        line-height: 18px;
        font-size: 12px;
        display: flex;
        justify-content: center;
        background: linear-gradient(to bottom,
    rgba(0,0,0,0.1),
    rgba(253,253,248,0.1));
        -webkit-box-shadow: 0 1px 5px 2px rgba(0, 0, 0, .15);
        box-shadow: 0 1px 5px 2px rgba(0, 0, 0, .15)
    }
    .his_container{
        width: 260px;
        height: 100vh;
        /*margin-top: 30px;*/
        background-color: #fdfcf8;
        -webkit-box-shadow: 0 1px 5px 2px rgba(0, 0, 0, .15);
        box-shadow: 0 1px 5px 2px rgba(0, 0, 0, .15)
    }
    .bottom-div {
      position: absolute; 
      bottom: 0;  
      width: 100%;  
      background-color: #f2f2f2;  
    }
 
    .new_button{
        margin: 2px 0px !important; 
        padding: 0px !important;
        font-size: 12px;
        width:50%;
        background-color: #fb7750  ;
        border-color: #fb7750 ;
        color: #fff;
    }
    .new_button:hover,.new_button:focus{
        background-color: #fb8d6d;
        border-color: #fb8d6d;
        color: #fff;
    }

    :deep(.el-menu){
        border: 0px;
    }

/* 默认状态 */
:deep(.el-menu-item) {
  background-color: #fdfcf8 !important; /* 你想要的默认颜色 */
  transition: background-color 0.3s ease; /* 可选过渡效果 */
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 44px;
  line-height: 44px;
}

/* 悬停/聚焦状态 */
:deep(.el-menu-item:hover),
:deep(.el-menu-item:focus) {
  background-color: rgba(0,0,0,0.1) !important;
}

:deep(.el-menu-item.is-active) {
  background-color:  rgba(0,0,0,0.2)  !important; 
  color: #000 !important;  
  border-radius: 4px;    
}


/* 使用 :deep() 穿透 scoped 限制，定位到 el-scrollbar 内部的元素 */
/* 通过 .my-custom-scrollbar 限定范围，避免影响页面上其他的 el-scrollbar */
.my-custom-scrollbar :deep(.el-scrollbar__bar.is-vertical .el-scrollbar__thumb) {
  background-color: rgba(0,0,0,0.1); /* 设置为你想要的颜色 */
  /* 你也可以添加其他样式，比如圆角 */
  border-radius: 4px;
}

/* 可选：设置鼠标悬停时的颜色 */
.my-custom-scrollbar :deep(.el-scrollbar__bar.is-vertical .el-scrollbar__thumb:hover) {
  background-color: rgba(0,0,0,0.2); /* 设置为你想要的悬停颜色 */
}


</style>
