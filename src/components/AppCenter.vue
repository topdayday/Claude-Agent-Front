<template>
<div class="content-main">
  <div class="" v-if="showIndexContent">
      <span class="card_sense" ></span>
          <div  class="card_contains">

            <div  v-bind:class="{selected_box:model_type===0, card_item:true, card_item_max:isHidden }"  @click="selectType(0)">
              <i v-if="model_type===0" class="selected-icon">✓已选</i>
              <h4 class="gmat-headline-4 gradient gradient-1">Claude 2.1</h4>
              <div  v-bind:class="{ hidden: isHidden }">
                <div class="containt_txt">由Anthropic开发,更快更强大的模型，可以处理一系列任务，包括对话、文本分析、摘要和文档理解.</div>
                <h4  class="containt_txt">适用场景:</h4>
                <ul style="background-color: rgba(255, 255, 255, 0.0);border: 0px;">
                  <li> 高性能</li>
                  <li> 低延迟</li>
                  <li> 轻量级对话</li>
                  <li> 辅助编码</li>
                  <li> 适度的内容生成</li>
                </ul>
              </div>
            </div>
            <div  v-bind:class="{selected_box:model_type===10, card_item:true, card_item_max:isHidden }"  @click="selectType(10)">
              <i v-if="model_type===10" class="selected-icon">✓已选</i>
              <h4 class="gmat-headline-4 gradient gradient-1">Llama2 70b</h4>
              <div  v-bind:class="{ hidden: isHidden }">
                <div class="containt_txt">LLAMA2 采用了自回归 Transformer 预训练方法，并在数据预训练方面进行了一系列优化，大大提高性能.</div>
                <h4 class="containt_txt">适用场景:</h4>
                <ul style="background-color: rgba(255, 255, 255, 0.0);border: 0px;">
                  <li> 复杂的推理</li>
                  <li> 丰富的创造力</li>
                  <li> 深思熟虑的对话</li>
                  <li> 高质量编码</li>
                  <li> 详细的内容生成</li>
                </ul>
              </div>
            </div>
            <div  v-bind:class="{selected_box:model_type===2, card_item:true, card_item_max:isHidden }"  @click="selectType(2)">
              <i v-if="model_type===2" class="selected-icon">✓已选</i>
              <h4 class="gmat-headline-4 gradient gradient-1">Gemini Pro</h4>
              <div  v-bind:class="{ hidden: isHidden }">
                <div class="containt_txt">由Google AI开发，拥有2800亿个参数，在147种语言上进行了训练，可以执行各种任务.</div>
                <h4 class="containt_txt">适用场景:</h4>
                <ul style="background-color: rgba(255, 255, 255, 0.0);border: 0px;">
                  <li> 机器翻译</li>
                  <li> 文本翻译</li>
                  <li> 代码生成</li>
                  <li> 数据分析</li>
                  <li> 信息检索</li>
                </ul>
              </div>
            </div>
      </div>
      <h1 class="card_start" >让我们开始新的探索吧！</h1>
    </div>
  <div class="content-warp">
    <div class="content" v-for="(item, index) in content_his" :key="index" :id="'content_'+item.id">
      <button @click="delConversation(item.id)" v-if="editable" class="btn_edit">删除</button>
      <button @click="handleCopyConversation(item.id)" v-if="editable" class="btn_edit">复制</button>
      <div class="content-human-warp">
        <div class="content-human-icon" v-if="!isHidden">
          <div class="circle"><span style="margin-left: -3px;"   @click="installCopyCode(item.id)">你</span></div>
        </div>
        <div class="content-human">
          <div>{{item.content_in}}</div>
        </div>
      </div>

      <div class="content-assistant-warp">
        <div class="content-assistant-icon"  v-if="!isHidden"  @click="installCopyCode(item.id)">
          <svg width="22" height="22" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.54 2H9.09l4.46 12H16L11.54 2ZM4.46 2 0 14h2.5l.9-2.52h4.68L8.99 14h2.5L7.02 2H4.46Zm-.24 7.25 1.52-4.22 1.53 4.22H4.22Z"></path></svg>
        </div>
        <div class="content-assistant">
          <div :id="item.id"  v-html="item.content_out"></div>
        </div>
      </div>
    </div>
  </div>
  <div class="fixed-bottom" v-on:keydown.ctrl.enter="sendMessage">
    <div  v-bind:class="{ send_message:true, send_message_min: !isHidden }">
      <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 100}"
              placeholder="按下 Ctrl+Enter 提交,请输入你想知道的..."
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
    session_id: String,selectedModel:Number
  },
  comments:{

  },

  data(){
    return{
      content_his:[],
      content_in:'',
      sent_status: 0,
      model_type:0,
      isHidden: false, // 初始状态，可以根据需要设置
      editable:false,
      windowWidth: window.innerWidth // 获取初始窗口宽度
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
    // 监听窗口大小变化事件
    window.addEventListener('resize', this.handleResize);
    // 初始检查窗口宽度
    this.checkWidth();
  },
  beforeDestroy() {
    // 在组件销毁前移除事件监听，避免内存泄漏
    window.removeEventListener('resize', this.handleResize);
  },
  methods:{
    load_model_type(){
      let local_model_type=localStorage.getItem('model_type')
      if(local_model_type){
        this.model_type=Number(local_model_type);
      }else{
        this.model_type=0;
      }
    },
    handleResize() {
      // 当窗口大小变化时更新窗口宽度，并检查是否需要隐藏 div
      this.windowWidth = window.innerWidth;
      this.checkWidth();
    },
    checkWidth() {
      // 检查当前窗口宽度是否小于 500px，并更新 isHidden 的值
      this.isHidden = this.windowWidth < 1300;
    },
    currentSession() {
      let token=localStorage.getItem('token');
      let session_id=localStorage.getItem('session_id');
      list_session(token,session_id).then(data => {
        this.editable=false;
        this.content_his= data;
        this.scrollToBottom();
      }) .catch(error => {
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
      let { innerText } = Array.from(children)[3]
      this.copyToClipboard(innerText)
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
  /*max-width: 780px;*/
  background-color: #fdfdfd;
  text-align: left;
  padding-bottom: 10px;
  padding-top: 5px;
  overflow-x: auto;
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
  width: 100vw;
  overflow-x: auto;
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
}
.fixed-bottom {
  position: fixed;
  bottom: 10px;
  width: 100%;
  z-index: 999;
  margin: 2px auto;
  max-width: 804px;
  left: 50%;
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

.card_contains{
  display: flex;
  justify-content:center;
  padding: 0px 50px;
  margin-top:50px;
}
.card_item{
  max-width: 400px;
  background-color: white;
  margin: 20px;
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
  font-size: 26px;
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
