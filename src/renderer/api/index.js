import api from "../request";

export const getUserInfoApi = () => api.get("/student/info");

// 用户手机号密码登陆
export const userPhoneLogin = (data) => api.post("/login", data);
