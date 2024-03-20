// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import MintUI from "mint-ui";
import "mint-ui/lib/style.css";
// import request from "./request/index";
import http from "./common/http";
import "./assets/icon/iconfont.css";
import preview from "vue-photo-preview";
import "animate.css";
import "vue-photo-preview/dist/skin.css";
import { toTop } from "./common/common";
import store from "./store";
import Vant from "vant";
import "vant/lib/index.css";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import * as echarts from "echarts";
import "echarts-wordcloud";
import "@vant/touch-emulator";
import listBar from "./components/list-bar/index.vue";


Vue.prototype.$echarts = echarts;

Vue.use(preview, {
  fullscreenEl: false, // 控制是否显示右上角全屏按钮
  closeEl: true, // 控制是否显示右上角关闭按钮
  tapToClose: true, // 点击滑动区域应关闭图库
  shareEl: false, // 控制是否显示分享按钮
  zoomEl: false, // 控制是否显示放大缩小按钮
  counterEl: false, // 控制是否显示左上角图片数量按钮
  arrowEl: true, // 控制如图的左右箭头（pc浏览器模拟手机时）
  tapToToggleControls: true, // 点击应切换控件的可见性
  clickToCloseNonZoomable: true, // 点击图片应关闭图库，仅当图像小于视口的大小时
});


Vue.use(MintUI);
Vue.use(Vant);
Vue.use(ElementUI);
Vue.use(store);
Vue.component("listBar", listBar);
Vue.config.productionTip = false;
Vue.prototype.$ajax = http;
// Vue.prototype.$request = request;
router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面 title */
  if (to.name) {
    document.title = to.meta.title || "评价系统";
  }
  toTop();
  next();
});

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  components: { App },
  template: "<App/>",
});
