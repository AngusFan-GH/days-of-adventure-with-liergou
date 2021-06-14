import Vue from 'vue';
import Vuex from 'vuex';
import tabBar from './modules/tabbar';
import getters from './getters';
import mutations from './mutations';

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        tabBar
    },
    getters,
    mutations
});

export default store;