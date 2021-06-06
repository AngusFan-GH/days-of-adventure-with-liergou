<template>
  <view class="container">
    <view class="info-item u-margin-bottom-5"
      >1人起拼，该场次已拼成，还可加入{{ restPeople }}人</view
    >
    <view class="info-item main-info u-margin-bottom-5"></view>
    <view class="info-item people-count u-margin-bottom-30"></view>
    <view class="info-item coupon u-margin-bottom-5"></view>
    <view class="info-item price-sum u-margin-bottom-30"></view>
    <view class="info-item phone u-margin-bottom-5"></view>
    <view class="info-item remark u-margin-bottom-30"></view>
    <view class="info-item notice u-margin-bottom-30"></view>

    <view class="footer u-flex u-row-between">
      <view>¥{{ totalPrice }}</view>
      <view>
        <u-button @click="createPay">立即支付</u-button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  onLoad(options) {
    console.log(options);
    const { id, restPeople } = options;
    this.id = id;
    this.restPeople = restPeople;
  },
  data() {
    return {
      id: "",
      restPeople: 0,
      totalPrice: 0,
    };
  },
  methods: {
    createPay() {
      this.$u.api
        .createPay({
          itemCount: 1,
          payerName: "test",
          payerPhone: uni.getStorageSync("phone"),
          productItemId: this.id,
        })
        .then((res) => {
          console.log(res);
          const { orderInfo } = res;
          this.pay(orderInfo);
        })
        .catch((err) => console.error(err));
    },
    pay(orderInfo) {
      const [appId, timeStamp, nonceStr, prepayId, paySign] = orderInfo;
      console.log({
        appId,
        timeStamp,
        nonceStr,
        package: prepayId,
        signType: "RSA",
        paySign,
      });
      uni.requestPayment({
        // appId,
        timeStamp,
        nonceStr,
        package: prepayId,
        signType: "RSA",
        paySign,
        success: (e) => {
          if (e.errMsg === "requestPayment:ok") {
            uni.showToast({
              title: "支付成功",
            });
          }
        },
        fail: (err) => {
          console.error(err);
          uni.showToast({
            title: "支付失败，请重试",
            icon: "none",
          });
        },
      });
    },
  },
};
</script>

<style lang="scss">
.container {
  min-height: 100%;

  background-color: #ccc;
}
.info-item {
  padding: 30rpx 50rpx;
  background-color: #fff;
}
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 30rpx;
  background-color: #fff;
  border-top: #ccc;
}
</style>