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
			'content-type': 'application/json;charset=UTF-8'
		}
	});

	Vue.prototype.$u.http.interceptor.request = (config) => {
		console.log('request:', config);
		const token = uni.getStorageSync('token');
		if (token) {
			config.data.token = token;
		} else if (!config.url.includes('code2session')) {
			uni.redirectTo({
				url: '/pages/login/index'
			});
		}
		return config;
	};

	Vue.prototype.$u.http.interceptor.response = (res) => {
		console.log('response:', res);
		if (res.code == 200) {
			return res.result;
		} else if (res.code == 401) {
			let pages = getCurrentPages();
			let current = pages[pages.length - 1];
			if (current.route !== 'pages/login/index') {
				uni.redirectTo({
					url: '/pages/login/index'
				});
				uni.showToast({
					title: "登录失效，请重新授权",
					icon: "none",
				});
			}
			return false;
		} else if (String(res.code).startsWith(50)) {
			uni.showToast({
				title: res.message || "服务器错误，请稍后重试",
				icon: "none",
			});
			return false;
		} else {
			uni.showToast({
				title: res.message,
				icon: "none",
			});
			return res;
		}
	};
};

export default {
	install
};
