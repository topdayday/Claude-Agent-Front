<template>
  <div class="header-container">
    <!-- 左侧菜单切换按钮 -->
    <div
      :class="['sidebar-toggle', { 'sidebar-toggle--expanded': showLeftMenu, 'sidebar-toggle--collapsed': !showLeftMenu }]"
      v-if="!smallWidth" style="margin-left:4px;">
      <button class="toggle-btn" @click="changLeftMenu(false)" v-if="showLeftMenu" title="收起侧边栏">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.41 16.59L10.83 12L15.41 7.41L14 6L8 12L14 18L15.41 16.59Z" />
        </svg>
      </button>
      <button class="toggle-btn" @click="changLeftMenu(true)" v-else title="展开侧边栏">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" />
        </svg>
      </button>
    </div>

    <!-- 中间模型选择区域 -->
    <div :class="smallWidth ? 'header-center-min':'header-center'">
      <div class="model-selector">
        <svg class="model-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" />
          <path d="M2 17L12 22L22 17" />
          <path d="M2 12L12 17L22 12" />
        </svg>
        <el-select  v-model="model_type" placeholder="选择AI模型" class="model-select">
          <el-option v-for="model in llmsModelInfo" :key="model.modelId" :label="model.name" :value="model.modelId">
          </el-option>
        </el-select>
      </div>
    </div>

    <!-- 右侧操作按钮组 -->
    <div class="header-actions">
      <div class="action-group">
        <el-tooltip content="新增会话" placement="bottom" :open-delay="500">
          <button class="action-btn" @click="newSession()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
            </svg>
          </button>
        </el-tooltip>
        <el-tooltip content="历史会话" placement="bottom" :open-delay="500">
          <button class="action-btn" @click="setDrawer()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20Z" />
              <path d="M12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z" />
            </svg>
          </button>
        </el-tooltip>
        <el-tooltip content="收藏会话" placement="bottom" :open-delay="500">
          <button class="action-btn" @click="addFavSession()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
            </svg>
          </button>
        </el-tooltip>
        <el-tooltip content="历史收藏" placement="bottom" :open-delay="500">
          <button class="action-btn" @click="setFavDrawer()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 3H7C5.9 3 5 3.9 5 5V21L12 18L19 21V5C19 3.9 18.1 3 17 3Z" />
            </svg>
          </button>
        </el-tooltip>
        <el-tooltip content="个人中心" placement="bottom" :open-delay="500">
          <button class="action-btn" @click="setMember()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 12C14.21 12 16 10.21 16 8S14.21 4 12 4 8 5.79 8 8 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" />
            </svg>
          </button>
        </el-tooltip>
        <el-tooltip content="系统主题" placement="bottom" :open-delay="500">
          <button class="action-btn" @click="toggleTheme()">
            <svg v-if="theme==='dark'" data-v-c4bf0156=""   width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path data-v-c4bf0156="" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.8 1.42-1.42zm10.45 14.32l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM12 5a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm0-3h-1v3h1V2zm0 18h-1v3h1v-3zM2 11H-1v1h3v-1zm23 0h-3v1h3v-1zM4.95 19.07l-1.41 1.41 1.79 1.8 1.41-1.41-1.79-1.8zM18.36 4.93l1.79-1.8-1.41-1.41-1.8 1.79 1.42 1.42z"/>
            </svg>
          </button>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>

import { generate_session, add_fav_session } from "@/utils/request";
import { getTheme, toggleTheme } from "@/utils/theme";
export default {
  name: 'AppTop',
  props: {
    showDrawer: Boolean, session_id: String, token: String, showMember: Boolean, editable: Boolean,
    selectedModel: Number, smallWidth: Boolean, showLeftMenu: Boolean, llmsModelInfo: Array,
    showFavDrawer: Boolean,
  },
  data() {
    return {
      model_type: 50,
      theme: 'light',
    }
  },
  watch: {
    model_type(model_type) {
      this.$emit('selectModel', model_type)
    },
    selectedModel(selectedModel) {
      this.model_type = selectedModel;
    },
  },
  mounted() {
    this.theme = getTheme();
    let m_type = localStorage.getItem('model_type');
    if (m_type != null) {
      this.model_type = Number(m_type);
    } else {
      this.model_type = this.llmsModelInfo[0].modelId;
    }
  },
  methods: {
    toggleTheme(){
      const next = toggleTheme();
      this.theme = next;
    },
    changLeftMenu(val) {
      this.$emit('setLeftMenu', val);
    },
    setMember() {
      this.$emit('update:showMember', true);
    },
    setDrawer() {
      this.$emit('update:showDrawer', true);
    },
    setFavDrawer() {
      this.$emit('update:showFavDrawer', true);
    },
    newSession() {
      let token = localStorage.getItem('token');
      generate_session(token).then(data => {
        localStorage.setItem('session_id', data);
        this.$emit('update:session_id', data); //
      }).catch(error => {
        console.error(error);
        this.loading = false;
      });
    },
    loginOut() {
      localStorage.removeItem('token');
      localStorage.removeItem('session_id');
      this.$emit('update:token', null);
      this.$emit('update:session_id', null);
    },
    addFavSession() {
      const token = localStorage.getItem('token');
      const session_id = localStorage.getItem('session_id');

      if (!session_id) {
        this.$message.warning('当前没有会话可以收藏');
        return;
      }

      add_fav_session(token, session_id, null).then(() => {
        // 收藏成功的提示在request.js中已经处理
      }).catch(error => {
        console.error('收藏失败:', error);
      });
    }
  }
}
</script>

