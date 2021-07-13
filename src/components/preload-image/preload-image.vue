<template>
  <view>
    <image
      style="display: none"
      v-for="(src, index) in srcs"
      :key="index"
      :src="src"
      @load="imageload(index, $event)"
      @error="imageError(index, $event)"
    ></image>
  </view>
</template>

<script>
export default {
  name: 'preload-image',
  props: {
    srcs: {
      type: Array,
      default: [],
    },
  },
  methods: {
    imageload(index, e) {
      console.log(index, e);
      this.$emit('load', {
        index,
        e,
      });
    },
    imageError(index, e) {
      console.error('image' + index + '发生error事件，携带值为' + e.detail.errMsg);
    },
  },
};
</script>

<style>
</style>