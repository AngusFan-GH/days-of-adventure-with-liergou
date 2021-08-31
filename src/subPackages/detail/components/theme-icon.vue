<template>
  <view class="u-flex u-flex-wrap theme-icon" :style="{ '--skull-bg-image': skullBgImage }">
    <view
      class="u-flex u-flex-col u-col-center theme-icon-item u-skeleton-fillet"
      v-for="(icon, index) in data.iconTagList"
      :key="index"
    >
      <img :src="data.iconMaps[icon]" alt />
      <view class="u-margin-top-18 icon-name">{{ icon }}</view>
    </view>
  </view>
</template>

<script>
import { fileUrl } from '@/common/js/config';
export default {
  name: 'theme-icon',
  props: {
    data: null,
  },
  data() {
    return {
      skullBgImage: `url(${fileUrl}skull_bg_image.png!d1)`,
    };
  },
};
</script>

<style lang="scss" scoped>
.theme-icon {
    padding: 27rpx 56rpx 90rpx;

    background: var(--skull-bg-image) no-repeat left 200rpx / 90%;
    &-item {
        width: 25%;
        height: 90rpx;
        &:nth-child(n+5) {
            margin-top: 48rpx;
        }
        img {
            width: 50rpx;
            height: 50rpx;
        }
    }
    .icon-name {
        font-size: 22rpx;
        font-weight: bold;

        color: #fff;
    }
}

</style>