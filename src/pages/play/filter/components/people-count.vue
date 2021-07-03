<template>
  <view class="u-flex filter-people-count">
    <u-button
      class="btn"
      v-for="(count, index) in btnList"
      :key="index"
      shape="circle"
      :ripple="true"
      :throttle-time="0"
      :custom-style="current === index ? activeBtnStyle : btnStyle"
      @click="handleClick(index)"
    >
      {{ count.label }}
    </u-button>
  </view>
</template>

<script>
import style from '../../../../common/style/variable.scss';
export default {
  name: 'filter-people-count',
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
        if (newVal == null) {
          return this.handleClick(0);
        }
        const index = this.btnList.findIndex(v => v.value === newVal);
        this.current = index >= 0 ? index : null;
      },
    },
  },
  data() {
    return {
      btnList: new Array(10)
        .fill(null)
        .map((v, i) => {
          return {
            label: i + 1 + '人',
            value: i + 1,
          };
        })
        .concat({
          label: '10+',
          value: 11,
        }),
      current: null,
      btnStyle: {
        backgroundColor: style.filterBtnBgColor,
        color: style.filterBtnTextColor,
        width: '206rpx',
        height: '58rpx',
        border: '4rpx solid ' + style.filterBtnBorderColor,
      },
      activeBtnStyle: {
        backgroundColor: style.filterBtnActiveBgColor,
        color: style.filterBtnActiveTextColor,
        width: '206rpx',
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
.filter-people-count {
    width: 100%;
    padding: 50rpx 0 40rpx $filter-tab-width;

    flex-wrap: wrap;
}
.btn {
    display: block;

    margin-bottom: 40rpx;
    &:nth-child(2n+1) {
        margin-right: 32rpx;
        margin-left: 25rpx;
    }
}

</style>