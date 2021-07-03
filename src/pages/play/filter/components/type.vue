<template>
  <view class="filter-type">
    <u-button
      class="btn"
      v-for="(btn, index) in btnList"
      :key="index"
      shape="circle"
      :ripple="true"
      :throttle-time="0"
      :custom-style="btn.active ? activeBtnStyle : btnStyle"
      @click="handleClick(btn, index)"
    >
      {{ btn.label }}
    </u-button>
  </view>
</template>

<script>
import style from '../../../../common/style/variable.scss';
export default {
  name: 'filter-type',
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    value: {
      type: Array,
      default: [],
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(newVal) {
        this.btnList.map(v => {
          v.active = newVal.findIndex(value => v.value === value) >= 0;
          return v;
        });
      },
    },
  },
  data() {
    return {
      btnList: [
        {
          label: '桌面剧本杀',
          value: '桌面剧本杀',
          active: false,
        },
        {
          label: '实景推理',
          value: '实景推理',
          active: false,
        },
        {
          label: '密室逃脱',
          value: '密室逃脱',
          active: false,
        },
        {
          label: '剧场',
          value: '剧场',
          active: false,
        },
      ],
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
    handleClick(btn) {
      const index = this.getIndexInValue(btn.value);
      if (index >= 0) {
        btn.active = false;
        this.value.splice(index, 1);
        this.$emit('input', this.value.length ? this.value : null);
        return;
      }
      btn.active = true;
      this.value.push(btn.value);
      this.$emit('input', this.value);
    },
    getIndexInValue(value) {
      return this.value.findIndex(v => v === value);
    },
  },
};
</script>

<style lang="scss">
@import '../../../../common/style/variable.scss';
.filter-type {
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