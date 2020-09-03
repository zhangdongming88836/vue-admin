import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
import app from "./modules/app.js"
import login from "./modules/login.js"
import infoDetailed from "./modules/infoDetailed"
export default new Vuex.Store({
    modules:{
      app,
      login,
      infoDetailed
    }
});