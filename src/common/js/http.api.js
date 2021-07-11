
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
	 * 商品详情
	 * http://182.92.107.174/market-boot/doc.html#/app/%E5%95%86%E5%93%81/searchUsingPOST
	 */
	let getDetail = (productId) => vm.$u.get(`/market-boot/app/productitem/view/${productId}`);

	/**
	 * 获取产品评论
	 * http://182.92.107.174/market-boot/doc.html#/app/%E5%95%86%E5%93%81/reviewUsingGET
	 */
	let getProductCommits = (params) => vm.$u.get(`/market-boot/app/productitem/review/${params.productId}`, params);

	/**
	 * 创建支付
	 * http://182.92.107.174/market-boot/doc.html#/app/%E8%AE%A2%E5%8D%95/createPayUsingPOST
	 */
	let createPay = (params = {}) => vm.$u.post('/market-boot/app/order/createPay', params);

	/**
	 * 订单列表
	 */
	let getOrderList = (params = {}) => {
		return new Promise((res, rej) => {
			setTimeout(() => {
				res({
					pages: params.pageNum + 1,
					records: new Array(params.pageSize).fill({}).reduce((p) => {
						p.push({
							shopName: '入梦时空沉浸式实景剧场',
							blockBooking: Math.random() >= 0.5 ? 0 : 1,
							price: (Math.random() * 999).toFixed(2),
							headPicUrl: 'https://img11.360buyimg.com/n7/jfs/t1/94448/29/2734/524808/5dd4cc16E990dfb6b/59c256f85a8c3757.jpg',
							productName: '最后的幸存者',
							time: '2021-07-10 20:22',
						});
						return p;
					}, [])
				});
			}, 500);
		});
	};

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
		updateUserInfo,
		getDetail,
		getProductCommits,
		getOrderList
	};
};

export default {
	install
};
