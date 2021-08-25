<template>
  <u-back-top
    :scroll-top="value"
    :icon-style="backTopIconStyle"
    :custom-style="backTopCustomStyle"
    @click.native="handleClick"
  ></u-back-top>
</template>

<script>
import style from '@/common/style/variable.scss';
export default {
  name: 'back-top',
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    value: {
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
      this.$emit('input', 0);
    },
  },
};
</script>

<style>
</style>