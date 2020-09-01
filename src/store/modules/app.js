import {Login} from "@/api/login.js"
import {setToken,setUserName,getUserName,removeToken,removeUserName} from "../../utils/app.js"
const state = {//存放单一的基础数据
  isCollapse: JSON.parse(window.sessionStorage.getItem("isCollapse")) || false,
  to_ken: "",
  username:getUserName("username") || ""
  //isCollapse:JSON.parse(Cookie.get("isCollapse")) || false
} 

const getters = {//相当于vue的计算函数computed,计算并监听值的变化, if判断也可以写在这里面
  // count: state => state.count + 10,//es6写法
   /*count: function(state){//es5的写法
      return  state.count + 10
   }*/
   isCollapse:state => state.isCollapse,
   username: state => state.username
 }
 const  mutations = {//更改state基础数据的函数,必须的 同步 没有回调处理事情
  SET_ISCOLLAPSE(state){
   state.isCollapse = !state.isCollapse;
   //html5本地储存
   //Cookie.set("isCollapse",JSON.stringify(state.isCollapse));
   window.sessionStorage.setItem("isCollapse",JSON.stringify(state.isCollapse ));
  },
  SET_TOKEN(state,value){
    state.to_ken = value
  },
  SET_USERNAME(state,value){
    state.username = value
  },
}
const  actions = {//可以回调处理事情
  //登录
  login(/*content*/{commit},data){
   return new Promise((resolve,reject)=>{
     //接口
     Login(data).then(response => {
       let data = response.data.data
       console.log(data)
       //token  username
       //普通
       //content.commit("SET_TOKEN",data.token)
      // content.commit("SET_USERNAME",data.username)
       //解构
       commit("SET_TOKEN",data.token)
       commit("SET_USERNAME",data.username)
       setToken(data.token);
       setUserName(data.username);
      resolve(response);
    }).catch(error => {
      reject(error);
    })
   })
 },
 //退出
 exit(content){
  return new Promise((resolve,reject)=>{
    removeToken();
    removeUserName();
    content.commit("SET_TOKEN","");
    content.commit("SET_USERNAME","");
    resolve();
  }) 
 }
}

export default {
  namespaced:true,
  state,
  getters,
  mutations,
  actions
}