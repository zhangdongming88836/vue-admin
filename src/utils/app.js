import cookie from "cookie_js";//引入cookie
const adminToken = "admin_token";
export function getToken(){//获取cookie
    return cookie.get(adminToken);
}
//设置cookie中的token
export function setToken(token){
    return cookie.set(adminToken,token)
}
//设置cookie中的username
export function setUserName(value){
    return cookie.set("username",value)
}
//删除cookie token
export function removeToken(){
   return cookie.remove(adminToken);
}
//删除coolie username
export function removeUserName(){
    return cookie.remove("username")
}
//获取cookie username
export function getUserName(){
    return cookie.get("username");
}