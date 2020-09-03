import { GetCategory,GetCategoryAll } from "@/api/news";
import {reactive} from "@vue/composition-api"
import service from "@/utils/request"
export function common(){
    const Category = reactive({
        item:[]
    })
    /*
    *获取分类
    */
    const getInfoCategory = () => {
        GetCategory({}).then(response => {
            Category.item = response.data.data.data
        }).catch(error => {

        })
    }
     /*
    *获取全部分类
    */
   const getInfoCategoryAll = () => {
     GetCategoryAll({}).then(response => {
        Category.item = response.data.data
    }).catch(error => {

    })
}
    return  {
        getInfoCategory,
        getInfoCategoryAll,
        Category
    }
}
/*
*获取七牛云token
*/
export function QiniuToken(data){
    return service.request({
       method:"post",
       url:"/uploadImgToken/",
       data
    })
}