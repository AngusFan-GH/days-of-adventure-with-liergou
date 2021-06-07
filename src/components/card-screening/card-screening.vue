<template>
  <view class="play toggle-play u-flex">
    <view class="play-left">
      <view class="left-top u-flex-1 u-line-1">
        <text class="time u-margin-right-8">06月11日 19:30-次日00:00</text>
        <text class="current-count">{{ screening.currentPeople }}人已加入</text>
      </view>
      <view class="left-bottom">
        <text v-if="screening.restPeople > 0"
          >差<text class="people-count">{{ screening.restPeople }}</text
          >人即可开场，最多再加入{{ screening.morePeople }}人</text
        >
        <text v-else
          >该场次已拼成，还可加入<text class="people-count">{{
            screening.morePeople
          }}</text
          >人</text
        >
      </view>
    </view>
    <view class="space u-flex-1"></view>
    <view class="play-right u-flex">
      <view class="rmb dpcolor">
        <text class="price u-margin-right-14">¥{{ screening.price }}/人</text>
      </view>
      <view
        data-view-bid="b_play_r20lxsmk_mv"
        data-extend="sku_id=720575953"
        class="btn dpbg"
      >
        <u-button
          shape="circle"
          size="mini"
          :custom-style="customStyle"
          @click="joinGroup()"
          >加入拼场</u-button
        >
      </view>
    </view>
  </view>
</template>

<script>
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
        backgroundColor: "orangered",
        color: "#fff",
      },
    };
  },
  methods: {
    joinGroup() {
      console.log(this.screening);
      const { productItemId, restPeople } = this.screening;
      uni.navigateTo({
        url: `/pages/order/index?id=${productItemId}&restPeople=${restPeople}`,
      });
    },
  },
};
</script>

<style lang="scss">
.play {
  position: relative;
  background: #f7f8fc;
  border-radius: 8rpx;
  padding: 14rpx 16rpx;
  margin-bottom: 22rpx;
  &-left {
    .left-top {
      font-size: 24rpx;
      color: #111;
      height: 30rpx;
      line-height: 30rpx;
      max-width: 360rpx;
      .current-count {
        color: #777;
        margin-left: 16rpx;
        &:before {
          content: "";
          width: 2rpx;
          height: 20rpx;
          background: #e1e1e1;
          display: inline-block;
          margin: 2rpx 0 0 -12rpx;
          position: absolute;
        }
      }
    }
    .left-bottom {
      font-size: 22rpx;
      color: #999;
      height: 30rpx;
      line-height: 30rpx;
      margin-top: 12rpx;
      .people-count {
        color: red;
      }
    }
  }
  &-right {
    .price {
      color: #f63;
      white-space: nowrap;
      font-size: 28rpx;
      font-weight: 700;
    }
  }
}
</style>