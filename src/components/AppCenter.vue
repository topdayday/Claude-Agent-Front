<template>
  <div class="content-main">
    <div v-bind:class="{ main_left: showLeftMenu, main_left_hide: !showLeftMenu }" v-if="!smallWidth"></div>
    <div class="main-right-card" v-if="showIndexContent" v-loading="loading"
      :element-loading-text="countdown > 0 ? `等待响应中... ${countdown}秒` : 'loading...'">
      <div class="model-selection-container">
        <div class="model-selection-header">
          <h2 class="selection-title">选择AI模型</h2>
          <p class="selection-subtitle">请选择一个AI模型开始对话</p>
        </div>
        <div class="model-cards-grid">
          <div v-for="model in llmsModelInfo" :key="model.modelId"
            :class="['model-card', { 'model-card--selected': model_type === model.modelId }]"
            @click="selectType(model.modelId)">
            <div class="model-card__content">
              <h3 v-if="model.multimodal >= 1" class="model-card__title">{{ model.name }}
              </h3>
              <h3 v-else class="model-card__title">{{ model.name }}</h3>
              <p class="model-card__description">{{ model.desc }}</p>
            </div>
            <div class="model-card__footer">
              <el-button class="model-card__status">
                {{ model_type === model.modelId ? '已选择' : '点击选择' }}
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div :class="showLeftMenu && (!smallWidth) ? 'content-warp-menu' : 'content-warp'" v-if="!showIndexContent"
      v-loading="loading" :element-loading-text="countdown > 0 ? `等待响应中... ${countdown}秒` : 'loading...'">
      <el-collapse v-model="activeNames" style="width: 100%;">
        <el-collapse-item v-for="(item, index) in content_his" :key="index" :id="'content_' + item.id" :name="item.id"
          style="padding: 6px;">
          <template slot="title">
            <div class="collapse-header">
              <span class="collapse-title">{{ showInfo(item.model_type, item.create_time) }}</span>
              <div class="header-actions">
                <el-button @click.stop="handleCopyConversation(item.id)" type="text" size="small"
                  class="header-btn delete-btn">
                  <i class="el-icon-document-copy"></i>
                </el-button>
                <el-button @click.stop="delConversation(item.id)" type="text" size="small"
                  class="header-btn delete-btn">
                  <i class="el-icon-delete"></i>
                </el-button>
              </div>
            </div>
          </template>
          <div class="content-human-warp">
            <div class="content-human-icon" v-if="!smallWidth">
              <div class="circle"><span style="margin-left: -1px;"><svg width="18" height="18" viewBox="0 0 20 20"
                    fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="shrink-0 group">
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
                    @click="downloadAttachmentAction(attachement.id, attachement.file_name, attachement.mime_type)">
                    <i class="el-icon-paperclip"></i>
                    {{ attachement.file_name }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="content-assistant-warp">
            <div class="content-assistant-icon" v-if="!smallWidth">
              <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M11.54 2H9.09l4.46 12H16L11.54 2ZM4.46 2 0 14h2.5l.9-2.52h4.68L8.99 14h2.5L7.02 2H4.46Zm-.24 7.25 1.52-4.22 1.53 4.22H4.22Z">
                </path>
              </svg>
            </div>

            <div class="content-assistant">
              <div v-if="item.reason_out" v-html="md.render(item.reason_out)" :id="item.id + '_reason'"></div>
              <div v-if="item.content_out" v-html="md.render(item.content_out)" :id="item.id"></div>
            </div>
          </div>

        </el-collapse-item>
      </el-collapse>

    </div>
    <!-- 收缩状态的小圆点 -->
    <div v-if="isInputCollapsed" :class="(smallWidth || !showLeftMenu) ? 'collapsed-dot-hiden' : 'collapsed-dot'"
      @click="toggleInputCollapse">
      <div class="dot-icon">
        <i class="el-icon-edit"></i>
      </div>
    </div>

    <!-- 完整的输入框 -->
    <div v-if="!isInputCollapsed" :class="(smallWidth || !showLeftMenu) ? 'fixed-bottom-hiden' : 'fixed-bottom'"
      v-on:keydown.ctrl.enter="sendMessage">
      <div class="gemini-input-container">
        <!-- 附件显示区域 -->
        <div v-if="attachments.length > 0" class="attachments-preview-gemini">
          <div v-for="(file, index) in attachments" :key="index" class="attachment-item-gemini">
            <div class="attachment-content">
              <i class="el-icon-paperclip attachment-icon"></i>
              <span class="attachment-name" v-if="!smallWidth">{{ file.name }}</span>
              <span class="attachment-name" v-else>{{ index + 1 }}</span>
              <span class="attachment-size" v-if="!smallWidth">({{ formatFileSize(file.size) }})</span>
            </div>
            <i class="el-icon-close attachment-remove" @click="removeAttachment(index)"></i>
          </div>
        </div>

        <div class="gemini-input-wrapper">
          <!-- 左侧按钮组 -->
          <div class="input-actions-left">
            <!-- 附件上传按钮 -->
            <div v-if="showAttachments(model_type)" class="action-button-wrapper">
              <input type="file" ref="fileInput" @change="handleFileSelect" multiple accept="*/*"
                style="display: none;" />
              <button class="gemini-action-btn" @click="$refs.fileInput.click()" :disabled="sent_status == 1"
                title="上传附件">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- 输入框 -->
          <div class="textarea-wrapper">
            <el-input autofocus=true type="textarea" ref="textarea_in" :autosize="{ minRows: 1, maxRows: 10 }"
              placeholder="输入消息..." v-model="content_in" class="gemini-textarea">
            </el-input>
            <!-- 清空按钮 -->
            <button v-if="content_in" class="clear-button" @click="clearContent" title="清空">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
              </svg>
            </button>
          </div>

          <!-- 发送按钮 -->
          <div class="send-button-wrapper">
            <button :disabled="sent_status == 1 || (!content_in.trim() && attachments.length === 0)"
              class="gemini-send-btn" @click="sendMessage()"
              :class="{ 'sending': sent_status == 1, 'disabled': !content_in.trim() && attachments.length === 0 }">
              <span v-if="sent_status == 1" class="sending-animation">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" class="loading-icon">
                  <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
                </svg>
              </span>
              <span v-else>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 固定在右下角的工具按钮（参考 collapsed-dot 定位） -->
    <div v-if="!isInputCollapsed" class="collapse-buttons-container">
      <div class="collapse-toggle-btn" @click="scrollToTop" title="回到顶部">
        <i class="el-icon-top"></i>
      </div>
      <div class="collapse-toggle-btn" @click="toggleInputCollapse" title="收缩输入框">
        <i class="el-icon-minus"></i>
      </div>
      <div class="collapse-toggle-btn" @click="scrollToBottom" title="滚动底部">
        <i class="el-icon-bottom"></i>
      </div>
    </div>

  </div>
</template>

<script>
import { list_session, del_conversation, assistant_with_attachments, downloadAttachment, assistant } from '@/utils/request';
import MarkdownIt from 'markdown-it';
import mditHighlightjs from 'markdown-it-highlightjs';
import 'highlight.js/styles/default.css';
import { generate_session } from "@/utils/request";
// import 'highlight.js/styles/github.css';
// import 'highlight.js/styles/dark.css';
// import 'highlight.js/styles/vs.css';



export default {
  name: 'AppCenter',
  props: {
    session_id: String, selectedModel: Number, smallWidth: Boolean, showLeftMenu: Boolean, llmsModelInfo: Array,
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
      loading: false,
      activeNames: [],
      attachments: [], // 附件列表
      isInputCollapsed: false, // 输入框收缩状态
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
      countdown: 0, // 倒计时秒数

    }
  },
  created() {
    this.currentSession();
    this.load_model_type();
  },

  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
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
      // 当模型类型改变时，重新绑定粘贴事件监听器
      this.$nextTick(() => {
        this.addPasteEventListener();
      });
    },
    // attachments_his(){
    //   setTimeout(() => {
    //        this.$forceUpdate()
    //       }, 500);
    // },
    content_his(val) {
      this.activeNames = [];
      let showIndexContent = (!val) || val.length === 0;
      if (showIndexContent) {
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
    // 监听DOM变化，为新生成的代码块添加复制按钮
    this.observeCodeBlocks();

    // 显示粘贴图片功能提示
    this.showPasteImageTip();

    // 手动添加粘贴事件监听器到输入框
    this.addPasteEventListener();
  },

  methods: {
    downloadAttachmentAction(id, file_name, mime_type) {
      downloadAttachment(id, file_name, mime_type);
    },
    getAttachments(conversationId) {
      return this.attachments_his.filter(item => item.conversation_id === conversationId)
    },



    scrollToBottom() {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    },
    scrollToTop() {
      window.scrollTo({
        top: 0,
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
      let token = localStorage.getItem('token');
      let session_id = localStorage.getItem('session_id');
      if(session_id==null){
        this.loading = false;
        return
      }
      list_session(token, session_id).then(data => {
        this.loading = false;
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
      this.countdown = 180; // 180秒倒计时

      if (this.timer) {
        clearInterval(this.timer);
      }

      this.timer = setInterval(() => {
        list_session(token, session_id).then(data => {
          if (data.data.length > oldLength) {
            this.loading = false;
            this.countdown = 0;
            this.currentSession();
            this.content_in = '';
            this.clearAttachments();
            clearInterval(this.timer);
          } else {
            this.countdown -= 5; // 每5秒减少5秒

            // 180秒后如果还没有新数据，关闭loading
            if (this.countdown <= 0) {
              this.loading = false;
              this.countdown = 0;
              clearInterval(this.timer);
              this.$notify({
                title: '提示',
                message: '响应超时，请重试',
                type: 'warning'
              });
            }
          }
        }).catch(error => {
          console.error(error);
          this.loading = false;
          this.countdown = 0;
          clearInterval(this.timer);
        });
      }, 5000);
    },

    selectType(model_type) {
      this.model_type = model_type;
    },

    async sendMessage() {
      if (this.sent_status === 1) {
        this.$notify({
          title: '提示',
          message: '请稍后再试...',
          type: 'warning'
        });
        return;
      }
      let token = localStorage.getItem('token');
      if (!token) {
        this.$notify({
          title: '提示',
          message: '请先登录...',
          type: 'warning'
        });
        return;
      }

      let session_id = localStorage.getItem('session_id');
      if(!session_id){
        try {
          session_id = await generate_session(token);
          localStorage.setItem('session_id', session_id);
          this.$emit('update:session_id', session_id);
        } catch (error) {
          console.error(error);
          return;
        }
      }
      token = localStorage.getItem('token');
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
          if (data) {
            this.loading = false;
            this.content_his.push(data.data);
            if (data.attachments && data.attachments.length > 0) {
              this.attachments_his.push(...data.attachments);
            }
            this.content_in = '';
            this.clearAttachments();
            if (this.content_his.length === 1) {
              this.$emit('addConversation', data.data);
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
          if (data) {
            this.loading = false;
            this.content_his.push(data.data);
            if (data.attachments && data.attachments.length > 0) {
              this.attachments_his.push(...data.attachments);
            }
            this.content_in = '';
            this.clearAttachments();
            if (this.content_his.length === 1) {
              this.$emit('addConversation', data.data);
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
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        let token = localStorage.getItem('token');
        del_conversation(token, c_id).then(data => {
          if (data) {
            this.content_his = this.content_his.filter(item => item.id !== c_id);
            if (this.content_his.length == 0) {
              this.$emit('update:session_id', null); // 发出事件通知父组件
            }
            // const div = document.querySelector('#content_' + c_id);
            // if (div) {
            //   div.remove();
            //   this.$notify({
            //     title: '提示',
            //     message: '对话已删除！',
            //     type: 'success'
            //   });
            // }
          }
        }).catch(error => {
          console.error(error);
        });
      }).catch(() => {
      });

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

    // 处理粘贴事件，支持图片粘贴
    handlePaste(event) {
      // 防止重复处理
      if (event._processed) {
        console.log('粘贴事件已被处理，跳过');
        return;
      }

      console.log('粘贴事件触发', event);
      console.log('剪贴板数据:', event.clipboardData);

      const items = event.clipboardData?.items;
      if (!items) {
        console.log('没有剪贴板数据');
        return;
      }

      console.log('剪贴板项目数量:', items.length);
      for (let i = 0; i < items.length; i++) {
        console.log(`项目 ${i}:`, items[i].type);
      }

      let hasImage = false;
      let processedImage = false;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];

        // 检查是否是图片类型
        if (item.type.indexOf('image') !== -1) {
          hasImage = true;
          const file = item.getAsFile();

          if (file && !processedImage) {
            try {
              // 为粘贴的图片生成文件名
              const timestamp = new Date().getTime();
              const extension = this.getImageExtension(file.type);
              const fileName = `screenshot_${timestamp}.${extension}`;

              // 创建新的File对象，包含文件名
              const renamedFile = new File([file], fileName, { type: file.type });

              // 检查文件大小
              const maxSize = 10 * 1024 * 1024;
              if (renamedFile.size > maxSize) {
                this.$notify({
                  title: '图片过大',
                  message: `粘贴的图片超过10MB限制，请压缩后重试`,
                  type: 'warning',
                  duration: 3000
                });
                return;
              }

              // 检查是否支持该图片格式
              if (!this.isSupportedImageType(file.type)) {
                this.$notify({
                  title: '不支持的图片格式',
                  message: `请使用 JPG、PNG、GIF、WebP 或 BMP 格式的图片`,
                  type: 'warning',
                  duration: 3000
                });
                return;
              }

              // 添加到附件列表
              this.attachments.push(renamedFile);

              // 阻止默认粘贴行为
              event.preventDefault();

              // 标记事件已被处理，防止重复触发
              event._processed = true;

              this.$notify({
                title: '截图已添加',
                message: `成功添加截图: ${fileName} (${this.formatFileSize(renamedFile.size)})`,
                type: 'success',
                duration: 2000
              });

              processedImage = true;

              // 只处理第一个图片，避免重复
              break;
            } catch (error) {
              console.error('处理粘贴图片时出错:', error);
              this.$notify({
                title: '处理失败',
                message: '粘贴图片时出现错误，请重试',
                type: 'error',
                duration: 3000
              });
            }
          }
        }
      }

      // 如果没有图片，允许正常的文本粘贴
      if (!hasImage) {
        return;
      }
    },

    // 检查是否支持该图片类型
    isSupportedImageType(mimeType) {
      const supportedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/bmp'
      ];
      return supportedTypes.includes(mimeType);
    },

    // 显示粘贴图片功能提示
    showPasteImageTip() {
      // 延迟显示提示，确保用户已经看到界面
      // setTimeout(() => {
      //   if (this.showAttachments(this.model_type)) {
      //     this.$notify({
      //       title: '新功能提示',
      //       message: '现在支持截图后直接粘贴图片了！按 Ctrl+V 即可粘贴截图',
      //       type: 'info',
      //       duration: 5000,
      //       showClose: true
      //     });
      //   }
      // }, 2000);
    },

    // 手动添加粘贴事件监听器
    addPasteEventListener() {
      this.$nextTick(() => {
        if (this.$refs.textarea_in) {
          const textareaElement = this.$refs.textarea_in.$el || this.$refs.textarea_in;
          if (textareaElement) {
            // 查找实际的 textarea 元素
            const textarea = textareaElement.querySelector('textarea') || textareaElement;
            if (textarea) {
              // 检查是否已经绑定了事件监听器
              if (textarea._pasteListenerBound) {
                console.log('粘贴事件监听器已存在，跳过重复绑定');
                return;
              }

              // 移除之前的事件监听器，避免重复绑定
              textarea.removeEventListener('paste', this.handlePaste);
              // 添加新的事件监听器
              textarea.addEventListener('paste', this.handlePaste);
              // 标记已绑定
              textarea._pasteListenerBound = true;

              console.log('粘贴事件监听器已添加');
              console.log('绑定的元素:', textarea);
              console.log('元素类型:', textarea.tagName);
            }
          }
        }

        // 移除全局粘贴事件监听器，避免重复触发
        // 只使用输入框的粘贴事件监听器
        document.removeEventListener('paste', this.handleGlobalPaste);
        console.log('已移除全局粘贴事件监听器，避免重复触发');
      });
    },

    // 全局粘贴事件处理（已移除，避免重复触发）
    // handleGlobalPaste(event) {
    //   // 检查当前焦点是否在输入框上
    //   const activeElement = document.activeElement;
    //   const isInTextarea = activeElement && (
    //     activeElement.tagName === 'TEXTAREA' || 
    //     activeElement.classList.contains('el-textarea__inner')
    //   );
    //   
    //   if (isInTextarea) {
    //     console.log('全局粘贴事件：焦点在输入框上，处理粘贴');
    //     this.handlePaste(event);
    //     // 标记事件已被处理，防止重复触发
    //     event._processed = true;
    //   } else {
    //     console.log('全局粘贴事件：焦点不在输入框上，忽略');
    //   }
    // },

    // 根据MIME类型获取图片扩展名
    getImageExtension(mimeType) {
      const extensions = {
        'image/jpeg': 'jpg',
        'image/jpg': 'jpg',
        'image/png': 'png',
        'image/gif': 'gif',
        'image/webp': 'webp',
        'image/bmp': 'bmp'
      };
      return extensions[mimeType] || 'png';
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
    },

    // 代码块复制功能相关方法
    observeCodeBlocks() {
      // 使用 MutationObserver 监听 DOM 变化
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                this.addCopyButtonsToCodeBlocks(node);
              }
            });
          }
        });
      });

      // 开始观察
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      // 为已存在的代码块添加复制按钮
      this.$nextTick(() => {
        this.addCopyButtonsToCodeBlocks(document.body);
      });
    },

    addCopyButtonsToCodeBlocks(container) {
      // 查找所有代码块
      const codeBlocks = container.querySelectorAll('pre code, .hljs');

      codeBlocks.forEach((codeBlock) => {
        // 避免重复添加按钮
        if (codeBlock.parentElement.querySelector('.code-copy-btn')) {
          return;
        }

        const pre = codeBlock.tagName === 'CODE' ? codeBlock.parentElement : codeBlock;

        // 确保是 pre 标签
        if (pre.tagName !== 'PRE') {
          return;
        }

        // 设置相对定位
        pre.style.position = 'relative';

        // 创建复制按钮
        const copyBtn = document.createElement('button');
        copyBtn.className = 'code-copy-btn';
        copyBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <span class="copy-text">复制</span>
        `;

        // 添加点击事件
        copyBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.copyCodeToClipboard(codeBlock, copyBtn);
        });

        // 将按钮添加到代码块容器
        pre.appendChild(copyBtn);
      });
    },

    copyCodeToClipboard(codeElement, button) {
      // 获取代码文本
      const codeText = codeElement.textContent || codeElement.innerText;

      // 使用现代 Clipboard API 或回退到旧方法
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(codeText).then(() => {
          this.showCopySuccess(button);
        }).catch(() => {
          this.fallbackCopyToClipboard(codeText, button);
        });
      } else {
        this.fallbackCopyToClipboard(codeText, button);
      }
    },

    fallbackCopyToClipboard(text, button) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand('copy');
        this.showCopySuccess(button);
      } catch (err) {
        console.error('复制失败:', err);
        this.$notify({
          title: '复制失败',
          message: '无法复制代码到剪贴板',
          type: 'error'
        });
      }

      document.body.removeChild(textArea);
    },

    showCopySuccess(button) {
      const originalHTML = button.innerHTML;
      button.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20,6 9,17 4,12"></polyline>
        </svg>
        <span class="copy-text">已复制</span>
      `;
      button.classList.add('copied');

      setTimeout(() => {
        button.innerHTML = originalHTML;
        button.classList.remove('copied');
      }, 2000);

      this.$notify({
        title: '复制成功',
        message: '代码已复制到剪贴板',
        type: 'success'
      });
    },

    // 切换输入框收缩状态
    toggleInputCollapse() {
      this.isInputCollapsed = !this.isInputCollapsed;

      // 如果展开输入框，自动聚焦到文本框
      if (!this.isInputCollapsed) {
        this.$nextTick(() => {
          if (this.$refs.textarea_in) {
            this.$refs.textarea_in.focus();
          }
        });
      }
    },

    showAttachments(model_type) {
      const model_info = this.llmsModelInfo.find(item => item.modelId === model_type);
      return model_info && model_info.multimodal > 0;
    },

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
  stroke: var(--color-primary);
  stroke-width: 3;
  stroke-dasharray: 90, 150;
  stroke-dashoffset: 0;
  animation: loading-dash 1.5s ease-in-out infinite;
}

::v-deep .el-loading-text {
  color: var(--color-primary);
  font-weight: 500;
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
  background-color: var(--color-panel);
  border: 1px solid var(--color-border);
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
  width: 96%;
}

.content-warp-menu {
  padding: 0 4px;
  text-align: left;
  width: calc((100vw - 260px) * 0.96);
}

.circle {
  width: 24px;
  height: 24px;
  background-color: var(--color-panel);
  border-radius: 50%;
  color: var(--color-text);
  padding-right: 2px;
  text-align: center;
  font-size: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 现代化对话气泡样式 */
.content-human-warp {
  display: flex;
  width: 100%;
  margin-bottom: 24px;
  align-items: flex-start;
  gap: 12px;
}

.content-human-icon {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 4px;
}

.content-human {
  flex: 1;
  background: var(--color-panel);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 16px 20px;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
  word-wrap: break-word;
  overflow-wrap: break-word;
  color: var(--color-text);
  font-weight: 500;
  /* Allow flex item to shrink and show horizontal scroll for wide content */
  min-width: 0;
  overflow-x: auto;
  max-width: 100%;
}

.content-human:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: var(--color-primary-weak-2);
}

/* 用户消息气泡尾巴 */
.content-human::before {
  content: '';
  position: absolute;
  left: -8px;
  top: 16px;
  width: 0;
  height: 0;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-right: 8px solid var(--color-panel);
  filter: drop-shadow(-1px 0 0 var(--color-border));
}

.content-assistant-warp {
  display: flex;
  width: 100%;
  margin-bottom: 24px;
  align-items: flex-start;
  gap: 12px;
}

.content-assistant-icon {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-panel);
  border-radius: 50%;
  color: var(--color-text);
  margin-top: 4px;
  box-shadow: 0 2px 8px rgba(251, 119, 80, 0.3);
}

