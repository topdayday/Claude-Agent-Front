<template>
<div class="content-main">
  <div class="" v-if="showIndexContent">
      <span class="card_sense" >Cloud AI</span>
          <div  class="card_contains">
            <div  v-bind:class="{selected_box:model_type===2, card_item:true, card_item_max:isHidden }"  @click="selectType(2)">
              <i v-if="model_type===2" class="selected-icon">✓已选</i>
              <h3 class="gmat-headline-4 gradient gradient-1">Gemini Pro</h3>
              <div  v-bind:class="{ hidden: isHidden }">
                <div class="containt_txt">我们最强大的模型，擅长执行从复杂对话和创意内容生成到详细指导的广泛任务.</div>
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
            <div  v-bind:class="{selected_box:model_type===0, card_item:true, card_item_max:isHidden }"  @click="selectType(0)">
              <i v-if="model_type===0" class="selected-icon">✓已选</i>
              <h3 class="gmat-headline-4 gradient gradient-1">Claude</h3>
              <div  v-bind:class="{ hidden: isHidden }">
                <div class="containt_txt">更快、更便宜但仍然非常强大的模型，可以处理一系列任务，包括对话、文本分析、摘要和文档理解。</div>
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
            <div  v-bind:class="{selected_box:model_type===1, card_item:true, card_item_max:isHidden }"  @click="selectType(1)">
              <i v-if="model_type===1" class="selected-icon">✓已选</i>
              <h3 class="gmat-headline-4 gradient gradient-1">Claude Pro</h3>
              <div  v-bind:class="{ hidden: isHidden }">
                <div class="containt_txt">我们最强大的模型，擅长执行从复杂对话和创意内容生成到详细指导的广泛任务.</div>
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

      </div>
      <div><a target="#"  href="https://www.anthropic.com/product" class="product_price">产品与价格</a></div>
      <h1 class="card_start" >让我们开始新的探索吧！</h1>
    </div>
  <div class="content-warp">
    <div class="content" v-for="(item, index) in content_his" :key="index">
      <div class="content-human-warp">
        <div class="content-human-icon" v-if="!isHidden">
          <div class="circle">你</div>
        </div>
        <div class="content-human">
          <div v-html="item.content_in"></div>
        </div>
      </div>

      <div class="content-assistant-warp">
        <div class="content-assistant-icon"  v-if="!isHidden">
          <svg width="22" height="22" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M11.54 2H9.09l4.46 12H16L11.54 2ZM4.46 2 0 14h2.5l.9-2.52h4.68L8.99 14h2.5L7.02 2H4.46Zm-.24 7.25 1.52-4.22 1.53 4.22H4.22Z"></path></svg>
        </div>
        <div class="content-assistant">
          <div v-html="item.content_out"></div>
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
      <el-button  class="btn-sent" type="primary" :icon="sent_status_ico" @click="sendMessage()">发送</el-button>
    </div>
  </div>
</div>

</template>

<script>
import {list_session} from  '@/utils/request.js';
import {assistant} from  '@/utils/request.js';

export default {
  name: 'AppCenter',
  props: {
    session_id: String
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
      windowWidth: window.innerWidth // 获取初始窗口宽度
    }
  },
  created(){
    this.list_session();
    let local_model_type=localStorage.getItem('model_type')
    if(local_model_type){
      this.model_type=Number(local_model_type);
    }else{
      this.model_type=0;
      localStorage.setItem('model_type', 0);
    }
  },

  watch:{
    session_id(){
      this.list_session();
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
    handleResize() {
      // 当窗口大小变化时更新窗口宽度，并检查是否需要隐藏 div
      this.windowWidth = window.innerWidth;
      this.checkWidth();
    },
    checkWidth() {
      // 检查当前窗口宽度是否小于 500px，并更新 isHidden 的值
      this.isHidden = this.windowWidth < 1100;
    },
    list_session() {
      let token=localStorage.getItem('token');
      let session_id=localStorage.getItem('session_id');
      list_session(token,session_id).then(data => {
        this.content_his= data;
        this.scrollToBottom();
        console.log('captcha:',data);
      }) .catch(error => {
        console.error(error);
      });
    },
    selectType(model_type){
      this.model_type=model_type;
      localStorage.setItem('model_type', model_type)
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
        localStorage.setItem('model_type', 0);
      }
      this.sent_status = 1;
      assistant(token,session_id,this.content_in,this.model_type).then(data => {
        this.content_his.push(data)
        this.scrollToBottom();
        this.sent_status = 0;
        this.content_in='';
        console.log('captcha:',data);
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
  },
}
</script>

<style scoped>
.content{
  background-color: #fcfcfc;
  border: 1px solid #fdfdfd;
  box-shadow:
          0 2px 5px rgba(0,0,0,0.1),
          inset 0 1px 0 rgba(255,255,255,0.1);
  max-width: 780px;
  margin: auto;
  margin-bottom:40px;
  padding: 10px 10px 10px 2px;
}
.circle {
  width: 25px;
  height: 25px;
  background-color: black;
  border-radius: 50%;
  color: white;
  text-align: center;
  font-size: 16px;
  margin-left: 5px;

}

.content-human-warp{
  display: flex;
  width: 100%;
}
.content-human-icon {
  width: 36px;
  margin-top: 0px;
}
.content-human{
  margin-left:0px;
  /*max-width: 780px;*/
  background-color: #fdfdfd;
  text-align: left;
  padding-bottom: 10px;
  overflow-x: auto;
}
.content-assistant-warp{
  display: flex;
}
.content-assistant-icon {
  width: 36px;
  margin-top: 16px;
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
.btn-sent{
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
  display: none; /* 或者使用其他隐藏样式，如 visibility: hidden; */
}

::v-deep  pre {
  background-color: rgba(0,0,0,0.7);  /* 设置背景颜色 */
  padding: 10px;  /* 设置内边距 */
  font-family: 'Courier New', monospace;  /* 设置字体 */
  overflow: auto;  /* 如果内容超出容器，出现滚动条 */
  text-align: left;
  color: white;
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