<style scoped>
/* 主容器 */
.header-container {
  width: 100%;
  height: 48px;
  background: linear-gradient(135deg, var(--color-bg) 0%, var(--color-panel-weak) 100%);
  border-bottom: 1px solid var(--color-border);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1000;
}

/* 左侧菜单切换区域 */
.sidebar-toggle {
  display: flex;
  align-items: center;
  height: 100%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar-toggle--expanded {
  width: 280px;
  padding-left: 260px;
}

.sidebar-toggle--collapsed {
  width: 40px;
  padding-left: 8px;
}

.toggle-btn {
  width: 28px;
  height: 28px;
  background: var(--color-primary-weak);
  border: 1px solid var(--color-primary-weak-2);
  border-radius: 14px;
  color: var(--color-text);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.toggle-btn:hover {
  background: var(--color-primary-weak-2);
  border-color: var(--color-primary-weak-3);
  transform: scale(1.05);
}

.toggle-btn:active {
  transform: scale(0.95);
}

/* 中间模型选择区域 */
.header-center {
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0 20px;
}

.header-center-min {
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0 2px;
}

.model-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--color-bg);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  max-width: 120px;
  position: relative;
}

.model-selector:hover {
  border-color: var(--color-border);
  box-shadow: var(--shadow-sm);
  transform: translateY(-1px);
}

.model-selector:focus-within {
  border-color: var(--color-border);
  box-shadow: 0 0 0 3px rgba(255,255,255,0.06), var(--shadow-sm);
  transform: translateY(-1px);
}

.model-icon {
  color: var(--color-text);
  flex-shrink: 0;
}

/* 右侧操作按钮组 */
.header-actions {
  display: flex;
  align-items: center;
  padding-right: 16px;
}

.action-group {
  display: flex;
  align-items: center;
  gap: 4px;
  background: var(--color-bg);
  border-radius: 8px;
  padding: 4px 1px;
  border: 1px solid var(--color-border);
}

.action-btn {
  width: 30px;
  height: 36px;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  position: relative;
}

.action-btn:hover {
  background: var(--color-primary-weak);
  color: var(--color-primary);
  transform: translateY(-1px);
}

.action-btn:active {
  transform: translateY(0);
}

.action-btn--active {
  background: var(--color-primary-weak-2);
  color: var(--color-primary);
}

.action-btn--primary {
  background: var(--color-primary-weak);
  color: var(--color-text);
  box-shadow: 0 2px 4px rgba(251, 119, 80, 0.3);
}

.action-btn--primary:hover {
  background: var(--color-primary-weak-2);;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(251, 119, 80, 0.4);
}

.action-btn--danger {
  color: #ef4444;
}

.action-btn--danger:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

/* Element UI 样式覆盖 */
.model-select {
  border: none !important;
  background: transparent !important;
  min-width: 140px;
  max-width: 100px;
}

::deep(.model-select .el-input) {
  border: none !important;
  background: transparent !important;
}

::deep(.model-select .el-input__inner) {
  border: none !important;
  background: transparent !important;
  color: #1e293b !important;
  font-weight: 500 !important;
  font-size: 14px !important;
  height: auto !important;
  line-height: 1.5 !important;
  padding: 0 !important;
  appearance: none;
  -webkit-appearance: none;
}

::deep(.model-select .el-input__inner:focus) {
  border: none !important;
  box-shadow: none !important;
}

::deep(.model-select .el-input__suffix) {
  right: 0 !important;
}

::deep(.model-select .el-input__suffix-inner) {
  color: #64748b !important;
  display: none !important;
}