.content-assistant {
  flex: 1;
  background: var(--color-panel);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 20px 24px;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
  word-wrap: break-word;
  overflow-wrap: break-word;
  color: var(--color-text);
  font-weight: 400;
  /* Allow flex item to shrink and show horizontal scroll for wide content */
  min-width: 0;
  overflow-x: auto;
  max-width: 100%;
}

.content-assistant:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: var(--color-primary-weak-2);
}

/* AI 回复气泡尾巴 */
.content-assistant::before {
  content: '';
  position: absolute;
  left: -8px;
  top: 16px;
  width: 0;
  height: 0;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-right: 8px solid var(--color-panel);
  filter: drop-shadow(-1px 0 0 var(--color-border));
}

/* Gemini 风格输入容器 */
.gemini-input-container {
  background: var(--color-panel);
  border-radius: 24px;
  border: 1px solid var(--color-border);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
  max-width: 100%;
}

.gemini-input-container:hover {
  border-color: var(--color-primary-weak-2);
  box-shadow: 0 4px 16px rgba(251, 119, 80, 0.12);
}

.gemini-input-container:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 4px 20px rgba(251, 119, 80, 0.2);
}

/* 附件预览区域 - Gemini 风格 */
.attachments-preview-gemini {
  padding: 12px 16px 8px 16px;
  border-bottom: 1px solid var(--color-border);
  background: rgba(251, 119, 80, 0.02);
}

