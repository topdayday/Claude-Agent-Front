<template>
<div class="content-main">
  <div v-bind:class="{main_left:showLeftMenu,main_left_hide:!showLeftMenu}" v-if="!smallWidth"></div>
  <div class="main-right" v-if="showIndexContent">
      <span class="card_sense" ></span>
    <h3 v-if="!smallWidth" class="card_start"><span style="color: darkred;font-weight: bold;font-size: 22px;">T2Day</span></h3>
          <div  class="card_contains">
            <div  v-bind:class="{selected_box:model_type===50, card_item:true,}"  @click="selectType(50)">
              <i v-if="model_type===50" class="selected-icon">✓已选</i>
              <h4 class="gmat-headline-4 gradient gradient-1">DeepSeek</h4>
            </div>
            <div  v-bind:class="{selected_box:model_type===2, card_item:true,}"  @click="selectType(2)">
              <i v-if="model_type===2" class="selected-icon">✓已选</i>
              <h4 class="gmat-headline-4 gradient gradient-1">Gemini</h4>
            </div>
<!--            <div  v-bind:class="{selected_box:model_type===0, card_item:true,}"  @click="selectType(0)">-->
<!--              <i v-if="model_type===0" class="selected-icon">✓已选</i>-->
<!--              <h4 class="gmat-headline-4 gradient gradient-1">Claude2</h4>-->
<!--            </div>-->
            <div  v-bind:class="{selected_box:model_type===1, card_item:true,}"  @click="selectType(1)">
              <i v-if="model_type===1" class="selected-icon">✓已选</i>
              <h4 class="gmat-headline-4 gradient gradient-1">Claude</h4>
            </div>
            <div  v-bind:class="{selected_box:model_type===40, card_item:true,}"  @click="selectType(40)">
              <i v-if="model_type===40" class="selected-icon">✓已选</i>
              <h4 class="gmat-headline-4 gradient gradient-1">QWen</h4>
            </div>
<!--            <div  v-bind:class="{selected_box:model_type===10, card_item:true,}"  @click="selectType(10)">-->
<!--              <i v-if="model_type===10" class="selected-icon">✓已选</i>-->
<!--              <h4 class="gmat-headline-4 gradient gradient-1">Llama3</h4>-->
<!--            </div>-->
<!--            <div  v-bind:class="{selected_box:model_type===4, card_item:true,}"  @click="selectType(4)">-->
<!--              <i v-if="model_type===4" class="selected-icon">✓已选</i>-->
<!--              <h4 class="gmat-headline-4 gradient gradient-1">PaML2</h4>-->
<!--            </div>-->
<!--            <div  v-bind:class="{selected_box:model_type===5, card_item:true,}"  @click="selectType(5)">-->
<!--              <i v-if="model_type===5" class="selected-icon">✓已选</i>-->
<!--              <h4 class="gmat-headline-4 gradient gradient-1">Code-bison</h4>-->
<!--            </div>-->
<!--            <div  v-bind:class="{selected_box:model_type===3, card_item:true,}"  @click="selectType(3)">-->
<!--              <i v-if="model_type===3" class="selected-icon">✓已选</i>-->
<!--              <h4 class="gmat-headline-4 gradient gradient-1">Mistral</h4>-->
<!--            </div>-->
<!--            <div  v-bind:class="{selected_box:model_type===6, card_item:true,}"  @click="selectType(6)">-->
<!--              <i v-if="model_type===6" class="selected-icon">✓已选</i>-->
<!--              <h4 class="gmat-headline-4 gradient gradient-1">Unicorn</h4>-->
<!--            </div>-->
          </div>
    </div>
  <div class="content-warp"  v-loading="loading">
    <div class="content" v-for="(item, index) in content_his" :key="index" :id="'content_'+item.id">
      <button @click="delConversation(item.id)" v-if="editable&&index>0" class="btn_edit">删除</button>
      <button @click="handleCopyConversation(item.id)" v-if="editable" class="btn_edit">复制</button>
      <div class="content-human-warp">
        <div class="content-human-icon" v-if="!smallWidth">
          <div class="circle"><span style="margin-left: -3px;"   @click="installCopyCode(item.id)">你</span></div>
        </div>
        <div class="content-human">
          <div style="margin-bottom: 10px;" v-for="(content_in,index) in splitContent(item.content_in) " :key="index">
            {{content_in}}
          </div>
          <div  class="content-info" style="text-align: left;float: left;">{{showInfo(-1,item.create_time)}}</div>
        </div>
      </div>

      <div class="content-assistant-warp">
        <div class="content-assistant-icon"  v-if="!smallWidth"  @click="installCopyCode(item.id)">
          <svg width="22" height="22" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.54 2H9.09l4.46 12H16L11.54 2ZM4.46 2 0 14h2.5l.9-2.52h4.68L8.99 14h2.5L7.02 2H4.46Zm-.24 7.25 1.52-4.22 1.53 4.22H4.22Z"></path></svg>
        </div>
        <div class="content-assistant">
          <div :id="item.id"  v-html="item.content_out"></div>
          <div class="content-info">{{showInfo(item.model_type,item.create_time)}}</div>
        </div>
      </div>
    </div>
  </div>
  <div :class="(smallWidth||!showLeftMenu)?'fixed-bottom-hiden':'fixed-bottom'" v-on:keydown.ctrl.enter="sendMessage">
    <div v-bind:class="{ send_message:true, send_message_min: !smallWidth }">
      <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 100}"
              placeholder="按下Ctrl+Enter提交..."
              v-model="content_in">
      </el-input>
      <el-button  class="btn_sent" type="primary" :icon="sent_status_ico" @click="sendMessage()">发送</el-button>
    </div>
  </div>

