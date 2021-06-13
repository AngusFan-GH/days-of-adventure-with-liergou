<template>
  <view class="play toggle-play u-flex">
    <view class="play-left">
      <view class="left-top u-flex-1 u-line-1">
        <text class="time u-margin-right-8">{{ time }}</text>
        <text class="current-count">{{ screening.currentPeople }}人已加入</text>
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
      <view data-view-bid="b_play_r20lxsmk_mv" data-extend="sku_id=720575953" class="btn dpbg">
        <u-button shape="circle" size="mini" :custom-style="customStyle" @click="joinGroup()">
          加入拼场
        </u-button>
      </view>
    </view>
  </view>
</template>

<script>
import { timeRangeFmt } from '@/common/js/time-fmt';
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
        backgroundColor: '#f63',
        color: '#fff',
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
        url: '/pages/order/index',
        success: res => {
          res.eventChannel.emit('submitOrder', this.screening);
        },
      });
    },
  },
};
</script>

<style lang="scss">
.play {
    position: relative;

    margin-bottom: 22rpx;
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
            .current-count {
                margin-left: 16rpx;

                color: #777;
                &:before {
                    position: absolute;

                    display: inline-block;

                    width: 2rpx;
                    height: 20rpx;
                    margin: 2rpx 0 0 -12rpx;

                    content: '';

                    background: #e1e1e1;
                }
            }
        }
        .left-bottom {
            font-size: 22rpx;
            line-height: 30rpx;

            height: 30rpx;
            margin-top: 12rpx;

            color: #999;
            .people-count {
                color: red;
            }
        }
    }
    &-right {
        .price {
            font-size: 28rpx;
            font-weight: 700;

            white-space: nowrap;

            color: #f63;
        }
    }
}

</style>