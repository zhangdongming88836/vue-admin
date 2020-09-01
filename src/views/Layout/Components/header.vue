<template>
    <div id="header-wrap">
       <div class="pull-left header-icon" @click="navMenuState"><svg-icon iconClass="info" className=info /></div>
       <div class="pull-right ">
         <div class="user-info pull-left">
           {{userName}}
         </div>
         <div class="header-icon pull-left" @click="exit">
             <svg-icon iconClass="close" className=close />
         </div>
       </div>
    </div>
</template>
<script>
import {reactive,ref,toMounted,computed,watch} from "@vue/composition-api"
export default {
    name:"layoutHeader",
    setup(props,context){
      const navMenuState = () => {
        context.root.$store.commit("app/SET_ISCOLLAPSE");
      };
      const userName = computed (() => context.root.$store.state.app.username);
      const exit = () =>{
        context.root.$store.dispatch("app/exit").then(()=>{
            context.root.$router.push({
              name:"login"
            })
        })
      }
      return {
        navMenuState,
        userName,
        exit
      }
    }
}
</script>
<style lang="scss" scoped>
//@import "../../../styles/confige.scss";
#header-wrap {
  position:fixed;
  top:0;
  right: 0;
  left:$navMenu;
  height:75px;
  background-color:#fff;
  line-height:75px;
  @include webkit(transition,all .5s ease 0s);
  @include webkit(box-shadow,0 3px 16px 0 raba(0,0,0,.1));
}
.header-icon{
  padding:0 32px;
  svg{
    margin-bottom:-5px;
    font-size:25px;
    cursor:pointer;
  }
}
.user-info{
  height:100%;
  padding:0 32px;
  border-right:1px solid #ededed;
  +.header-icon{
    padding:0 28px;
  }
}
.open{
   #header-wrap {
      left:$navMenu; 
   } 
}
.close{
     #header-wrap {
      left:$navMenuMin; 
   } 
}
</style>