<template>
  <div class="content-main">
    <div v-bind:class="{ main_left: showLeftMenu, main_left_hide: !showLeftMenu }" v-if="!smallWidth"></div>
    <div class="main-right-card" v-if="showIndexContent" v-loading="loading">
      <div class="card_contains">
        <div v-for="model in llmsModelInfo" :key="model.modelId"
          v-bind:class="{ selected_box: model_type === model.modelId, card_item: true, }"
          @click="selectType(model.modelId)">
          <i v-if="model_type === model.modelId" class="selected-icon">✓已选</i>
          <h4 class="gmat-headline-4 gradient gradient-1">{{ model.name }}</h4>
        </div>
      </div>
    </div>
    <div class="content-warp" v-if="!showIndexContent" v-loading="loading">
      <el-collapse v-model="activeNames" style="width: 100%;">
        <el-collapse-item v-for="(item, index) in content_his" :key="index" :id="'content_' + item.id" :name="item.id"
          style="padding: 6px;" :title="showInfo(item.model_type, item.create_time)">
          <div class="button-wrapper">
            <button @click="delConversation(item.id)" v-if="editable && index > 0" class="btn_edit">删除对话</button>
            <button @click="handleCopyConversation(item.id)" v-if="editable" class="btn_edit">复制对话</button>
          </div>
          <div class="content-human-warp">
            <div class="content-human-icon" v-if="!smallWidth">
              <div class="circle"><span style="margin-left: -1px;" @click="installCopyCode(item.id)"><svg width="18"
                    height="18" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"
                    class="shrink-0 group">
                    <path class="group-hover:-translate-x-[0.5px] transition group-active:translate-x-0"
                      fill-rule="evenodd" clip-rule="evenodd"
                      d="M9 2C5.96243 2 3.5 4.46243 3.5 7.5C3.5 8.66827 3.86369 9.75009 4.48403 10.6404C4.6225 10.8391 4.59862 11.1085 4.42735 11.2798L2.70711 13H9C12.0376 13 14.5 10.5376 14.5 7.5C14.5 4.46243 12.0376 2 9 2ZM2.5 7.5C2.5 3.91015 5.41015 1 9 1C12.5898 1 15.5 3.91015 15.5 7.5C15.5 11.0899 12.5898 14 9 14H1.5C1.29777 14 1.11545 13.8782 1.03806 13.6913C0.960669 13.5045 1.00345 13.2894 1.14645 13.1464L3.43405 10.8588C2.84122 9.87838 2.5 8.72844 2.5 7.5Z">
                    </path>
                    <path class="group-hover:translate-x-[0.5px] transition group-active:translate-x-0"
                      fill-rule="evenodd" clip-rule="evenodd"
                      d="M16.2996 9.64015C16.5527 9.52951 16.8474 9.64493 16.9581 9.89794C17.0204 10.0405 17.0778 10.1857 17.13 10.3334C17.3698 11.0117 17.5 11.7412 17.5 12.5C17.5 13.7284 17.1588 14.8784 16.5659 15.8588L18.8535 18.1464C18.9965 18.2894 19.0393 18.5045 18.9619 18.6913C18.8845 18.8782 18.7022 19 18.5 19H11C8.59344 19 6.493 17.6919 5.36988 15.7504C5.23161 15.5113 5.31329 15.2055 5.55232 15.0672C5.79135 14.9289 6.09721 15.0106 6.23548 15.2496C7.18721 16.8949 8.96484 18 11 18H17.2929L15.5726 16.2798C15.4014 16.1085 15.3775 15.8391 15.516 15.6404C16.1363 14.7501 16.5 13.6683 16.5 12.5C16.5 11.8563 16.3896 11.2394 16.1872 10.6666C16.143 10.5418 16.0946 10.4191 16.0419 10.2986C15.9312 10.0456 16.0466 9.75079 16.2996 9.64015Z">
                    </path>
                  </svg></span></div>
            </div>
            <div class="content-human">
              <div style="margin-bottom: 10px;" v-for="(content_in, index) in splitContent(item.content_in)"
                :key="index">
                {{ content_in }}
              </div>

              <div class="content-info" style="text-align: left;float: left;">
                <div class="attachments-display">
                  <span class="attachment-item-display" v-for="(attachement, i) in getAttachments(item.id)" :key="i"
                    @click="downloadAttachmentAction(attachement.id,attachement.file_name,attachement.mime_type)">
                    <i class="el-icon-paperclip"></i>
                    {{ attachement.file_name }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="content-assistant-warp">
            <div class="content-assistant-icon" v-if="!smallWidth" @click="installCopyCode(item.id)">
              <svg width="22" height="22" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M11.54 2H9.09l4.46 12H16L11.54 2ZM4.46 2 0 14h2.5l.9-2.52h4.68L8.99 14h2.5L7.02 2H4.46Zm-.24 7.25 1.52-4.22 1.53 4.22H4.22Z">
                </path>
              </svg>
            </div>

            <div class="content-assistant">
              <div v-if="item.reason_out" v-html="md.render(item.reason_out)" :id="item.id + '_reason'"></div>
              <div v-if="item.content_out" v-html="md.render(item.content_out)" :id="item.id"></div>
              <!-- <div class="content-info">{{showInfo(item.model_type,item.create_time)}}</div> -->
            </div>
          </div>

        </el-collapse-item>
      </el-collapse>

    </div>
    <div :class="(smallWidth || !showLeftMenu) ? 'fixed-bottom-hiden' : 'fixed-bottom'"
      v-on:keydown.ctrl.enter="sendMessage" v-if="scrollBottom || showScrollHeight">
      <div v-bind:class="{ send_message: true, send_message_min: !smallWidth }"
        style="border: 2px #fb7750  solid;background-color:#fff;">
        <!-- 附件显示区域 -->
        <div v-if="attachments.length > 0" class="attachments-preview">
          <div v-for="(file, index) in attachments" :key="index" class="attachment-item">
            <span class="attachment-name">{{ file.name }}</span>
            <span class="attachment-size">({{ formatFileSize(file.size) }})</span>
            <i class="el-icon-close attachment-remove" @click="removeAttachment(index)"></i>
          </div>
        </div>

        <div class="input-container">
          <!-- 附件上传按钮 -->
          <div class="upload-container" v-if="model_type === 1 || model_type === 2">
            <input type="file" ref="fileInput" @change="handleFileSelect" multiple accept="*/*"
              style="display: none;" />
            <el-button class="btn_attachment" @click="$refs.fileInput.click()" :disabled="sent_status == 1"
              icon="el-icon-paperclip" size="small" circle title="上传附件"></el-button>
          </div>
          <el-input autofocus=true type="textarea" ref="textarea_in" :autosize="{ minRows: 2, maxRows: 20 }"
            placeholder="按下Ctrl+Enter提交..." v-model="content_in">
          </el-input>
          <!-- 自定义清空按钮 -->
          <i v-if="content_in" class="el-icon-circle-close clear-btn" @click="clearContent"></i>
        </div>

        <el-button :disabled="sent_status == 1" class="btn_sent" type="primary" @click="sendMessage()"
          style="border: none;margin:0;border-radius:0px;">
          {{ sent_status == 1 ? '发送中...' : '发送' }}
        </el-button>
      </div>
    </div>

  </div>
</template>

<script>
import { list_session } from '@/utils/request.js';
import { assistant } from '@/utils/request.js';
import { del_conversation, assistant_with_attachments, downloadAttachment } from '@/utils/request';
import MarkdownIt from 'markdown-it';
import mditHighlightjs from 'markdown-it-highlightjs';
import 'highlight.js/styles/default.css';
// import 'highlight.js/styles/github.css';
// import 'highlight.js/styles/dark.css';
// import 'highlight.js/styles/vs.css';



export default {
  name: 'AppCenter',
  props: {
    session_id: String, selectedModel: Number, smallWidth: Boolean, showLeftMenu: Boolean, llmsModelInfo: Array, editable: Boolean,
  },
  comments: {

  },

  data() {
    return {
      content_his: [],
      attachments_his: [],
      content_in: '',
      sent_status: 0,
      model_type: 0,
      // editable:false,
      loading: false,
      showScrollHeight: false,
      scrollBottom: false,
      activeNames: [],
      attachments: [], // 附件列表
      md: new MarkdownIt()
        .use(mditHighlightjs, {
          // highlight.js 的可选配置:
          auto: true,         // 自动检测语言 (如果围栏代码块没有指定语言)
          code: true,         // 是否包装代码块 (默认 true)
          // register: { languageName: function }, // 注册自定义语言
          // inline: false,   // 是否高亮行内代码 `code` (通常不需要，除非你有特定需求)
          // hljs: hljs // 可以传入自定义的 hljs 实例
        }),
      timer: null,

    }
  },
  created() {
    this.currentSession();
    this.load_model_type();
    window.addEventListener('resize', this.checkScrollBottom);
    window.addEventListener('scroll', this.checkScrollBottom);
  },

  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    window.removeEventListener('resize', this.checkScrollBottom);
    window.removeEventListener('scroll', this.checkScrollBottom);
  },
  watch: {
    session_id() {
      this.currentSession()
    },
    selectedModel(selectedModel) {
      this.selectType(selectedModel);
    },
    model_type(model_type) {
      this.$emit('selectModel', model_type)
    },
    content_his(val) {
      this.activeNames = [];
      let showIndexContent = (!val) || val.length === 0;
      if (showIndexContent) {
        this.showScrollHeight = showIndexContent
        this.$forceUpdate()
        return
      }
      // val.forEach(item=>{ 
      //   this.activeNames.push(item.id);
      // })
      if (val.length > 0) {
        this.activeNames.push(val[val.length - 1].id);
      }
      this.$nextTick(() => {
        let showScrollHeight = document.body.scrollHeight < document.documentElement.clientHeight;
        this.showScrollHeight = showScrollHeight
        this.$forceUpdate()
      })
      setTimeout(() => {
        this.scrollToBottom();
      }, 500);
    }
  },
  computed: {
    showIndexContent() {
      let showIndexContent = !this.content_his || this.content_his.length === 0;
      return showIndexContent
    },
  },
  mounted() {
  },

  methods: {
    downloadAttachmentAction(id,file_name,mime_type) {
      downloadAttachment(id,file_name,mime_type);
    },
    getAttachments(conversationId) {
      return this.attachments_his.filter(item => item.conversation_id = conversationId)
    },
    changeEditable(editable) {
      this.$emit('update:editable', editable);
    },
    checkScrollBottom() {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const documentHeight = document.documentElement.scrollHeight;
      if (scrollTop + windowHeight >= documentHeight - 20) {
        this.scrollBottom = true;
      } else {
        this.scrollBottom = false;
      }
    },

    scrollToBottom() {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    },
    clearContent() {
      this.content_in = "";
      this.$nextTick(() => {
        this.$refs.textarea_in.focus(); // 清空后自动聚焦
      });
    },
    splitContent(content) {
      if (content) {
        return content.split('<br>');
      } else {
        return [];
      }
    },
    showInfo(model_type, create_time) {
      let modelStr = '';
      let timeStr = '';
      if (create_time) {
        timeStr = (create_time + '').replace("T", " ")
      }
      if (model_type === -1) {
        modelStr = 'You'
      } else {
        this.llmsModelInfo.forEach(item => { if (item.modelId === model_type) { modelStr = item.name; } })
      }
      let timeInfo = modelStr + ' at:  ' + timeStr.slice(0, 19);
      return timeInfo;
    },
    load_model_type() {
      let local_model_type = localStorage.getItem('model_type')
      if (local_model_type) {
        this.model_type = Number(local_model_type);
      } else {
        this.model_type = 0;
      }
    },
    currentSession() {
      this.loading = true;
      this.scrollBottom = false
      let token = localStorage.getItem('token');
      let session_id = localStorage.getItem('session_id');
      list_session(token, session_id).then(data => {
        this.loading = false;
        this.changeEditable(false);
        this.content_his = data.data;
        this.attachments_his = data.attachments;

        if (this.content_his && this.content_his.length > 0) {
          let lastItem = this.content_his[this.content_his.length - 1];
          this.selectType(lastItem.model_type)
        }
        setTimeout(() => {
          this.scrollToBottom();
        }, 500);
      }).catch(error => {
        this.loading = false;
        console.error(error);
      });
    },

    refreshSession(token, session_id) {
      let oldLength = this.content_his.length;
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.timer = setInterval(() => {
        list_session(token, session_id).then(data => {
          if (data.length > oldLength) {
            this.currentSession();
            clearInterval(this.timer);
          }
        }).catch(error => {
          console.error(error);
        });
      }, 5000);
    },

    selectType(model_type) {
      this.model_type = model_type;
    },
    sendMessage() {
      if (this.sent_status === 1) {
        this.$notify({
          title: '提示',
          message: '请稍后再试...',
          type: 'warning'
        });
        return;
      }
      let token = localStorage.getItem('token');
      let session_id = localStorage.getItem('session_id');
      if (!token || !session_id) {
        this.$notify({
          title: '提示',
          message: '请先登录...',
          type: 'warning'
        });
        return;
      }
      if ((!this.content_in || this.content_in.trim().length === 0) && this.attachments.length === 0) {
        this.$notify({
          title: '提示',
          message: '请输入对话内容或上传附件...',
          type: 'warning'
        });
        return;
      }
      let local_model_type = localStorage.getItem('model_type')
      if (local_model_type) {
        this.model_type = Number(local_model_type);
      } else {
        this.model_type = 2;
      }
      this.sent_status = 1;
      this.loading = true;

      // 如果有附件，需要先上传附件
      if (this.attachments.length > 0) {
        assistant_with_attachments(token, session_id, this.content_in.trim(), this.model_type, this.attachments).then(data => {
          this.sent_status = 0;
          this.loading = false;
          if (data) {
            this.content_his.push(data);
            this.content_in = '';
            this.clearAttachments();
            if (this.content_his.length === 1) {
              this.$emit('addConversation', data);
              localStorage.setItem('session_id', session_id);
              this.$emit('update:session_id', session_id); // 发出事件通知父组件
            }
          } else {
            this.refreshSession(token, session_id);
          }
        }).catch(error => {
          this.loading = false;
          console.error(error);
          this.sent_status = 0;
        });
      } else {
        // 没有附件，直接发送文本消息
        assistant(token, session_id, this.content_in.trim(), this.model_type).then(data => {
          this.sent_status = 0;
          this.loading = false;
          if (data) {
            this.content_his.push(data);
            this.content_in = '';
            this.clearAttachments();
            if (this.content_his.length === 1) {
              this.$emit('addConversation', data);
              localStorage.setItem('session_id', session_id);
              this.$emit('update:session_id', session_id); // 发出事件通知父组件
            }
          } else {
            this.refreshSession(token, session_id);
          }
        }).catch(error => {
          this.loading = false;
          console.error(error);
          this.sent_status = 0;
        });
      }
    },

    delConversation(c_id) {
      this.$confirm('你确定要删除该对话吗？', '提示', {
        cancelButtonText: '退出',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        let token = localStorage.getItem('token');
        del_conversation(token, c_id).then(data => {
          if (data) {
            const div = document.querySelector('#content_' + c_id);
            if (div) {
              div.remove();
              this.$notify({
                title: '提示',
                message: '对话已删除！',
                type: 'success'
              });
            }
          }
        }).catch(error => {
          console.error(error);
        });
      }).catch(() => {
      });

    },
    installCopyCode(id) {
      if (this.editable) {
        this.changeEditable(false)
        const parent = document.getElementById(id);
        const btnCodes = document.querySelectorAll(".btn-code");
        for (const btnCode of btnCodes) {
          btnCode.parentElement.removeChild(btnCode);
        }
        parent.removeAttribute('showCopy');
        return;
      }
      const parent = document.getElementById(id);
      if (parent.hasAttribute('showCopy')) {
        const btnCodes = document.querySelectorAll(".btn-code");
        for (const btnCode of btnCodes) {
          btnCode.parentElement.removeChild(btnCode);
        }
        parent.removeAttribute('showCopy');
        return;
      }
      // this.editable=true;
      this.changeEditable(true)
      const highlights = parent.querySelectorAll("pre")
      highlights.forEach(div => {
        const copy = document.createElement("button")
        copy.innerHTML = "复制代码"
        copy.style.cssText = `
        box-sizing: border-box;
        transition: 0.2s ease-out;
        cursor: pointer;
        user-select: none;
        font-size: 0.8em;
        border-radius: 0 0.15rem;
        line-height:20px;
        background-color: rgba(0,0,0,0.2)  ;
        border: 0px solid  rgba(0,0,0,0.5) ;
        color: #000;
        float: right;
        margin-right: 10px;
        margin-top: 4px;
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
      const parent = document.getElementById('content_' + id);
      const { children } = parent;
      let { innerText } = Array.from(children)[1]
      if (innerText == '复制对话') {
        let { innerText } = Array.from(children)[3]
        this.copyToClipboard(innerText)
      } else {
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
    },

    // 附件相关方法
    handleFileSelect(event) {
      const files = Array.from(event.target.files);
      if (files.length === 0) return;

      // 检查文件大小限制 (例如: 10MB)
      const maxSize = 10 * 1024 * 1024;
      const validFiles = files.filter(file => {
        if (file.size > maxSize) {
          this.$notify({
            title: '文件过大',
            message: `文件 "${file.name}" 超过10MB限制`,
            type: 'warning'
          });
          return false;
        }
        return true;
      });

      // 添加到附件列表
      this.attachments.push(...validFiles);

      // 清空input以便重复选择同一文件
      event.target.value = '';

      this.$notify({
        title: '附件已添加',
        message: `成功添加 ${validFiles.length} 个附件`,
        type: 'success'
      });
    },

    removeAttachment(index) {
      this.attachments.splice(index, 1);
      this.$notify({
        title: '附件已移除',
        message: '附件已从列表中移除',
        type: 'info'
      });
    },

    formatFileSize(bytes) {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    clearAttachments() {
      this.attachments = [];
    }

  },
}
</script>

<style scoped>
/* 自定义 loading 样式 */
::v-deep .el-loading-mask {
  background-color: rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2000;
}

::v-deep .el-loading-spinner {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
}

::v-deep .el-loading-spinner .circular {
  width: 42px;
  height: 42px;
  animation: loading-rotate 2s linear infinite;
}

::v-deep .el-loading-spinner .path {
  stroke: #fb7750;
  stroke-width: 3;
  stroke-dasharray: 90, 150;
  stroke-dashoffset: 0;
  animation: loading-dash 1.5s ease-in-out infinite;
}

@keyframes loading-rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes loading-dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -40px;
  }

  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -120px;
  }
}

.codehilite {
  display: flex;
  justify-content: flex-end;
}

.content-base {
  background-color: #fcfcfc;
  border: 1px solid #fdfdfd;
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
  box-shadow:
    0 2px 5px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  margin: auto;
  margin-bottom: 40px;
  padding: 10px 10px 10px 2px;
}

.content {
  composes: content-base;
  max-width: calc(100vw - 260px);
}

.content-small {
  composes: content-base;
  max-width: 96%;
}

.content-warp {
  padding: 0 4px;
  text-align: left;
  width: 98%;
}

.circle {
  width: 24px;
  height: 24px;
  background-color: rgb(0, 0, 0, 0.7);
  border-radius: 50%;
  color: white;
  padding-right: 2px;
  text-align: center;
  font-size: 16px;

}

.content-human-warp {
  display: flex;
  width: 100%;
}

.content-human-icon {
  width: 36px;
  margin-top: 5px;
}

.content-human {
  margin-left: 0px;
  background-color: #fdfdfd;
  text-align: left;
  padding-bottom: 10px;
  padding-top: 5px;
  overflow-x: auto;
  max-width: calc(100vw - 4px);
}

.content-assistant-warp {
  display: flex;
}

.content-assistant-icon {
  width: 36px;
  margin-top: 18px;
}

.content-assistant {
  margin: auto;
  background-color: #fcfcfc;
  border-top: 1px dotted #d4d4d4;
  flex: 1;
  overflow-x: auto;
  max-width: calc(100vw - 6px);
}

.send_message {
  display: flex;
  justify-content: center;
  align-items: center;

}

.send_message_min {
  margin-left: 10px;
}

.content-main {
  padding-bottom: 46px;
  padding-top: 36px;
  width: 100vw;
  display: flex;
}

.main_left {
  min-width: 260px;
  flex-shrink: 0;
}

.main_left_hide {
  min-width: 0px;
}

.fixed-bottom {
  position: fixed;
  bottom: 10px;
  width: 100%;
  z-index: 999;
  margin: 2px auto;
  max-width: 804px;
  left: calc(50vw + 120px);
  transform: translateX(-50%);
}

.fixed-bottom-hiden {
  position: fixed;
  bottom: 10px;
  width: 100%;
  z-index: 999;
  margin: 2px auto;
  max-width: 804px;
  left: calc(50vw);
  transform: translateX(-50%);
}

.containt_txt {
  text-align: left;
  padding-left: 20px;
}


.card_item {
  width: 150px;
  background-color: white;
  margin: 10px;
  /*padding: 50px 100px;*/
  border: 1px solid #dedede;
  border-radius: 10px;
  box-shadow:
    0 2px 5px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);

}

.card_item_max {
  padding: 20px;
}

.card_item:hover {
  background-color: rgba(188, 206, 251, 0.5);
  border: 1px solid rgb(198, 190, 238);
  box-shadow:
    0 2px 5px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.selected_box {
  position: relative;
  /* 让图标相对于这个元素定位 */
  background-color: rgba(0, 0, 0, .2);
  color: darkblue;
  border: 1px solid rgb(198, 190, 238);
  box-shadow:
    0 2px 5px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.card_sense {
  margin-top: 150px;

}

.card_start {
  margin-top: 80px;
  font-size: 24px;
}

.selected-icon {
  position: absolute;
  /* 绝对定位 */
  top: 2px;
  /* 与顶部的距离 */
  right: 10px;
  /* 与右侧的距离 */
  font-size: 14px;
  /* 图标大小 */
  color: red;
  /* 图标颜色 */
}

.hidden {
  display: none;
}

.content-info {
  max-width: 300px;
  float: right;
  /*background-color:rgba(0,0,0,0.8);*/
  font-size: 10px;
  color: rgb(0, 0, 0);
  text-align: right;
  padding-right: 5px;
  font-style: italic;
}

.btn_edit {
  box-sizing: border-box;
  transition: 0.2s ease-out;
  cursor: pointer;
  user-select: none;
  font-size: 14px;
  border-radius: 0.15rem 0.15rem;
  line-height: 20px;

  background-color: rgba(0, 0, 0, 0.2);
  border: 0px solid rgba(0, 0, 0, 0.5);
  color: #000;
  float: right;
  margin-right: 10px;
  margin-top: 4px;
}

.btn_sent {
  margin-right: 4px;
  min-height: 54px;
  background-color: #fb7750;
  border-color: #fb7750;
  color: #fff;
}

.btn_sent:hover,
.btn_sent:focus {
  background-color: #fb8d6d;
  border-color: #fb8d6d;
  color: #fff;
}

.main-right-card {
  width: 100%;
}

.card_contains {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
}



/* 未访问链接的样式 */
::v-deep a:link {
  color: black;
  text-decoration: underline;
  font-size: 16px;
}

/* 已访问链接的样式，与未访问链接相同 */
::v-deep a:visited {
  color: black;
  text-decoration: underline;
  font-size: 16px;
}

::v-deep .el-textarea {
  /*padding-left: 25px;*/
  margin-left: 2px;
}

::v-deep hr {
  /* 保持原有的样式 */
  display: block;
  margin-block-start: 0.5em;
  margin-block-end: 0.5em;
  margin-inline-start: auto;
  margin-inline-end: auto;
  unicode-bidi: isolate;
  overflow: hidden;

  /* 修改颜色和样式 */
  border-style: dotted;
  /* 改为虚线 */
  border-color: rgba(0, 0, 0, 0.1);
  /* 改为红色, 你可以替换成任何你想要的颜色 */
  border-width: 1px;
  /* 设置虚线的粗细，可以根据需要调整 */
}

::v-deep .el-textarea__inner {
  border: 0px #fb7750 solid;
}

::v-deep .el-textarea__inner:hover,
.el-textarea__inner:focus {
  border: 0px #fb7750 solid;
}

/* 外层容器（根据实际类名调整） */
::v-deep .el-textarea__inner {
  /* 确保滚动条可见 */
  overflow-y: auto !important;
}

/* 滚动条整体样式 */
::v-deep .el-textarea__inner::-webkit-scrollbar {
  width: 2px;
  /* 垂直滚动条宽度 */
  height: 8px;
  /* 水平滚动条高度（可选） */
}

/* 滚动条滑块 */
::v-deep .el-textarea__inner::-webkit-scrollbar-thumb {
  background: #f5f5f5;
  /* 滑块颜色 */
  border-radius: 4px;
  /* 圆角 */
}

/* 滚动条轨道 */
::v-deep .el-textarea__inner::-webkit-scrollbar-track {
  background: #ffffff;
  /* 轨道背景色 */
  border-radius: 4px;
  /* 圆角 */
}

.button-wrapper {
  display: flex;
  justify-content: right;
  gap: 8px;
  margin-top: 10px;
}

::v-deep table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
  display: block;
  overflow-x: auto;
  border: 0px solid #ddd;
}

::v-deep th,
::v-deep td {
  padding: 0.5rem;
  border: 1px solid #ddd;
}

::v-deep th {
  font-weight: bold;
  background-color: #f0f0f0;
  color: #444;
  text-align: center;
}

::v-deep tr:nth-child(even) {
  background-color: #f8f8f8;
}

/* 附件相关样式 */
.attachments-preview {
  padding: 8px 12px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  max-height: 120px;
  overflow-y: auto;
}

.attachment-item {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  margin: 2px 0;
  background-color: #fff;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 12px;
}

.attachment-name {
  flex: 1;
  color: #495057;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px;
}

.attachment-size {
  color: #6c757d;
  margin-left: 8px;
  font-size: 11px;
}

.attachment-remove {
  margin-left: 8px;
  cursor: pointer;
  color: #dc3545;
  font-size: 14px;
  padding: 2px;
}

.attachment-remove:hover {
  color: #c82333;
}

.input-container {
  display: flex;
  align-items: flex-end;
  flex: 1;
  position: relative;
}

.upload-container {
  margin-left: 8px;
  margin-bottom: 8px;
}

.btn_attachment {
  background-color: #6c757d !important;
  border-color: #6c757d !important;
  color: #fff !important;
  width: 32px !important;
  height: 32px !important;
  padding: 0 !important;
}

.btn_attachment:hover,
.btn_attachment:focus {
  background-color: #5a6268 !important;
  border-color: #545b62 !important;
}

.btn_attachment:disabled {
  background-color: #6c757d !important;
  border-color: #6c757d !important;
  opacity: 0.6 !important;
}

.clear-btn {
  position: absolute;
  right: 50px;
  bottom: 18px;
  cursor: pointer;
  color: #6c757d;
  font-size: 16px;
  z-index: 10;
}

.clear-btn:hover {
  color: #495057;
}

/* 附件显示样式 */
.attachments-display {
  display: flex;
  gap: 8px;
  margin-top: 5px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.attachments-display:hover {
  opacity: 0.8;
  transform: translateY(-1px);
}

.attachment-item-display {
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 3px;
  font-size: 12px;
  color: #666;
}

.attachment-item-display i {
  margin-right: 4px;
  font-size: 12px;
}
</style>
