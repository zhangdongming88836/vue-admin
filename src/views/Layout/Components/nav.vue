<template>
    <div id="nav-wrap">
        <h1 class="logo">
           <img src="../../../assets/logo.png" alt="">
        </h1>
        <el-menu default-active="1-4-1" class="el-menu-vertical-demo" :collapse="isCollapse" background-color="transparent" text-color="#fff" active-text-color="#fff" router>
            <template  v-for="(item,index) in routers">
                <el-submenu v-if="!item.hideen" :key="item.id" :index="index + ''">
                    <!-- 一级菜单 -->
                    <template slot="title">
                    <svg-icon :iconClass="item.meta.icon" :className="item.meta.icon"/>
                    <span slot="title">{{item.meta.name}}</span>
                    </template>
                    <!-- 子级菜单 -->
                    <el-menu-item v-for="subItem in item.children" :key="subItem.id" :index="subItem.path">{{subItem.meta.name}}</el-menu-item>
                </el-submenu> 
            </template>                     
        </el-menu>
    </div>
</template>
<script>
import {ref,reactive,isRef,toRefs,onMounted,computed} from "@vue/composition-api";
export default {
    name:"navMenu",
    setup(props,context){
        /*
        *data数据
        */
        //const isCollapse = ref(true);
        const routers = reactive(context.root.$router.options.routes);
        /*
        *computed 监听vuex的store.state里面值的变化
        */
         const isCollapse = computed(() =>{
          return context.root.$store.state.app.isCollapse
          });
        /*
        *函数
        */
        //打印store
        console.log(context.root.$store.getters.count);
        console.log(context.root.$store.state.count);
        
          return {
          isCollapse,
          routers,
          };
    }
}
</script>
<style lang="scss" scoped>
@import "../../../styles/confige.scss";
.logo{
    img{
        width:92px;
        margin: 28px auto 25px;
        @include webkit(transition,all 0.5s ease 0s);
    }
}
#nav-wrap{
    position:fixed;
    top:0;
    left:0;
    width:$navMenu;
    height:100vh;
    background-color:#344a5f;
    @include webkit(transition,all .5s ease 0s);
    svg{
        font-size:20px;
        margin-right:10px;
    }
}
.open{
   #nav-wrap{
      width:$navMenu; 
   } 
}
.close{
     #nav-wrap{width:$navMenuMin;}
   .logo img {width:60%;} 
}
</style>