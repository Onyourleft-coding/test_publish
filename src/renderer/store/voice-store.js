const state = () => ({
  evaluateList: [], // 三级指标列表
  secondEvaluate: {}, // 二级指标
  creditType: 1,
  remark: "", // 评语
  isRemark: false, // 是否自动生成了AI智能评语
  studentList: [], // 学生信息
  voiceText: "", // 录音文本
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
  changeRemark({ commit }, params) {
    commit("setRemark", params);
  },
  changeIsRemark({ commit }, params) {
    commit("setIsRemark", params);
  },
  changeStudentList({ commit }, params) {
    commit("setStudentList", params);
  },
  resetVoiceStore({ commit }, params) {
    commit("setResetStore", params);
  },
  changeVoiceText({ commit }, params) {
    commit("setVoiceText", params);
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
  setRemark(state, params) {
    state.remark = params;
  },
  setIsRemark(state, params) {
    state.isRemark = params;
  },
  setStudentList(state, params) {
    state.studentList = params;
  },
  setVoiceText(state, params) {
    state.voiceText = params;
  },
  setResetStore(state) {
    state.evaluateList = [];
    state.secondEvaluate = {};
    state.creditType = 1;
    state.remark = "";
    state.isRemark = false;
    state.studentList = [];
    state.voiceText = "";
  },
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
