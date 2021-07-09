<template>
  <view class="filter-people-count" :style="{ '--background': background }">
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
import { fileUrl } from '../../../../common/js/config';
const person = [
  // 数组顺序决定了人物背景图层级
  {
    id: 1,
    position: { x: 331, y: 599 },
    size: { w: 116, h: 451 },
  },
  {
    id: 4,
    position: { x: 225, y: 652 },
    size: { w: 112, h: 431 },
  },
  {
    id: 2,
    position: { x: 264, y: 651 },
    size: { w: 124, h: 431 },
  },
  {
    id: 3,
    position: { x: 372, y: 621 },
    size: { w: 128, h: 429 },
  },
  {
    id: 5,
    position: { x: 434, y: 632 },
    size: { w: 102, h: 359 },
  },
  {
    id: 8,
    position: { x: 146, y: 652 },
    size: { w: 101, h: 392 },
  },
  {
    id: 6,
    position: { x: 198, y: 660 },
    size: { w: 109, h: 431 },
  },
  {
    id: 7,
    position: { x: 515, y: 640 },
    size: { w: 98, h: 391 },
  },
  {
    id: 9,
    position: { x: 582, y: 659 },
    size: { w: 76, h: 364 },
  },
  {
    id: 10,
    position: { x: 99, y: 660 },
    size: { w: 89, h: 376 },
  },
  {
    id: 11,
    position: { x: 20, y: 679 },
    size: { w: 122, h: 266 },
  },
];
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
  computed: {
    background() {
      const res = person
        .filter(p => p.id <= this.current + 1)
        .map(
          p =>
            `url(${fileUrl}person${p.id}.png) ${p.position.x}rpx ${
              ((p.position.y + p.size.h) / (667 * 2 * 0.85)) * 100
            }% / ${p.size.w}rpx ${(p.size.h / (667 * 2 * 0.85)) * 100}% no-repeat`
        );
      res.unshift(
        `url(${fileUrl}filter_background_grass.png) left calc(100% + 108rpx) / 100% no-repeat`
      );
      return res.join(',');
    },
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
    height: 100%;
    padding: 50rpx 0 40rpx $filter-tab-width;

    background: var(--background);
}
.btn {
    display: inline-block;

    margin-bottom: 40rpx;
    &:nth-child(2n+1) {
        margin-right: 32rpx;
        margin-left: 25rpx;
    }
}

</style>