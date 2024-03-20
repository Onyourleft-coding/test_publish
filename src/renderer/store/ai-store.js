const state = () => ({
  evaluateList: [], // 三级指标列表
  secondEvaluate: {}, // 二级指标
  creditType: 1,
  fileList: [], // 上传的图片file
  imgUrl: "", // 图片地址
  remark: "", // 评语
  isRemark: false, // 是否自动生成了AI智能评语
  studentList: [], // 学生信息
});
const getters = {};
const actions = {
  changeEvaluateList({ commit }, params) {
    commit("setEvaluateList", params);
  },
  changeSecondEvaluate({ commit }, params) {
    commit("setSecondEvaluate", params);
  },
  changeCreditType({ commit }, params) {
    commit("setCreditType", params);
  },
  changeFileList({ commit }, params) {
    commit("setFileList", params);
  },
  changeImgUrl({ commit }, params) {
    commit("setImgUrl", params);
  },
  changeRemark({ commit }, params) {
    commit("setRemark", params);
  },
  changeIsRemark({ commit }, params) {
    commit("setIsRemark", params);
  },
  changeStudentList({ commit }, params) {
    commit("setStudentList", params);
  },
  resetAiStore({ commit }, params) {
    commit("setResetStore", params);
  },
};
const mutations = {
  setEvaluateList(state, params) {
    state.evaluateList = params;
  },
  setSecondEvaluate(state, params) {
    state.secondEvaluate = params;
  },
  setCreditType(state, params) {
    state.creditType = params;
  },
  setFileList(state, params) {
    state.fileList = params;
  },
  setImgUrl(state, params) {
    state.imgUrl = params;
  },
  setRemark(state, params) {
    state.remark = params;
  },
  setIsRemark(state, params) {
    state.isRemark = params;
  },
  setStudentList(state, params) {
    state.studentList = params;
  },
  setResetStore(state) {
    state.evaluateList = [];
    state.secondEvaluate = {};
    state.creditType = 1;
    state.fileList = [];
    state.imgUrl = "";
    state.remark = "";
    state.isRemark = false;
    state.studentList = [];
  },
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
