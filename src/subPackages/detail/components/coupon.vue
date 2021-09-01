<template>
  <view class="u-flex coupon" v-if="isShow && data && list.length">
    <u-icon name="youhuiquan" custom-prefix="custom-icon" color="#f4a56e" size="36"></u-icon>
    <view class="u-flex u-flex-1 u-line-1 u-m-l-20 u-m-r-40 main" @click="getCoupon">
      <view class="u-flex-1 u-line-1 text">{{ data.title }}</view>
      <text class="u-m-l-20 btn" v-if="!hasGotCoupon">立即领取</text>
      <text class="u-m-l-20 btn" v-else>已领取</text>
    </view>
    <u-icon name="close" size="30" @click="close"></u-icon>
  </view>
</template>

<script>
export default {
  name: 'coupon',
  props: {
    data: null,
    list: Array,
  },
  data() {
    return {
      isShow: true,
      hasGotCoupon: false,
    };
  },
  methods: {
    getCoupon() {
      if (this.hasGotCoupon) {
        return;
      }
      uni.navigateTo({
        url: '/subPackages/pay/valid-coupon-list?type=take',
        events: {
          chooseCoupon: ({ id }) => {
            const couponInfo = this.list.find(v => v.id === id);
            if (!couponInfo) return;
            this.$u.api
              .takeCoupon(id)
              .then(() => {
                this.hasGotCoupon = true;
                console.log(this.hasGotCoupon);
              })
              .catch(() => {
                this.close();
              });
          },
        },
        success: res => {
          const { id } = this.couponChoosn || {};
          res.eventChannel.emit('validCouponList', { value: id, list: this.list });
        },
      });
    },
    close() {
      this.isShow = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.coupon {
    padding: 14rpx 20rpx;

    background: linear-gradient(90deg, rgba(247,220,220,1) 17%, rgba(245,174,180,1) 100%);
    .text {
        font-size: 28rpx;
        font-weight: 600;
    }
    .btn {
        font-size: 26rpx;
        font-weight: 600;

        color: red;
    }
}

</style>