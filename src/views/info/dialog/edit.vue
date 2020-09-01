<template>
  <div>
    <el-dialog
      title="编辑"
      :visible.sync="dialogInfo"
      @close="close"
      width="580px"
      @open="openDialog"
    >
      <el-form :model="form" ref="addInfoForm">
        <el-form-item label="类型:" :label-width="formLabelWidth">
          <el-select v-model="form.category" placeholder="请选择活动区域">
            <el-option
              v-for="item in categoryOption.item"
              :key="item.id"
              :label="item.category_name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题:" :label-width="formLabelWidth">
          <el-input v-model="form.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="概况:" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.content" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit" :loading="submitLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

import { AddInfo,GetList,EditInfo } from "@/api/news"
import { ref, reactive, watch } from "@vue/composition-api";
export default {
  name: "dialogInfo",
  //单项数据流 父级 -> 子级 不能反向修改
  props: {
    flag: {
      type: Boolean,
      default: false
    },
    category: {
      type: Array,
      default: () => {}
    },
    id:{
      type:String,
      default:""
    },
  },
  setup(props, context) {
    const dialogInfo = ref(false);
    const formLabelWidth = ref("70px");
    const submitLoading = ref(false);
    const form = reactive({
        category:"",
        title:"",
        content:""
    });
    const categoryOption = reactive({
      item: []
    });
    //watch
    watch(() => {
      dialogInfo.value = props.flag;
    });
    const openDialog = () => {
      categoryOption.item = props.category;
      getInfo()
      console.log(props.id)
    };
    //vue2.0 methods
    const getInfo = () => {
      let requestData = {
        pageNumber: 1,
        pageSize: 1,
        id:props.id
      }
      GetList(requestData).then(response => {
        let data = response.data.data.data[0];
           form.category=data.categoryId,
           form.title=data.title,
           form.content=data.content
      }).catch(error => {

      })
    }
    const close = () => {
      dialogInfo.value = false;
      context.emit("close", false);
         form.category = ""
         form.title = ""
         form.content = ""
    };
    const submit = () => {
      submitLoading.value = true
      let requestData = {
        id:props.id,
        categoryId:form.category,
        title:form.title,
        content:form.content,
      }
      EditInfo(requestData).then(response => {
        //  if(response.data.resCode === 0){
        //     context.emit("asdf",requestData)
        //  }
          context.root.$message({
            message:response.data.message,
            type:"success"
          })
         submitLoading.value = false
          context.emit("getList");
         //重置表单
         form.category = ""
         form.title = ""
         form.content = ""
      }).catch(error => {
         submitLoading.value = false
      })
    }
    return {
      dialogInfo,
      formLabelWidth,
      form,
      close,
      openDialog,
      categoryOption,
      submit,
      submitLoading
    };
  }

  //   watch: {
  //     flag: {
  //       handler(newValue, oldValue) {
  //         this.dialogInfo = newValue;
  //       }
  //     }
  //   }
};
</script>>
<style lang="scss"  scoped>
</style>>