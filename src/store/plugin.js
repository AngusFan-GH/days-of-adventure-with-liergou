import $deepCopy from '@/common/js/utils/deep-copy';

export default function (key = 'lsKey', { moduleMappings, stateMappings, blacklist }) {
    moduleMappings = moduleMappings || [];
    stateMappings = stateMappings || [];
    blacklist = blacklist || [];
    return store => {
        //回写state
        const localStorage = uni.getStorageSync(key);
        if (localStorage) {
            moduleMappings.forEach(module => {
                const [moduleName, stateProp] = module.split('/');
                const value = localStorage[moduleName] ? localStorage[moduleName][stateProp] : null;
                store.commit('reset', { module: moduleName, key: stateProp, value });
            });
            stateMappings.forEach(stateName => {
                store.commit('reset', { key: stateName, value: localStorage[stateName] });
            });
        }
        console.log('vuex plugin reset from localStorage:', localStorage);
        store.subscribe((mutation, state) => {
            //写入localStorage
            if (blacklist.findIndex(m => m === mutation.type) < 0) {
                const o = Object.create(null);
                moduleMappings.forEach(module => {
                    const [moduleName, stateProp] = module.split('/');
                    if (!o[moduleName]) {
                        o[moduleName] = Object.create(null);
                    }
                    o[moduleName][stateProp] = $deepCopy(state[moduleName][stateProp]);
                });
                stateMappings.forEach(stateProp => {
                    o[stateProp] = $deepCopy(state[stateProp]);
                });
                uni.setStorageSync(key, o);
                console.log('vuex plugin write localStorage:', mutation.type, key, o);
            }
        });
    };
};