::deep(.model-select .el-select__caret) {
  color: #64748b !important;
  font-size: 14px !important;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

::deep(.model-select .el-select__caret:hover) {
  color: var(--color-primary) !important;
  transform: scale(1.1) !important;
}

::deep(.model-select.is-focus .el-select__caret) {
  color: var(--color-primary) !important;
  transform: rotate(180deg) !important;
}

::deep(.model-select .el-input.is-focus .el-select__caret) {
  color: var(--color-primary) !important;
  transform: rotate(180deg) !important;
}

/* 下拉框样式优化 */
::deep(.el-select-dropdown) {
  border: 1px solid #e2e8f0 !important;
  border-radius: 12px !important;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
  margin-top: 8px !important;
  background: var(--color-panel) !important;
  backdrop-filter: blur(10px) !important;
  overflow: hidden !important;
  animation: dropdown-appear 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

::deep(.el-select-dropdown .el-scrollbar) {
  max-height: 280px !important;
}

::deep(.el-select-dropdown .el-select-dropdown__item) {
  color: #374151 !important;
  font-weight: 500 !important;
  font-size: 14px !important;
  padding: 12px 16px !important;
  margin: 0 8px !important;
  border-radius: 8px !important;
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1) !important;
  position: relative !important;
  border: none !important;
  background: transparent !important;
}

::deep(.el-select-dropdown .el-select-dropdown__item:first-child) {
  margin-top: 8px !important;
}

::deep(.el-select-dropdown .el-select-dropdown__item:last-child) {
  margin-bottom: 8px !important;
}

::deep(.el-select-dropdown .el-select-dropdown__item:hover) {
  background: rgba(255,255,255,0.06) !important;
  color: var(--color-text) !important;
  transform: translateX(2px) !important;
  box-shadow: none !important;
}

::deep(.el-select-dropdown .el-select-dropdown__item.selected) {
  background: transparent !important;
  color: var(--color-primary) !important;
  font-weight: 600 !important;
  border: 2px solid var(--color-primary) !important;
  padding: 10px 14px !important;
  position: relative !important;
}

::deep(.el-select-dropdown .el-select-dropdown__item.selected::after) {
  content: '✓' !important;
  position: absolute !important;
  right: 16px !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  color: var(--color-primary) !important;
  font-weight: bold !important;
  font-size: 14px !important;
}

/* 下拉框出现动画 */
@keyframes dropdown-appear {
  from {
    opacity: 0;
    transform: translateY(-8px) scale(0.95);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 下拉框空状态样式 */
::deep(.el-select-dropdown .el-select-dropdown__empty) {
  padding: 20px !important;
  color: #9ca3af !important;
  text-align: center !important;
  font-size: 14px !important;
}

/* 下拉框加载状态 */
::deep(.el-select-dropdown .el-select-dropdown__loading) {
  padding: 20px !important;
  text-align: center !important;
  color: var(--color-primary) !important;
}

/* 选择框激活状态 */
::deep(.model-select.is-focus) {
  border-color: var(--color-primary) !important;
}

::deep(.model-select.is-focus .el-input__inner) {
  color: var(--color-primary) !important;
}

/* 下拉框分组样式（如果有分组的话） */
::deep(.el-select-group__title) {
  color: #6b7280 !important;
  font-size: 12px !important;
  font-weight: 600 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.05em !important;
  padding: 8px 16px 4px !important;
  margin: 0 !important;
}

/* 下拉框滚动条样式 */
::deep(.el-select-dropdown .el-scrollbar__wrap) {
  overflow-x: hidden !important;
}

::deep(.el-select-dropdown .el-scrollbar__bar) {
  right: 2px !important;
  border-radius: 4px !important;
}

::deep(.el-select-dropdown .el-scrollbar__thumb) {
  background: rgba(251, 119, 80, 0.3) !important;
  border-radius: 4px !important;
}

::deep(.el-select-dropdown .el-scrollbar__thumb:hover) {
  background: rgba(251, 119, 80, 0.5) !important;
}

/* Tooltip样式定制 */
::v-deep .el-tooltip__popper {
  background: rgba(0, 0, 0, 0.85) !important;
  color: white !important;
  font-size: 12px !important;
  padding: 6px 10px !important;
  border-radius: 4px !important;
}

::v-deep .el-tooltip__popper[x-placement^="bottom"] .popper__arrow {
  border-bottom-color: rgba(0, 0, 0, 0.85) !important;
}

::v-deep .el-tooltip__popper[x-placement^="bottom"] .popper__arrow::after {
  border-bottom-color: rgba(0, 0, 0, 0.85) !important;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-container {
    height: 44px;
  }

  .model-selector {
    min-width: 160px;
    padding: 6px 10px;
  }

  .action-btn {
    width: 32px;
    height: 32px;
  }

  .action-group {
    gap: 2px;
    padding: 2px;
  }
}



::v-deep .el-input__inner {
  background-color: var(--color-bg);
  background-image: none;
  border-radius: 4px;
  border: 1px solid var(--color-border);  
  box-sizing: border-box;
  color: var(--color-text);
  display: inline-block;
  height: 40px;
  line-height: 40px;
  outline: 0;
  padding: 0 15px;
  transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  width: 100%
}
</style>