</div>
</template>

<script>
import {list_session} from  '@/utils/request.js';
import {assistant} from  '@/utils/request.js';
import {del_conversation} from '@/utils/request';
export default {
  name: 'AppCenter',
  props: {
    session_id: String,selectedModel:Number,smallWidth:Boolean,showLeftMenu:Boolean
  },
  comments:{

  },

  data(){
    return{
      content_his:[],
      content_in:'',
      sent_status: 0,
      model_type:0,
      editable:false,
      loading:false,
    }
  },
  created(){
    this.currentSession();
    this.load_model_type();
  },

  watch:{
    session_id(){
      this.currentSession();
    },
    showIndexContent(){
      this.load_model_type();
    },
    selectedModel(selectedModel){
      this.selectType(selectedModel);
    },
    model_type(model_type){
      this.$emit('selectModel',model_type)
    },
  },
  computed:{
    sent_status_ico(){
      return this.sent_status===0?'el-icon-upload2':'el-icon-loading';
    },
    showIndexContent(){
      return  this.content_his.length===0;
    },
  },
  mounted(){
  },
  beforeDestroy() {
  },
  methods:{
    splitContent(content){
      if(content){
        return content.split('<br>');
      }else{
        return [];
      }
    },
    showInfo(model_type,create_time){
      let modelStr = '';
      let timeStr='';
      if(create_time){
        timeStr=(create_time+'').replace("T", " ")
      }
      switch (model_type) {
        case -1:
          modelStr = 'You'
          break
        case 1:
          modelStr =  'Claude'
          break
        case 2:
          modelStr =  'Gemini'
          break
        case 50:
          modelStr =  'DeepSeek'
          break
        case 40:
          modelStr =  'QWen'
          break
        // case 3:
        //   modelStr =  'Mistral'
        //   break
        // case 4:
        //   modelStr =  'PaLM2'
        //   break
        // case 5:
        //   modelStr =  'Code-bison'
        //   break
        // case 6:
        //   modelStr =  'Unicorn'
        //   break
        // case 10:
        //   modelStr =  'LLama3'
        //   break
        default:
          modelStr =  ''
      }
      let timeInfo=modelStr+' at:  '+timeStr.slice(0,19);
      return  timeInfo;
    },
    load_model_type(){
      let local_model_type=localStorage.getItem('model_type')
      if(local_model_type){
        this.model_type=Number(local_model_type);
      }else{
        this.model_type=0;
      }
    },
    currentSession() {
      this.loading=true;
      let token=localStorage.getItem('token');
      let session_id=localStorage.getItem('session_id');
      list_session(token,session_id).then(data => {
        this.loading=false;
        this.editable=false;
        this.content_his= data;
        this.scrollToBottom();
      }) .catch(error => {
        this.loading=false;
        console.error(error);
      });
    },
    selectType(model_type){
      this.model_type=model_type;
    },
    sendMessage(){
      if( this.sent_status === 1){
        return ;
      }
      let token=localStorage.getItem('token');
      let session_id=localStorage.getItem('session_id');
      if(!token || !session_id || !this.content_in.length){
        return
      }
      if (this.content_in.trim().length===0){
        return
      }
      let local_model_type=localStorage.getItem('model_type')
      if(local_model_type){
        this.model_type=Number(local_model_type);
      }else{
        this.model_type=0;
      }
      this.sent_status = 1;
      assistant(token,session_id,this.content_in.trim(),this.model_type).then(data => {
        this.sent_status = 0;
        this.scrollToBottom();
        if(data){
          this.content_his.push(data);
          this.content_in='';
          if(this.content_his.length===1){
            this.$emit('addConversation',data);
          }
        }
      }) .catch(error => {
        console.error(error);
        this.sent_status = 0;
      });
    },
    scrollToBottom() {
      this.$nextTick(() => {
        window.scrollTo(0, document.body.scrollHeight);
      })
    },

    delConversation(c_id){
      this.$confirm('你确定要删除该对话吗？', '提示', {
        cancelButtonText: '退出',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        let token=localStorage.getItem('token');
        del_conversation(token,c_id).then(data => {
          if(data){
            const div = document.querySelector('#content_'+c_id);
            if(div){
              div.remove();
              this.$notify({
                title: '提示',
                message: '对话已删除！',
                type: 'success'
              });
            }
          }
        }) .catch(error => {
          console.error(error);
        });
      }).catch(() => {
      });

    },
    installCopyCode(id){
      if(this.editable){
        this.editable=false;
        const parent = document.getElementById(id);
        const btnCodes = document.querySelectorAll(".btn-code");
        for (const btnCode of btnCodes) {
          btnCode.parentElement.removeChild(btnCode);
        }
        parent.removeAttribute('showCopy');
        return;
      }
      const parent = document.getElementById(id);
      if(parent.hasAttribute('showCopy')) {
        const btnCodes = document.querySelectorAll(".btn-code");
        for (const btnCode of btnCodes) {
          btnCode.parentElement.removeChild(btnCode);
        }
        parent.removeAttribute('showCopy');
        return;
      }
      this.editable=true;
      const highlights = parent.querySelectorAll(".codehilite")
      highlights.forEach(div => {
        const copy = document.createElement("button")
        copy.innerHTML = "复制代码"
        copy.style.cssText = `
        color: white;
        box-sizing: border-box;
        transition: 0.2s ease-out;
        cursor: pointer;
        user-select: none;
        background: rgba(0, 0, 0, 0.45);
        border: 1px solid rgba(0, 0, 0, 0);
        padding: 5px 10px;
        font-size: 0.8em;
        border-radius: 0 0.15rem;
        line-height:20px;
      `;
        copy.classList.add("btn-code");
        copy.addEventListener("click", this.handleCopyClick);
        div.append(copy)
      })
      parent.setAttribute('showCopy', 'true');
    },

    copyToClipboard(str) {
      const el = document.createElement("textarea")
      el.value = str
      el.setAttribute("readonly", "")
      el.style.position = "absolute"
      el.style.left = "-9999px"
      document.body.appendChild(el)
      const selected =
          document.getSelection().rangeCount > 0
              ? document.getSelection().getRangeAt(0)
              : false
      el.select()
      document.execCommand("copy")
      document.body.removeChild(el)
      if (selected) {
        document.getSelection().removeAllRanges()
        document.getSelection().addRange(selected)
      }
    },
    handleCopyConversation(id) {
      const parent = document.getElementById('content_'+id);
      const { children } =parent;
      let { innerText } = Array.from(children)[1]
      if(innerText == '复制'){
        let { innerText } = Array.from(children)[3]
        this.copyToClipboard(innerText)
      }else{
        let { innerText } = Array.from(children)[2]
        this.copyToClipboard(innerText)
      }
      this.$notify({
        title: '提示',
        message: '内容已复制成功！',
        type: 'success'
      });
    },
    handleCopyClick(evt) {
      const { children } = evt.target.parentElement
      const { innerText } = Array.from(children)[0]
      this.copyToClipboard(innerText)
      this.$notify({
        title: '提示',
        message: '内容已复制成功！',
        type: 'success'
      });
    }

  },
}
</script>