.attachment-item-gemini {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  margin: 4px 0;
  background: var(--color-panel);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  font-size: 13px;
  transition: all 0.2s ease;
}

.attachment-item-gemini:hover {
  background: var(--color-primary-weak);
  border-color: var(--color-primary-weak-2);
  transform: translateY(-1px);
}

.attachment-content {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.attachment-icon {
  color: var(--color-primary);
  font-size: 14px;
}

.attachment-name {
  color: var(--color-text);
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.attachment-size {
  color: var(--color-text-secondary);
  font-size: 12px;
  margin-left: 4px;
}

.attachment-remove {
  color: #999;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.2s ease;
  font-size: 14px;
}

.attachment-remove:hover {
  color: #f56c6c;
  background: rgba(245, 108, 108, 0.1);
}

/* 输入框包装器 */
.gemini-input-wrapper {
  display: flex;
  align-items: flex-end;
  padding: 12px 16px;
  gap: 12px;
  min-height: 56px;
}

/* 左侧操作按钮 */
.input-actions-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-button-wrapper {
  display: flex;
  align-items: center;
}

.gemini-action-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  position: relative;
}

.gemini-action-btn:hover:not(:disabled) {
  background: var(--color-primary-weak);
  color: var(--color-primary);
  transform: scale(1.05);
}

.gemini-action-btn:active {
  transform: scale(0.95);
}

.gemini-action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 输入框区域 */
.textarea-wrapper {
  flex: 1;
  position: relative;
  min-width: 0;
}

.gemini-textarea {
  width: 100%;
}

.gemini-textarea ::v-deep .el-textarea__inner {
  border: none !important;
  background: transparent !important;
  padding: 8px 40px 8px 0 !important;
  font-size: 16px !important;
  line-height: 1.5 !important;
  resize: none !important;
  box-shadow: none !important;
  color: var(--color-text) !important;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
}

.gemini-textarea ::v-deep .el-textarea__inner:focus {
  border: none !important;
  box-shadow: none !important;
  outline: none !important;
}

.gemini-textarea ::v-deep .el-textarea__inner::placeholder {
  color: var(--color-text-secondary) !important;
  font-size: 16px !important;
}

/* 清空按钮 */
.clear-button {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: var(--color-text-secondary);
  color: var(--color-panel);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  opacity: 0.7;
}

.clear-button:hover {
  opacity: 1;
  background: var(--color-text);
  transform: translateY(-50%) scale(1.1);
}

/* 发送按钮 */
.send-button-wrapper {
  display: flex;
  align-items: center;
}

.gemini-send-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: var(--color-primary);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(251, 119, 80, 0.3);
  position: relative;
  overflow: hidden;
}

