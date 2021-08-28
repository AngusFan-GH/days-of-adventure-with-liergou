<template>
  <view>
    <view>支付结果</view>
    <view>
      <u-button hover-class="none" :ripple="true" :hair-line="false" open-type="share">
        分享
      </u-button>
    </view>
  </view>
</template>

<script>
export default {
  onShareAppMessage(res) {
    console.log(res.target);
    return {
      title: '欢迎体验',
      path: `/subPackages/share/index`,
      imageUrl:
        'https://bjetxgzv.cdn.bspapp.com/VKCEYUGU-uni-app-doc/962fc340-4f2c-11eb-bdc1-8bd33eb6adaa.png',
    };
  },
};
</script>

<style>
</style>