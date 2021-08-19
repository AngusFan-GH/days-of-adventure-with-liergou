<template>
  <view>
    pay
    <count-down-circle :orderUpdateTime="time"></count-down-circle>
    <view>{{ time }}</view>
    <view>{{ info.orderId }}</view>
    <u-button @click="pay">立即支付</u-button>
  </view>
</template>

<script>
import { mapState } from 'vuex';
import { countDownCircle } from '@/components/count-down-circle/count-down-circle.vue';
export default {
  components: {
    countDownCircle,
  },
  computed: {
    ...mapState('pay', ['time', 'info']),
  },
  mounted() {
    console.log(this.time, this.info);
  },
  methods: {
    pay() {
      const [appId, timeStamp, nonceStr, prepayId, paySign] = this.info.orderInfo;
      uni.requestPayment({
        appId,
        timeStamp,
        nonceStr,
        package: prepayId,
        signType: 'RSA',
        paySign,
        success: e => {
          if (e.errMsg === 'requestPayment:ok') {
            uni.showToast({
              title: '支付成功',
            });
            // 跳转支付成功结果页面
            return this.goToResultPage();
          }
        },
        fail: err => {
          console.error(err);
          uni.showToast({
            title: err.errMsg === 'requestPayment:fail cancel' ? '取消支付' : '支付失败，请重试',
            icon: 'none',
          });
        },
      });
    },
    goToResultPage() {
      uni.navigateTo({
        url: '/subPackages/order/pay/result',
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>