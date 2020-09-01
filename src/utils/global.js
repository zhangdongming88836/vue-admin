import { Message } from 'element-ui';
import { MessageBox } from 'element-ui';
export default{
    install(Vue,options){
        Vue.prototype.confirm = (params)=>{
            MessageBox.confirm(params.content, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                center: true
              })
                .then(() => {
                    params.fn && params.fn(params.id || "")
                    Message({
                    type: "success",
                    message: "删除成功!"
                  });
                })
                .catch(() => {
                  params.catchFn && params.catchFn()
                });
        },
      Vue.prototype.xxxxxx = () => {

     }
    }
}