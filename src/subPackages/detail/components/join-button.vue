<template>
  <u-button shape="circle" :ripple="true" :custom-style="customStyle" @click="goToOrder()">
    <text class="btn-text">立即加入</text>
  </u-button>
</template>

<script>
import style from '@/common/style/variable.scss';
export default {
  name: 'join-button',
  props: {
    uniqueId: null,
    data: null,
  },
  inject: ['goToOrder'],
  watch: {
    data(data) {
      if (data) {
        const session = this.getSessionDescribe();
        console.log('session', session);
        this.$emit('getSession', session);
      }
    },
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
  methods: {
    getSessionDescribe() {
      return this.uniqueId
        ? Object.values(this.data.rooms)
            .reduce((prev, cur) => prev.concat(cur), [])
            .find(v => v.uniqueId === this.uniqueId)
        : {};
    },
  },
};
</script>

<style lang="scss" scoped>
</style>