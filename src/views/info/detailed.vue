<template>
  <el-form ref="form" :model="form" label-width="120px">
    <el-form-item label="信息分类：">
      <el-select v-model="form.categoryId">
        <el-option
          v-for="item in Category.item"
          :key="item.id"
          :label="item.category_name"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="新闻标题：">
      <el-input v-model="form.title"></el-input>
    </el-form-item>
    <el-form-item label="缩略图：">
      <el-upload
        class="avatar-uploader"
        action="http://up-z2.qiniup.com"
        :data="uploadkey"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-form-item>
    <el-form-item label="发布日期：">
      <el-date-picker v-model="form.dataTime" type="date" placeholder="选择日期" disabled></el-date-picker>
    </el-form-item>
    <el-form-item label="详细内容：">
      <quillEditor v-model="form.content" ref="myQuillEditor" :options="editorOption" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit" :loading="submitLoading">保存</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { timestampToTime } from "@/utils/common.js";
import { GetCategory, GetList, EditInfo } from "@/api/news";
import { QiniuToken } from "@/api/common";
import { ref, reactive, watch, onMounted } from "@vue/composition-api";
//富文本编辑器
import { quillEditor } from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
export default {
  name: "infoDetailed",
  components: {
    quillEditor
  },
  setup(props, { root, emit }) {
    // let id =
    //   root.$route.params.id || root.$store.getters["infoDetailed/infoId"];
    // let title =
    //   root.$route.params.title || root.$store.getters["infoDetailed/infoTitle"];
    /*
     *基础信息
     */
    const Category = reactive({
      id: root.$route.params.id || root.$store.getters["infoDetailed/infoId"],
      item: []
    });
    const form = reactive({
      categoryId: "",
      title: "",
      dataTime: "",
      content: "",
      imageUrl:""
    });
    const submitLoading = ref(false);
    const editorOption = reactive({});
    const uploadkey = reactive({
        token:"",
        key:""
    })
    /*
     *获取信息分类
     */
    const getInfoCategory = () => {
      GetCategory({})
        .then(response => {
          Category.item = response.data.data.data;
        })
        .catch(error => {});
    };
    /*
     *获取当前id的信息
     */
    const getInfo = () => {
      let requestData = {
        pageNumber: 1,
        pageSize: 1,
        id: Category.id
      };
      //获取当前id的数据
      GetList(requestData)
        .then(response => {
          let data = response.data.data.data[0];
          form.categoryId = data.categoryId;
          form.title = data.title;
          form.dataTime = timestampToTime(data.createDate);
          form.content = data.content;
          //   (form.category = data.categoryId),
          //     (form.title = data.title),
          //     (form.content = data.content);
        })
        .catch(error => {});
    };
    /*
     *保存 (修改数据时，必须注意的，一定需要一个ID)
     */
    const submit = () => {
      submitLoading.value = true;
      let requestData = {
        id: Category.id,
        categoryId: form.categoryId,
        title: form.title,
        content: form.content
      };
      EditInfo(requestData)
        .then(response => {
          //  if(response.data.resCode === 0){
          //     context.emit("asdf",requestData)
          //  }
          root.$message({
            message: response.data.message,
            type: "success"
          });
          submitLoading.value = false;
        })
        .catch(error => {
          submitLoading.value = false;
        });
    };
    
     const handleAvatarSuccess = (res, file) => {
       
        root.imageUrl = URL.createObjectURL(file.raw);
      }
      const beforeAvatarUpload = (file) => {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          root.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          root.$message.error('上传头像图片大小不能超过 2MB!');
        }
        //文件名转码
        let suffix = file.name;
        let key = encodeURI(`${suffix}`);
        uploadkey.key = key;
        return isJPG && isLt2M;
      }
      /*
      *获取七牛云的token
      */
     const getQiniuToken = () => {
         let requestData = {
            "ak":"z9CqbxFnxnnbY7Ra2V5MYqxA2Rg5Ptfb9XwsQQdb",
            "sk":"s4UvleItseoDxZPYW59JDa6H7zr5_3qS352Yhkg8",
            "buckety":"qg0t3x0zu.hn-bkt.clouddn.com",
         }
        QiniuToken(requestData).then(response => {
              uploadkey.token = response.data.data.token
       })
     }
    /*
     *生命周期加载完成后做什么
     */
    onMounted(() => {
      getInfoCategory();
      getInfo();
      getQiniuToken();
    });
    return {
      //对象数据
      Category,
      form,
      editorOption,
      submitLoading,
      uploadkey,
      //方法函数
      getInfoCategory,
      getInfo,
      submit,
      handleAvatarSuccess,
      beforeAvatarUpload,
      getQiniuToken
    };
  }
};
</script>
<style lang =scss scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>