import Vue from "vue";
import Vuex from "vuex";
import user from "./modules/user";
import other from "./modules/other";
import role from "./modules/role";
import good from "./modules/good";
import category from "./modules/category";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    user,
    other,
    role,
    good,
    category,
  },
});

export default store;
