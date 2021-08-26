import Vue from 'vue';
import Vuex from 'vuex';
import tabbar from './modules/tabbar';
import pay from './modules/pay';
import user from './modules/user';
import position from './modules/position';
import mutations from './mutations';
import createLocalStoragePlugin from './plugin';

Vue.use(Vuex);

const LS_KEY = '_r_hzd_local';

const mutataionsBlackList = [
    'reset'
];

const moduleMappings = [
    'user/userInfo',
    'user/phone',
    'position/position',
];

const plugin = createLocalStoragePlugin(LS_KEY, { moduleMappings, mutataionsBlackList });

const store = new Vuex.Store({
    modules: {
        tabbar,
        pay,
        user,
        position
    },
    mutations,
    plugins: [plugin]
});

export default store;