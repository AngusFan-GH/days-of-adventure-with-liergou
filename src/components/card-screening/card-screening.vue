<template>
  <view class="play toggle-play u-flex">
    <view class="play-left">
      <view class="left-top u-flex-1 u-line-1">
        <text class="u-margin-right-18 time">{{ time }}</text>
        <text class="u-padding-left-18 current-count">{{ screening.currentPeople }}人已加入</text>
      </view>
      <view class="left-bottom">
        <text v-if="screening.restPeople > 0">
          差
          <text class="people-count">{{ screening.restPeople }}</text>
          人即可开场，最多再加入{{ screening.morePeople }}人
        </text>
        <text v-else>
          该场次已拼成，还可加入
          <text class="people-count">{{ screening.morePeople }}</text>
          人
        </text>
      </view>
    </view>
    <view class="space u-flex-1"></view>
    <view class="play-right u-flex">
      <view class="rmb dpcolor">
        <text class="price u-margin-right-14">¥{{ screening.price }}/人</text>
      </view>
      <view class="btn">
        <u-button
          shape="circle"
          size="mini"
          :custom-style="customStyle"
          :ripple="true"
          @click="joinGroup()"
        >
          立即预定
        </u-button>
      </view>
    </view>
  </view>
</template>

<script>
import { timeRangeFmt } from '@/common/js/utils/time-fmt';
import style from '../../common/style/variable.scss';
export default {
  props: {
    screening: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      customStyle: {
        backgroundColor: style.themeColor,
        color: style.textCommonColor,
      },
    };
  },
  computed: {
    time() {
      return timeRangeFmt(this.screening.roomBeginTime, this.screening.roomEndTime);
    },
  },
  methods: {
    joinGroup() {
      console.log(this.screening);
      uni.navigateTo({
        url: '/subPackages/order/pay/index',
        success: res => {
          res.eventChannel.emit('submitOrder', JSON.parse(JSON.stringify(this.screening)));
        },
      });
    },
  },
};
</script>

<style lang="scss">
@import '../../common/style/variable.scss';
.play {
    position: relative;

    padding: 14rpx 16rpx;

    border-radius: 8rpx;
    background: #f7f8fc;
    &-left {
        .left-top {
            font-size: 24rpx;
            line-height: 30rpx;

            max-width: 360rpx;
            height: 30rpx;

            color: #111;
            .time {
                color: $text-dark-color ;
            }
            .current-count {
                color: $text-light-gray-color;
                border-left: 1px solid $line-color;
            }
        }
        .left-bottom {
            font-size: 22rpx;
            line-height: 30rpx;

            height: 30rpx;
            margin-top: 12rpx;

            color: $text-gray-color;
            .people-count {
                color: $theme-color;
            }
        }
    }
    &-right {
        .price {
            font-size: 28rpx;
            font-weight: 700;

            white-space: nowrap;

            color: $theme-color;
        }
    }
}

</style>