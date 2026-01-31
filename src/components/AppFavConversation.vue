<template>
  <div>
    <el-drawer title="收藏会话" :visible.sync="show" direction="rtl" size="100%" :before-close="handleClose"
      class="history-drawer">

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <el-spinner></el-spinner>
        <p class="loading-text">loading...</p>
      </div>

      <!-- 会话列表 -->
      <div v-else class="conversation-container">
        <!-- 过滤器 -->
        <div class="filter-container">
          <div class="filter-item">
            <i class="el-icon-date filter-icon"></i>
            <el-date-picker v-model="selectedDate" type="date" placeholder="选择日期过滤" format="yyyy/MM/dd"
              value-format="yyyy-MM-dd" @change="onDateChange" clearable class="date-picker">
            </el-date-picker>
          </div>
          <div class="filter-item">
            <i class="el-icon-search filter-icon"></i>
            <el-input v-model="searchTitle" placeholder="搜索标题（按回车搜索）" @keyup.enter.native="onTitleSearch" @clear="onTitleSearch" clearable
              class="title-search" size="small">
            </el-input>
          </div>
          <div class="filter-actions">
            <el-button v-if="selectedDate || searchTitle" @click="clearFilters" size="mini" icon="el-icon-refresh-left"
              class="clear-btn">
              清除筛选
            </el-button>
          </div>
        </div>

        <!-- 表格头部 -->
        <div class="table-header">
          <div class="header-content" style="flex: 3;">标题</div>
          <div class="header-time" style="flex: 1;">创建时间</div>
          <div class="header-action" style="min-width: 160px;">操作</div>
        </div>

        <!-- 会话列表项 -->
        <div class="conversation-list">
          <div v-for="(item, index) in conversation_list" :key="index" class="conversation-item"
            :class="{ 'active': item.session_id === session_id, 'editing': editingSessionId === item.session_id }">

            <div class="item-content" style="flex: 3;">
              <div class="content-text" v-if="editingSessionId !== item.session_id">
                <i class="el-icon-star-on content-icon"></i>
                <span class="content-title" @click="viewSession(item.session_id)">{{ item.title }}</span>
              </div>
              <div class="content-text edit-mode" v-else>
                <i class="el-icon-star-on content-icon"></i>
                <el-input v-model="editingTitle" size="small" placeholder="请输入标题" class="edit-input"
                  @keyup.enter.native="saveTitle(item.session_id)">
                </el-input>
              </div>
            </div>

            <div class="item-time" style="flex: 1;">
              <i class="el-icon-time time-icon"></i>
              <span>{{ dateFormat(item.create_time) }}</span>
            </div>

            <div class="item-action">
              <template v-if="editingSessionId !== item.session_id">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="startEdit(item)"
                  class="edit-action-btn">
                  编辑
                </el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteFavSession(item.session_id)"
                  class="delete-btn">
                  删除
                </el-button>
              </template>
              <template v-else>
                <el-button type="success" size="mini" icon="el-icon-check" @click="saveTitle(item.session_id)"
                  class="save-btn">
                  保存
                </el-button>
                <el-button type="info" size="mini" icon="el-icon-close" @click="cancelEdit()"
                  class="cancel-btn">
                  取消
                </el-button>
              </template>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="conversation_list.length === 0" class="empty-state">
          <i class="el-icon-star-off empty-icon"></i>
          <p class="empty-text">暂无收藏会话</p>
        </div>
      </div>

      <!-- 分页控制 -->
      <div class="pagination-container" v-if="!loading">
        <el-button v-if="pageNumber > 0" @click="previousPage()" icon="el-icon-arrow-left" class="page-btn">
          上一页
        </el-button>
        <span class="page-info" v-if="pageNumber > 0 || conversation_list.length >= 30">
          第 {{ pageNumber + 1 }} 页
        </span>
        <el-button v-if="conversation_list.length >= 30" @click="nextPage()" class="page-btn">
          下一页
          <i class="el-icon-arrow-right"></i>
        </el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { list_fav_session, del_fav_session, update_fav_session } from "@/utils/request";

