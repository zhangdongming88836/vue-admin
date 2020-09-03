const state = {
   id:"" || sessionStorage.getItem("infoId"),
   title:"" || sessionStorage.getItem("infoTitle")
}
const getters = {//可以计算监听返回结果
    infoId: state => state.id,
    infoTitle: state => state.title
}
const mutations = {
   UPDATE_STATE_VALUE(state,params){
       for(let key in params){
           //储存值      //储存的value
           state[key] = params[key].value
           //判断是否存储session
           if(params[key].session){
               sessionStorage.setItem(params[key].sessionKey,params[key].value)
           }
       }
   }
}
const actions = {

}
export default {
    namespaced:true,
    state,
    getters,
    mutations,
    actions
}