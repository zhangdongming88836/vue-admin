import Vue from "vue";
import VueCompositionApi from "@vue/composition-api";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "./router/premit.js";
//自定义全局组件
import "./icons/index.js";

Vue.use(ElementUI);
Vue.config.productionTip = false;
Vue.use(VueCompositionApi);


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