export default {
  name: 'AppFavConversation',
  props: {
    showFavDrawer: Boolean,
    session_id: String,
  },
  data() {
    return {
      conversation_list: [],
      show: false,
      pageNumber: 0,
      loading: true,
      selectedDate: null,
      searchTitle: '',
      editingSessionId: null,
      editingTitle: '',
    }
  },
  watch: {
    showFavDrawer() {
      this.show = this.showFavDrawer;
      if (this.show) {
        this.loadFavSessions();
      }
    },
  },

  methods: {
    handleClose() {
      this.show = false;
      this.$emit('update:showFavDrawer', false);
    },

    nextPage() {
      this.pageNumber++;
      if (this.pageNumber < 0) {
        this.pageNumber = 0;
      }
      this.loadFavSessions();
    },

    previousPage() {
      this.pageNumber--;
      if (this.pageNumber < 0) {
        this.pageNumber = 0;
      }
      this.loadFavSessions();
    },

    loadFavSessions() {
      let token = localStorage.getItem('token');
      this.loading = true;
      this.conversation_list = [];

      list_fav_session(token, this.pageNumber, this.selectedDate, this.searchTitle).then(data => {
        this.conversation_list = data;
        this.loading = false;
      }).catch(error => {
        console.error(error);
        this.loading = false;
      });
    },

    onDateChange(date) {
      console.log(date);
      this.pageNumber = 0;
      this.loadFavSessions();
    },

    onTitleSearch() {
      this.pageNumber = 0;
      this.loadFavSessions();
    },

    clearFilters() {
      this.selectedDate = null;
      this.searchTitle = '';
      this.pageNumber = 0;
      this.loadFavSessions();
    },

    deleteFavSession(session_id) {
      this.$confirm('你确定要取消收藏这个会话吗？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        let token = localStorage.getItem('token');
        del_fav_session(token, session_id).then(() => {
          this.loadFavSessions();
          this.$notify({
            title: '提示',
            message: '已取消收藏！',
            type: 'success'
          });
        }).catch(error => {
          console.error(error);
        });
      }).catch(() => {});
    },

    viewSession(session_id) {
      if (this.editingSessionId) {
        return;
      }
      localStorage.setItem('session_id', session_id);
      this.$emit('update:session_id', session_id);
      this.handleClose();
    },

    startEdit(item) {
      this.editingSessionId = item.session_id;
      this.editingTitle = item.title;
    },

    cancelEdit() {
      this.editingSessionId = null;
      this.editingTitle = '';
    },

    saveTitle(session_id) {
      if (!this.editingTitle || !this.editingTitle.trim()) {
        this.$message.warning('标题不能为空');
        return;
      }

      let token = localStorage.getItem('token');
      update_fav_session(token, session_id, this.editingTitle.trim()).then(() => {
        this.$notify({
          title: '提示',
          message: '标题修改成功！',
          type: 'success'
        });
        this.cancelEdit();
        this.loadFavSessions();
      }).catch(error => {
        console.error(error);
      });
    },

    dateFormat(time) {
      if (time === undefined || time == null) {
        return '';
      }
      var d = new Date(time);
      var year = d.getFullYear();
      var month = d.getMonth() + 1;
      var day = d.getDate();

      var clock = year + '/';
      if (month < 10) { clock += '0'; }
      clock += month + '/';
      if (day < 10) { clock += '0'; }
      clock += day + ' ';

      return clock;
    }
  },
}
</script>

<style scoped>
/* 抽屉整体样式 */
:deep(.history-drawer .el-drawer) {
  background-color: #fdfcf8;
}

:deep(.history-drawer .el-drawer__header) {
  background: var(--color-panel);
  padding: 15px 20px;
  margin-bottom: 0;
  box-shadow: 0 2px 8px var(--color-border);
}

:deep(.history-drawer .el-drawer__title) {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
}

:deep(.history-drawer .el-drawer__body) {
  padding: 0;
  background-color: var(--color-panel);
}

/* 加载状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #666;
}

.loading-text {
  margin-top: 15px;
  font-size: 14px;
  color: #999;
}

/* 会话容器 */
.conversation-container {
  height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
}

/* 过滤器样式 */
.filter-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  background: linear-gradient(to bottom, rgba(251, 119, 80, 0.05), rgba(253, 253, 248, 0.05));
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  gap: 10px;
  flex-wrap: wrap;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-icon {
  color: var(--color-primary);
  font-size: 16px;
}

.date-picker {
  width: 180px;
}

.title-search {
  width: 200px;
}

.filter-actions {
  display: flex;
  align-items: center;
}

.clear-btn {
  background-color: rgba(251, 119, 80, 0.1);
  border-color: var(--color-primary-weak-3);
  color: var(--color-primary);
  border-radius: 12px;
  padding: 4px 8px;
  font-size: 12px;
  transition: all 0.3s ease;
}