.gemini-send-btn:hover:not(:disabled):not(.disabled) {
  background: var(--color-primary-600);
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(251, 119, 80, 0.4);
}

.gemini-send-btn:active:not(:disabled):not(.disabled) {
  transform: scale(0.95);
}

.gemini-send-btn.disabled {
  background: var(--color-text-secondary);
  cursor: not-allowed;
  opacity: 0.5;
  box-shadow: none;
}

.gemini-send-btn.sending {
  background: var(--color-primary);
  cursor: not-allowed;
}

/* 发送按钮动画 */
.loading-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.sending-animation {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .gemini-input-wrapper {
    padding: 8px 12px;
    gap: 8px;
    min-height: 48px;
  }

  .gemini-action-btn,
  .gemini-send-btn {
    width: 36px;
    height: 36px;
  }

  .gemini-textarea ::v-deep .el-textarea__inner {
    font-size: 14px !important;
    padding: 6px 36px 6px 0 !important;
  }

  .attachments-preview-gemini {
    padding: 8px 12px 6px 12px;
  }

  .attachment-item-gemini {
    padding: 6px 10px;
    font-size: 12px;
  }
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
  padding-top: 46px;
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

/* 收缩状态的小圆点样式 */
.collapsed-dot {
  position: fixed;
  bottom: 20px;
  right: 30px;
  z-index: 1000;
  cursor: pointer;
  transition: all 0.3s ease;
}

.collapsed-dot-hiden {
  position: fixed;
  bottom: 20px;
  right: 30px;
  z-index: 1000;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-300));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  box-shadow: 0 4px 12px rgba(251, 119, 80, 0.4);
  transition: all 0.3s ease;
  opacity: 0.8;
}

.dot-icon:hover {
  opacity: 1;
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

/* 收缩按钮样式 */
.collapse-toggle-btn {
  position: absolute;
  top: -35px;
  right: 10px;
  width: 30px;
  height: 30px;
  background: var(--color-primary-weak-4);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  z-index: 1001;
  opacity: 0.5;
}

.collapse-toggle-btn:hover {
  opacity: 1;
  transform: scale(1.1);
  background: var(--color-primary);
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
  border: 1px solid #eee;
}

/* 多模态徽章基础样式 */
.multimodal-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  transition: all 0.3s ease;
  z-index: 10;
  cursor: pointer;
}

/* 多模态样式 (multimodal >= 1) */
.multimodal-badge--multimodal {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  border: 1px solid rgba(76, 175, 80, 0.3);
}

.multimodal-badge--multimodal:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
  background: linear-gradient(135deg, #45a049 0%, #388e3c 100%);
}

.multimodal-badge--multimodal .multimodal-icon {
  color: rgba(255, 255, 255, 0.95);
}

/* 多轮对话样式 (multimodal < 1) */
.multimodal-badge--conversation {
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
  border: 1px solid rgba(33, 150, 243, 0.3);
}

.multimodal-badge--conversation:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.4);
  background: linear-gradient(135deg, #1976D2 0%, #1565C0 100%);
}

.multimodal-badge--conversation .multimodal-icon {
  color: rgba(255, 255, 255, 0.95);
}

/* 深色主题下的多模态徽章优化 */
:root[data-theme="dark"] .multimodal-badge--multimodal {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  border: 1px solid rgba(76, 175, 80, 0.4);
}

