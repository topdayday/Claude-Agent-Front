<template>
  <div class="sidebar-container" v-if="!smallWidth && showLeftMenu">
    <div class="sidebar-header">
      <div class="sidebar-title">
        <div class="title-left">
          <svg class="sidebar-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 6L9 17L4 12L5.41 13.41L9 10L18.59 7.59L20 6Z" />
            <path
              d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20Z" />
          </svg>
          <span>对话历史</span>
        </div>
        <button class="more-history-btn-header" @click="viewMoreHistory" v-if="conversation_list.length > 0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20Z" />
            <path d="M12 6V12L16 16" />
          </svg>
          <span>更多</span>
        </button>
      </div>
      <button class="new-chat-btn" @click="newSession()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
        </svg>
        <span>新建对话</span>
      </button>
    </div>

    <div class="sidebar-content">
      <el-scrollbar class="conversation-scrollbar" :style="{ height: '100%' }">
        <div class="conversation-list">
          <div v-for="(item, index) in conversation_list" :key="index"
            :class="['conversation-item', { 'conversation-item--active': activeMenuIndex === index.toString() }]"
            @click="viewSession(item.session_id)">
            <div class="conversation-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z" />
                <path d="M7 9H17V11H7V9ZM7 12H14V14H7V12Z" />
              </svg>
            </div>
            <div class="conversation-content">
              <div class="conversation-text">{{ item.content_in }}</div>
              <div class="conversation-time">{{ formatTime(item.create_time) }}</div>
            </div>
          </div>


        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import { latest_session } from "@/utils/request";
import { generate_session } from "@/utils/request";

export default {
  name: 'AppLeftDrawer',
  props: {
    showDrawer: Boolean, session_id: String, smallWidth: Boolean, showLeftMenu: Boolean
  },
  data() {
    return {
      conversation_list: [],
      show: true,
      pageNumber: 0,
      loading: true,
      activeMenuIndex: "0",
    }
  },
  created() {
    this.latestSession();
  },
  watch: {
    session_id() {
      this.setActiveIndex()
    },
  },
  methods: {
    handleClose() {
      this.show = false;
    },
    addConversation(data) {
      this.conversation_list.unshift(data);
    },
    latestSession() {
      let _this = this;
      let token = localStorage.getItem('token');
      this.loading = true;
      this.conversation_list = []
      latest_session(token, this.pageNumber).then(data => {
        this.conversation_list = data;
        this.loading = false;
        this.setActiveIndex();
        console.log('latest_session:', data);
      }).catch(error => {
        console.error(error);
        _this.loading = false;
      });
    },

    setActiveIndex() {
      let targetSessionId = localStorage.getItem('session_id');
      if (!targetSessionId || !this.conversation_list || this.conversation_list.length === 0) {
        this.activeMenuIndex = "0";
        console.log('activeMenuIndex:0', 0);
        return;
      }
      console.log('activeMenuIndex:targetSessionId', targetSessionId);
      const index = this.conversation_list.findIndex(
        item => item.session_id === targetSessionId
      );
      console.log('activeMenuIndex:index', index);
      if (index !== -1) {
        this.activeMenuIndex = index.toString();
      } else {
        this.activeMenuIndex = "0"; // Reset if not found
      }
    },

    viewSession(session_id) {
      localStorage.setItem('session_id', session_id);
      this.$emit('update:session_id', session_id); // 发出事件通知父组件
      this.handleClose();
    },

    newSession() {
      let token = localStorage.getItem('token');
      generate_session(token).then(data => {
        localStorage.setItem('session_id', data);
        this.$emit('update:session_id', data); //
        console.log('generate_session:', data);
        // this.latestSession()
      }).catch(error => {
        console.error(error);
        this.loading = false;
      });
    },

    formatTime(timeStr) {
      if (!timeStr) return '';
      const time = new Date(timeStr);
      const now = new Date();
      const diff = now - time;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));

      if (days === 0) {
        return time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
      } else if (days === 1) {
        return '昨天';
      } else if (days < 7) {
        return `${days}天前`;
      } else {
        return time.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
      }
    },

    viewMoreHistory() {
      // 调用AppTop中的setDrawer方法来显示历史记录抽屉
      this.$emit('update:showDrawer', true);
    },
  },
}
</script>