<style scoped>
  .codehilite{
    display: flex; justify-content: flex-end;
  }

.content{
  background-color: #fcfcfc;
  border: 1px solid #fdfdfd;
  border-bottom: 2px solid rgba(0,0,0,0.1);
  box-shadow:
          0 2px 5px rgba(0,0,0,0.1),
          inset 0 1px 0 rgba(255,255,255,0.1);
  max-width: 780px;
  margin: auto;
  margin-bottom:40px;
  padding: 10px 10px 10px 2px;

}
.circle {
  width: 24px;
  height: 24px;
  background-color: black;
  border-radius: 50%;
  color: white;
  text-align: center;
  font-size: 16px;
  margin-left: 5px;
  margin-right: 8px;
}

.content-human-warp{
  display: flex;
  width: 100%;
}
.content-human-icon {
  width: 36px;
  margin-top: 5px;
}
.content-human{
  margin-left:0px;
  background-color: #fdfdfd;
  text-align: left;
  padding-bottom: 10px;
  padding-top: 5px;
  overflow-x: auto;
  max-width: calc(100vw - 4px);
}
.content-assistant-warp{
  display: flex;
}
.content-assistant-icon {
  width: 36px;
  margin-top: 18px;
}
.content-assistant{
  margin: auto;
  background-color: #fcfcfc;
  border-top: 1px dotted #d4d4d4;
  flex: 1;
  overflow-x: auto;
  max-width: calc(100vw - 6px);
  padding:4px;
}

