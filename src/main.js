import Vue from 'vue';
import App from './App';
import store from '@/store/index';
import uView from "uview-ui";
Vue.use(uView);

Vue.config.productionTip = false;

App.mpType = 'app';

const app = new Vue({
  ...App,
  store
});

// http拦截器
import httpInterceptor from '@/common/http.interceptor.js';
Vue.use(httpInterceptor, app);

// http接口API集中管理引入部分
import httpApi from '@/common/http.api.js';
Vue.use(httpApi, app);

app.$mount();
