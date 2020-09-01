<template>
    <div id="layout" :class="[meunStatus ? 'close' : 'open']"> 
      <layoutHeader/>
      <layoutmain/>
      <layoutnav/>
    </div>
</template>
<script>
import layoutHeader from "./Components/header"
import layoutmain from "./Components/main"
import layoutnav from "./Components/nav"
import {ref,reactive,toMounted,computed,watch,} from "@vue/composition-api"
export default {
   name:"layout",
   components:{layoutHeader,layoutmain,layoutnav},
   setup(props,context){
     const meunStatus = computed(() => context.root.$store.state.app.isCollapse)
    return {
      meunStatus,
    }
  }
}
</script>
<style lang="scss" scoped>
</style>