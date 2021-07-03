<template>
  <view class="filter-block-booking">
    <u-button
      class="btn"
      v-for="(btn, index) in btnList"
      :key="index"
      shape="circle"
      :ripple="true"
      :throttle-time="0"
      :custom-style="current === index ? activeBtnStyle : btnStyle"
      @click="handleClick(index)"
    >
      {{ btn.label }}
    </u-button>
  </view>
</template>

<script>
import style from '../../../../common/style/variable.scss';
export default {
  name: 'filter-block-booking',
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    value: null,
  },
  watch: {
    value: {
      immediate: true,
      handler(newVal) {
        const index = this.btnList.findIndex(v => v.value === newVal);
        this.current = index >= 0 ? index : null;
      },
    },
  },
  data() {
    return {
      btnList: [
        {
          label: '优先包场',
          value: 1,
        },
        {
          label: '优先拼场',
          value: 0,
        },
      ],
      current: null,
      btnStyle: {
        backgroundColor: style.filterBtnBgColor,
        color: style.filterBtnTextColor,
        width: '388rpx',
        height: '58rpx',
        border: '4rpx solid ' + style.filterBtnBorderColor,
      },
      activeBtnStyle: {
        backgroundColor: style.filterBtnActiveBgColor,
        color: style.filterBtnActiveTextColor,
        width: '388rpx',
        height: '58rpx',
        border: '4rpx solid ' + style.filterBtnBorderColor,
      },
    };
  },
  methods: {
    handleClick(index) {
      if (this.current === index) {
        this.current = null;
        this.$emit('input', null);
        return;
      }
      this.current = index;
      this.$emit('input', this.btnList[index].value);
    },
  },
};
</script>

<style lang="scss">
@import '../../../../common/style/variable.scss';
.filter-block-booking {
    display: block;

    width: 100%;
    padding: 50rpx 0 40rpx $filter-tab-width;
}
.btn {
    display: block;
    &:not(:nth-last-child(1)) {
        margin-bottom: 31rpx;
    }
}


</style>