const state = {
    filter: null
};

const mutations = {
    setFilterData: (state, data) => state.filter = data,
};

export default {
    namespaced: true,
    state,
    mutations
};