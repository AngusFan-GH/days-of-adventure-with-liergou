const state = {
    position: null
};

const mutations = {
    setPosition: (state, { latitude, longitude }) => state.position = { latitude, longitude }
};

export default {
    namespaced: true,
    state,
    mutations
};