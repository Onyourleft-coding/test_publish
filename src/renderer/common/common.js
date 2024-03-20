const treeDataTranslate = function (data, id = "id", pid = "parentId") {
  var res = [];
  var temp = {};
  for (var i = 0; i < data.length; i++) {
    temp[data[i][id]] = data[i];
  }
  for (var k = 0; k < data.length; k++) {
    if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
      if (!temp[data[k][pid]]["children"]) {
        temp[data[k][pid]]["children"] = [];
      }
      if (!temp[data[k][pid]]["_level"]) {
        temp[data[k][pid]]["_level"] = 1;
      }
      data[k]["_level"] = temp[data[k][pid]]._level + 1;
      temp[data[k][pid]]["children"].push(data[k]);
    } else {
      res.push(data[k]);
    }
  }
  return res;
};
const getStartTime = function () {
  var data = new Date();
  var year = data.getFullYear();
  var month = data.getMonth() + 1;
  var day = data.getDate();

  var cur =
    year +
    "-" +
    (month > 9 ? month : "0" + month) +
    "-" +
    (day > 9 ? day : "0" + day) +
    " " +
    "00:00:00";
  return new Date(cur);
};
const getEndTime = function () {
  var data = new Date();
  var year = data.getFullYear();
  var month = data.getMonth() + 1;
  var day = data.getDate();

  var cur =
    year +
    "-" +
    (month > 9 ? month : "0" + month) +
    "-" +
    (day > 9 ? day : "0" + day) +
    " " +
    "23:59:59";
  return new Date(cur);
};
const setStorage = function (name, value) {
  localStorage.setItem(name, value);
};
const getStorage = function (name) {
  return localStorage.getItem(name);
};
const delStorage = function (name) {
  localStorage.removeItem(name);
};
const formatStartDate = function (val) {
  var data = new Date(val);
  var year = data.getFullYear();
  var month = data.getMonth() + 1;
  var day = data.getDate();

  return (
    year +
    "-" +
    (month > 9 ? month : "0" + month) +
    "-" +
    (day > 9 ? day : "0" + day) +
    " " +
    "00:00:00"
  );
};
const formatEndDate = function (val) {
  var data = new Date(val);
  var year = data.getFullYear();
  var month = data.getMonth() + 1;
  var day = data.getDate();

  return (
    year +
    "-" +
    (month > 9 ? month : "0" + month) +
    "-" +
    (day > 9 ? day : "0" + day) +
    " " +
    "23:59:59"
  );
};
const formatTime = function (val) {
  var data = new Date(val);
  var year = data.getFullYear();
  var month = data.getMonth() + 1;
  var day = data.getDate();
  var hour = data.getHours();
  var mint = data.getMinutes();
  var second = data.getSeconds();
  return (
    year +
    "-" +
    (month > 9 ? month : "0" + month) +
    "-" +
    (day > 9 ? day : "0" + day) +
    " " +
    (hour > 9 ? hour : "0" + hour) +
    ":" +
    (mint > 9 ? mint : "0" + mint) +
    ":" +
    (second > 9 ? second : "0" + second)
  );
};
const isAuth = function (key) {
  return (
    JSON.parse(sessionStorage.getItem("permissions") || "[]").indexOf(key) !==
      -1 || false
  );
};
const erro450 = function (res, obj) {
  if (res.response.status == 450) {
    obj.msgVisible = true;
    obj.msg = "登录失效，即将跳转到登录页面";
    setTimeout(function () {
      obj.msgVisible = false;
      obj.$router.push({ path: "/login" });
    }, 2000);
  } else {
    obj.msgVisible = true;
    obj.msg = res.response.statusText;
  }
};
const toTop = function () {
  document.documentElement.scrollTop = 0;
};

export {
  erro450,
  formatTime,
  treeDataTranslate,
  isAuth,
  formatStartDate,
  formatEndDate,
  getEndTime,
  getStartTime,
  setStorage,
  getStorage,
  delStorage,
  toTop,
};