:root[data-theme="dark"] .multimodal-badge--multimodal:hover {
  background: linear-gradient(135deg, #45a049 0%, #388e3c 100%);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.5);
}

:root[data-theme="dark"] .multimodal-badge--conversation {
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
  border: 1px solid rgba(33, 150, 243, 0.4);
}

:root[data-theme="dark"] .multimodal-badge--conversation:hover {
  background: linear-gradient(135deg, #1976D2 0%, #1565C0 100%);
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.5);
}

.multimodal-icon {
  width: 14px;
  height: 14px;
  opacity: 0.9;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
  transition: all 0.2s ease;
}

.multimodal-text {
  white-space: nowrap;
  letter-spacing: 0.3px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  font-weight: 600;
}

/* 确保模型卡片有相对定位以支持绝对定位的徽章 */
.model-card {
  position: relative;
}

/* 调整模型卡片头部样式以适应徽章 */
.model-card__header {
  position: relative;
  padding-right: 80px;
  /* 为徽章留出空间 */
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
  background-color: rgba(251, 119, 80, 0.5);
  border-color: var(--color-primary);
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

/* 新的模型选择容器样式 */
.model-selection-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 40px 20px;
  background: var(--color-bg);
}

.model-selection-header {
  text-align: center;
  margin-bottom: 48px;
}

.selection-title {
  font-size: 32px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 12px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.selection-subtitle {
  font-size: 16px;
  color: #64748b;
  margin: 0;
  font-weight: 400;
}

.model-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  max-width: 1200px;
  width: 100%;
}

.model-card {
  background: var(--color-panel);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 2px solid var(--color-border);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.model-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.model-card:hover::before,
.model-card--selected::before {
  opacity: 1;
}

.model-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.model-card--selected {
  background: var(--color-panel);
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(251, 119, 80, 0.1), 0 4px 6px -2px rgba(251, 119, 80, 0.05);
}

.model-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.model-card__icon {
  width: 48px;
  height: 48px;
  background: var(--color-primary-weak-4);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.model-card__check {
  width: 24px;
  height: 24px;
  background: #10b981;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}



.model-card__description {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.model-card__status {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-primary);
  padding: 8px 16px;
  background: var(--color-primary-weak);
  border-radius: 20px;
}

.model-card--selected .model-card__status {
  background: var(--color-border);
  color: var(--color-text);
}

/* 折叠面板头部样式 */
.collapse-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-right: 10px;
  border-bottom: 1px solid var(--color-border);
}

.collapse-title {
  flex: 1;
  font-size: 14px;
  color: var(--color-text);
}

.header-actions {
  display: flex;
  gap: 2px;
  opacity: 1;
}

.header-btn {
  padding: 6px 12px !important;
  font-size: 12px !important;
  height: 28px !important;
  line-height: 1.2 !important;
  border-radius: 4px !important;
  border: 1px solid #dcdfe6 !important;
  background-color: var(--color-panel) !important;
  color: #606266 !important;
  transition: all 0.2s ease !important;
}

.header-btn:hover {
  background-color: #f5f7fa !important;
  border-color: #c0c4cc !important;
  color: #409eff !important;
}

.header-btn.copy-btn:hover {
  background-color: #e8f4fd !important;
  border-color: #409eff !important;
  color: #409eff !important;
}

.header-btn.delete-btn:hover {
  background-color: #fef0f0 !important;
  border-color: #f56c6c !important;
  color: #f56c6c !important;
}

/* 代码复制按钮样式 */
.code-copy-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: var(--color-primary-weak);
  border: 1px solid var(--color-primary-weak-2);
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 12px;
  color: var(--color-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(8px);
  z-index: 10;
  opacity: 0;
  transform: translateY(-4px) scale(0.95);
  box-shadow: 0 2px 8px rgba(251, 119, 80, 0.1);
}

.code-copy-btn:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
  transform: translateY(0) scale(1);
  box-shadow: 0 4px 12px rgba(251, 119, 80, 0.3);
}

.code-copy-btn.copied {
  background: rgba(16, 185, 129, 0.15);
  border-color: #10b981;
  color: #10b981;
  transform: translateY(0) scale(1);
}

.code-copy-btn .copy-text {
  font-size: 11px;
  font-weight: 500;
}

/* 当鼠标悬停在代码块上时显示复制按钮 */
pre:hover .code-copy-btn {
  opacity: 1;
}

/* 代码块基础样式优化 */
pre {
  position: relative;
  background: #f6f8fa;
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  padding: 16px;
  margin: 16px 0;
  overflow-x: auto;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 14px;
  line-height: 1.45;
}

pre code {
  background: transparent;
  border: none;
  padding: 0;
  font-size: inherit;
  color: inherit;
  white-space: pre;
  word-break: normal;
  word-wrap: normal;
}

/* 行内代码样式 */
code {
  background: rgba(175, 184, 193, 0.2);
  padding: 2px 4px;
  border-radius: 3px;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 85%;
}

/* 深色主题适配 - 基于应用主题属性 */
:root[data-theme="dark"] .content-human {
  color: #f0f0f0 !important;
}

:root[data-theme="dark"] .content-assistant {
  color: #e6e6e6 !important;
}

:root[data-theme="dark"] .content-assistant * {
  color: #e6e6e6 !important;
}

:root[data-theme="dark"] ::v-deep .content-assistant p {
  color: #e6e6e6 !important;
}

:root[data-theme="dark"] ::v-deep .content-assistant div {
  color: #e6e6e6 !important;
}

:root[data-theme="dark"] ::v-deep .content-assistant span {
  color: #e6e6e6 !important;
}

:root[data-theme="dark"] ::v-deep .content-assistant li {
  color: #e6e6e6 !important;
}

:root[data-theme="dark"] ::v-deep .content-assistant h1,
:root[data-theme="dark"] ::v-deep .content-assistant h2,
:root[data-theme="dark"] ::v-deep .content-assistant h3,
:root[data-theme="dark"] ::v-deep .content-assistant h4,
:root[data-theme="dark"] ::v-deep .content-assistant h5,
:root[data-theme="dark"] ::v-deep .content-assistant h6 {
  color: #f0f0f0 !important;
}

:root[data-theme="dark"] ::v-deep .content-assistant td {
  color: #e6e6e6 !important;
}

:root[data-theme="dark"] ::v-deep .content-assistant th {
  color: #f0f0f0 !important;
}

:root[data-theme="dark"] .collapse-header {
  background: rgba(0, 0, 0, 0.3) !important;
  border-color: #333;
}

:root[data-theme="dark"] .collapse-header:hover {
  background: rgba(0, 0, 0, 0.4) !important;
  border-color: var(--color-primary-weak-2);
}

:root[data-theme="dark"] .gemini-input-container {
  background: var(--color-panel);
  border-color: #333;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}

:root[data-theme="dark"] .gemini-input-container:hover {
  border-color: var(--color-primary-weak-2);
  box-shadow: 0 4px 16px rgba(251, 119, 80, 0.2);
}

:root[data-theme="dark"] .gemini-input-container:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 4px 20px rgba(251, 119, 80, 0.3);
}

:root[data-theme="dark"] .attachments-preview-gemini {
  background: rgba(255, 255, 255, 0.02);
  border-bottom-color: #333;
}

:root[data-theme="dark"] .attachment-item-gemini {
  background: var(--color-panel);
  border-color: #333;
}

:root[data-theme="dark"] .attachment-item-gemini:hover {
  background: var(--color-primary-weak);
  border-color: var(--color-primary-weak-2);
}

:root[data-theme="dark"] .gemini-action-btn {
  color: #999;
}

:root[data-theme="dark"] .gemini-action-btn:hover:not(:disabled) {
  background: var(--color-primary-weak);
  color: var(--color-primary);
}

:root[data-theme="dark"] .clear-button {
  background: #666;
  color: var(--color-panel);
}

:root[data-theme="dark"] .clear-button:hover {
  background: #888;
}

:root[data-theme="dark"] .gemini-send-btn.disabled {
  background: #444;
  color: #666;
}

/* 代码块深色主题 */
:root[data-theme="dark"] pre {
  background: #1a1a1a;
  border-color: #333;
  color: #e6e6e6;
}

:root[data-theme="dark"] .code-copy-btn {
  background: rgba(26, 26, 26, 0.9);
  border-color: #444;
  color: #999;
}

:root[data-theme="dark"] .code-copy-btn:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

:root[data-theme="dark"] code {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-primary);
}

:root[data-theme="dark"] .selection-title {
  color: #e6e6e6;
}

:root[data-theme="dark"] .selection-subtitle {
  color: #999;
}

/* 模型卡片深色主题 */
:root[data-theme="dark"] .model-card {
  background: var(--color-panel);
  border-color: #333;
}

:root[data-theme="dark"] .model-card:hover {
  border-color: #444;
}

:root[data-theme="dark"] .model-card__description {
  color: #999;
}

/* 折叠面板深色主题 */
:root[data-theme="dark"] .collapse-title {
  color: var(--color-primary);
}

/* 附件相关深色主题 */
:root[data-theme="dark"] .attachments-preview {
  background-color: rgba(255, 255, 255, 0.05);
  border-bottom-color: #333;
}

:root[data-theme="dark"] .attachment-item {
  background-color: var(--color-panel);
  border-color: #333;
}

:root[data-theme="dark"] .attachment-name {
  color: #e6e6e6;
}

:root[data-theme="dark"] .attachment-size {
  color: #999;
}

:root[data-theme="dark"] .attachment-item-display {
  background-color: rgba(255, 255, 255, 0.08);
  border-color: #333;
  color: #e6e6e6;
}

:root[data-theme="dark"] .attachment-item-display:hover {
  background-color: rgba(255, 255, 255, 0.12);
  border-color: #444;
}

/* 按钮深色主题 */
:root[data-theme="dark"] .btn_attachment {
  background-color: rgba(255, 255, 255, 0.08) !important;
  border-color: #333 !important;
  color: #e6e6e6 !important;
}

:root[data-theme="dark"] .btn_attachment:hover {
  background-color: rgba(255, 255, 255, 0.12) !important;
  border-color: #444 !important;
}

:root[data-theme="dark"] .header-btn {
  background: var(--color-panel) !important;
  border-color: var(--color-primary) !important;
  color: var(--color-primary) !important;
}

:root[data-theme="dark"] .header-btn:hover {
  background: var(--color-primary-weak) !important;
}

/* 表格深色主题 */
:root[data-theme="dark"] table {
  border-color: #333;
}

:root[data-theme="dark"] th,
:root[data-theme="dark"] td {
  border-color: #333;
}

:root[data-theme="dark"] th {
  background-color: #2d2d2d;
  color: #e6e6e6;
}

:root[data-theme="dark"] tr:nth-child(even) {
  background-color: rgba(255, 255, 255, 0.02);
}

/* 粘贴提示深色主题 */
:root[data-theme="dark"] .paste-tip {
  background-color: rgba(255, 255, 255, 0.08);
  border-color: #333;
  color: #e6e6e6;
}

:root[data-theme="dark"] .paste-tip:hover {
  background-color: rgba(255, 255, 255, 0.12);
  border-color: #444;
}

/* 清除按钮深色主题 */
:root[data-theme="dark"] .clear-btn {
  color: #666;
}

:root[data-theme="dark"] .clear-btn:hover {
  color: var(--color-primary);
}

/* 收缩按钮深色主题 */
:root[data-theme="dark"] .collapse-toggle-btn {
  background-color: var(--color-panel);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

:root[data-theme="dark"] .collapse-toggle-btn:hover {
  background-color: var(--color-primary);
  color: white;
}

:root[data-theme="dark"] .dot-icon {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-300));
}

