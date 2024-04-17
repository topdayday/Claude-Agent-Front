<template>
  <div>
    <div class="content-main" id="login_index">
      <h1 class="index_title" v-bind:class="{index_title:smallWidth,index_title_min:smallWidth }">T2Day AI</h1>
      <h2 class="index_title" v-bind:class="{index_title:smallWidth,index_title_min:smallWidth }">集成主流AI大模型</h2>
      <div  class="card_contains">
        <div  v-bind:class="{card_item:true ,hidden: !smallWidth}">
          <ol style="background-color: rgba(255, 255, 255, 0.0);border: 0px; padding-left: 20px;">
            <li> Claude</li>
            <li> Gemini</li>
            <li> Mistral</li>
            <li> PaML</li>
            <li> Llama</li>
            <li> CodeBison</li>
          </ol>
        </div>
        <div>
            <div  v-bind:class="{card_item:true ,hidden: smallWidth}">
             <h3 class="gmat-headline-4 gradient gradient-1">Claude</h3>
            </div>
            <div  v-bind:class="{card_item:true,hidden: smallWidth }">
              <h3 class="gmat-headline-4 gradient gradient-1">Gemini</h3>
            </div>
            <div  v-bind:class="{card_item:true,hidden: smallWidth }">
              <h3 class="gmat-headline-4 gradient gradient-1">Mistral</h3>
            </div>
        </div>
        <div>
            <div  v-bind:class="{card_item:true,hidden: smallWidth }">
              <h3 class="gmat-headline-4 gradient gradient-1">PaML</h3>
            </div>
            <div  v-bind:class="{card_item:true,hidden: smallWidth }">
              <h3 class="gmat-headline-4 gradient gradient-1">LLama</h3>
            </div>
            <div  v-bind:class="{card_item:true ,hidden: smallWidth}">
              <h3 class="gmat-headline-4 gradient gradient-1">CodeBison</h3>
            </div>
        </div>

      </div>
      <div><el-button target="#" class="product_price" @click="showForm()">注册/登录</el-button></div>
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
                  <div class="login-container">
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
      let token=localStorage.getItem('token');
      if(!token){
        this.generateCaptcha();
      }
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
    },
    methods: {
      showForm(){
        this.showLoginForm=true;
      },
      generateCaptcha() {
        get_captcha().then(data => {
         this.captchaImage= data;
          console.log('captcha:',data);
          }) .catch(error => {
            console.error(error); //
          });
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
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
  }

  .login-form {
    width: 400px;
  }
  .login-title {
    text-align: center;
    margin-bottom: 20px;
  }
  .captcha img {
    vertical-align: middle;
    cursor: pointer;
  }

  .flex-container {
    display: flex;
    align-items: center; /* 垂直居中 */
    gap: 10px; /* 子元素之间的间距，根据需要调整 */
  }


  .content{
    background-color: #fcfcfc;
    border: 1px solid #fdfdfd;
    box-shadow:
            0 2px 5px rgba(0,0,0,0.1),
            inset 0 1px 0 rgba(255,255,255,0.1);
    max-width: 780px;
    margin: auto;
    margin-bottom:40px;
    padding: 10px ;
  }

  .content-human{
    margin: auto;
    max-width: 780px;
    background-color: #fdfdfd;
    text-align: left;
    padding-bottom: 10px;
  }
  .content-assistant{
    margin: auto;
    max-width: 780px;
    background-color: #fcfcfc;
    border-top: 1px dotted #d4d4d4;
  }
  .content-main{
    padding-bottom: 36px;
    padding-top: 36px;
  }
  .fixed-bottom {
    position: fixed;
    bottom: 10px;
    width: 100%;
    z-index: 999;
    margin: 2px auto;
    max-width: 804px;
    left: 50%;
    transform: translateX(-50%);
  }
  .btn_sent{
    padding: 9px;
    min-height: 54px;
    min-width: 96px;
  }

  .containt_txt{
    text-align: left;
    padding-left: 20px;
  }


  .card_contains{
    display: flex;
    justify-content:center;
    padding: 0px 50px;
    margin-top:50px;
  }

  .card_item{
    max-width: 400px;
    min-width: 200px;
    background-color: white;
    margin: 20px 3px;
    /*padding: 50px 100px;*/
    border: 1px solid #fdfdfd;
    border-radius: 10px;
    box-shadow:
            0 2px 5px rgba(0,0,0,0.1),
            inset 0 1px 0 rgba(255,255,255,0.1);

  }
  .card_item_max{
    padding: 30px 5px ;
  }
  .index_title{
     margin-top: 100px;
   }
  .index_title_min{
    margin-top: 10px;
  }
  .hidden {
    display: none; /* 或者使用其他隐藏样式，如 visibility: hidden; */
  }
  ::v-deep  p{
    text-align: left;
  }
  ::v-deep  li{
    text-align: left;
    list-style-type: decimal; /* 可以是 circle、disc、square、decimal、lower-roman、upper-roman 等 */
    text-align: left;
    margin: 0 40px;
    min-height: 36px;
  }

  ::v-deep  ul{
    padding: 10px; /* 内边距 */
    background-color: #f5f5f5; /* 背景色 */
    border-bottom: 1px solid #ccc; /* 底部边框 */
    border-top: 1px solid #ccc; /* 底部边框 */
  }

</style>
