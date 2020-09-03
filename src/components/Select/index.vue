<template>
  <el-form-item label="类型: ">
    <el-select v-model="data.selectValue" placeholder="请选择" style="width:120px;">
      <el-option
        v-for="item in data.initOption"
        :key="item.value"
        :value="item.value"
        :label="item.label"
      ></el-option>
    </el-select>
  </el-form-item>
</template>
<script>
import {ref,reactive,onMounted,watch,computed} from "@vue/composition-api"
export default {
    name : "",
    props :{
      config:{
         type:Array,
         default:()=>{} 
      }
    },
    setup(props,context){
        const data = reactive({
            selectValue :"",
            initOption:[],
            option:[
                {value:"name",label:"姓名"},
                {value:"phone",label:"手机号"},
                {value:"email",label:"邮箱"},
                {value:"id",label:"ID"},
                {value:"title",label:"标题"},
            ]
        })
        /*
        *初始化下拉选项
        */
         let initOption = () => {
             let optionArr = [];
           props.config.forEach(item =>{
               let arr= data.option.filter(elem =>elem.value==item)[0]
               optionArr.push(arr)
                
            })
            //初始化赋值
            data.initOption = optionArr
            //初始化搜索类型
            data.selectValue = optionArr[0].value
         }
        //生命周期加载完成onMounted
        onMounted(()=>{
           initOption()
        })
      return {
        data
      }
    }
}
</script>
<style lang="scss" scoped>
</style>