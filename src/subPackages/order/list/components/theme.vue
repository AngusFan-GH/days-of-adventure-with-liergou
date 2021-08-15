<template>
  <view class="theme">
    <u-card :title="order.title" padding="18">
      <view slot="body">
        <view class="u-body-item u-flex u-col-between u-p-t-0">
          <image v-show="order.thumbnail" :src="order.thumbnail" mode="aspectFill"></image>
          <view class="content">
            <view class="u-line-1 u-margin-bottom-20">{{ time }}</view>
            <view class="u-line-1 u-margin-bottom-20">{{ order.extraInfo.shopName }}</view>
            <view class="u-line-1 high-light">总价：¥{{ order.orderPrice }}</view>
          </view>
        </view>
      </view>
      <view class="u-flex u-row-right" slot="foot">
        <slot name="btn-container" :status="order.payStatus" :orderId="order.id"></slot>
      </view>
    </u-card>
  </view>
</template>

<script>
import { timeRangeFmt } from '@/common/js/utils/time-fmt';
export default {
  name: 'order-theme',
  props: {
    order: Object,
  },
  mounted() {
    console.log('order-theme', this.order);
  },
  computed: {
    time() {
      const { roomBeginTime, roomEndTime } = this.order ? this.order.extraInfo : {};
      return timeRangeFmt(roomBeginTime, roomEndTime, false, true);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../../../common/style/variable.scss';
.u-card-wrap {
    background-color: $u-bg-color;
}

.u-body-item {
    font-size: 32rpx;

    color: #333;
    .content {
        overflow: hidden;
        flex: 1;
    }
}

.u-body-item image {
    flex: 0 0 145rpx;

    width: 145rpx;
    height: 211rpx;
    margin-right: 20rpx;

    border-radius: 8rpx;
}
.high-light {
    color: $theme-color;
}

</style>