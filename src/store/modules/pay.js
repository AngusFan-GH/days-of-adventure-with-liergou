const state = {
    /**
     * time
     * orderId
     * orderInfo
     * screening
     */
    unpaidOrder: {}
};

const mutations = {
    setUnpaidOrder: (state, info) => state.unpaidOrder = info,
    clearUnpaidOrder: (state) => state.unpaidOrder = {}
};

export default {
    namespaced: true,
    state,
    mutations
};