<template>
  <u-button shape="circle" :ripple="true" :custom-style="customStyle" open-type="share">
    <text class="btn-text">邀请伙伴</text>
  </u-button>
</template>

<script>
import style from '@/common/style/variable.scss';
export default {
  name: 'share',
  props: {
    data: null,
  },
  data() {
    return {
      customStyle: {
        backgroundColor: style.themeColor,
        color: style.textCommonColor,
        width: '100%',
        height: '74rpx',
        lineHeight: '74rpx',
      },
    };
  },
};
</script>

<style lang="scss" scoped>
</style>