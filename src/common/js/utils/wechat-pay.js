export default function (orderInfo) {
    return new Promise((res, rej) => {
        const [appId, timeStamp, nonceStr, prepayId, paySign] = orderInfo;
        uni.requestPayment({
            appId,
            timeStamp,
            nonceStr,
            package: prepayId,
            signType: 'RSA',
            paySign,
            success: e => {
                if (e.errMsg === 'requestPayment:ok') {
                    return res(e);
                }
                rej(e);
            },
            fail: err => {
                uni.showToast({
                    title: err.errMsg === 'requestPayment:fail cancel' ? '取消支付' : '支付失败，请重试',
                    icon: 'none',
                });
                rej(err);
            },
        });
    });
}