.clear-btn:hover,
.clear-btn:focus {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

/* 日期选择器样式定制 */
:deep(.date-picker .el-input__inner) {
  background-color: rgba(248, 250, 252, 0.8);
  border: 1px solid var(--color-primary-weak-3);
  border-radius: 8px;
  color: #2c3e50;
  font-size: 13px;
  height: 32px;
  line-height: 32px;
  transition: all 0.3s ease;
}

:deep(.date-picker .el-input__inner:focus) {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px var(--color-primary-weak-2);
}

:deep(.title-search .el-input__inner) {
  background-color: rgba(248, 250, 252, 0.8);
  border: 1px solid var(--color-primary-weak-3);
  border-radius: 8px;
  color: #2c3e50;
  font-size: 13px;
  transition: all 0.3s ease;
}

:deep(.title-search .el-input__inner:focus) {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px var(--color-primary-weak-2);
}

/* 表格头部 */
.table-header {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  background: linear-gradient(to bottom, var(--color-panel-weak), transparent);
  border-bottom: 1px solid var(--color-border);
  font-weight: 600;
  color: #8c8f92;
  font-size: 14px;
}

.header-content {
  flex: 1;
  text-align: left;
}

.header-time {
  width: 120px;
  text-align: center;
}

.header-action {
  min-width: 160px;
  text-align: center;
}

/* 会话列表 */
.conversation-list {
  flex: 1;
  overflow-y: auto;
}

.conversation-item {
  display: flex;
  align-items: center;
  padding: 18px 20px;
  border-bottom: 1px solid var(--color-border);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.conversation-item:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.conversation-item:hover .item-action {
  opacity: 1;
}

.conversation-item.editing .item-action {
  opacity: 1;
}

.conversation-item.active {
  background-color: var(--color-primary-weak);
  border-left: 4px solid var(--color-primary);
  box-shadow: inset 0 1px 3px rgba(251, 119, 80, 0.1);
}

/* 内容区域 */
.item-content {
  flex: 1;
}

.item-content .content-title {
  cursor: pointer;
}

.content-text {
  display: flex;
  align-items: center;
}

.content-icon {
  color: #FFD700;
  margin-right: 8px;
  font-size: 16px;
}

.content-title {
  font-size: 14px;
  color: var(--color-text);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
  line-height: 1.5;
  max-width: 400px;
}

/* 时间区域 */
.item-time {
  width: 120px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: #888;
  font-weight: 500;
}

.time-icon {
  margin-right: 4px;
  font-size: 13px;
}

/* 操作区域 */
.item-action {
  min-width: 160px;
  text-align: right;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.edit-action-btn {
  background-color: transparent;
  border-color: var(--color-primary);
  color: var(--color-primary);
  border-radius: 15px;
  padding: 4px 12px;
  font-size: 12px;
  transition: all 0.3s ease;
}

.edit-action-btn:hover,
.edit-action-btn:focus {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
  box-shadow: 0 2px 4px rgba(251, 119, 80, 0.2);
}

.delete-btn {
  background-color: transparent;
  border-color: #ddd;
  color: #999;
  border-radius: 15px;
  padding: 4px 12px;
  font-size: 12px;
  transition: all 0.3s ease;
}

.delete-btn:hover,
.delete-btn:focus {
  background-color: #ff4757;
  border-color: #ff4757;
  color: white;
  box-shadow: 0 2px 4px rgba(255, 71, 87, 0.2);
}

.save-btn {
  background-color: #2ecc71;
  border-color: #2ecc71;
  color: white;
  border-radius: 15px;
  padding: 4px 12px;
  font-size: 12px;
  transition: all 0.3s ease;
}

.save-btn:hover,
.save-btn:focus {
  background-color: #27ae60;
  border-color: #27ae60;
  box-shadow: 0 2px 4px rgba(46, 204, 113, 0.2);
}

.cancel-btn {
  background-color: #95a5a6;
  border-color: #95a5a6;
  color: white;
  border-radius: 15px;
  padding: 4px 12px;
  font-size: 12px;
  transition: all 0.3s ease;
}

.cancel-btn:hover,
.cancel-btn:focus {
  background-color: #7f8c8d;
  border-color: #7f8c8d;
  box-shadow: 0 2px 4px rgba(149, 165, 166, 0.2);
}

/* 编辑模式 */
.content-text.edit-mode {
  width: 100%;
}

.edit-input {
  flex: 1;
  max-width: 400px;
}

:deep(.edit-input .el-input__inner) {
  border: 1px solid var(--color-primary);
  border-radius: 8px;
  background-color: rgba(248, 250, 252, 0.9);
}

:deep(.edit-input .el-input__inner:focus) {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px var(--color-primary-weak-2);
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #999;
}

.empty-icon {
  font-size: 48px;
  color: #ddd;
  margin-bottom: 15px;
}

.empty-text {
  font-size: 14px;
  color: #999;
}

/* 分页控制 */
.pagination-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.05), rgba(253, 253, 248, 0.05));
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  gap: 15px;
}

.page-btn {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 13px;
  transition: all 0.3s ease;
}

.page-btn:hover,
.page-btn:focus {
  background-color: var(--color-primary-300);
  border-color: var(--color-primary-300);
  box-shadow: 0 2px 6px rgba(251, 119, 80, 0.2);
}

.page-info {
  font-size: 13px;
  color: #666;
  font-weight: 500;
}

/* 滚动条样式 */
.conversation-list::-webkit-scrollbar {
  width: 6px;
}

.conversation-list::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.conversation-list::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  transition: background 0.3s ease;
}

.conversation-list::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .filter-container {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-item {
    width: 100%;
  }

  .date-picker,
  .title-search {
    width: 100%;
  }

  .table-header,
  .conversation-item {
    padding: 10px 15px;
  }

  .header-time,
  .item-time {
    width: 100px;
    font-size: 11px;
  }

  .header-action,
  .item-action {
    min-width: 140px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }

  .content-title {
    max-width: 120px;
  }

  .delete-btn,
  .edit-action-btn,
  .save-btn,
  .cancel-btn {
    padding: 2px 8px;
    font-size: 11px;
    min-width: 45px;
    margin: 2px;
  }

  .edit-input {
    max-width: 200px;
  }
}
</style>
