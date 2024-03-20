import axios from "axios";
import router from "@/router";
import { Toast } from "mint-ui";
// import { getCookies } from "./cookie.js";
import config from "../config/index.js";
const http = axios.create({
  timeout: 1000 * 60,
  // baseURL: "/estimate-api",
  baseURL: config.host + config.baseUrl,

  withCredentials: false,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
  },
});

/**
 * 请求拦截
 */
http.interceptors.request.use(
  (config) => {
    // if (getCookies("token")) {
    //   config.headers["token"] = sessionStorage.getItem("token");
    // }
    if (sessionStorage.getItem("token")) {
      config.headers["token"] = sessionStorage.getItem("token");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 响应拦截
 */
http.interceptors.response.use(
  (response) => {
    const res = response.data;
    if ([450].includes(res.code)) {
      Toast("登陆失效");
      router.push({ path: "/" });
      return;
    }
    if (res.code !== "0000") {
      Toast(res.message);
      return response;
    }
    return response;
  },
  (error) => {
    console.log(error.response && error.response.status === 450);
    if (error.response && error.response.status === 450) {
      Toast("登陆失效");
      router.push({ path: "/" });
    } else {
      Toast("系统错误，联系管理员");
    }
    return Promise.reject(error);
  }
);
export default http;
