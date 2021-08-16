
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
	 * 场次详情
	 * http://182.92.107.174/market-boot/doc.html#/app/%E5%95%86%E5%93%81/viewSceneUsingGET
	 */
	let getViewScene = (uniqueId) => vm.$u.get(`/market-boot/app/productitem/viewScene/${uniqueId}`);

	/**
	 * 获取产品评论
	 * http://182.92.107.174/market-boot/doc.html#/app/%E5%95%86%E5%93%81/reviewUsingGET
	 */
	let getProductCommits = (params) => vm.$u.get(`/market-boot/app/productitem/review/${params.productId}`, params);

	/**
	 * 创建支付(主题)
	 * http://182.92.107.174/market-boot/doc.html#/app/%E8%AE%A2%E5%8D%95/createActivityPayUsingPOST
	 */
	let createPay = (params = {}) => vm.$u.post('/market-boot/app/order/createPay', params);

	/**
	 * 创建支付(活动)
	 * http://182.92.107.174/market-boot/doc.html#/app/%E8%AE%A2%E5%8D%95/createPayUsingPOST
	 */
	let createActivityPay = (params = {}) => vm.$u.post('/market-boot/app/order/createActivityPay', params);

	/**
	 * 领取优惠券
	 * http://182.92.107.174/market-boot/doc.html#/app/%E4%BC%98%E6%83%A0%E5%88%B8/takeUsingPOST
	 */
	let takeCoupon = (couponTmplId) => vm.$u.post(`/market-boot/app/coupon/take/${couponTmplId}`, {});

	/**
	 * 领取全部优惠券
	 * http://182.92.107.174/market-boot/doc.html#/app/%E4%BC%98%E6%83%A0%E5%88%B8/takeAllUsingPOST
	 */
	let takeAllCoupon = (activityId) => vm.$u.post(`/market-boot/app/coupon/takeAll/${activityId}`, {});

	/**
	 * 订单列表
	 * http://182.92.107.174/market-boot/doc.html#/app/%E8%AE%A2%E5%8D%95/pageListUsingPOST
	 */
	let getOrderList = (params = {}) => vm.$u.post('/market-boot/app/order/pageList', params);

	/**
	 * 优惠券列表
	 * http://182.92.107.174/market-boot/doc.html#/app/%E4%BC%98%E6%83%A0%E5%88%B8/couponPageListUsingPOST
	 */
	let getCouponList = (params = {}) => vm.$u.post('/market-boot/app/coupon/couponPageList', params);

	/**
	 * 可用优惠券列表(用户)
	 * http://182.92.107.174/market-boot/doc.html#/app/%E4%BC%98%E6%83%A0%E5%88%B8/validCouponListUsingGET
	 */
	let getValidCouponList = (withAmount) => vm.$u.get(`/market-boot/app/coupon/validCouponList?withAmount=${withAmount}`, {});

	/**
	 * 计算优惠信息
	 * http://182.92.107.174/market-boot/doc.html#/app/%E4%BC%98%E6%83%A0%E5%88%B8/calculateCouponUsingPOST
	 */
	let calculateCoupon = (params = {}) => vm.$u.post('/market-boot/app/coupon/calculateCoupon', params);

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

	/**
	 * 继续支付
	 * http://182.92.107.174/market-boot/doc.html#/app/%E8%AE%A2%E5%8D%95/continuePayUsingPOST
	 */
	let continuePay = (orderId) => vm.$u.post(`/market-boot/app/order/continuePay/${orderId}`, {});

	/**
	 * 取消订单
	 * http://182.92.107.174/market-boot/doc.html#/app/%E8%AE%A2%E5%8D%95/closeUsingPOST
	 */
	let cancelOrder = (params = {}) => vm.$u.post(`/market-boot/app/order/${params.orderId}?operate=${params.operate}`, {});

	/**
	 * 申请退款
	 * http://182.92.107.174/market-boot/doc.html#/app/%E8%AE%A2%E5%8D%95/applyRefundUsingPOST
	 */
	let applyRefund = (orderId) => vm.$u.post(`/market-boot/app/order/applyRefund/${orderId}`, {});

	/**
	 * 订单-强制退款
	 * http://182.92.107.174/market-boot/doc.html#/app/API/refundOrderRefundUsingPOST
	 */
	let refundOrderRefund = (orderId) => vm.$u.post(`/market-boot/app/api/refundOrderRefund/${orderId}`, {}, {
		'api-token': 'Rck8ejfZTIkKJGgWhZtE61gvRI6reyquGYuC5QgE14lU6zDm0IQOdUltNoTt6VVD'
	});

	/**
	 * 活动列表
	 * http://182.92.107.174/market-boot/doc.html#/app/%E6%B4%BB%E5%8A%A8/activityListUsingGET
	 */
	let getActivityList = (location) => vm.$u.get('/market-boot/app/activity/activityList', location);

	/**
	 * 活动详情
	 * http://182.92.107.174/market-boot/doc.html#/app/%E6%B4%BB%E5%8A%A8/viewUsingGET
	 */
	let getActivityDetail = (activityId) => vm.$u.get(`/market-boot/app/activity/view/${activityId}`);

	/**
	 * 忽略活动
	 * http://182.92.107.174/market-boot/doc.html#/app/%E6%B4%BB%E5%8A%A8/ignoreUsingPOST
	 */
	let ignoreActivity = (params) => vm.$u.post(`/market-boot/app/activity/ignore/${params.activityId}?ignoreDuration=${params.ignoreDuration}`, {});

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
		getViewScene,
		getProductCommits,
		getOrderList,
		getCouponList,
		getValidCouponList,
		calculateCoupon,
		getActivityList,
		ignoreActivity,
		getActivityDetail,
		createActivityPay,
		takeCoupon,
		takeAllCoupon,
		continuePay,
		cancelOrder,
		applyRefund,
		refundOrderRefund
	};
};

export default {
	install
};
