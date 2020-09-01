import axios from "axios"
import {Message} from "element-ui"
import {getToken,getUserName} from "@/utils/app"
//常见axios,赋值给变量service
const BASEURL =  process.env.NODE_ENV === 'production' ? '' : '/devApi';
const service = axios.create({
   baseURL: BASEURL,
   timeout:15000,
});
//添加请求拦截器(请求接口前，做一些数据处理)
service.interceptors.request.use(function (config){
   //在发送请求之前做什么
   //后台需要前端这边传相关的参数(请求头添加参数)
   //token
   //userId
   //sui
   console.log(config.headers);
   config.headers.Token = getToken();
   config.headers.UserName = getUserName();
    return config;
},function (error){
    //对请求错误做什么
    return Promise.reject(error);
})
//添加响应拦截器(请求接口后，返回数据进行拦截)
service.interceptors.response.use(function (response){
    //对响应数据做点什么
    let data = response.data;
    console.log(data);
    if(data.resCode!==0){
        Message.error(data.message);
        return Promise.reject(data);
    }else{
        return response;
        return Promise.resolve;
    }
    
},function(error){
    //对响应错误做点什么
    return Promise.reject(error);
});
export default service;