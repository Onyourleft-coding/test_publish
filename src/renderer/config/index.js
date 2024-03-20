import currentConfig from "./basic"

const env = process.env;

/**
 * lhxx 莲花小学
 * xsss 下沙小学
 * dcxx 东城小学
 * hbqxx 花板桥小学
 * zxxx 中心小学
 */

console.log('currentConfig', currentConfig);
console.log('131312', currentConfig.dcxx);

let target = currentConfig.dcxx
const config = {
  ...target,
  baseUrl: "/estimate-api", //目前更新的五个版本都是统一，就不单独列出了
  host: target.configUrl
};
Object.assign(config, env);

console.log("config", config);
if (config.VUE_APP_ENV === "development") {
  config.BASE_URL = config.configUrl;
} else if (config.VUE_APP_ENV === "test") {
  config.host = "http://192.168.148.175:8080";
} else if (config.VUE_APP_ENV === "production") {
  config.host = "http://192.168.148.176:8080";
}
export default config;
// 本地开发切换环境，可以使用上面注释的方法修改，也可以直接修改.env文件的VUE_APP_ENV
