<template>
  <div>
  <el-drawer
      title="历史会话"
      :visible.sync="show"
      direction="rtl"
      size="100%"
      :before-close="handleClose">
      <el-row v-for="(item, index) in conversation_list" :key="index">
        <div  class="his_row" @click="viewSession(item.session_id)">
        <el-col :span="11" >
          <div class="conversation-his"><span class="his_li" >{{item.content_in}}</span></div>
        </el-col>
        <el-col :span="8">
          <div class="conversation-his"><span class="his_li">{{item.create_time}}</span></div>
        </el-col>
        <el-col :span="5">
          <el-button  @click="deleteSession(item.session_id)">删除</el-button>
        </el-col>
        </div>
      </el-row>
  </el-drawer>
  </div>
</template>

<script>
import {latest_session} from "@/utils/request";
import {del_session} from "@/utils/request";

export default {
  name: 'AppDrawer',
  props: {
    showDrawer: Boolean, session_id: String,
  },
  data(){
    return{
      conversation_list:[],
      show:false,
    }
  },
  created() {

  },
  watch:{
    showDrawer(){
        this.show =this.showDrawer;
        if(this.show){
          this.latest_session();
        }
    },
  },

  methods:{
    handleClose(){
      this.show=false;
      this.$emit('update:showDrawer', false);
    },
    latest_session(){
      let token=localStorage.getItem('token');
      this.loading=true;
      latest_session(token).then(data => {
        this.conversation_list= data;
        console.log('latest_session:',data);
      }) .catch(error => {
        console.error(error);
      });
    },
    deleteSession(session_id){
      let token=localStorage.getItem('token');
      del_session(token,session_id).then(data => {
        this.latest_session();
        console.log('deleteSession:',data);
      }) .catch(error => {
        console.error(error);
        this.loading=false;
      });
    },

    viewSession(session_id){
      localStorage.setItem('session_id',session_id);
      this.$emit('update:session_id', session_id); // 发出事件通知父组件
      this.handleClose();
    },
  },
}
</script>

<style scoped>
  .top{
    width: 100%;
    height: 30px;
    background: linear-gradient(to bottom,
    rgba(0,0,0,0.1),
    rgba(253,253,248,0.1));
    display: flex;
  }
  .logo{
    width:  30px;
  }
  .conversation-topic{
    flex: 1;
    display: block;
    font-weight: bold;
    text-align: center;
    margin-top: 2px;
  }
  .user-setting{
    width: 80px;
    margin-top: 2px;
  }

  .conversation-his{
    text-align: left;
    /*padding: 10px;*/
    white-space: nowrap;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 18px;
  }
  .his_li{
    height: 40px;
    display: block;
    padding-top: 8px;

    /*display: inline-block;*/
    width: 100%; /* 设置最大宽度，超出时将显示省略号 */
    overflow: hidden; /* 隐藏超出部分 */
    white-space: nowrap; /* 不换行 */
    text-overflow: ellipsis; /* 使用省略号表示超出部分 */
  }
  .his_row{
    height: 40px;
    display: block;
    /*padding-top: 10px;*/
    padding-left: 10px;
    padding-bottom: 5px;
    /*background-color: #f8f8f8; !* 背景色 *!*/
    border-bottom: 1px dotted #ccc; /* 底部边框 */
    /*border-top: 1px solid #ccc; !* 底部边框 *!*/
  }

</style>
