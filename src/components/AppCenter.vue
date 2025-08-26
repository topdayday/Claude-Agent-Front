<template>
  <div class="content-main">
    <div v-bind:class="{ main_left: showLeftMenu, main_left_hide: !showLeftMenu }" v-if="!smallWidth"></div>
    <div class="main-right-card" v-if="showIndexContent" v-loading="loading"
      :element-loading-text="countdown > 0 ? `等待响应中... ${countdown}秒` : '加载中...'">
      <div class="model-selection-container">
        <div class="model-selection-header">
          <h2 class="selection-title">选择AI模型</h2>
          <p class="selection-subtitle">请选择一个AI模型开始对话</p>
        </div>
        <div class="model-cards-grid">
          <div v-for="model in llmsModelInfo" :key="model.modelId"
            :class="['model-card', { 'model-card--selected': model_type === model.modelId }]"
            @click="selectType(model.modelId)">
            <div class="model-card__header">
              <div class="model-card__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                  <path d="M2 17L12 22L22 17" />
                  <path d="M2 12L12 17L22 12" />
                </svg>

              </div>
              <div v-if="model.multimodal >= 1" class="multimodal-badge multimodal-badge--multimodal">
                <svg class="multimodal-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" opacity="0.6" />
                  <path d="M2 17L12 22L22 17" />
                  <path d="M2 12L12 17L22 12" opacity="0.8" />
                  <circle cx="8" cy="8" r="2" fill="#4CAF50" />
                  <circle cx="16" cy="16" r="2" fill="#2196F3" />
                </svg>
                <span class="multimodal-text">多模态</span>
              </div>
              <div v-else class="multimodal-badge multimodal-badge--conversation">
                <svg class="multimodal-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" opacity="0.6" />
                  <path d="M2 17L12 22L22 17" />
                  <path d="M2 12L12 17L22 12" opacity="0.8" />
                  <circle cx="8" cy="8" r="2" fill="#4CAF50" />
                  <circle cx="16" cy="16" r="2" fill="#2196F3" />
                </svg>
                <span class="multimodal-text">多轮对话</span>
              </div>
              <!-- <div v-if="model_type === model.modelId" class="model-card__check">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" />
                </svg>
              </div> -->
            </div>
            <div class="model-card__content">
              <h3 class="model-card__title">{{ model.name + '-' + model.ver }}</h3>
              <p class="model-card__description">{{ model.desc }}</p>
            </div>
            <div class="model-card__footer">
              <span class="model-card__status">
                {{ model_type === model.modelId ? '已选择' : '点击选择' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div :class="showLeftMenu&&(!smallWidth) ? 'content-warp-menu' : 'content-warp'" v-if="!showIndexContent" v-loading="loading"
      :element-loading-text="countdown > 0 ? `等待响应中... ${countdown}秒` : '加载中...'">
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
              <svg width="22" height="22" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
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
      <!-- 收缩按钮容器 -->
      <div class="collapse-buttons-container">
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

      <div v-bind:class="{ send_message: true, send_message_min: !smallWidth }"
        style="border: 2px #fb7750  solid;background-color:#fff;">
        <!-- 附件显示区域 -->
        <div v-if="attachments.length > 0 && !smallWidth" class="attachments-preview">
          <div v-for="(file, index) in attachments" :key="index" class="attachment-item">
            <span class="attachment-name">{{ file.name }}</span>
            <span class="attachment-size">({{ formatFileSize(file.size) }})</span>
            <i class="el-icon-close attachment-remove" @click="removeAttachment(index)"></i>
          </div>
        </div>
        <div v-if="attachments.length > 0 && smallWidth" class="attachments-preview">
          <div v-for="(file, index) in attachments" :key="index" class="attachment-item">
            <span class="attachment-name">{{ index + 1 }}</span>
            <i class="el-icon-close attachment-remove" @click="removeAttachment(index)"></i>
          </div>
        </div>
        <div class="input-container">
          <!-- 附件上传按钮 -->
          <div class="upload-container" v-if="showAttachments(model_type)">
            <input type="file" ref="fileInput" @change="handleFileSelect" multiple accept="*/*"
              style="display: none;" />
            <el-button class="btn_attachment" @click="$refs.fileInput.click()" :disabled="sent_status == 1"
              icon="el-icon-paperclip" size="small" circle title="上传附件"></el-button>
          </div>
          <!-- 粘贴提示信息 -->
          <el-input autofocus=true type="textarea" ref="textarea_in" :autosize="{ minRows: 2, maxRows: 20 }"
            placeholder="按下Ctrl+Enter提交，或直接粘贴图片..." v-model="content_in">
          </el-input>
          <!-- 自定义清空按钮 -->
          <i v-if="content_in" class="el-icon-circle-close clear-btn" @click="clearContent"></i>
        </div>

        <el-button :disabled="sent_status == 1" class="btn_sent" type="primary" @click="sendMessage()" :style="{
          border: 'none',
          margin: '0',
          borderRadius: '0px',
          opacity: sent_status == 1 ? '0.6' : '1',
        }">
          <span v-if="sent_status == 1" class="sending-animation">
            <i class="el-icon-loading sending-icon"></i>
          </span>
          <span v-else>发送</span>
        </el-button>
      </div>
    </div>

  </div>
</template>

<script>
import { list_session, del_conversation, assistant_with_attachments, downloadAttachment, assistant } from '@/utils/request';
import MarkdownIt from 'markdown-it';
import mditHighlightjs from 'markdown-it-highlightjs';
import 'highlight.js/styles/default.css';

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
  stroke: #fb7750;
  stroke-width: 3;
  stroke-dasharray: 90, 150;
  stroke-dashoffset: 0;
  animation: loading-dash 1.5s ease-in-out infinite;
}

