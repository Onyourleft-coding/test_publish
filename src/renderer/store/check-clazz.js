const state = () => ({
  checkClazz: [],
  isMultipleClazz: false,
});
const getters = {
  getCheckClazz(state) {
    return state.checkClazz;
  },
  getIsMultipleClazz(state) {
    return state.isMultipleClazz;
  },
};
const actions = {
  changeCheckClazz({ commit }, params) {
    commit("setCheckClazz", params);
  },
  changeIsMultipleClazz({ commit }, params) {
    commit("setIsMultipleClazz", params);
  },
};

const mutations = {
  setCheckClazz(state, params) {
    state.checkClazz = params;
  },
  setIsMultipleClazz(state, params) {
    state.isMultipleClazz = params;
  },
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
