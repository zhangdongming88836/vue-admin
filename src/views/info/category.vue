<template>
  <div id="category">
    <el-button type="danger" @click="addFirst({type:'category_first_add'})">添加一级分类</el-button>
    <div>
      <el-row :gutter="30">
        <el-col :span="8">
          <div class="category" v-for="firstItem in category.item" :key="firstItem.id">
            <!-- 一级分类start -->
            <h4>
              <svg-icon icon-class="jian"></svg-icon>
              {{firstItem.category_name}}
              <div class="button-group">
                <el-button
                  size="mini"
                  type="danger"
                  @click="editCategory({data:firstItem,type:'category_first_edit'})"
                >编辑</el-button>
                <el-button size="mini" type="success" @click="handerAdd({data:firstItem,type:'category_children_add'})">添加子级</el-button>
                <el-button size="mini" @click="deleteCategory(firstItem.id)">删除</el-button>
              </div>
            </h4>
            <!-- 一级分类end -->
            <!-- 子级分类start -->
            <ul v-if="firstItem.children">
              <li v-for="childrenItem in firstItem.children" :key="childrenItem.id">
                {{childrenItem.category_name}}
                <div class="button-group">
                  <el-button size="mini" type="success">添加子级</el-button>
                  <el-button size="mini">删除</el-button>
                </div>
              </li>
            </ul>
            <!-- 子级分类end -->
          </div>
        </el-col>
        <el-col :span="16">
          <h4 class="menu-title">一级分类编辑</h4>
          <el-form label-width="142px" class="w410" ref="categoryFrom">
            <el-form-item label="一级的名称:" v-if="category_first">
              <el-input v-model="from.categoryName"></el-input>
            </el-form-item>
            <el-form-item label="二级的名称:" v-if="category_children">
              <el-input v-model="from.secCategoryName"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="danger" @click="submit" :loading="submit_loading">确定</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import {common} from "@/api/common"
import { AddFirstCategory, GetCategory, DeleteCategory,EditCategory,AddChildrenCategory } from "../../api/news";
import { ref, reactive, onMounted,watch } from "@vue/composition-api";
export default {
  name: "category",
  setup(props, context) {
    const { getInfoCategory,getInfoCategoryAll,Category } = common();
    const from = reactive({
      categoryName: "",
      secCategoryName: ""
    });
    const subit_button_type = ref("");
    const category_first = ref(true);
    const category_children = ref(true);
    const deleteId = ref("");
    const category = reactive({
      item: [],
      current:[]
    });
    const submit_loading = ref(false);
    /*
     *methods v2.0
     */
    const submit = () => {
      if (subit_button_type.value === "category_first_add") {
        submit_loading.value = true;
        AddFirstCategory({ categoryName: from.categoryName })
          .then(response => {
            let data = response.data;
            if (data.resCode === 0) {
              context.root.$message({
                message: data.message,
                type: "success"
              });
              category.item.push(response.data.data);
            }
            submit_loading.value = false;
            from.categoryName = "";
          })
          .catch(error => {
            submit_loading.value = false;
            from.categoryName = "";
          });
      }
      if(subit_button_type.value === "category_first_edit"){
         editFirstCategory();
      }
      if(subit_button_type.value === "category_children_add"){
        addChildrenCategory()
      }
    };

    const addFirst = e => {
      subit_button_type.value = e.type;
      category_first.value = true;
      category_children.value = false;
    };
    //子级
    const handerAdd = (props) => {
      //更新确定按钮类型
      subit_button_type.value = props.type;
      //存储数据
      category.current = props.data
      //显示一级分类
      from.categoryName = props.data.category_name
      from.secCategoryName = ""
    }
    const addChildrenCategory = () => {
       let requestData = {
          categoryName:from.secCategoryName,
          parentId:category.current.id
       } 
       AddChildrenCategory(requestData).then(response => {
            if(response.data.resCode === 0){
              context.root.$message({
                message:response.data.message,
                type:"success"
              })
            }
            getInfoCategoryAll();
            from.secCategoryName = ""
       }).catch(error => {

       })
    }
    const deleteCategory = id => {
      deleteId.value = id;
      context.root.confirm({
        content: "确认删除当前信息",
        fn: confirmDelete,
        catchFn: () => {
          deleteId.value = "";
        }
      });
    };
    const confirmDelete = () => {
      DeleteCategory({ categoryId: deleteId.value })
        .then(response => {
          //操作数组splice  es6findIndex
          let index = category.item.findIndex(
            item => item.id == deleteId.value
          );
          category.item.splice(index, 1);
        })
        .catch(error => {});
    };
    const editCategory = e => {
      subit_button_type.value = e.type;
      category_children.value = false;
      from.categoryName = e.data.category_name;
      //存储当前的对象
       category.current = e.data
    };
    const editFirstCategory = () => {
       if(category.current.length == 0){
          context.root.$message({
            message:"未选择分类",
            type:"error"
          })
         return false
       }
       let requestData = {
         id:category.current.id,
         categoryName:from.categoryName
       } 
        EditCategory(requestData).then(respons=>{
          
          context.root.$message({
            message:respons.data.message,
            type:"success"
          })
          //  let index = category.item.findIndex(
          //   item => item.id == requestData.id
          // );
          category.current.category_name= respons.data.data.data.categoryName
           //清空
           from.categoryName = ""
            category.current = []
        }).catch(erroe=>{

        })
    }
    /*
     * 声明周期 挂载完成时执行 （页面DOM元素完成时，实例完成）
     */
    onMounted(() => {
      getInfoCategoryAll();
    });
     //监听watch
     watch(() => Category.item,(value)=>{
       category.item = value
     })
    return {
      from,
      submit,
      addFirst,
      category_first,
      category_children,
      category,
      submit_loading,
      deleteCategory,
      deleteId,
      editCategory,
      handerAdd,
      addChildrenCategory
    };
  }
};
</script>
<style lang="scss" scoped>
.menu-title {
  line-height: 44px;
  padding-left: 22px;
  background-color: #f3f3f3;
}
.category {
  position: relative;
  line-height: 44px;
  &:before {
    content: "";
    position: absolute;
    left: 22px;
    top: 0;
    bottom: 0;
    width: 32px;
    border-left: 1px dotted #000;
  }
  h4 {
    padding-left: 40px;
  }
  li {
    padding-left: 36px;
    margin-left: 24px;
    position: relative;
    &:before {
      content: "";
      position: absolute;
      left: 0;
      top: 20px;
      width: 32px;
      border-bottom: 1px dotted #000;
    }
  }
  li,
  h4 {
    @include webkit(transition, all 0.5s ease 0s);
    &:hover {
      background-color: #f3f3f3;
      .button-group {
        display: block;
      }
    }
  }
}
.button-group {
  display: none;
  position: absolute;
  right: 11px;
  top: -1px;
  button {
    font-size: 12px;
  }
}
.w410 {
  width: 410px;
}
</style>