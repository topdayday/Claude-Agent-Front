<template>
  <div>
    <el-drawer title="历史会话" :visible.sync="show" direction="rtl" size="100%" :before-close="handleClose"
      class="history-drawer">

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <el-spinner></el-spinner>
        <p class="loading-text">加载中...</p>
      </div>

      <!-- 会话列表 -->
      <div v-else class="conversation-container">
        <!-- 日期过滤器 -->
        <div class="filter-container">
          <div class="filter-item">
            <i class="el-icon-date filter-icon"></i>
            <el-date-picker v-model="selectedDate" type="date" placeholder="选择日期过滤" format="yyyy/MM/dd"
              value-format="yyyy-MM-dd" @change="onDateChange" clearable class="date-picker">
            </el-date-picker>
          </div>
          <div class="filter-actions">
            <el-button v-if="selectedDate" @click="clearDateFilter" size="mini" icon="el-icon-refresh-left"
              class="clear-btn">
              清除筛选
            </el-button>
          </div>
        </div>

        <!-- 表格头部 -->
        <div class="table-header">
          <div class="header-content">对话内容</div>
          <div class="header-time">创建时间</div>
          <div class="header-action">操作</div>
        </div>

        <!-- 会话列表项 -->
        <div class="conversation-list">
          <div v-for="(item, index) in conversation_list" :key="index" class="conversation-item"
            :class="{ 'active': item.session_id === session_id }">

            <div class="item-content" @click="viewSession(item.session_id)">
              <div class="content-text">
                <i class="el-icon-chat-dot-round content-icon"></i>
                <span class="content-title">{{ item.content_in }}</span>
              </div>
            </div>

            <div class="item-time">
              <i class="el-icon-time time-icon"></i>
              <span>{{ dateFormat(item.create_time) }}</span>
            </div>

            <div class="item-action">
              <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteSession(item.session_id)"
                class="delete-btn">
                删除
              </el-button>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="conversation_list.length === 0" class="empty-state">
          <i class="el-icon-chat-dot-square empty-icon"></i>
          <p class="empty-text">暂无历史会话</p>
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
import { latest_session } from "@/utils/request";
import { del_session } from "@/utils/request";

export default {
  name: 'AppDrawer',
  props: {
    showDrawer: Boolean, session_id: String,
  },
  data() {
    return {
      conversation_list: [],
      show: false,
      pageNumber: 0,
      loading: true,
      selectedDate: null, // 选择的日期
    }
  },
  created() {

  },
  watch: {
    showDrawer() {
      this.show = this.showDrawer;
      if (this.show) {
        this.latestSession();
      }
    },
  },

  methods: {
    handleClose() {
      this.show = false;
      this.$emit('update:showDrawer', false);
    },

    nextPage() {
      this.pageNumber++;
      if (this.pageNumber < 0) {
        this.pageNumber = 0;
      }
      this.latestSession();
    },
    previousPage() {
      this.pageNumber--;
      if (this.pageNumber < 0) {
        this.pageNumber = 0;
      }
      this.latestSession()
    },
    latestSession() {
      let _this = this;
      let token = localStorage.getItem('token');
      this.loading = true;
      this.conversation_list = []
      latest_session(token, this.pageNumber, this.selectedDate).then(data => {
        this.conversation_list = data;
        this.loading = false;
        // console.log('latest_session:',data);
      }).catch(error => {
        console.error(error);
        _this.loading = false;
      });
    },

    // 日期选择变化时的处理
    onDateChange(date) {
      console.log(date)
      this.pageNumber = 0; // 重置页码
      this.latestSession(); // 重新加载数据
    },

    // 清除日期过滤
    clearDateFilter() {
      this.selectedDate = null;
      this.pageNumber = 0; // 重置页码
      this.latestSession(); // 重新加载数据
    },
    deleteSession(session_id) {
      this.$confirm('你确定要删除会话所有对话吗？', '提示', {
        cancelButtonText: '退出',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        let token = localStorage.getItem('token');
        del_session(token, session_id).then(data => {
          this.latestSession();
          console.log('deleteSession:', data);
          this.$notify({
            title: '提示',
            message: '会话已删除！',
            type: 'success'
          });
        }).catch(error => {
          console.error(error);
          this.loading = false;
        });
      }).catch(() => {

      });



    },

    viewSession(session_id) {
      localStorage.setItem('session_id', session_id);
      this.$emit('update:session_id', session_id); // 发出事件通知父组件
      this.handleClose();
    },
    dateFormat(time) {
      if (time === undefined || time == null) {
        return '';
      }
      var d = new Date(time)

      var year = d.getFullYear()
      var month = d.getMonth() + 1
      var day = d.getDate() //


      var clock = year + '/'

      if (month < 10) { clock += '0' }

      clock += month + '/'

      if (day < 10) { clock += '0' }

      clock += day + ' '
      return (clock)
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

/* 日期过滤器样式 */
.filter-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  background: linear-gradient(to bottom, rgba(251, 119, 80, 0.05), rgba(253, 253, 248, 0.05));
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  gap: 15px;
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

.filter-actions {
  display: flex;
  align-items: center;
}

.clear-btn {
  background-color: #f5f5f5;
  border-color: #d9d9d9;
  color: #666;
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
  transform: translateY(-1px);
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

:deep(.date-picker .el-input__inner::placeholder) {
  color: #999;
  font-size: 12px;
}

:deep(.date-picker .el-input__suffix) {
  color: var(--color-primary);
}

:deep(.date-picker .el-input__suffix .el-input__icon) {
  color: var(--color-primary);
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
  width: 80px;
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
  padding: 15px 20px;
  border-bottom: 1px solid var(--color-border);
  transition: all 0.3s ease;
  cursor: pointer;
}

.conversation-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
  transform: translateX(2px);
}

.conversation-item.active {
  background-color: var(--color-primary-weak);
  border-left: 4px solid var(--color-primary);
}

/* 内容区域 */
.item-content {
  flex: 1;
  cursor: pointer;
}

.content-text {
  display: flex;
  align-items: center;
}

.content-icon {
  color: var(--color-primary);
  margin-right: 8px;
  font-size: 16px;
}

.content-title {
  font-size: 14px;
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
}

/* 时间区域 */
.item-time {
  width: 120px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #999;
}

.time-icon {
  margin-right: 4px;
  font-size: 12px;
}

/* 操作区域 */
.item-action {
  width: 80px;
  text-align: right;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.delete-btn {
  background-color: #ff4757;
  border-color: #ff4757;
  color: white;
  border-radius: 15px;
  padding: 4px 12px;
  font-size: 12px;
  transition: all 0.3s ease;
}

.delete-btn:hover,
.delete-btn:focus {
  background-color: #ff3838;
  border-color: #ff3838;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(255, 71, 87, 0.3);
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
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(251, 119, 80, 0.3);
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
    width: 70px;
  }

  .content-title {
    max-width: 200px;
  }
}
</style>
