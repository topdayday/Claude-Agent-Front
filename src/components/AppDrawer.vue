<template>
  <div>
  <el-drawer
      title="历史会话"
      :visible.sync="show"
      direction="rtl"
      size="100%"
      :before-close="handleClose">
      <template v-if="loading">
        <el-spinner></el-spinner>
      </template>
      <el-row v-for="(item, index) in conversation_list" :key="index">
        <div  class="his_row">
        <el-col :span="12" >
          <div class="conversation-his" @click="viewSession(item.session_id)"><span class="his_li" >{{item.content_in}}</span></div>
        </el-col>
        <el-col :span="7">
          <div class="conversation-his"><span class="his_li">{{dateFormat(item.create_time)}}</span></div>
        </el-col>
        <el-col :span="5">
          <el-button  @click="deleteSession(item.session_id)">删除</el-button>
        </el-col>
        </div>
      </el-row>
      <el-row type="flex" class="row-bg" justify="end">
        <el-button v-if="pageNumber>0 && !loading" @click="previousPage()">上一页</el-button>
        <el-button v-if="conversation_list.length>=30 && !loading"  @click="nextPage()">下一页</el-button>
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
      pageNumber:0,
      loading:true,
    }
  },
  created() {

  },
  watch:{
    showDrawer(){
        this.show =this.showDrawer;
        if(this.show){
          this.latestSession();
        }
    },
  },

  methods:{
    handleClose(){
      this.show=false;
      this.$emit('update:showDrawer', false);
    },

    nextPage(){
        this.pageNumber++;
        if( this.pageNumber<0){
          this.pageNumber=0;
        }
      this.latestSession();
    },
    previousPage(){
      this.pageNumber--;
      if( this.pageNumber<0){
        this.pageNumber=0;
      }
      this.latestSession()
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
    deleteSession(session_id){
        this.$confirm('你确定要删除会话所有对话吗？', '提示', {
            cancelButtonText: '退出',
            confirmButtonText: '确定',
            type: 'warning'
        }).then(() => {
            let token=localStorage.getItem('token');
            del_session(token,session_id).then(data => {
                this.latestSession();
                console.log('deleteSession:',data);
                this.$notify({
                    title: '提示',
                    message: '会话已删除！',
                    type: 'success'
                });
            }) .catch(error => {
                console.error(error);
                this.loading=false;
            });
        }).catch(() => {

        });



    },

    viewSession(session_id){
      localStorage.setItem('session_id',session_id);
      this.$emit('update:session_id', session_id); // 发出事件通知父组件
      this.handleClose();
    },
    dateFormat(time) {
      if(time===undefined||time==null){
        return '';
      }
      var d = new Date(time)

      var year = d.getFullYear()
      var month = d.getMonth() + 1
      var day = d.getDate() //


      var clock = year + '/'

      if (month < 10) { clock += '0' }

      clock += month + '/'

      if (day < 10) { clock += '0' }

      clock += day + ' '
      return (clock)
    }

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
    border-bottom: 1px #ccc solid; /* 底部边框 */
    /*border-top: 1px solid #ccc; !* 底部边框 *!*/
  }

</style>
