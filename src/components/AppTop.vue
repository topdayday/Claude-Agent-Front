<template>
  <div class="top">
    <div class="top-left" @click="toTop()">
      <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M11.54 2H9.09l4.46 12H16L11.54 2ZM4.46 2 0 14h2.5l.9-2.52h4.68L8.99 14h2.5L7.02 2H4.46Zm-.24 7.25 1.52-4.22 1.53 4.22H4.22Z"></path></svg>
    </div>
    <div class="top-center">
      <el-select v-if="!smallWidth" v-model="model_type" placeholder="请选择模型">
        <el-option
            v-for="model in model_types"
            :key="model.value"
            :label="model.label"
            :value="model.value"
            :disabled="model.disabled">
        </el-option>
      </el-select>
    </div>
    <div class="top-right">
      <div class="top-button-contains">
        <el-button  class="top-button el-icon-refresh"    @click="newSession()"></el-button>
        <el-button  class="top-button el-icon-document"    @click="setDrawer()"></el-button>
        <el-button  class="top-button el-icon-edit-outline"    @click="setMember()"></el-button>
        <el-button  class="top-button el-icon-close"    @click="loginOut()"></el-button>
      </div>
    </div>
  </div>
</template>

<script>

import {generate_session} from "@/utils/request";
export default {
  name: 'AppTop',
  props: {
    showDrawer: Boolean, session_id: String,token:String,showMember:Boolean,selectedModel:Number,smallWidth:Boolean
  },
  data(){
    return {
      model_types: [{
        value: 0,
        label: 'Calude 2.1'
      }, {
        value: 10,
        label: 'Llama2 70b',
      }, {
        value: 2,
        label: 'Gemini Pro'
      }],
      model_type: 0,
    }
  },
  watch:{
    model_type(model_type){
     this.$emit('selectModel',model_type)
    },
    selectedModel(selectedModel){
      this.model_type=selectedModel;
    },
  },
  mounted() {
    let m_type =localStorage.getItem('model_type');
    if(m_type!=null){
      this.model_type=Number(m_type);
    }
  },
  methods:{
    toTop(){
      window.scrollTo({ top: 0, behavior: 'smooth' }); // 平滑滚动到顶部
    },
    setMember(){
      this.$emit('update:showMember', true);
    },
    setDrawer(){
      this.$emit('update:showDrawer', true);
    },
    newSession(){
      let token=localStorage.getItem('token');
      generate_session(token).then(data => {
        localStorage.setItem('session_id',data);
        this.$emit('update:session_id', data); //
        console.log('generate_session:',data);
      }) .catch(error => {
        console.error(error);
        this.loading=false;
      });
    },
    loginOut(){
      localStorage.removeItem('token');
      localStorage.removeItem('session_id');
      this.$emit('update:token', null);
      this.$emit('update:session_id', null);
    }
  }
}
</script>

<style scoped>
  .top{
    width: 100%;
    height: 30px;
    background: linear-gradient(to bottom,
    rgba(0,0,0,0.1),
    rgba(253,253,248,0.1));
    display: flex;
  }
  .top-left{
    width:  50px;
    margin-left: 5px;
  }

  .top-center{
    flex: 1;
    font-weight: bold;
    text-align: left;
    margin-top: 2px;
    margin-left:210px;
  }
  .top-right{
    width: 150px;
    margin-top: 2px;
  }
  .top-button-contains{
    display: flex;
    justify-content: flex-end;
  }
  .top-button{
    background-color: rgba(255,255,255,0.2);;
    color: black;
    height: 28px;
    padding: 5px 5px;
    border: 0px;
  }

  ::v-deep .el-button--primary{
    background-color: rgba(255,255,255,0.2);
    border: 0px;
    height: 30px;
  }

  ::v-deep  .el-button--primary:focus, .el-button--primary:hover{
    background-color: rgba(255,255,255,0.2);
    border: 0px;
    height: 30px;
  }
  ::v-deep  .el-select{
    max-height: 30px;
  }

  ::v-deep  .el-input__inner {
    -webkit-appearance: none;
    background-color: rgba(255,255,255,0.001);
    background-image: none;
    border-radius: 4px;
    border: 1px solid rgba(255,255,255,0.01);
    box-sizing: border-box;
    color: #000000;
    font-weight: bold;
    display: inline-block;
    height: 30px;
    line-height: 30px;
    outline: 0;
    padding-left: 30px;
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    width: 100%;
    text-align: center;
  }
  ::v-deep  .el-input__suffix{
    display: none;
    width: 1px;
  }
  ::v-deep  .el-input__inner{
    text-align: left;
    padding: 0 20px;
  }
</style>
