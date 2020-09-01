<template>
  <div>
    <el-form :inline="true"  class="demo-form-inline">
      <el-row :gutter="20">
        <el-col :span="3">
          <el-form-item label="类型: ">
            <el-select v-model="categoryValue" placeholder="请选择" style="width:120px;">
              <el-option
                v-for="item in options.category"
                :key="item.id"
                :label="item.category_name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="日期: ">
            <el-date-picker
              v-model="dateValue"
              type="datetimerange"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
              :default-time="['12:00:00','08:00:00']"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label="关键字: ">
            <el-select v-model="search_key" style="width:80px;">
              <el-option
                v-for="item in searchOption"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-input v-model="search_keywork" placeholder="请输入内容"></el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="danger" @click="getList">搜索</el-button>
        </el-col>
        <el-col :span="3">
          <el-button type="danger" class="pull-right" @click="dialog_info=true">新增</el-button>
        </el-col>
      </el-row>
    </el-form>
    <!-- 表格 -->
    <el-table :data="tableData.item" border style="width: 100%" v-loading="loadingData"  @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="45"></el-table-column>
      <el-table-column prop="title" label="标题" width="830"></el-table-column>
      <el-table-column prop="categoryId" label="类别" width="130" :formatter="toCategory"></el-table-column>
      <el-table-column prop="createDate" label="日期" width="237" :formatter="toData"></el-table-column>
      <el-table-column prop="user" label="管理人" width="115"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="deleteItem(scope.row.id)">删除</el-button>
          <el-button type="success" size="mini" @click="editInfo(scope.row.id)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 底部分页 -->
    <el-row>
      <el-col :span="12">
        <el-button @click="deleteAll">批量删除</el-button>
      </el-col>
      <el-col :span="12">
        <el-pagination
          class="pull-right"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          background
          layout="total,sizes,prev, pager, next,jumper"
          :page-sizes="[10, 20, 30, 40]"
          :total="total"
        ></el-pagination>
      </el-col>
    </el-row>
    <!-- 新增弹窗 -->
    <DialogInfo :flag="dialog_info" @close="closeDIalog" @getList="getList" :category="options.category"/>
    <!-- 修改弹窗 -->
    <DialogEditInfo :flag="dialog_info_edit" :id="infoId" @close="closeDIalog" @getList="getList" :category="options.category"/>
  </div>
</template>
<script>
import {common} from "@/api/common"
import {GetCategory, GetList } from "../../api/news";
import DialogInfo from "./dialog/info";
import DialogEditInfo from "./dialog/edit";
import { ref, reactive, isRef, toRefs, onMounted,computed,watch } from "@vue/composition-api";
import { timestampToTime } from "@/utils/common.js"
import {DeleteInfo} from "@/api/news"
export default {
  //:picker-options="pickerOptions"
  name: "infoIndex",
  components: {
    DialogInfo,
    DialogEditInfo
  },
  setup(props, context) {
     //基础数据
    const search_key = ref("id");
    const categoryValue = ref("");
    const dateValue = ref("");
    const search_keywork = ref("");
    const total = ref(0)
    const loadingData = ref(false)
    const deleteInfoId = ref("")
    const dialog_info_edit = ref(false)
    const infoId = ref("");
    //页码
    const page = reactive({
      pageNumber:1,
      pageSize:10
    })
    //信息弹窗标记
    const dialog_info = ref(false);
    const options = reactive({
      category:[]
    });
    const { getInfoCategory,Category } = common();

    //表格数据
    const tableData = reactive({
       item:[]
    });
    //搜索关键字
    const searchOption = reactive([
      { value: "id", label: "ID" },
      { value: "title", label: "标题" }
    ]);
    //监听watch
     watch(() => Category.item,(value)=>{
       options.category = value
     })
    //vue2.0 methods
    //编辑弹窗
    const editInfo = (id) => {
      infoId.value = id
     dialog_info_edit.value = true
    }
    //删除单个
    const deleteItem = (id) => {
         deleteInfoId.value = [id]
       context.root.confirm({
         content:"确认删除当前信息",
         fn:confirmDelete,
         id:"22222"
       });
     };
     //删除所有
    const deleteAll = ()=>{
      if(!deleteInfoId.value || deleteInfoId.value.length ==0){
           context.root.$message({
              message:"请选择要删除的数据",
              type:"error"
           })
         return false  
      }
      //vue2.0 this.aaaa()
      //vue3.0
      context.root.confirm({
        content:"确认删除全部信息",
        fn:confirmDelete,
        id:"111111"
      });
    }
   const confirmDelete = (value) =>{
       DeleteInfo({id:deleteInfoId.value}).then(response => {
          deleteInfoId.value = ""
          getList()
       }).catch(error => {

       })
     }
     const handleSelectionChange = (val) => {
        let id = val.map(item => item.id);
        deleteInfoId.value = id
     }
    const handleSizeChange = val => {
      page.pageSize = val
       getList()
    };
    const handleCurrentChange = val => {
       page.pageNumber = val
       getList()
    };
    const closeDIalog = e => {
      dialog_info.value = e;
      dialog_info_edit.value = e;
    };
    const formatData = () => {
      let requestData = {
          pageNumber: page.pageNumber,
          pageSize:page.pageSize
      };
      //分类id
      if(categoryValue.value){requestData.categoryId=categoryValue.value}
      //日期
      if(dateValue.value.length > 0 ){
        requestData.startTiem = dateValue.value[0]
        requestData.endTime = dateValue.value[1]
      }
      //关键字
      if(search_keywork.value){ requestData[search_key.value] = search_keywork.value}
      
      return requestData
    }
    const getList = () => {
        loadingData.value = true
        //单独处理数据
          let requestData = formatData()
          GetList(requestData).then(response => {
             tableData.item = response.data.data.data
             //页码
             total.value = response.data.data.total
             loadingData.value = false
          }).catch(error => {
             loadingData.value = false
          })
    }
    //格式化时间内容
    const toData = (row, column, cellValue, index) => {
       return timestampToTime(row.createDate);  
    }
    const toCategory = (row)=>{
         let categoryId = row.categoryId
         let categoryData = options.category.filter(item => item.id == categoryId)[0];
        return categoryData.category_name;
    }
    //生命周期
    onMounted(()=>{
      getInfoCategory()
      getList()
    })
    return {
      dialog_info,
      handleCurrentChange,
      handleSizeChange,
      options,
      categoryValue,
      dateValue,
      searchOption,
      search_key,
      search_keywork,
      tableData,
      closeDIalog,
      deleteItem,
      deleteAll,
      GetList,
      total,
      confirmDelete,
      loadingData,
      toData,
      toCategory,
      deleteInfoId,
      handleSelectionChange,
      formatData,
      getList,
      dialog_info_edit,
      editInfo,
      infoId
    };
  }
};
</script>
<style lang="scss" scoped>
</style>