::v-deep .el-loading-text {
  color: #fb7750;
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
  background: linear-gradient(135deg, #fb7750, #fb8d6d);
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
  box-shadow: 0 6px 16px rgba(251, 119, 80, 0.6);
}

/* 收缩按钮样式 */
.collapse-toggle-btn {
  position: absolute;
  top: -35px;
  right: 10px;
  width: 30px;
  height: 30px;
  background: rgba(251, 119, 80, 0.9);
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
  background: rgba(251, 119, 80, 1);
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
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

/* 新的模型选择容器样式 */
.model-selection-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 40px 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
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
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 2px solid transparent;
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
  border-color: #667eea;
  background: linear-gradient(135deg, #f8faff 0%, #f1f5ff 100%);
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

.model-card__title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.model-card__description {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.model-card__status {
  font-size: 12px;
  font-weight: 500;
  color: #667eea;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.model-card--selected .model-card__status {
  color: #10b981;
}

/* 折叠面板头部样式 */
.collapse-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-right: 10px;
}

.collapse-title {
  flex: 1;
  font-size: 14px;
  color: #333;
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
  background-color: #fff !important;
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
  top: 8px;
  right: 8px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  padding: 6px 8px;
  font-size: 12px;
  color: #586069;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
  backdrop-filter: blur(4px);
  z-index: 10;
  opacity: 0;
  transform: translateY(-2px);
}

.code-copy-btn:hover {
  background: rgba(255, 255, 255, 0.95);
  border-color: #0366d6;
  color: #0366d6;
  transform: translateY(0);
}

.code-copy-btn.copied {
  background: rgba(40, 167, 69, 0.1);
  border-color: #28a745;
  color: #28a745;
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

/* 深色主题适配 */
@media (prefers-color-scheme: dark) {
  pre {
    background: #161b22;
    border-color: #30363d;
    color: #e6edf3;
  }

  .code-copy-btn {
    background: rgba(22, 27, 34, 0.9);
    border-color: #30363d;
    color: #7d8590;
  }

  .code-copy-btn:hover {
    background: rgba(22, 27, 34, 0.95);
    border-color: #58a6ff;
    color: #58a6ff;
  }

  code {
    background: rgba(110, 118, 129, 0.4);
  }
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
  border-color: #667eea;
  background: linear-gradient(135deg, #f8faff 0%, #f1f5ff 100%);
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

.model-card__title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.model-card__description {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.model-card__status {
  font-size: 12px;
  font-weight: 500;
  color: #667eea;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.model-card--selected .model-card__status {
  color: #10b981;
}

/* 折叠面板头部样式 */
.collapse-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-right: 10px;
}

.collapse-title {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.model-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border-color: #fb7750;
}

.model-card:hover::before {
  transform: scaleX(1);
}

.model-card--selected {
  border-color: #fb7750;
  background: linear-gradient(135deg, #fff5f3 0%, #ffffff 100%);
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(251, 119, 80, 0.1), 0 4px 6px -2px rgba(251, 119, 80, 0.05);
}

.model-card--selected::before {
  transform: scaleX(1);
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
  background: linear-gradient(135deg, #fb7750 0%, #ff9a7b 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: transform 0.3s ease;
}

.model-card:hover .model-card__icon {
  transform: scale(1.1);
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
  margin-bottom: 20px;
}

.model-card__title {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.model-card__description {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
}

.model-card__footer {
  display: flex;
  justify-content: center;
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;
}

.model-card__status {
  font-size: 14px;
  font-weight: 500;
  color: #fb7750;
  padding: 8px 16px;
  background: rgba(251, 119, 80, 0.1);
  border-radius: 20px;
  transition: all 0.3s ease;
}

.model-card--selected .model-card__status {
  background: #fb7750;
  color: white;
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

/* 代码复制按钮样式 - 融入你的设计风格 */
::v-deep .code-copy-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(251, 119, 80, 0.1);
  border: 1px solid rgba(251, 119, 80, 0.2);
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 12px;
  color: #fb7750;
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
  background: #fb7750;
  border-color: #fb7750;
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
  background: #fcfcfc;
  border: 1px solid #e8e8e8;
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
  background: rgba(251, 119, 80, 0.1);
  color: #fb7750;
  padding: 3px 6px;
  border-radius: 4px;
  font-family: 'SFMono-Regular', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', monospace;
  font-size: 85%;
  font-weight: 500;
  border: 1px solid rgba(251, 119, 80, 0.15);
}

/* 语法高亮颜色调整 */
::v-deep .hljs {
  background: #fcfcfc !important;
  color: #333 !important;
}

::v-deep .hljs-keyword,
::v-deep .hljs-selector-tag,
::v-deep .hljs-literal,
::v-deep .hljs-section,
::v-deep .hljs-link {
  color: #fb7750 !important;
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
  background: #ffffff;
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
  background-color: rgba(251, 119, 80, 0.05);
  border-radius: 6px;
  border-left: 3px solid #fb7750;
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

::v-deep .el-collapse-item__header {
  padding-left: 4px;
  background: rgba(251, 119, 80, 0.1) !important;
  border: 1px solid rgba(251, 119, 80, 0.2) !important;
  color: #fb7750 !important;
  transition: all 0.3s ease;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(251, 119, 80, 0.1);
}

::v-deep .el-collapse-item__header:hover {
  background: rgba(251, 119, 80, 0.15) !important;
  border-color: rgba(251, 119, 80, 0.4) !important;
  box-shadow: 0 4px 8px rgba(251, 119, 80, 0.2);
  transform: translateY(-1px);
}

::v-deep .el-collapse-item__header:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(251, 119, 80, 0.15);
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
  background-color: rgba(251, 119, 80, 0.1);
  border: 1px solid rgba(251, 119, 80, 0.3);
  border-radius: 4px;
  font-size: 12px;
  color: #fb7750;
  cursor: pointer;
  transition: all 0.2s ease;
}

.attachment-item-display:hover {
  background-color: rgba(251, 119, 80, 0.2);
  border-color: #fb7750;
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
  background-color: rgba(251, 119, 80, 0.1);
  border: 1px solid rgba(251, 119, 80, 0.2);
  border-radius: 12px;
  font-size: 11px;
  color: #fb7750;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: help;
  user-select: none;
}

.paste-tip:hover {
  background-color: rgba(251, 119, 80, 0.15);
  border-color: rgba(251, 119, 80, 0.3);
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
  background-color: rgba(251, 119, 80, 0.1) !important;
  border-color: #fb7750 !important;
  color: #fb7750 !important;
}

.btn_attachment:hover {
  background-color: rgba(251, 119, 80, 0.2) !important;
  border-color: #fb8d6d !important;
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
  position: absolute;
  top: -140px;
  right: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 1001;
  pointer-events: auto;
}

/* 收缩按钮样式 */
.collapse-toggle-btn {
  width: 36px;
  height: 36px;
  background-color: rgba(251, 119, 80, 0.95);
  border: 1px solid #fb7750;
  border-radius: 8px;
  display: flex !important;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  font-size: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 3px 10px rgba(251, 119, 80, 0.4);
  backdrop-filter: blur(4px);
  pointer-events: auto;
  position: relative;
}

.collapse-toggle-btn:hover {
  background-color: #fb7750;
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
    right: 5px;
    top: -130px;
  }

  .collapse-toggle-btn {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }
}



.clear-btn:hover {
  color: #fb7750;
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

/* 折叠面板头部样式优化 - 扁平化设计 */
.collapse-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px 16px;
  transition: all 0.2s ease;
  background: #fff;
  margin-bottom: 8px;
}

.collapse-header:hover {
  border-color: #fff;
}

.collapse-title {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: #ff9a7a;
  letter-spacing: 0.3px;
  margin-right: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  opacity: 0.8;
  transition: opacity 0.2s ease;
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
  background: #fff !important;
  transition: all 0.2s ease !important;
}

.header-btn:hover {
  background: rgba(251, 119, 80, 0.1) !important;
  border-color: #fb7750 !important;
}

.header-btn:active {
  background: rgba(251, 119, 80, 0.2) !important;
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
  background: rgba(251, 119, 80, 0.1) !important;
  color: #fb7750 !important;
}

/* 删除按钮特定样式 - 扁平化设计 */
.delete-btn {
  color: #fb7750 !important;
  border-color: #fb7750 !important;
}

.delete-btn:hover {
  background: rgba(251, 119, 80, 0.15) !important;
  color: #fb7750 !important;
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
    display: none; /* 在小屏幕上隐藏文字，只显示图标 */
  }

  .paste-tip i {
    font-size: 11px;
  }
}

/* 确保按钮在折叠面板中正确显示 */
::v-deep .el-collapse-item__header .collapse-header {
  margin: 0;
}

/* 优化折叠面板整体样式以匹配新的头部设计 */
::v-deep .el-collapse-item {
  border: none !important;
  margin-bottom: 12px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  background: #fff;
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
  background: #fff;
}

::v-deep .el-collapse-item__content {
  padding: 16px !important;
  background: #fff;
  border-top: 1px solid rgba(251, 119, 80, 0.1);
}
</style>