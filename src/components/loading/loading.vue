<template>
  <view class="loading tank"></view>
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