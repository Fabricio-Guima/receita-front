export const state = () => ({
  snackbars: []
});

export const getters = {
  readSnacksbars(state) {
    return state.snackbars;
  }
};

export const mutations = {
  setSnack(state, payload) {
    return (state.snackbars = state.snackbars.concat(payload));
  }
};

export const actions = {
  setSnack({ commit }, payload) {
    payload.showing = true;
    payload.timeout = payload.timeout || 3000;
    payload.color = payload.color || "dark";
    commit("setSnack", payload);
  }
};
