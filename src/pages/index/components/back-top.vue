<template>
  <u-back-top
    :scroll-top="scrollTop"
    :icon-style="backTopIconStyle"
    :custom-style="backTopCustomStyle"
    @click.native="handleClick"
  ></u-back-top>
</template>

<script>
import style from '@/common/style/variable.scss';
export default {
  name: 'back-top',
  props: {
    scrollTop: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      backTopIconStyle: {
        fontSize: '32rpx',
        color: style.themeColor,
      },
      backTopCustomStyle: {
        background: '#fff',
        border: '2rpx solid ' + style.titleColor,
      },
    };
  },
  methods: {
    handleClick() {
      this.$emit('backTop');
    },
  },
};
</script>

<style>
</style>