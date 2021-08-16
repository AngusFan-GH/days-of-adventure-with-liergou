<template>
  <view class="theme-wrapper">
    <view class="u-flex u-row-between header">
      <view class="u-flex u-flex-1">
        <u-icon
          name="pifuzhuti-kuai"
          custom-prefix="custom-icon"
          color="#e9505c"
          size="36"
        ></u-icon>
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
          <view class="u-line-1 u-margin-bottom-16 time">{{ time }}</view>
          <view class="u-line-1 u-margin-bottom-16">
            <text class="u-m-r-10">{{ order.itemCount }}张</text>
            |
            <text class="u-m-l-10 high-light">总价：¥{{ order.payPrice }}</text>
          </view>
          <view class="u-line-1 u-margin-bottom-16">{{ order.extraInfo.shopName }}</view>
        </view>
      </view>
    </view>
    <view class="u-flex u-row-right footer">
      <slot name="btn-container"></slot>
    </view>
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
.theme-wrapper {
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
    .header {
        .title {
            font-weight: 600;
        }
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
                font-weight: 600;
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