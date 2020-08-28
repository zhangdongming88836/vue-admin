import Vue from "vue";
import Vuex from "vuex";
import Cookie from "cookie_js";
import {Login} from "@/api/login";
Vue.use(Vuex);
export default new Vuex.Store({
  state: {//存放单一的基础数据
    isCollapse:JSON.parse(window.sessionStorage.getItem("isCollapse")) || false
    //isCollapse:JSON.parse(Cookie.get("isCollapse")) || false
  },
  getters:{//相当于vue的计算函数computed if判断也可以写在这里面
   // count: state => state.count + 10,//es6写法
    /*count: function(state){//es5的写法
       return  state.count + 10
    }*/
  },
  mutations: {//更改state基础数据的函数,必须的 同步 没有回调处理事情
     SET_ISCOLLAPSE(state){
      state.isCollapse = !state.isCollapse;
      //html5本地储存
      //Cookie.set("isCollapse",JSON.stringify(state.isCollapse));
      window.sessionStorage.setItem("isCollapse",JSON.stringify(state.isCollapse ));
     },
     
  },
  actions: {//可以回调处理事情
    login(content,data){
     return new Promise((resolve,reject)=>{
       //接口
       Login(data).then(response => {
        resolve(response);
      }).catch(error => {
        reject(error);
      })
     })
   }
  },
  modules: {}
});
