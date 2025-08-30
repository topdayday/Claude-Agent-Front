<template>
  <!-- 遮罩层 -->
  <div class="member-overlay" v-if="showMemberVal" @click="handleOverlayClick">
    <!-- 主对话框容器 -->
    <div class="member-dialog" @click.stop>
      <!-- 对话框头部 -->
      <div class="dialog-header">
        <div class="header-left">
          <div class="user-avatar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 12C14.21 12 16 10.21 16 8S14.21 4 12 4 8 5.79 8 8 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" />
            </svg>
          </div>
          <div class="header-info">
            <h2 class="dialog-title">用户设置</h2>
            <p class="dialog-subtitle">管理您的账户信息和安全设置</p>
          </div>
        </div>
        <button class="close-btn" @click="closeDg" title="关闭">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" />
          </svg>
        </button>
      </div>

      <!-- 对话框内容 -->
      <div class="dialog-content">
        <div class="content-layout">
          <!-- 左侧导航 -->
          <div class="sidebar-nav">
            <div class="nav-section">
              <h3 class="nav-title">账户管理</h3>
              <div class="nav-items">
                <div :class="['nav-item', { 'nav-item--active': activeTab === 'profile' }]"
                  @click="activeTab = 'profile'">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M12 12C14.21 12 16 10.21 16 8S14.21 4 12 4 8 5.79 8 8 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" />
                  </svg>
                  <span>基本信息</span>
                </div>
                <div :class="['nav-item', { 'nav-item--active': activeTab === 'security' }]"
                  @click="activeTab = 'security'">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 7C13.1 7 14 7.9 14 9S13.1 11 12 11 10 10.1 10 9 10.9 7 12 7ZM12 17C10.33 17 8.91 16.16 8.16 14.98C8.2 13.29 11.33 12.5 12 12.5S15.8 13.29 15.84 14.98C15.09 16.16 13.67 17 12 17Z" />
                  </svg>
                  <span>安全设置</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧内容区域 -->
          <div class="main-content">
            <!-- 基本信息标签页 -->
            <div v-if="activeTab === 'profile'" class="tab-content">
              <div class="section-header">
                <h3 class="section-title">基本信息</h3>
                <p class="section-description">更新您的个人资料和联系方式</p>
              </div>

              <form class="profile-form" @submit.prevent="submitForm('memberForm')">
                <div class="form-group">
                  <label class="form-label">登录名</label>
                  <div class="input-wrapper">
                    <input type="text" class="form-input form-input--disabled" v-model="memberData.login_name" disabled
                      placeholder="用户登录名" />
                    <div class="input-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path
                          d="M12 12C14.21 12 16 10.21 16 8S14.21 4 12 4 8 5.79 8 8 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" />
                      </svg>
                    </div>
                  </div>
                  <p class="form-help">登录名不可修改</p>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">手机号码</label>
                    <div class="input-wrapper">
                      <input type="tel" class="form-input" v-model="memberData.mobile" placeholder="请输入手机号码" />
                      <div class="input-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path
                            d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="form-label">邮箱地址</label>
                    <div class="input-wrapper">
                      <input type="email" class="form-input" v-model="memberData.email" placeholder="请输入邮箱地址" />
                      <div class="input-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path
                            d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <!-- 安全设置标签页 -->
            <div v-if="activeTab === 'security'" class="tab-content">
              <div class="section-header">
                <h3 class="section-title">安全设置</h3>
                <p class="section-description">修改密码以保护您的账户安全</p>
              </div>

              <form class="security-form" @submit.prevent="submitForm('memberForm')">
                <div class="form-group">
                  <label class="form-label">当前密码</label>
                  <div class="input-wrapper">
                    <input type="password" class="form-input" v-model="memberData.password" placeholder="请输入当前密码" />
                    <div class="input-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path
                          d="M18 8H17V6C17 3.24 14.76 1 12 1S7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15S10.9 13 12 13 14 13.9 14 15 13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9S15.1 4.29 15.1 6V8Z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">新密码</label>
                  <div class="input-wrapper">
                    <input type="password" class="form-input" v-model="memberData.new_password"
                      placeholder="请输入新密码（为空则保留原密码）" />
                    <div class="input-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path
                          d="M18 8H17V6C17 3.24 14.76 1 12 1S7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15S10.9 13 12 13 14 13.9 14 15 13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9S15.1 4.29 15.1 6V8Z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">确认新密码</label>
                  <div class="input-wrapper">
                    <input type="password" class="form-input" v-model="memberData.new_password1"
                      placeholder="请再次输入新密码" />
                    <div class="input-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path
                          d="M18 8H17V6C17 3.24 14.76 1 12 1S7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15S10.9 13 12 13 14 13.9 14 15 13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9S15.1 4.29 15.1 6V8Z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- 对话框底部 -->
      <div class="dialog-footer">
        <div class="footer-actions">
          <button class="btn btn--secondary" @click="closeDg">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" />
            </svg>
            <span>取消更改</span>
          </button>
          <button class="btn btn--primary" @click="submitForm('memberForm')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" />
            </svg>
            <span>保存更改</span>
          </button>
          <button class="btn btn--danger" @click="handleLogout">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.59L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z" />
            </svg>
            <span>退出登录</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { member_info } from '@/utils/request.js';
