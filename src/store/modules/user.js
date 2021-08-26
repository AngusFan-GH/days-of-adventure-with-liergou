const state = {
    userInfo: null,
    phone: null
};

const mutations = {
    setUserInfo: (state, info) => state.userInfo = info,
    setPhone: (state, phone) => state.phone = phone
};

export default {
    namespaced: true,
    state,
    mutations
};