const state = {
    time: null,
    info: null
};

const mutations = {
    setOrderTime: (state, time) => state.time = time,
    setOrderInfo: (state, info) => state.info = info
};

export default {
    namespaced: true,
    state,
    mutations
};