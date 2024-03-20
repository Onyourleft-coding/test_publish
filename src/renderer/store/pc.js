const state = () => ({
  classDetail: {}, // 班级信息
  menuPath: "/pc-student-evaluate", // 目录id
  headTeacher: {}, // 当前老师
  evaluateType: 1, // 点评类型
  checkObj: [], // 多选学生
  singleStudentId: "", // 选择的学生
  checkTargetObj: {}, // 点评
  groupId: "", // 小组id
});
const getters = {
  getHeadTeacher(state) {
    return state.headTeacher;
  },
  getMenuPath(state) {
    return state.menuPath;
  },
  getEvaluateType() {
    return state.evaluateType;
  },
  getCheckObj() {
    return state.checkObj;
  },
  getSingleStudentId() {
    return state.singleStudentId;
  },
  getCheckTargetObj() {
    return state.checkTargetObj;
  },
  getClassDetail() {
    return state.classDetail;
  },
  getGroupId(state) {
    return state.groupId;
  },
};
const actions = {
  changeMenuPath({ commit }, params) {
    commit("setMenuPath", params);
  },
  changeClassDetail({ commit }, params) {
    commit("setClassDetail", params);
  },
  changeEvaluateType({ commit }, params) {
    commit("setEvaluateType", params);
  },
  changeCheckObj({ commit }, params) {
    commit("setCheckObj", params);
  },
  changeSingleStudentId({ commit }, params) {
    commit("setSingleStudentId", params);
  },
  changeCheckTargetObj({ commit }, params) {
    commit("setCheckTargetObj", params);
  },
  changeHeadTeacher({ commit }, params) {
    commit("setHeadTeacher", params);
  },
  changeGroupId({ commit }, params) {
    commit("setGroupId", params);
  },
  resetPcStore({ commit }, params) {
    commit("setResetStore", params);
  },
};

const mutations = {
  setMenuPath(state, params) {
    state.menuPath = params;
  },
  setClassDetail(state, params) {
    state.classDetail = params;
  },
  setEvaluateType(state, params) {
    state.evaluateType = params;
  },
  setCheckObj(state, params) {
    state.checkObj = params;
  },
  setSingleStudentId(state, params) {
    state.singleStudentId = params;
  },
  setCheckTargetObj(state, params) {
    state.checkTargetObj = params;
  },
  setHeadTeacher(state, params) {
    state.headTeacher = params;
  },
  setGroupId(state, params) {
    state.groupId = params;
  },
  setResetStore(state) {
    state.classDetail = {}; // 班级信息
    state.menuPath = "/pc-student-evaluate"; // 目录id
    state.headTeacher = {}; // 当前老师
    state.evaluateType = 1; // 点评类型
    state.checkObj = []; // 多选学生
    state.singleStudentId = ""; // 选择的学生
    state.checkTargetObj = {}; // 点评
    state.groupId = ""; // 小组id
  },
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
