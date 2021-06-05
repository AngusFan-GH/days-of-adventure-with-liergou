import { apiUrl } from './config.js';

const install = (Vue, vm) => {
	Vue.prototype.$u.http.setConfig({
		baseUrl: apiUrl,
		method: 'POST',
		dataType: 'json',
		showLoading: false,
		loadingText: '请求中...',
		loadingTime: 800, // 在此时间内，请求还没回来的话，就显示加载中动画，单位ms
		originalData: false,
		loadingMask: true,
		header: {
			'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
		}
	});

	Vue.prototype.$u.http.interceptor.request = (config) => {
		console.log('request:', config);
		const token = uni.getStorageSync('token');
		if (token) {
			config.data.token = token;
		}
		return config;
	};

	Vue.prototype.$u.http.interceptor.response = (res) => {
		console.log('response:', res);
		if (res.code == 1000) {
			return res;
		} else if (res.code == 201) {
			vm.$u.toast(res.msg);
			return res;
		} else if (res.code == 500) {
			vm.$u.toast(res.msg);
			return res;
		} else if (res.code == 9003) {
			let pages = getCurrentPages();
			let current = pages[pages.length - 1];
			if (current.route !== 'pages/login') {
				uni.redirectTo({
					url: '/pages/login'
				});
			}
			return false;
		} else {
			vm.$u.toast(res.msg);
			return res;
		}
	};
};

export default {
	install
};
