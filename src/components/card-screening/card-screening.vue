<template>
  <view class="screening u-flex">
    <view class="screening-info u-flex-1">
      <view class="screening-info-item u-flex u-line-1">
        <view class="time"
          >{{ screening.roomBeginTime }}-{{ screening.roomEndTime }}</view
        >
        <view class="current-people"
          >{{ screening.currentPeople }}人已加入</view
        >
      </view>
      <view class="screening-info-item"
        >该场次已拼成，还可加入<text class="rest-people">{{
          screening.restPeople
        }}</text
        >人</view
      >
    </view>
    <view class="screening-price">¥{{ screening.price }}/人</view>
    <view class="screening-btn">
      <u-button
        shape="circle"
        size="mini"
        :custom-style="customStyle"
        @click="joinGroup()"
        >加入拼场</u-button
      >
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
.screening {
  width: 100%;
  padding: 15rpx;
  background-color: #ddd;
  border-radius: 4px;
  margin-top: 15rpx;
  overflow: hidden;
  &-info {
    overflow: hidden;
  }
  &-price {
    color: orangered;
    white-space: nowrap;
  }
  &-btn {
    // width: 200rpx;
  }
  .rest-people {
    color: red;
  }
}
</style>