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
    <div :class="smallWidth?'header-center-min':'header-center'">
      <div class="model-selector">
        <svg class="model-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" />
          <path d="M2 17L12 22L22 17" />
          <path d="M2 12L12 17L22 12" />
        </svg>
        <el-select v-model="model_type" placeholder="选择AI模型" class="model-select">
          <el-option v-for="model in llmsModelInfo" :key="model.modelId" :label="model.name" :value="model.modelId">
          </el-option>
        </el-select>
      </div>
    </div>

    <!-- 右侧操作按钮组 -->
    <div class="header-actions">
      <div class="action-group">
        <button class="action-btn action-btn--primary" @click="newSession()" title="新建对话">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
          </svg>
        </button>
        <button class="action-btn" @click="setDrawer()" title="历史记录">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20Z" />
            <path d="M12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z" />
          </svg>
        </button>
        <button class="action-btn" @click="setMember()" title="用户设置">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12 12C14.21 12 16 10.21 16 8S14.21 4 12 4 8 5.79 8 8 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>

import { generate_session } from "@/utils/request";
export default {
  name: 'AppTop',
  props: {
    showDrawer: Boolean, session_id: String, token: String, showMember: Boolean, editable: Boolean,
    selectedModel: Number, smallWidth: Boolean, showLeftMenu: Boolean, llmsModelInfo: Array,
  },
  data() {
    return {
      model_type: 50,
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
    let m_type = localStorage.getItem('model_type');
    if (m_type != null) {
      this.model_type = Number(m_type);
    } else {
      this.model_type = this.llmsModelInfo[0].modelId;
    }
  },
  methods: {
    changLeftMenu(val) {
      this.$emit('setLeftMenu', val);
    },
    setMember() {
      this.$emit('update:showMember', true);
    },
    setDrawer() {
      this.$emit('update:showDrawer', true);
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
    }
  }
}
</script>

<style scoped>
/* 主容器 */
.header-container {
  width: 100%;
  height: 48px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-bottom: 1px solid #e2e8f0;
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
  background: rgba(251, 119, 80, 0.1);
  border: 1px solid rgba(251, 119, 80, 0.2);
  border-radius: 14px;
  color: #fb7750;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.toggle-btn:hover {
  background: rgba(251, 119, 80, 0.15);
  border-color: rgba(251, 119, 80, 0.3);
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
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  max-width: 120px;
}

.model-selector:hover {
  border-color: #fb7750;
  box-shadow: 0 2px 4px rgba(251, 119, 80, 0.1);
}

.model-icon {
  color: #fb7750;
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
  background: rgba(248, 250, 252, 0.8);
  border-radius: 8px;
  padding: 4px 1px;
  border: 1px solid #e2e8f0;
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
  background: rgba(251, 119, 80, 0.1);
  color: #fb7750;
  transform: translateY(-1px);
}

.action-btn:active {
  transform: translateY(0);
}

.action-btn--active {
  background: rgba(251, 119, 80, 0.15);
  color: #fb7750;
}

.action-btn--primary {
  background: linear-gradient(135deg, #fb7750 0%, #ff9a7b 100%);
  color: white;
  box-shadow: 0 2px 4px rgba(251, 119, 80, 0.3);
}

.action-btn--primary:hover {
  background: linear-gradient(135deg, #ff8d6d 0%, #ffb199 100%);
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

:deep(.model-select .el-input) {
  border: none !important;
  background: transparent !important;
}

:deep(.model-select .el-input__inner) {
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

:deep(.model-select .el-input__inner:focus) {
  border: none !important;
  box-shadow: none !important;
}

:deep(.model-select .el-input__suffix) {
  right: 0 !important;
}

:deep(.model-select .el-input__suffix-inner) {
  color: #64748b !important;
  display: none !important;
}

:deep(.model-select .el-select__caret) {
  color: #64748b !important;
  font-size: 14px !important;
}

:deep(.model-select .el-select__caret:hover) {
  color: #fb7750 !important;
}

/* 下拉框样式 */
:deep(.el-select-dropdown) {
  border: 1px solid #e2e8f0 !important;
  border-radius: 8px !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
  margin-top: 4px !important;
}

:deep(.el-select-dropdown .el-select-dropdown__item) {
  color: #374151 !important;
  font-weight: 500 !important;
  padding: 8px 12px !important;
  transition: all 0.2s ease !important;
}

:deep(.el-select-dropdown .el-select-dropdown__item:hover) {
  background: rgba(251, 119, 80, 0.1) !important;
  color: #fb7750 !important;
}

:deep(.el-select-dropdown .el-select-dropdown__item.selected) {
  background: rgba(251, 119, 80, 0.15) !important;
  color: #fb7750 !important;
  font-weight: 600 !important;
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

/* 工具提示样式增强 */
.action-btn[title]:hover::after {
  content: attr(title);
  position: absolute;
  bottom: -32px;
  left: 50%;
  transform: translateX(-50%);
  background: #1f2937;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 1000;
  opacity: 0;
  animation: tooltip-appear 0.2s ease-out 0.5s forwards;
}

@keyframes tooltip-appear {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(4px);
  }

  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}
</style>
