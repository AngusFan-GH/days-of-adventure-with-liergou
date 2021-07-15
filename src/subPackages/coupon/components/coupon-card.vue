<template>
  <view class="coupon-card">
    <view class="u-flex card-main">
      <view class="u-flex u-row-center u-line-1 card-price">¥{{ coupon.price }}</view>
      <view class="u-flex-1 card-info">
        <view class="u-margin-bottom-20 u-line-1 card-type">{{ coupon.type }}</view>
        <view class="u-line-1 card-time">{{ coupon.startTime }} - {{ coupon.endTime }}</view>
        <view
          class="u-margin-top-10 u-flex card-order"
          v-show="coupon.status === 1 && coupon.relativeOrder"
        >
          <text>订单：</text>
          <text class="order">{{ coupon.relativeOrder }}</text>
        </view>
      </view>
      <view class="u-flex card-status">
        <u-icon
          name="yiguoqi"
          custom-prefix="custom-icon"
          size="60"
          v-show="coupon.status === 2"
        ></u-icon>
        <u-icon
          name="daishiyong"
          custom-prefix="custom-icon"
          size="60"
          v-show="coupon.status === 0"
        ></u-icon>
        <u-icon
          name="yishiyong"
          custom-prefix="custom-icon"
          size="60"
          v-show="coupon.status === 1"
        ></u-icon>
      </view>
    </view>
    <view class="card-bottom">
      <view class="card-rule">
        <view class="u-flex u-row-between card-rule-top">
          <view class="card-range">单次消费金额满{{ coupon.range }}使用</view>
          <view class="card-rule-label" @click="showRules()">
            <text class="u-margin-right-4">使用规则</text>
            <u-icon
              :name="isShowRules ? 'arrow-up' : 'arrow-down'"
              :color="styleVariable.textDarkColor"
              size="20"
            ></u-icon>
          </view>
        </view>
        <view class="card-rule-content" v-if="isShowRules">
          <u-gap height="2" :bg-color="styleVariable.lineColor"></u-gap>
          <view class="card-rule-item" v-for="(rule, index) in coupon.rules || []" :key="index">
            {{ index + 1 }}.{{ rule }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import style from '@/common/style/variable.scss';
export default {
  name: 'coupon-card',
  data() {
    return {
      isShowRules: false,
      styleVariable: style,
    };
  },
  props: {
    coupon: {
      default: {},
    },
  },
  methods: {
    showRules() {
      this.isShowRules = !this.isShowRules;
    },
  },
};
</script>

<style lang="scss">
@import '../../../common/style/variable.scss';
.coupon-card {
    font-size: 28rpx;

    position: relative;

    display: block;
    overflow: hidden;

    margin: 15px;

    border-radius: 8rpx;
    background-color: $white;
    box-shadow: none;
    .card {
        &-main {
            align-items: stretch;
        }
        &-info {
            overflow: hidden;

            padding: 10rpx 20rpx;
        }
        &-type {
            font-weight: bold;
        }
        &-time {
            font-size: 20rpx;
        }
        &-order {
            font-size: 25rpx;
            .order {
                color: $text-light-gray-color;
            }
        }
        &-status {
            padding-right: 20rpx;
        }
        &-price {
            font-size: 35rpx;
            font-weight: bold;

            width: 200rpx;
            padding: 0 30rpx 0 16rpx;

            white-space: nowrap;

            color: $theme-color;
            background-image: linear-gradient(45deg, $filter-confirm-btn-color 50%, transparent 25%), linear-gradient(-225deg, $filter-confirm-btn-color 50%, transparent 25%);
            background-position: 0 0;
            background-size: 180% 20%;
        }
        &-price,
        &-status {
            flex-shrink: 0;
        }
        &-rule {
            box-shadow: 0 0 6rpx 0 rgba(0, 0, 0, .5) inset;

            &-top {
                font-size: 25rpx;

                padding: 8rpx 20rpx;
            }
            &-label {
                font-size: 22rpx;

                color: $text-dark-color;
            }
            &-content {
                padding: 0 20rpx 20rpx;
            }
            &-item {
                font-size: 20rpx;

                color: $text-gray-color;
                &:nth-child(2) {
                    margin-top: 10rpx;
                }
            }
        }
    }
}

</style>