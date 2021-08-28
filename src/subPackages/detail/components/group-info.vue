<template>
  <view class="u-padding-30 group-info">
    <view class="u-flex u-row-between title u-skeleton-fillet">组队信息</view>
    <view class="u-flex u-p-t-30 wrapper">
      <view class="u-m-6 mumber" v-for="(item, index) in data" :key="index">
        <u-avatar class="avatar" size="60" :src="item.src"></u-avatar>
        <view class="u-line-1 name">{{ item.name || '神秘人' }}</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'group-info',
  props: {
    data: null,
  },
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
    .wrapper {
        flex-wrap: wrap;
        .mumber {
            width: 70rpx;
            .avatar {
                margin: 0 auto;
            }
            .name {
                font-size: 22rpx;

                width: 100%;

                text-align: center;
            }
        }
    }
}

</style>>