const state = {
    /**
     * time
     * orderId
     * orderInfo
     * screening
     */
    unpaidOrderMap: {}
};

const mutations = {
    addUnpaidOrder: (state, { id, info }) => state.unpaidOrderMap[id] = info,
    clearTimeoutOrder(state) {
        const now = Date.now();
        Object.keys(state.unpaidOrderMap).forEach(id => {
            const time = state.unpaidOrderMap[id].time;
            if (now - time >= 5 * 60 * 1000) {
                delete state.unpaidOrderMap[id];
            }
        });
    },
    removeUnpaidOrder(state, id) {
        delete state.unpaidOrderMap[id];
    }
};

export default {
    namespaced: true,
    state,
    mutations
};