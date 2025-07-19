<template>
  <div>
    <div class="login-main" id="login_index">
      <!-- 主标题区域 -->
      <div class="hero-section">
        <div class="hero-content">
          <h1 class="main-title" :class="{ 'mobile': smallWidth }">
            <i class="el-icon-cpu title-icon"></i>
            T2Day AI
          </h1>
          <h2 class="sub-title" :class="{ 'mobile': smallWidth }">
            集成主流AI大模型，智能对话新体验
          </h2>
          <div class="feature-tags">
            <span class="tag">多轮对话</span>
            <span class="tag">多模态支持</span>
            <span class="tag">高效便捷</span>
          </div>
        </div>
      </div>

      <!-- 模型展示区域 -->
      <div class="models-showcase">
        <div class="models-header">
          <i class="el-icon-star-on"></i>
          <span>支持的AI模型</span>
        </div>
        <div class="models-grid">
          <div 
            v-for="item in llmsModelInfo" 
            :key="item.modelId" 
            class="model-card">
            <div class="model-icon">
              <i class="el-icon-cpu">  
                <span class="model-desc">{{ item.name + '-' + item.ver }}</span>
             </i>
            </div>
            <div class="model-name">{{item.desc}}</div>
          </div>
        </div>
      </div>

      <!-- 登录按钮区域 -->
      <div class="login-action">
        <el-button 
          class="login-btn" 
          type="primary" 
          size="large"
          @click="showForm()">
          <i class="el-icon-user"></i>
          开始使用 - 注册/登录
        </el-button>
        <p class="login-hint">立即体验智能AI对话服务</p>
      </div>
    </div>
    <el-dialog
            title="用户登录"
            :visible.sync="showLoginForm"
            :show-close="true"
            :fullscreen="true"
            center>
            <div class="login-container"  id="login_from">
              <el-form ref="loginForm"  :model="loginData" :rules="loginRules" class="login-form">
                <el-form-item label="登录名"  prop="username">
                  <el-input v-model="loginData.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                  <el-input type="password" v-model="loginData.password"></el-input>
                </el-form-item>
                <el-form-item label="验证码"   prop="captcha">
                  <el-input v-model="loginData.captcha"  placeholder="请输入图片验证码"></el-input>
                </el-form-item>
                <div class="captcha flex-container">
                  <img width="80%" height="38" :src="captchaImageSource" @click="generateCaptcha" title="点击刷新验证码" v-if="captchaImage">
                  <el-button   @click="generateCaptcha">更换</el-button>
                </div>
                <el-form-item label="邀请码">
                  <el-input v-model="loginData.invite_code"  placeholder="注册请输入邀请码，登录无需"></el-input>
                </el-form-item>
                <el-form-item  label="">
                  <div class="login-container-botton">
                    <el-button type="primary" @click="registerForm('loginForm')">注册</el-button>
                    <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
                  </div>
                </el-form-item>
              </el-form>
            </div>
    </el-dialog>

  </div>
</template>

<script>
  import {get_captcha} from  '@/utils/request.js';
  import {member_login} from  '@/utils/request.js'
  import {member_register} from  '@/utils/request.js'
  export default {
    name: 'AppLogin',
    props: {
      token: String,
      session_id: String,
      smallWidth:Boolean,
      llmsModelInfo:Array,
    },
    comments:{

    },
    data() {
      return {
        loginData: {
            username: '',
            password: '',
            captcha: ''
        },
        loginRules: {
          username: [{ required: true, message: '请输入登录名', trigger: 'blur' }],
          password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
          captcha: [{ required: true, message: '请输入图片验证码', trigger: 'blur' }]
        },
        captchaImage: '' ,
        tokenVal:'',
        sessionIdVal:'',
        showLoginForm:false,
      };
    },

    created(){

    },
    computed: {
      captchaImageSource() {
        return 'data:image/jpg;base64,' + this.captchaImage;
      }
    },
    watch: {
      tokenVal(newToken) {
        this.$emit('update:token', newToken); //
      },
      sessionIdVal(newSessionId) {
        this.$emit('update:session_id', newSessionId); //
      },
      showLoginForm(val){
          if(val){
             this.generateCaptcha();
          }
      },
    },
    methods: {
  
      showForm(){
        this.showLoginForm=true;
      },
      generateCaptcha() {
        get_captcha().then(data => {
         this.captchaImage= data;
      })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            member_login(this.loginData).then(data => {
              if(data){
                this.$message.success('欢迎使用!')
                this.tokenVal=data.token;
                this.sessionIdVal=data.session_id;
                localStorage.setItem('token',this.tokenVal);
                localStorage.setItem('session_id',this.sessionIdVal);
              }
            }) .catch(error => {
              console.error(error); //
            });
          } else {
            this.$message.error('表单验证失败！');
            return false;
          }
        });
      },
        registerForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    member_register(this.loginData).then(data => {
                      if(data) {
                        this.$message.success('欢迎使用!')
                        this.tokenVal = data.token;
                        this.sessionIdVal = data.session_id;
                        localStorage.setItem('token', this.tokenVal);
                        localStorage.setItem('session_id', this.sessionIdVal);
                      }
                    }) .catch(error => {
                        console.error(error); //
                    });
                } else {
                    this.$message.error('表单验证失败！');
                    return false;
                }
            });
        },

    },
  };
</script>

<style scoped>
/* 主登录页面容器 */
.login-main {
  min-height: 100vh;
  background: linear-gradient(135deg, 
    rgba(251, 119, 80, 0.1) 0%, 
    rgba(253, 253, 248, 0.95) 30%, 
    rgba(251, 119, 80, 0.05) 70%,
    rgba(253, 253, 248, 0.9) 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
}

.login-main::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(251, 119, 80, 0.05) 0%, transparent 70%);
  animation: rotate 20s linear infinite;
  z-index: 0;
}

