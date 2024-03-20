import { createLogger } from "vuex";
import NavTitle from "./nav-title";
import Vuex from "vuex";
import Vue from "vue";
import CheckClazz from "./check-clazz";
import persistedState from "vuex-persistedstate";
import pcStore from "./pc";
import aiStore from "./ai-store";
import voiceStore from "./voice-store";

Vue.use(Vuex);
const debug = process.env.NODE_ENV !== "production";
const persisted = persistedState({
  key: "teacher-store", // 浏览器中的名字
  paths: ["CheckClazz", "pcStore", "aiStore", "voiceStore"], // 需要存储起来的参数模块
  storage: window.sessionStorage,
});

const store = new Vuex.Store({
  modules: {
    NavTitle,
    CheckClazz,
    pcStore,
    aiStore,
    voiceStore,
  },
  strict: debug,
  plugins: debug ? [createLogger(), persisted] : [persisted],
});
export default store;
