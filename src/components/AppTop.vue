<template>
  <div class="top">
    <div v-bind:class="{top_left:showLeftMenu, top_left_hide:!showLeftMenu,}" v-if="!smallWidth">
      <el-button @click="changLeftMenu(false)" v-if="showLeftMenu"
                 style="border: 0px;background-color: rgba(0,0,0,0);height: 35px;" icon="el-icon-d-arrow-left"  size="small"></el-button>
      <el-button @click="changLeftMenu(true)"  v-else
                 style="border: 0px;background-color: rgba(0,0,0,0);height: 35px;" icon="el-icon-d-arrow-right" size="small"></el-button>
    </div>
    <div class="top-center">
      <el-select  v-model="model_type" placeholder="请选择模型" style="max-width:150px;">
        <el-option
            v-for="model in llmsModelInfo"
            :key="model.modelId"
            :label="model.name"
            :value="model.modelId">
        </el-option>
      </el-select>
    </div>
    <div class="top-right">
      <div class="top-button-contains">
        <el-button  class="top-button el-icon-upload2"    @click="scrollToTop()"></el-button>
        <el-button  class="top-button el-icon-download"    @click="scrollToBottom()"></el-button>
        <el-button  class="top-button el-icon-edit-outline"    @click="changeEditable()"></el-button>
        <el-button  class="top-button el-icon-plus"    @click="newSession()"></el-button>
        <el-button  class="top-button el-icon-time"    @click="setDrawer()"></el-button>
        <el-button  class="top-button el-icon-user"    @click="setMember()"></el-button>
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
    showDrawer: Boolean, session_id: String,token:String,showMember:Boolean,editable:Boolean,
    selectedModel:Number,smallWidth:Boolean,showLeftMenu:Boolean,llmsModelInfo:Array,
  },
  data(){
    return {
      model_type: 50,
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
    }else{
      this.model_type=this.llmsModelInfo[0].modelId;
    }
  },
  methods:{
 
    changeEditable(){
      this.$emit('update:editable', !this.editable);
    },

    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    },

    scrollToBottom() {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    },

    changLeftMenu(val){
      this.$emit('setLeftMenu', val);
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
  .top_left{
    width:  20px;
    margin-left: 260px;
  }
  .top_left_hide{
    width:  20px;
    margin-left: 2px;
  }

  .top-center{
    flex: 1;
    text-align: left;
    margin-top: 2px;
    margin-left:10px;
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
    background-color: rgba(255,255,255,0);
    color: black;
    height: 28px;
    padding: 5px 5px;
    border: 0px;
  }

  ::v-deep .el-button--primary{
    background-color: rgba(255,255,255,0);
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