@keyframes rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 主标题区域 */
.hero-section {
  text-align: center;
  margin-bottom: 60px;
  position: relative;
  z-index: 1;
}

.hero-content {
  max-width: 600px;
  margin: 0 auto;
}

.main-title {
  font-size: 3.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.main-title.mobile {
  font-size: 2.5rem;
  flex-direction: column;
  gap: 10px;
}

.title-icon {
  color: #fb7750;
  font-size: 3rem;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.sub-title {
  font-size: 1.3rem;
  color: #666;
  margin-bottom: 30px;
  font-weight: 400;
  line-height: 1.6;
}

.sub-title.mobile {
  font-size: 1.1rem;
}

.feature-tags {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
}

.tag {
  background: linear-gradient(135deg, #fb7750, #fb8d6d);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(251, 119, 80, 0.3);
  transition: all 0.3s ease;
}

.tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(251, 119, 80, 0.4);
}

/* 模型展示区域 */
.models-showcase {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 50px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(251, 119, 80, 0.2);
  position: relative;
  z-index: 1;
  max-width: 800px;
  width: 100%;
}

.models-header {
  text-align: center;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
}

.models-header i {
  color: #fb7750;
  font-size: 1.4rem;
}

.models-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.model-card {
  background: linear-gradient(135deg, rgba(251, 119, 80, 0.05), rgba(255, 255, 255, 0.8));
  border: 1px solid rgba(251, 119, 80, 0.2);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.model-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(251, 119, 80, 0.2);
  border-color: #fb7750;
}
.model-desc {
  color: #fb7750;
  font-size: 16px;
  padding: 10px 0px 10px;
  display: flex;
  align-items: center;
  height: 100%;
}
.model-icon {
  margin-bottom: 12px;
}

.model-icon i {
  font-size: 2rem;
  color: #fb7750;
}

.model-name {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
}

/* 登录按钮区域 */
.login-action {
  text-align: center;
  position: relative;
  z-index: 1;
}

.login-btn {
  background: linear-gradient(135deg, #fb7750, #fb8d6d) !important;
  border: none !important;
  border-radius: 25px !important;
  padding: 15px 40px !important;
  font-size: 1.1rem !important;
  font-weight: 600 !important;
  box-shadow: 0 4px 15px rgba(251, 119, 80, 0.4) !important;
  transition: all 0.3s ease !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 10px !important;
}

.login-btn:hover,
.login-btn:focus {
  transform: translateY(-3px) !important;
  box-shadow: 0 8px 25px rgba(251, 119, 80, 0.5) !important;
  background: linear-gradient(135deg, #fb8d6d, #fba088) !important;
}

.login-btn i {
  font-size: 1.2rem;
}

.login-hint {
  margin-top: 15px;
  color: #666;
  font-size: 0.95rem;
  font-style: italic;
}

/* 登录表单对话框样式 */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, 
    rgba(251, 119, 80, 0.05) 0%, 
    rgba(253, 253, 248, 0.95) 100%);
  min-height: 100vh;
  padding: 20px;
}

.login-container-botton {
  display: flex;
  justify-content: center;
  padding: 20px;
}
.login-form {
  width: 100%;
  max-width: 450px;
  background: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(251, 119, 80, 0.2);
}

.captcha {
  margin-bottom: 20px;
}

.captcha img {
  vertical-align: middle;
  cursor: pointer;
  border-radius: 6px;
  border: 1px solid rgba(251, 119, 80, 0.3);
  transition: all 0.3s ease;
}

.captcha img:hover {
  border-color: #fb7750;
  box-shadow: 0 2px 8px rgba(251, 119, 80, 0.3);
}

.flex-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Element UI 组件样式覆盖 */
::v-deep .el-form-item__label {
  color: #2c3e50 !important;
  font-weight: 600 !important;
}

::v-deep .el-input__inner {
  border: 1px solid rgba(251, 119, 80, 0.3) !important;
  border-radius: 8px !important;
  transition: all 0.3s ease !important;
}

::v-deep .el-input__inner:focus {
  border-color: #fb7750 !important;
  box-shadow: 0 0 0 2px rgba(251, 119, 80, 0.2) !important;
}

::v-deep .el-button--primary {
  background: linear-gradient(135deg, #fb7750, #fb8d6d) !important;
  border: none !important;
  border-radius: 8px !important;
  font-weight: 600 !important;
  transition: all 0.3s ease !important;
}

::v-deep .el-button--primary:hover,
::v-deep .el-button--primary:focus {
  background: linear-gradient(135deg, #fb8d6d, #fba088) !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(251, 119, 80, 0.4) !important;
}

::v-deep .el-dialog {
  border-radius: 0px !important;
  overflow: hidden !important;
}

::v-deep .el-dialog__header {
  background: linear-gradient(135deg, #fb7750, #fb8d6d) !important;
  color: white !important;
  padding: 20px !important;
}

::v-deep .el-dialog__title {
  font-weight: 600 !important;
  font-size: 1.2rem !important;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-main {
    padding: 20px 10px;
  }
  
  .models-showcase {
    padding: 30px 20px;
    margin-bottom: 40px;
  }
  
  .models-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
  }
  
  .model-card {
    padding: 15px;
  }
  
  .login-btn {
    padding: 12px 30px !important;
    font-size: 1rem !important;
  }
  
  .login-form {
    padding: 30px 20px;
  }
}

@media (max-width: 480px) {
  .feature-tags {
    flex-direction: column;
    align-items: center;
  }
  
  .models-grid {
    grid-template-columns: 1fr;
  }
}
</style>