<style scoped>
/* 侧边栏容器 */
.sidebar-container {
  width: 260px;
  height: 100vh;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  border-right: 1px solid #e2e8f0;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

/* 侧边栏头部 */
.sidebar-header {
  padding: 20px 16px 16px;
  border-bottom: 1px solid #f1f5f9;
  background: white;
  flex-shrink: 0;
}

.sidebar-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.title-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sidebar-icon {
  color: #fb7750;
  flex-shrink: 0;
}

/* 顶部更多按钮 */
.more-history-btn-header {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  background: rgba(251, 119, 80, 0.08);
  color: #fb7750;
  border: 1px solid rgba(251, 119, 80, 0.2);
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.more-history-btn-header:hover {
  background: rgba(251, 119, 80, 0.15);
  border-color: rgba(251, 119, 80, 0.4);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(251, 119, 80, 0.2);
}

.more-history-btn-header:active {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(251, 119, 80, 0.1);
}

.more-history-btn-header svg {
  flex-shrink: 0;
}

/* 新建对话按钮 */
.new-chat-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #fb7750 0%, #ff9a7b 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(251, 119, 80, 0.2);
}

.new-chat-btn:hover {
  background: linear-gradient(135deg, #ff8d6d 0%, #ffb199 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(251, 119, 80, 0.3);
}

.new-chat-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(251, 119, 80, 0.2);
}

/* 侧边栏内容区域 */
.sidebar-content {
  flex: 1;
  overflow: hidden;
  min-height: 0;
}

/* 对话列表 */
.conversation-list {
  padding: 8px 8px 16px 8px;
}

.conversation-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 12px;
  margin-bottom: 4px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  background: transparent;
}

.conversation-item:hover {
  background: rgba(251, 119, 80, 0.05);
  transform: translateX(2px);
}

.conversation-item--active {
  background: linear-gradient(135deg, rgba(251, 119, 80, 0.1) 0%, rgba(255, 154, 123, 0.08) 100%);
  border-left: 3px solid #fb7750;
  padding-left: 9px;
}

.conversation-item--active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(180deg, #fb7750 0%, #ff9a7b 100%);
  border-radius: 0 2px 2px 0;
}

/* 对话图标 */
.conversation-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.conversation-item:hover .conversation-icon {
  background: linear-gradient(135deg, #fb7750 0%, #ff9a7b 100%);
  color: white;
  transform: scale(1.05);
}

.conversation-item--active .conversation-icon {
  background: linear-gradient(135deg, #fb7750 0%, #ff9a7b 100%);
  color: white;
}

/* 对话内容 */
.conversation-content {
  flex: 1;
  min-width: 0;
  padding-top: 2px;
  text-align: left;
}

.conversation-text {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  line-height: 1.4;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.2s ease;
}

.conversation-item:hover .conversation-text {
  color: #fb7750;
}

.conversation-item--active .conversation-text {
  color: #fb7750;
  font-weight: 600;
}

.conversation-time {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 400;
  transition: color 0.2s ease;
}

.conversation-item:hover .conversation-time {
  color: #64748b;
}

.conversation-item--active .conversation-time {
  color: #fb7750;
  opacity: 0.8;
}

/* 滚动条样式 */
.conversation-scrollbar {
  height: 100% !important;
}

.conversation-scrollbar :deep(.el-scrollbar__wrap) {
  overflow-x: hidden !important;
  max-height: 100% !important;
}

.conversation-scrollbar :deep(.el-scrollbar__view) {
  height: auto !important;
}

.conversation-scrollbar :deep(.el-scrollbar__bar.is-vertical) {
  right: 2px;
  width: 4px;
}

.conversation-scrollbar :deep(.el-scrollbar__bar.is-vertical .el-scrollbar__thumb) {
  background: rgba(148, 163, 184, 0.3);
  border-radius: 2px;
  transition: background 0.3s ease;
}

.conversation-scrollbar :deep(.el-scrollbar__bar.is-vertical .el-scrollbar__thumb:hover) {
  background: rgba(251, 119, 80, 0.4);
}

/* 空状态样式 */
.conversation-list:empty::before {
  content: '暂无对话记录';
  display: block;
  text-align: center;
  color: #94a3b8;
  font-size: 14px;
  padding: 40px 20px;
  font-style: italic;
}

/* 响应式调整 */
@media (max-height: 600px) {
  .sidebar-header {
    padding: 16px 16px 12px;
  }

  .conversation-item {
    padding: 10px 12px;
  }
}

/* 加载状态 */
.conversation-item.loading {
  opacity: 0.6;
  pointer-events: none;
}



/* 动画效果 */
.conversation-item {
  animation: slideIn 0.3s ease-out;
}

.more-button-container {
  animation: slideIn 0.4s ease-out 0.1s both;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
