import Vue from "vue";
import Router from "vue-router";
import store from "../store";
import pcRoutes from "./pc";
import config from "../config/index";
Vue.use(Router);

const routes = [
  {
    path: "/",
    name: "login",
    meta: {
      needNav: false,
      title: "登录",
    },
    component: (resolve) => require(["../views/login"], resolve),
  },
  {
    path: "/ball",
    name: "Ball",
    meta: {
      needNav: false,
      title: "浮窗",
    },
    component: (resolve) => require(["../views/Ball"], resolve),
  },
];

const routerMap = [...routes, pcRoutes];
console.log("routerMap", routerMap);
console.log("config", config);
const router = new Router({
  base: process.env.BASE_URL,
  routes: routerMap,
});
router.beforeEach(async (to, form, next) => {
  if (to.meta.title) {
    await store.dispatch("NavTitle/changeNavTitle", to.meta.title);
  }
  next();
});
export default router;