import { member_edit } from '@/utils/request.js'
import { MessageBox } from "element-ui";

export default {
  name: 'AppMember',
  props: {
    showMember: Boolean, session_id: String, token: String,
  },
  data() {
    return {
      activeTab: 'profile', // 当前激活的标签页
      memberData: {
        login_name: '',
        email: '',
        mobile: '',
        password: '',
        new_password: '',
        new_password1: ''
      },
      loginRules: {

      },

    };
  },
  created() {
    let token = localStorage.getItem('token');
    if (token) {
      this.get_member_info()
    }
  },
  computed: {
    showMemberVal() {
      return this.showMember;
    }
  },
  watch: {
    showMember() {
      if (this.showMember) {
        this.get_member_info();
      }
    },
  },
  methods: {
    closeDg() {
      this.$emit('update:showMember', false);
    },
    get_member_info() {
      let token = localStorage.getItem('token');
      member_info(token).then(data => {
        this.memberData = data[0];
        // this.memberData.password=''
        // this.memberData.new_password=''
        // this.memberData.new_password1=''
        // console.log('captcha:',data);
      }).catch(error => {
        console.error(error); // 如果发生错误，会打印错误信息
      });
    },
    handleOverlayClick() {
      // 点击遮罩层关闭对话框
      this.closeDg();
    },

    submitForm(formName) {
      console.log(formName)
      if (this.memberData.new_password !== this.memberData.new_password1) {
        MessageBox.alert('两次输入新密码不一致！', '提示')
        return false;
      }
      let token = localStorage.getItem('token');

      // 由于我们不再使用el-form，直接进行提交
      member_edit(token, this.memberData).then(data => {
        if (Object.keys(data).length > 0) {
          MessageBox.alert('修改成功！', '提示')
          this.closeDg()
        }
      }).catch(error => {
        console.error(error);
      });
    },
    handleLogout() {
      MessageBox.confirm('确定要退出登录吗？', '确认退出', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.closeDg();
        this.loginOut();
        MessageBox.alert('已成功退出系统！', '提示');
      }).catch(() => {
        // 用户取消退出
        console.log('cancel')
      });
    },
    loginOut() {
      this.$emit('update:token', null);
      this.$emit('update:session_id', null);
    },
  },
};
</script>

<style scoped>
/* 遮罩层 */
.member-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: overlay-appear 0.3s ease-out;
}

@keyframes overlay-appear {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

/* 主对话框容器 */
.member-dialog {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: dialog-appear 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes dialog-appear {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
  }

  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* 对话框头部 */
.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 32px;
  border-bottom: 1px solid #f1f5f9;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-avatar {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-400) 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 8px rgba(251, 119, 80, 0.3);
}

.header-info {
  flex: 1;
}

.dialog-title {
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
  line-height: 1.3;
}

.dialog-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
  line-height: 1.4;
}

.close-btn {
  width: 40px;
  height: 40px;
  background: rgba(248, 250, 252, 0.8);
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: #ef4444;
  color: #ef4444;
  transform: scale(1.05);
}

/* 对话框内容 */
.dialog-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.content-layout {
  display: flex;
  flex: 1;
  min-height: 0;
}

/* 左侧导航 */
.sidebar-nav {
  width: 240px;
  background: #f8fafc;
  border-right: 1px solid #e2e8f0;
  padding: 24px 0;
  flex-shrink: 0;
}

.nav-section {
  padding: 0 20px;
}