/* 语法高亮深色主题优化 */
:root[data-theme="dark"] .hljs-keyword,
:root[data-theme="dark"] .hljs-selector-tag,
:root[data-theme="dark"] .hljs-literal,
:root[data-theme="dark"] .hljs-section,
:root[data-theme="dark"] .hljs-link {
  color: #ff6b6b !important;
}

:root[data-theme="dark"] .hljs-string,
:root[data-theme="dark"] .hljs-title,
:root[data-theme="dark"] .hljs-name,
:root[data-theme="dark"] .hljs-type,
:root[data-theme="dark"] .hljs-attribute,
:root[data-theme="dark"] .hljs-symbol,
:root[data-theme="dark"] .hljs-bullet,
:root[data-theme="dark"] .hljs-built_in,
:root[data-theme="dark"] .hljs-addition,
:root[data-theme="dark"] .hljs-variable,
:root[data-theme="dark"] .hljs-template-tag,
:root[data-theme="dark"] .hljs-template-variable {
  color: #51cf66 !important;
}

:root[data-theme="dark"] .hljs-comment,
:root[data-theme="dark"] .hljs-quote,
:root[data-theme="dark"] .hljs-deletion,
:root[data-theme="dark"] .hljs-meta {
  color: #868e96 !important;
}

:root[data-theme="dark"] .hljs-number,
:root[data-theme="dark"] .hljs-regexp,
:root[data-theme="dark"] .hljs-literal {
  color: #74c0fc !important;
}


.header-btn.delete-btn:hover {
  background-color: #fef0f0 !important;
  border-color: #f56c6c !important;
  color: #f56c6c !important;
}

.header-btn i {
  margin-right: 4px;
  font-size: 12px;
}

.model-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.model-card:hover::before,
.model-card--selected::before {
  opacity: 1;
}

.model-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.model-card--selected {
  border-color: var(--color-border);
  background: var(--color-panel);
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(251, 119, 80, 0.1), 0 4px 6px -2px rgba(251, 119, 80, 0.05);
}

.model-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.model-card__icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-400) 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.model-card__check {
  width: 32px;
  height: 32px;
  background: #10b981;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  animation: checkmark-appear 0.3s ease-out;
}

