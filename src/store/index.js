import Vue from 'vue';
import Vuex from 'vuex';
import tabbar from './modules/tabbar';
import pay from './modules/pay';

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        tabbar,
        pay
    }
});

export default store;