export default {
    reset(state, { module, key, value }) {
        console.log('reset', state);
        if (module) {
            state[module][key] = value;
        } else {
            state[key] = value;
        }
    }
}