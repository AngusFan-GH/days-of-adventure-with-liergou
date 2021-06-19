<template>
  <view class="loading tank">
    <text>{{ label }}</text>
  </view>
</template>

<script>
export default {
  name: 'loading',
  props: {
    label: {
      type: String,
      default: '稍等一会',
    },
  },
};
</script>

<style lang="scss" scoped>
@import './tank.scss';

</style>