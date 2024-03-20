import axios from "axios";
import config from "../config";
import { Toast } from "vant";
import { getCookies } from "../common/cookie";
const instance = axios.create({
  baseURL: config.host + config.baseUrl,
  timeout: 10000,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
  },
});

let loadingInstance;

// 创建实例
instance.interceptors.request.use(
  (config) => {
    console.log("config123", config);
    loadingInstance = Toast.loading({
      message: "加载中...",
      forbidClick: true,
    });
    // 设置请求头
    if (getCookies("token")) {
      config.headers["token"] = sessionStorage.getItem("token");
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

// 响应拦截

instance.interceptors.response.use(
  (res) => {
    // 响应成功 返回响应数据
    loadingInstance.close();
    const { status, data } = res;
    if (status === 200) {
      // 响应成功
      if (data.code === "0000") {
        return {
          ...data,
        };
      }
    } else {
      loadingInstance = Toast.fail("请求失败");
      setTimeout(() => {
        loadingInstance.close();
      }, 300);
      return Promise.reject(data);
    }
  },
  (err) => {
    // 响应失败
    setTimeout(() => {
      loadingInstance = Toast.fail("请求失败");
      loadingInstance.close();
    }, 300);
    return Promise.reject(err);
  }
);

// 导出实例
export default instance;