@keyframes checkmark-appear {
  0% {
    transform: scale(0);
    opacity: 0;
  }

  50% {
    transform: scale(1.2);
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.model-card__content {
  margin-bottom: 10px;
}

.model-card__title {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.model-card__description {
  font-size: 14px;
  color: var(--color-text);
  margin: 0;
  line-height: 1.5;
}

.model-card__footer {
  display: flex;
  justify-content: center;
  padding-top: 8px;
  border-top: var(--color-border);
}


.model-card__status {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-secondary);
  padding: 8px 16px;
  background: var(--color-panel);
  border-radius: 20px;
  transition: all 0.3s ease;
}

.model-card--selected .model-card__status {
  background: var(--color-primary-weak);
  color: var(--color-primary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .model-selection-container {
    padding: 20px 16px;
  }

  .selection-title {
    font-size: 24px;
  }

  .model-cards-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .model-card {
    padding: 20px;
  }
}

/* 保留原有的样式作为备用 */
.card_contains {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
}



/* 未访问链接的样式 */
::v-deep a:link {
  color: var(--color-text);
  text-decoration: underline;
  font-size: 16px;
}

/* 已访问链接的样式，与未访问链接相同 */
::v-deep a:visited {
  color: var(--color-text);
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
  border: 0px var(--color-primary) solid;
}

::v-deep .el-textarea__inner:hover,
.el-textarea__inner:focus {
  border: 0px var(--color-primary) solid;
}

/* 代码复制按钮样式 - 融入你的设计风格 */
::v-deep .code-copy-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: var(--color-primary-weak);
  border: 1px solid var(--color-primary-weak-2);
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 12px;
  color: var(--color-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(8px);
  z-index: 10;
  opacity: 0;
  transform: translateY(-4px) scale(0.95);
  box-shadow: 0 2px 8px rgba(251, 119, 80, 0.1);
}

::v-deep .code-copy-btn:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
  transform: translateY(0) scale(1);
  box-shadow: 0 4px 12px rgba(251, 119, 80, 0.3);
}

::v-deep .code-copy-btn.copied {
  background: rgba(16, 185, 129, 0.15);
  border-color: #10b981;
  color: #10b981;
  transform: translateY(0) scale(1);
}

::v-deep .code-copy-btn .copy-text {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.3px;
}

/* 当鼠标悬停在代码块上时显示复制按钮 */
::v-deep pre:hover .code-copy-btn {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* 代码块基础样式优化 - 匹配你的界面风格 */
::v-deep pre {
  position: relative;
  background: var(--color-panel);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 20px;
  margin: 16px 0;
  overflow-x: auto;
  font-family: 'SFMono-Regular', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
}

::v-deep pre:hover {
  border-color: rgba(251, 119, 80, 0.3);
  box-shadow: 0 4px 12px rgba(251, 119, 80, 0.1);
}

::v-deep pre code {
  background: transparent;
  border: none;
  padding: 0;
  font-size: inherit;
  color: inherit;
  white-space: pre;
  word-break: normal;
  word-wrap: normal;
}

/* 行内代码样式 - 匹配你的主题色 */
::v-deep code {
  background: var(--color-primary-weak);
  color: var(--color-primary);
  padding: 3px 6px;
  border-radius: 4px;
  font-family: 'SFMono-Regular', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', monospace;
  font-size: 85%;
  font-weight: 500;
  border: 1px solid rgba(251, 119, 80, 0.15);
}

/* 语法高亮颜色调整 */
::v-deep .hljs {
  background: var(--color-panel) !important;
  color: var(--color-text) !important;
}

::v-deep .hljs-keyword,
::v-deep .hljs-selector-tag,
::v-deep .hljs-literal,
::v-deep .hljs-section,
::v-deep .hljs-link {
  color: var(--color-primary) !important;
}

::v-deep .hljs-string,
::v-deep .hljs-title,
::v-deep .hljs-name,
::v-deep .hljs-type,
::v-deep .hljs-attribute,
::v-deep .hljs-symbol,
::v-deep .hljs-bullet,
::v-deep .hljs-built_in,
::v-deep .hljs-addition,
::v-deep .hljs-variable,
::v-deep .hljs-template-tag,
::v-deep .hljs-template-variable {
  color: #2d8659 !important;
}

::v-deep .hljs-comment,
::v-deep .hljs-quote,
::v-deep .hljs-deletion,
::v-deep .hljs-meta {
  color: #999 !important;
  font-style: italic;
}

::v-deep .hljs-number,
::v-deep .hljs-regexp,
::v-deep .hljs-literal {
  color: #0066cc !important;
}

/* 响应式适配 */
@media (max-width: 768px) {
  ::v-deep .code-copy-btn {
    top: 8px;
    right: 8px;
    padding: 6px 8px;
    font-size: 11px;
  }

  ::v-deep .code-copy-btn .copy-text {
    display: none;
  }

  ::v-deep pre {
    padding: 16px;
    font-size: 13px;
  }
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
  background: var(--color-panel);
  /* 轨道背景色 */
  border-radius: 4px;
  /* 圆角 */
}

/* 对话操作按钮样式 */
.conversation-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding: 8px 12px;
  background-color: var(--color-primary-weak);
  border-radius: 6px;
  border-left: 3px solid var(--color-primary);
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px !important;
  font-size: 13px;
  border-radius: 4px;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.copy-btn {
  color: #409eff !important;
  background-color: rgba(64, 158, 255, 0.1);
}

.copy-btn:hover {
  background-color: rgba(64, 158, 255, 0.2) !important;
  border-color: #409eff !important;
  transform: translateY(-1px);
}

.delete-btn {
  color: #f56c6c !important;
  background-color: rgba(245, 108, 108, 0.1);
}

.delete-btn:hover {
  background-color: rgba(245, 108, 108, 0.2) !important;
  border-color: #f56c6c !important;
  transform: translateY(-1px);
}

.action-btn i {
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .conversation-actions {
    padding: 6px 8px;
    gap: 6px;
  }

  .action-btn {
    padding: 4px 8px !important;
    font-size: 12px;
  }

  .action-btn span {
    display: none;
  }
}

::v-deep table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
  display: block;
  overflow-x: auto;
  border: 0px solid var(--color-border);
  ;
}

::v-deep th,
::v-deep td {
  padding: 0.5rem;
  border: 1px solid var(--color-border);
}

::v-deep th {
  font-weight: bold;
  background-color: var(--color-bg);
  color: var(--color-text);
  text-align: center;
}

::v-deep tr:nth-child(even) {
  background-color: var(--color-bg);
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
  background-color: var(--color-panel);
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
}

.attachment-remove:hover {
  color: #c82333;
}

/* 附件显示样式优化 */
.attachments-display {
  margin-top: 8px;
}

.attachment-item-display {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  margin: 2px 4px 2px 0;
  background-color: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 12px;
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.2s ease;
}

.attachment-item-display:hover {
  background-color: rgba(255, 255, 255, 0.10);
  border-color: var(--color-border);
  transform: translateY(-1px);
}

.attachment-item-display i {
  font-size: 12px;
}

/* 输入区域样式优化 */
.input-container {
  position: relative;
  flex: 1;
  display: flex;
  align-items: flex-end;
}

.upload-container {
  margin-right: 8px;
  margin-left: 2px;
  display: flex;
  align-items: flex-end;
  padding-bottom: 8px;
}

/* 粘贴提示信息样式 */
.paste-tip {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-right: 12px;
  margin-left: 2px;
  padding: 4px 8px;
  background-color: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  font-size: 11px;
  color: var(--color-text);
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: help;
  user-select: none;
}

.paste-tip:hover {
  background-color: rgba(255, 255, 255, 0.10);
  border-color: var(--color-border);
  transform: translateY(-1px);
}

.paste-tip i {
  font-size: 12px;
  opacity: 0.8;
}

.paste-tip span {
  white-space: nowrap;
  letter-spacing: 0.3px;
}

.btn_attachment {
  background-color: rgba(255, 255, 255, 0.06) !important;
  border-color: var(--color-border) !important;
  color: var(--color-text) !important;
}

.btn_attachment:hover {
  background-color: rgba(255, 255, 255, 0.10) !important;
  border-color: var(--color-border) !important;
}

.clear-btn {
  position: absolute;
  right: 8px;
  bottom: 20px;
  cursor: pointer;
  color: #c0c4cc;
  font-size: 16px;
  z-index: 10;
  transition: color 0.2s ease;
}

.clear-btn:hover {
  color: #909399;
}

/* 收缩按钮容器样式 */
.collapse-buttons-container {
  position: fixed;
  bottom: 20px;
  right: 30px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: auto;
  transition: all 0.3s ease;
}

/* 收缩按钮样式 */
.collapse-toggle-btn {
  width: 36px;
  height: 36px;
  background-color: var(--color-primary-weak-2);
  border: 1px solid var(--color-primary);
  border-radius: 8px;
  display: flex !important;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--color-primary);
  font-size: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 3px 10px rgba(251, 119, 80, 0.4);
  backdrop-filter: blur(4px);
  pointer-events: auto;
  position: relative;
  top: auto;
  right: auto;
}

.collapse-toggle-btn:hover {
  background-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(251, 119, 80, 0.4);
}

.collapse-toggle-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(251, 119, 80, 0.3);
}

