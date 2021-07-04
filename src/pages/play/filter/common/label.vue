<template>
  <view class="label">
    <view style="visibility: hidden">{{ label }}</view>
    <view class="u-flex label-text">{{ label }}</view>
  </view>
</template>

<script>
export default {
  name: 'filter-tab-content-label',
  props: {
    label: String,
  },
};
</script>

<style lang="scss">
.label {
    position: relative;

    display: inline-block;

    height: 47rpx;
    margin-top: 8rpx;
    margin-left: 5rpx;
    padding: 0 20rpx 0 7rpx;

    border-radius: 0 0 43rpx 0;
    background: #995320;
    &-text {
        font-weight: bold;

        position: absolute;
        right: 5rpx;
        bottom: 8rpx;

        height: 100%;
        padding: 0 20rpx 0 7rpx;

        white-space: nowrap;

        color: #fff;
        border-radius: 0 0 43rpx 0;
        background: #dc782f;
    }
}

</style>