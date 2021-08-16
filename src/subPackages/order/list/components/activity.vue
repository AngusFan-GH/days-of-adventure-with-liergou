<template>
  <view class="activity-wrapper">
    <view class="u-flex u-row-between header">
      <view class="u-flex u-flex-1">
        <u-icon name="huodong1" custom-prefix="custom-icon" color="#f4a56e" size="36"></u-icon>
        <text class="u-m-l-6 title">{{ order.title }}</text>
      </view>
      <view class="status">
        <slot name="status"></slot>
      </view>
    </view>
    <view class="body">
      <view class="body-item u-flex u-col-between u-p-t-0">
        <image v-show="order.thumbnail" :src="order.thumbnail" mode="aspectFill"></image>
        <view class="content">
          <view class="u-flex u-row-between u-m-b-16">
            <view class="u-flex-1 u-line-1 title">{{ order.title }}</view>
            <view class="high-light">¥{{ order.payPrice }}</view>
          </view>
          <view class="u-line-1 u-m-b-16 time">下单时间：{{ order.buyTime }}</view>
        </view>
      </view>
    </view>
    <view class="u-flex u-row-right footer">
      <slot
        name="btn-container"
        :status="order.payStatus"
        :orderId="order.outTradeNo"
        :orderType="order.orderType"
      ></slot>
    </view>
  </view>
</template>

<script>
export default {
  name: 'order-activity',
  props: {
    order: Object,
  },
  mounted() {
    console.log('order-activity', this.order);
  },
};
</script>

<style lang="scss" scoped>
@import '../../../../common/style/variable.scss';
.activity-wrapper {
    margin: 15px;

    border-radius: 8px;
    background-color: $white;
    box-shadow: none;

    $border-color: #e4e7ed;
    .header,
    .body,
    .footer {
        padding: 10rpx 20rpx;
    }
    .title {
        font-weight: 600;
    }
    .header {
        .status {
            color: #dc782f;
        }
    }
    .footer {
        border-top: 1px solid $border-color;
    }
    .body-item {
        font-size: 32rpx;

        color: #333;
        .content {
            overflow: hidden;
            flex: 1;
            .time {
                font-size: 24rpx;

                color: #6e6e6e;
            }
        }
        image {
            flex: 0 0 145rpx;

            width: 145rpx;
            height: 145rpx;
            margin-right: 20rpx;

            border-radius: 8rpx;
        }
        .high-light {
            color: $theme-color;
        }
    }
}

</style>