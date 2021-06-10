<template>
  <view class="open-setting">
    <view class="title" v-if="title">{{ title }}</view>
    <scroll-view :scroll-y="true" class="desc" v-if="desc">
      {{ desc }}
    </scroll-view>
    <view class="btn-container">
      <u-button
        class="btn"
        type="primary"
        :ripple="true"
        open-type="openSetting"
        @opensetting="handleOpenSetting"
      >
        去设置
      </u-button>
    </view>
  </view>
</template>

<script>
export default {
  name: 'open-setting',
  props: {
    title: {
      type: String,
      default: '修改设置',
    },
    desc: String,
    authSetting: {
      type: String,
      required: true,
    },
  },
  methods: {
    handleOpenSetting(e) {
      if (e.detail.authSetting[this.authSetting]) {
        this.$emit('afterSetting');
      }
    },
  },
};
</script>

<style lang="scss">
.open-setting {
    position: relative;

    box-sizing: border-box;
    width: 750rpx;
    padding: 56rpx 40rpx 80rpx 40rpx;
    .title {
        font-size: 40rpx;

        margin-bottom: 30rpx;
    }
    .desc {
        font-size: 30rpx;

        overflow: hidden;

        box-sizing: border-box;
        max-height: 300rpx;
        margin-bottom: 80rpx;
        padding-bottom: 60rpx;

        opacity: .8;
    }
    .btn-container {
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;

        padding: 40rpx;

        background-color: #fff;
    }
}


</style>