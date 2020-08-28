<template>
    <div id="main-wrap">
        <div class="main-content">
            <div class="content"><router-view/>{{BAS}}</div>
        </div>
    </div>
</template>
<script>
import{ref,reactive}from "@vue/composition-api"
export default {
   name:"layoutMain",
   setup(props,context){
     const BAS = ref(context.root.$store.state.login.aaa);
     return {
        BAS
     }
      
   }
}
</script>
<style lang="scss" scoped>
@import "../../../styles/confige.scss";
#main-wrap{
 height:100vh;
 position:fixed;
 left:$navMenu;
 top:75px;   
 right:0;
 bottom:0;
 border:30px solid #f7f7f7;
 border-bottom:none;
 @include webkit (box-sizing,border-box);
 @include webkit (transition,all .5s ease 0s);
}
.content{
    padding-left:30px;
    padding-top:30px;
    -webkit-box-sizing:border-box;
    box-sizing:border-box;
}
.open{
  #main-wrap{
      left:$navMenu; 
   } 
}
.close{
    #main-wrap{
      left:$navMenuMin; 
   } 
}
</style>