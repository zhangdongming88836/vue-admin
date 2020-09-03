<template>
  <div>
    <el-form :inline="true" class="demo-form-inline">
      <el-row :gutter="16">
        <el-col :span="20">
          <SelectVue :config="data.configOption"/>
          <el-input  placeholder="请输入内容" style="width:120px;"></el-input>
          <el-button type="danger">搜索</el-button>
        </el-col>
        <el-col :span="4">
          <el-button type="danger" class="pull-right">添加用户</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import {ref, reactive, onMounted,watch,computed } from "@vue/composition-api"
//下拉选择组件
import SelectVue from "@/components/Select/index.vue"
export default {
    components:{
      SelectVue
    },
    name:"userIndex",
    //基础数据vue2.0的data
    setup(props,context){
        const data = reactive({
            configOption :["name","phone","email"],
         
        })
     //函数vue2.0 methods   
        return {
            data
        }
    }
};
</script>
<style lang="scss" scoped>
</style>