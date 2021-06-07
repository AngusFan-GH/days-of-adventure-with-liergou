
// 此处第二个参数vm，就是我们在页面使用的this，你可以通过vm获取vuex等操作，更多内容详见uView对拦截器的介绍部分：
// https://uviewui.com/js/http.html#%E4%BD%95%E8%B0%93%E8%AF%B7%E6%B1%82%E6%8B%A6%E6%88%AA%EF%BC%9F
const install = (Vue, vm) => {
	/**
	 * 登录凭证校验
	 * http://182.92.107.174/market-boot/doc.html#/app/%E7%94%A8%E6%88%B7/code2sessionUsingGET 
	 */
	let weChatLogin = (params = {}) => vm.$u.get('/market-boot/app/user/code2session', params);

	/**
		 * 解密用户信息
		 * http://182.92.107.174/market-boot/doc.html#/app/%E7%94%A8%E6%88%B7/decryptUsingPOST
		 */
	let decryptUserInfo = (params = {}) => vm.$u.post('/market-boot/app/user/decryptUserInfo', params);

	/**
	 * 更新用户信息
	 * http://182.92.107.174/market-boot/doc.html#/app/%E7%94%A8%E6%88%B7/decryptUsingPOST
	 */
	let updateUserInfo = (params = {}) => vm.$u.post('/market-boot/app/user/update', params);

	/**
	 * 商品搜索
	 * http://182.92.107.174/market-boot/doc.html#/app/%E5%95%86%E5%93%81/searchUsingPOST
	 */
	let getCardList = (params = {}) => vm.$u.post('/market-boot/app/productitem/search', params);

	/**
	 * 创建支付
	 * http://182.92.107.174/market-boot/doc.html#/app/%E8%AE%A2%E5%8D%95/createPayUsingPOST
	 */
	let createPay = (params = {}) => vm.$u.post('/market-boot/app/order/createPay', params);

	/**
	 * 微信通知处理
	 * http://182.92.107.174/market-boot/doc.html#/app/%E8%AE%A2%E5%8D%95/noticeUsingPOST
	 */
	let handleWeChatNotice = (params = {}) => vm.$u.post('/market-boot/app/order/notice/weixin', params);

	/**
	 * 查询支付状态
	 * http://182.92.107.174/market-boot/doc.html#/app/%E8%AE%A2%E5%8D%95/queryPayUsingPOST
	 */
	let queryPay = (params = {}) => vm.$u.post('/market-boot/app/order/queryPay', params);

	// 将各个定义的接口名称，统一放进对象挂载到vm.$u.api(因为vm就是this，也即this.$u.api)下
	vm.$u.api = {
		weChatLogin,
		getCardList,
		decryptUserInfo,
		createPay,
		handleWeChatNotice,
		queryPay,
		updateUserInfo
	};
};

export default {
	install
};