.send_message {
  display: flex;
  justify-content: center;
  align-items: center;

}
.send_message_min {
  margin-left: 10px;
}

.content-main{
  padding-bottom: 46px;
  padding-top: 36px;
  width: 100vw;
  display: flex;
  justify-content: center;
}
.main_left{
  min-width: 260px;
}
.main_left_hide{
  min-width: 0px;
}
.fixed-bottom {
  position: fixed;
  bottom: 10px;
  width: 100%;
  z-index: 999;
  margin: 2px auto;
  max-width: 804px;
  left:calc(50vw + 120px);
  transform: translateX(-50%);
}
.fixed-bottom-hiden {
  position: fixed;
  bottom: 10px;
  width: 100%;
  z-index: 999;
  margin: 2px auto;
  max-width: 804px;
  left:calc(50vw);
  transform: translateX(-50%);
}
.btn_sent{
  margin-right: 4px;
  min-height: 54px;
}

.containt_txt{
  text-align: left;
  padding-left: 20px;
 }


.card_item{
  min-width: 300px;
  background-color: white;
  margin: 10px;
  /*padding: 50px 100px;*/
  border: 1px solid #fdfdfd;
  border-radius: 10px;
  box-shadow:
          0 2px 5px rgba(0,0,0,0.1),
          inset 0 1px 0 rgba(255,255,255,0.1);

}
.card_item_max{
  padding: 20px;
}
.card_item:hover{
  background-color: rgba(188,206,251,0.5);
  border: 1px solid rgb(198,190,238);
  box-shadow:
          0 2px 5px rgba(0,0,0,0.1),
          inset 0 1px 0 rgba(255,255,255,0.1);
}

