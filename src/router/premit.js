import router from "./index.js";//这里引入路由
import store from "../store/index"
import {getToken,removeToken,removeUserName}from "../utils/app.js";//这里引入getToken方法

const  whiteRouter = ["/login"];//白名单//indexOf方法，判断数组是不是存在指定的某个对象

//路由守卫
router.beforeEach((to,from ,next) => {
     //index
    if(getToken()){
        next();
        //如果to的指向是登录页面也就是说返回了登录页面
        if(to.path == "/login"){
            //清空cookie中的token
            removeToken();
            //清空cookie中的username
            removeUserName();
            //清空vuex中的state中的token
            store.commit("app/SET_TOKEN","");
             //清空vuex中的state中的username
            store.commit("app/SET_USERNAME","");
            next();
        }else{
            //获取用户的角色
            //动态分配路由权限
            //继续执行跳转
              next();
        }
        //路由的动态添加，分配菜单，每个角色分配不同的菜单
    }else{
        //next("")
        //如果白名单里的是不是存在to存在1不存在等于-1
        if(whiteRouter.indexOf(to.path) !== -1){
            next(); //to  
        }else{
            next("/login") //路由指向
        }
    }
    /*
    * 1.直接进入index的时候，参数to改变成了“/index“ 触发路由指向就会跑beforeEach    *    
    * 2.再一次next 指向了login 再次发生路由的指向，在跑beforeEach，参数的to被改变了/login
    * 3. 白名单判断存在 则直接执行next()，因为没有参数，所以不会再次beforeEach
    */
    // console.log(to);
    // console.log(from);
    // console.log(next);
    // next()
  })