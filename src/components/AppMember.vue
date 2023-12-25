<template>
  <el-dialog
      title="用户信息编辑"
      :visible.sync="showMemberVal"
      fullscreen="true"
      :show-close="false"
      center>
      <div class="login-container">
        <el-form  ref="memberForm" :model="memberData"  label-width="100px" >
          <el-form-item label="登录名">
            <el-input  placeholder="Please input"  :disabled="true" v-model="memberData.login_name"></el-input>
          </el-form-item>
          <el-form-item  placeholder="Please input" label="手机" >
            <el-input  v-model="memberData.mobile"></el-input>
          </el-form-item>
          <el-form-item  placeholder="Please input" label="邮箱" >
            <el-input type="text" v-model="memberData.email"></el-input>
          </el-form-item>
          <el-form-item  placeholder="Please input" label="旧密码">
            <el-input type="password"  v-model="memberData.password" ></el-input>
          </el-form-item>
          <el-form-item  placeholder="为空则保留原密码" label="新密码">
            <el-input type="password" v-model="memberData.new_password"></el-input>
          </el-form-item>
          <el-form-item  placeholder="为空则保留原密码" label="重复新密码">
            <el-input type="password" v-model="memberData.new_password1"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('memberForm')">提交</el-button>
            <el-button type="primary" @click="closeDg('memberForm')">关闭</el-button>
          </el-form-item>
        </el-form>
      </div>
  </el-dialog>
</template>

<script>
import {member_info} from  '@/utils/request.js';
import {member_edit} from  '@/utils/request.js'
import { MessageBox } from "element-ui";

export default {
  name: 'AppMember',
  props: {
    showMember:Boolean,
  },
  data() {
    return {
      memberData: {
        login_name: '',
        email: '',
        mobile: '',
        password:'',
        new_password: '',
        new_password1: ''
      },
      loginRules: {

      },

    };
  },
  created(){
    let token=localStorage.getItem('token');
    if(token){
      this.get_member_info()
    }
  },
  computed: {
    showMemberVal(){
      return  this.showMember;
    }
  },
  watch: {
    showMember(){
      if(this.showMember){
        this.get_member_info();
      }
    },
  },
  methods: {
    closeDg(){
      this.$emit('update:showMember', false);
    },
    get_member_info() {
      let token=localStorage.getItem('token');
      member_info(token).then(data => {
        this.memberData= data[0];
        // this.memberData.password=''
        // this.memberData.new_password=''
        // this.memberData.new_password1=''
        console.log('captcha:',data);
      }) .catch(error => {
        console.error(error); // 如果发生错误，会打印错误信息
      });
    },
    submitForm(formName) {
      if(this.memberData.new_password !== this.memberData.new_password1){
        MessageBox.alert('两次输入新密码不一致！','提示')
        return false;
      }
      let token=localStorage.getItem('token');
      this.$refs[formName].validate((valid) => {
        if (valid) {
          member_edit(token,this.memberData).then(data => {
            if(Object.keys(data).length>0){
              MessageBox.alert('修改成功！','提示')
              console.log(data)
              this.closeDg('memberForm')
            }
          }) .catch(error => {
            console.error(error);
          });
        } else {
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
</style>
