import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);
//引入布局组件
import Layout from "@/views/Layout/index";
const routes = [
  {
    path: "/",
    redirect: "login",
    hideen:true,
    meta:{
      name:"主页"
    },
  },
  {
    path: "/login",
    name: "login",
    hideen:true,
    meta:{
      name:"登录"
    },
    component:()=> import("../views/login/index.vue")
  },
  /*
  *控制台
  */
  {
    path:"/console",
    name:"console",
    redirect:"index",
    meta:{
      name:"控制台",
      icon:"console"
    },
    component:Layout,
    children:[
      {
        path: "/index",
        name: "index",
        meta:{
          name:"首页"
        },
        component:()=> import("../views/console/index.vue")
      }
    ]
  },
  /*
  *信息管理
  */
  {
    path:"/info",
    name:"Info",
    meta:{
      name:"信息管理",
      icon:"info"
    },
    component:Layout,
    children:[
      {
        path: "/infoIndex",
        name: "InfoIndex",
        meta:{
          name:"信息列表"
        },
        component:()=> import("../views/info/index.vue")
      },
      {
        path: "/infoCategory",
        name: "InfoCategory",
        meta:{
          name:"信息分类"
        },
        component:()=> import("../views/info/category.vue")
      },
    ]
  },
  /*
  *用户管理
  */
  {
    path:"/user",
    name:"user",
    meta:{
      name:"用户管理",
      icon:"user"
    },
    component:Layout,
    children:[
      {
        path: "/userIndex",
        name: "UserIndex",
        meta:{
          name:"用户列表"
        },
        component:()=> import("../views/User/index.vue")
      },
      
    ]
  },
];

const router = new VueRouter({
  routes
});

export default router;
