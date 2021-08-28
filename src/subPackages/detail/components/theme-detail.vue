<template>
  <view class="theme-detail">
    <view class="detail">
      <view class="u-margin-bottom-20 title u-skeleton-fillet">主题描述</view>
      <view class="theme-description">【写在前面】</view>
      <view class="theme-description" v-for="(desc, index) in data.descriptionList" :key="index">
        {{ desc }}
      </view>
      <view class="theme-description">【故事背景】</view>
      <view class="theme-description">{{ data.introduction }}</view>
      <view>
        <u-lazy-load
          class="u-margin-bottom-20 pic"
          v-for="(url, index) in data.detailPicList"
          :key="index"
          :image="url"
        ></u-lazy-load>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'theme-detail',
  props: {
    data: null,
  },
};
</script>

<style lang="scss" scoped>
.theme-detail {
    margin: 0 25rpx;

    border-radius: 20rpx;
    background: #fff;
    .detail {
        padding: 30rpx;
        .title {
            font-size: 34rpx;
            font-weight: 700;

            color: #111;
        }
        .theme-description {
            font-size: 28rpx;
            font-weight: 400;

            margin-bottom: 30rpx;

            white-space: pre-wrap;

            opacity: .8;
            color: #111;
        }
        .pic {
            display: block;

            width: 100%;
        }
    }
}

</style>