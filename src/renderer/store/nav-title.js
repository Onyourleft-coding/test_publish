const state = () => ({
  navTitle: "下沙评价系统",
});
const getters = {
  getNavTitle(state) {
    return state.navTitle;
  },
};
const actions = {
  changeNavTitle({ commit }, params) {
    commit("setNavTitle", params);
  },
};

const mutations = {
  setNavTitle(state, params) {
    state.navTitle = params;
  },
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
