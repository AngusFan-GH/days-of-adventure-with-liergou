<template>
  <view class="u-padding-30 group-info">
    <view class="u-flex u-row-between title u-skeleton-fillet">组队信息</view>
  </view>
</template>

<script>
export default {
  name: 'group-info',
};
</script>

<style lang="scss" scoped>
.group-info {
    position: relative;

    margin: -6rpx 25rpx 0;

    border-radius: 20rpx;
    background: #fff;
    .title {
        font-size: 34rpx;
        font-weight: 700;

        color: #111;
    }
}

</style>>