.nav-title {
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 16px 0;
  padding: 0 12px;
}

.nav-items {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
}

.nav-item:hover {
  background: var(--color-primary-weak);
  color: var(--color-primary);
  transform: translateX(2px);
}

.nav-item--active {
  background: var(--color-primary-weak-2);
  color: var(--color-primary);
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(251, 119, 80, 0.1);
}

.nav-item svg {
  flex-shrink: 0;
}

/* 危险操作区域 */
.danger-zone {
  margin-top: 40px;
  padding: 24px;
  border: 1px solid #fecaca;
  border-radius: 12px;
  background: linear-gradient(135deg, #fef2f2 0%, #fff5f5 100%);
}

.danger-header {
  margin-bottom: 16px;
}

.danger-title {
  font-size: 16px;
  font-weight: 600;
  color: #dc2626;
  margin: 0 0 4px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.danger-title::before {
  content: "⚠️";
  font-size: 14px;
}

.danger-description {
  font-size: 14px;
  color: #991b1b;
  margin: 0;
  line-height: 1.5;
}

.danger-actions {
  display: flex;
  justify-content: flex-start;
}

.btn--danger {
  background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
  color: white;
  border: 1px solid #dc2626;
  box-shadow: 0 2px 4px rgba(220, 38, 38, 0.3);
}

.btn--danger:hover {
  background: linear-gradient(135deg, #b91c1c 0%, #dc2626 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(220, 38, 38, 0.4);
}

/* 右侧内容区域 */
.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
}

.tab-content {
  max-width: 600px;
}

.section-header {
  margin-bottom: 32px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.section-description {
  font-size: 14px;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
}

/* 表单样式 */
.profile-form,
.security-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin: 0;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.form-input {
  width: 100%;
  padding: 12px 16px 12px 44px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  color: #1f2937;
  background: white;
  transition: all 0.2s ease;
  outline: none;
}

.form-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-weak);
}

.form-input--disabled {
  background: #f9fafb;
  color: #9ca3af;
  cursor: not-allowed;
}

.input-icon {
  position: absolute;
  left: 14px;
  color: #9ca3af;
  pointer-events: none;
  z-index: 1;
}

.form-input:focus+.input-icon {
  color: var(--color-primary);
}

.form-help {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
  font-style: italic;
}

/* 对话框底部 */
.dialog-footer {
  padding: 24px 32px;
  border-top: 1px solid #f1f5f9;
  background: #f8fafc;
}

.footer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 按钮样式 */
.btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  outline: none;
}

.btn--secondary {
  background: white;
  color: #64748b;
  border: 1px solid #d1d5db;
}

.btn--secondary:hover {
  background: #f9fafb;
  border-color: #9ca3af;
  color: #374151;
  transform: translateY(-1px);
}

.btn--primary {
  background: linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-400) 100%);
  color: white;
  box-shadow: 0 2px 4px rgba(251, 119, 80, 0.3);
}

.btn--primary:hover {
  background: linear-gradient(135deg, #ff8d6d 0%, #ffb199 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(251, 119, 80, 0.4);
}

.btn:active {
  transform: translateY(0);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .member-dialog {
    max-width: 95vw;
    max-height: 95vh;
    margin: 10px;
  }

  .content-layout {
    flex-direction: column;
  }

  .sidebar-nav {
    width: 100%;
    padding: 16px 0;
  }

  .nav-items {
    flex-direction: row;
    overflow-x: auto;
    padding: 0 20px;
    gap: 8px;
  }

  .nav-item {
    white-space: nowrap;
    flex-shrink: 0;
  }

  .main-content {
    padding: 20px;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .dialog-header {
    padding: 20px;
  }

  .dialog-footer {
    padding: 20px;
  }

  .footer-actions {
    flex-direction: column-reverse;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .member-overlay {
    padding: 10px;
  }

  .dialog-title {
    font-size: 20px;
  }

  .user-avatar {
    width: 40px;
    height: 40px;
  }

  .main-content {
    padding: 16px;
  }
}

/* 滚动条样式 */
.main-content::-webkit-scrollbar {
  width: 6px;
}

.main-content::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.main-content::-webkit-scrollbar-thumb {
  background: rgba(251, 119, 80, 0.3);
  border-radius: 3px;
}

.main-content::-webkit-scrollbar-thumb:hover {
  background: rgba(251, 119, 80, 0.5);
}
</style>
