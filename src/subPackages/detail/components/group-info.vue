<template>
  <view
    class="u-p-b-30 u-p-t-60 u-p-l-50 u-p-r-50 group-info"
    v-if="data && data.length"
    :style="{
      '--background-top': 'url(' + backgroundImage[0] + ')',
      '--background-middle': 'url(' + backgroundImage[1] + ')',
      '--background-bottom': 'url(' + backgroundImage[2] + ')',
    }"
  >
    <slot name="session-describe"></slot>
    <slot name="session-info"></slot>
    <view class="u-flex u-row-between title u-skeleton-fillet">组队信息</view>
    <view class="u-flex u-p-t-30 u-p-b-30 wrapper">
      <view class="u-m-6 mumber" v-for="(item, index) in data" :key="index">
        <view
          class="avatar-wrapper"
          :class="{
            paid: item.status === 'paid',
            lock: item.status === 'lock',
          }"
        >
          <u-avatar class="avatar" size="60" :src="item.avatarUrl"></u-avatar>
          <view class="count" v-if="item.buyCount > 1">×{{ item.buyCount }}</view>
          <view class="count" v-if="item.lockCount > 1">×{{ item.lockCount }}</view>
        </view>
        <view class="u-line-1 name">{{ item.nickName || '神秘人' }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import { fileUrl } from '@/common/js/config';
export default {
  name: 'group-info',
  props: {
    data: null,
  },
  data() {
    return {
      backgroundImage: [
        fileUrl + 'group_bg_img_top.png!s1',
        fileUrl + 'group_bg_img_middle.png!s1',
        fileUrl + 'group_bg_img_bottom.png!s1',
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.group-info {
    position: relative;

    margin: 20rpx 25rpx 0;

    background: var(--background-top) no-repeat top/100% 56rpx,
    var(--background-bottom) no-repeat bottom/100% 120rpx,
    var(--background-middle) no-repeat center/100% 100%;
    .title {
        font-size: 34rpx;
        font-weight: 700;

        color: #111;
    }
    .wrapper {
        flex-wrap: wrap;
        .mumber {
            width: 70rpx;
            .avatar-wrapper {
                position: relative;
                .avatar {
                    display: block;

                    width: 60rpx;
                    height: 60rpx;
                    margin: 0 auto 10rpx;

                    border: 2px solid #ccc;
                    border-radius: 100%;
                }
                .count {
                    font-size: 16rpx;

                    position: absolute;
                    right: -4rpx;
                    bottom: 0;

                    padding: 0 8rpx;

                    color: #fff;
                    border-radius: 8rpx;
                    background: #ccc;
                }
                &.paid {
                    .avatar {
                        border: 2px solid #f0ba43;
                    }
                    .count {
                        background: #f0ba43;
                    }
                }
                &.lock {
                    .avatar {
                        border: 2px solid #fa3534;
                    }
                    .count {
                        background: #fa3534;
                    }
                }
            }
            .name {
                font-size: 22rpx;
                font-weight: 500;

                width: 100%;

                text-align: center;
            }
        }
    }
}


</style>