.selected_box {
  position: relative; /* 让图标相对于这个元素定位 */
  background-color: rgb(188,206,251);
  color: darkblue;
  border: 1px solid rgb(198,190,238);
  box-shadow:
          0 2px 5px rgba(0,0,0,0.1),
          inset 0 1px 0 rgba(255,255,255,0.1);
}

.card_sense{
  margin-top: 150px;

}
.card_start{
  margin-top: 80px;
  font-size: 24px;
}
.selected-icon {
  position: absolute; /* 绝对定位 */
  top: 2px; /* 与顶部的距离 */
  right: 10px; /* 与右侧的距离 */
  font-size: 14px; /* 图标大小 */
  color: red; /* 图标颜色 */
}

.hidden {
  display: none;
}
.content-info{
  max-width:300px;
  float:right;
  /*background-color:rgba(0,0,0,0.8);*/
  font-size: 10px;
  color: rgb(0, 0, 0);
  text-align: right;
  padding-right: 5px;
  font-style: italic;
}
.btn_edit{
  color: white;
  box-sizing: border-box;
  transition: 0.2s ease-out;
  cursor: pointer;
  user-select: none;
  background: #409EFF;
  border: 0px solid rgba(0, 0, 0, 0);
  padding: 4px 10px;
  font-size: 14px;
  border-radius: 0.15rem 0.15rem;
  float: right;
  margin-left: 8px;
  line-height: 20px;
}
/* 表格的样式 */
::v-deep  table {
  width: 100%; /* 表格宽度为100% */
  border-collapse: collapse; /* 边框合并为一个 */
}


/* 表头的样式 */
::v-deep  th {
  background-color: #f2f2f2; /* 背景颜色为浅灰色 */
  color: black; /* 文字颜色为黑色 */
  padding: 8px; /* 内边距为8像素 */
}

/* 表格行的样式 */
::v-deep  tr:nth-child(even) {
  background-color: #f2f2f2; /* 偶数行的背景颜色为浅灰色 */
}


::v-deep  pre {
  background-color: rgba(0,0,0,0.7);  /* 设置背景颜色 */
  padding: 10px;  /* 设置内边距 */
  font-family: 'Courier New', monospace;  /* 设置字体 */
  overflow: auto;  /* 如果内容超出容器，出现滚动条 */
  text-align: left;
  color: white;
  margin-bottom: 6px;
}
::v-deep  p{
    text-align: left;
  }
::v-deep  li{
  text-align: left;
  margin: 0 20px;
  min-height: 36px;
}

::v-deep  ul{
  padding: 10px; /* 内边距 */
  background-color: #fafafa; /* 背景色 */
  /*border-bottom: 1px solid #ccc; !* 底部边框 *!*/
  /*border-top: 1px solid #ccc; !* 底部边框 *!*/
  list-style-type: square; /* 可以是 circle、disc、square、decimal、lower-roman、upper-roman 等 */
}
::v-deep  ol{
  padding: 10px; /* 内边距 */
  background-color: #f8f8f8; /* 背景色 */
  /*border-bottom: 1px solid #ccc; !* 底部边框 *!*/
  /*border-top: 1px solid #ccc; !* 底部边框 *!*/
  list-style-type: decimal; /* 可以是 circle、disc、square、decimal、lower-roman、upper-roman 等 */
}

/* 未访问链接的样式 */
::v-deep  a:link {
  color: black;
  text-decoration: underline;
  font-size: 16px;
}

/* 已访问链接的样式，与未访问链接相同 */
::v-deep  a:visited {
  color: black;
  text-decoration: underline;
  font-size: 16px;
}
::v-deep  .el-textarea{
  /*padding-left: 25px;*/
  margin-left: 2px;
}

</style>
