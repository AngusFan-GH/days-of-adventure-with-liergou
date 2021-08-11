import Vue from 'vue';
import Vuex from 'vuex';
import tabbar from './modules/tabbar';

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        tabbar
    }
});

export default store;