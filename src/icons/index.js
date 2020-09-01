import Vue from "vue";
import svgIcon from "./Svglcon.vue"
//自定义全局组件 //runtime(运动模式)\\\\\compiler(模板)模式
Vue.component("svg-icon",svgIcon);
/*
*解析svg
*require.context()：解析读取指定目录的所有文件括号里三个参数
*第一个：目录，第二个：是否遍历自己目录，第三个：定义遍历文件的规则
*/
const req = require.context("./svg", false, /\.svg$/);//正则里面表示读取结尾为.svg的文件
const requireAll = requireContext => {
    //console.log(requireContext.keys().map(requireContext))
    return requireContext.keys().map(requireContext)
}
requireAll(req)