/* 确保按钮在小屏幕上也能显示 */
@media (max-width: 768px) {
  .collapse-buttons-container {
    right: 30px;
    bottom: 20px;
    top: auto;
  }

  .collapse-toggle-btn {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }
}



.clear-btn:hover {
  color: var(--color-primary);
}

/* 发送按钮动画样式 */
.sending-animation {
  display: flex;
  align-items: center;
  gap: 6px;
}

.sending-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* 发送按钮状态样式 */
.btn_sent {
  transition: all 0.3s ease;
}

.btn_sent:disabled {
  cursor: not-allowed;
}

/* 现代化折叠面板头部样式 */
.collapse-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 10px;
  margin-bottom: 12px;
  position: relative;
  overflow: hidden;
}


.collapse-title {
  flex: 1;
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text);
  letter-spacing: 0.2px;
  margin-right: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.4;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  opacity: 0.6;
  transition: all 0.3s ease;
}

.collapse-header:hover .header-actions {
  opacity: 1;
}

/* 头部按钮样式优化 - 扁平化设计 */
.header-btn {
  display: flex !important;
  align-items: center;
  justify-content: center;
  width: 28px !important;
  height: 28px !important;
  padding: 0 !important;
  border-radius: 4px !important;
  border: 1px solid #fb7750 !important;
  background: var(--color-panel) !important;
  transition: all 0.2s ease !important;
}

.header-btn:hover {
  background: var(--color-primary-weak) !important;
  border-color: var(--color-primary) !important;
}

.header-btn:active {
  background: var(--color-primary-weak-2) !important;
}

.header-btn i {
  font-size: 14px;
  transition: all 0.2s ease;
}

/* 复制按钮特定样式 - 扁平化设计 */
.copy-btn {
  color: #fb7750 !important;
  border-color: #fb7750 !important;
}

.copy-btn:hover {
  background: var(--color-primary-weak) !important;
  color: var(--color-primary) !important;
}

/* 删除按钮特定样式 - 扁平化设计 */
.delete-btn {
  color: #fb7750 !important;
  border-color: #fb7750 !important;
}

.delete-btn:hover {
  background: var(--color-primary-weak-2) !important;
  color: var(--color-primary) !important;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .collapse-header {
    padding: 6px 10px;
  }

  .collapse-title {
    font-size: 13px;
    margin-right: 8px;
  }

  .header-btn {
    width: 28px !important;
    height: 28px !important;
  }

  .header-btn i {
    font-size: 12px;
  }

  .header-actions {
    gap: 4px;
  }

  /* 小屏幕上的粘贴提示信息 */
  .paste-tip {
    margin-right: 8px;
    padding: 3px 6px;
    font-size: 10px;
  }

  .paste-tip span {
    display: none;
    /* 在小屏幕上隐藏文字，只显示图标 */
  }

  .paste-tip i {
    font-size: 11px;
  }
}



/* 现代化折叠面板整体样式 */
::v-deep .el-collapse-item {
  background: var(--color-panel);
}



::v-deep .el-collapse-item__header {
  background: transparent !important;
  border: none !important;
  padding: 0 !important;
  height: auto !important;
  line-height: normal !important;
}

::v-deep .el-collapse-item__arrow {
  display: none !important;
}

::v-deep .el-collapse-item__wrap {
  border: none !important;
  background: var(--color-panel);
}

::v-deep .el-collapse-item__content {
  padding: 0 !important;
  background: var(--color-panel);
  border-top: none !important;
}

/* 现代化 Markdown 内容样式 */
::v-deep .content-assistant h1,
::v-deep .content-assistant h2,
::v-deep .content-assistant h3,
::v-deep .content-assistant h4,
::v-deep .content-assistant h5,
::v-deep .content-assistant h6 {
  color: var(--color-text);
  font-weight: 600;
  margin: 24px 0 16px 0;
  line-height: 1.3;
}

::v-deep .content-assistant h1 {
  font-size: 28px;
  border-bottom: 2px solid var(--color-primary-weak);
  padding-bottom: 12px;
}

::v-deep .content-assistant h2 {
  font-size: 24px;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 8px;
}

::v-deep .content-assistant h3 {
  font-size: 20px;
}

::v-deep .content-assistant p {
  color: var(--color-text);
  line-height: 1.7;
  margin: 16px 0;
  font-size: 15px;
}

::v-deep .content-assistant ul,
::v-deep .content-assistant ol {
  margin: 16px 0;
  padding-left: 24px;
}

::v-deep .content-assistant li {
  color: var(--color-text);
  line-height: 1.6;
  margin: 8px 0;
}

::v-deep .content-assistant blockquote {
  border-left: 4px solid var(--color-primary);
  background: var(--color-primary-weak);
  margin: 20px 0;
  padding: 16px 20px;
  border-radius: 0 8px 8px 0;
  font-style: italic;
  color: var(--color-text);
}

/* 现代化表格样式 */
::v-deep .content-assistant table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin: 20px 0;
  background: var(--color-panel);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

::v-deep .content-assistant th {
  background: var(--color-primary-weak);
  color: var(--color-text);
  font-weight: 600;
  padding: 16px 20px;
  text-align: left;
  border-bottom: 2px solid var(--color-primary-weak-2);
  font-size: 14px;
  letter-spacing: 0.5px;
}

::v-deep .content-assistant th:first-child {
  border-top-left-radius: 12px;
}

::v-deep .content-assistant th:last-child {
  border-top-right-radius: 12px;
}

::v-deep .content-assistant td {
  padding: 14px 20px;
  color: var(--color-text);
  font-size: 14px;
  vertical-align: top;
}



::v-deep .content-assistant tr:last-child td:first-child {
  border-bottom-left-radius: 12px;
}

::v-deep .content-assistant tr:last-child td:last-child {
  border-bottom-right-radius: 12px;
}

::v-deep .content-assistant tr:nth-child(even) {
  background: rgba(251, 119, 80, 0.02);
}

::v-deep .content-assistant tr:hover {
  background: rgba(251, 119, 80, 0.05);
  transition: background-color 0.2s ease;
}

/* 强调文本样式 */
::v-deep .content-assistant strong {
  color: var(--color-primary);
  font-weight: 600;
}

::v-deep .content-assistant em {
  color: var(--color-text-secondary);
  font-style: italic;
}

/* 链接样式 */
::v-deep .content-assistant a {
  color: var(--color-primary) !important;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: all 0.2s ease;
}

::v-deep .content-assistant a:hover {
  border-bottom-color: var(--color-primary);
  background: var(--color-primary-weak);
  padding: 2px 4px;
  border-radius: 4px;
}

/* 分隔线样式 */
::v-deep .content-assistant hr {
  border: none;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--color-border), transparent);
  margin: 32px 0;
}

/* 响应式表格 */
@media (max-width: 768px) {
  ::v-deep .content-assistant table {
    font-size: 12px;
    margin: 16px 0;
  }

  ::v-deep .content-assistant th,
  ::v-deep .content-assistant td {
    padding: 10px 12px;
  }

  ::v-deep .content-assistant th {
    font-size: 12px;
  }
}
</style>