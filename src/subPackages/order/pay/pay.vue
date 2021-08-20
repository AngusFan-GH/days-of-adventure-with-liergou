<template>
  <view>
    pay
    <count-down-circle :orderUpdateTime="time"></count-down-circle>
    <view>{{ time }}</view>
    <view>{{ orderId }}</view>
    <u-button @click="cancel">取消</u-button>
    <u-button @click="pay">立即支付</u-button>
  </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { countDownCircle } from '@/components/count-down-circle/count-down-circle.vue';
const $moment = require('moment');
export default {
  components: {
    countDownCircle,
  },
  onLoad(options) {
    console.log(options.id);
    console.log(this.unpaidOrderMap[options.id]);
    const { time, orderId, orderInfo, screening } = this.unpaidOrderMap[options.id] || {};
    this.time = $moment(time).format('YYYY/MM/DD HH:mm:ss');
    this.orderId = orderId;
    this.orderInfo = orderInfo;
    this.screening = screening;
  },
  data() {
    return {
      time: null,
      orderId: null,
      orderInfo: null,
      screening: null,
    };
  },
  computed: {
    ...mapState('pay', ['unpaidOrderMap']),
  },
  methods: {
    ...mapMutations('pay', {
      getUnpaidOrderInfo: 'getUnpaidOrderInfo',
      removeUnpaidOrder: 'removeUnpaidOrder',
    }),
    pay() {
      const [appId, timeStamp, nonceStr, prepayId, paySign] = this.orderInfo;
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
            this.removeUnpaidOrder(this.screening.uniqueId);
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
    cancel() {
      this.$u.api
        .cancelOrder({
          orderId: this.orderId,
          operate: 'cancel',
        })
        .then(() => {
          this.removeUnpaidOrder(this.screening.uniqueId);
          uni.navigateBack({
            delta: 1,
          });
        });
    },
    goToResultPage() {
      uni.redirectTo({
        url: '/subPackages/order/pay/result',
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>