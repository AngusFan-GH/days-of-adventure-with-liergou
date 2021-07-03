<template>
  <view class="u-flex filter-feature">
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
import feature from '../../modal/feature';
import style from '../../../../common/style/variable.scss';
export default {
  name: 'filter-feature',
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
      btnList: feature.map(v => {
        v.active = false;
        return v;
      }),
      btnStyle: {
        backgroundColor: style.filterBtnBgColor,
        color: style.filterBtnTextColor,
        height: '58rpx',
        border: '4rpx solid ' + style.filterBtnBorderColor,
        padding: '0 29rpx',
      },
      activeBtnStyle: {
        backgroundColor: style.filterBtnActiveBgColor,
        color: style.filterBtnActiveTextColor,
        height: '58rpx',
        border: '4rpx solid ' + style.filterBtnBorderColor,
        padding: '0 29rpx',
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
.filter-feature {
    width: 100%;
    padding: 50rpx 20rpx 50rpx $filter-tab-width;

    flex-wrap: wrap;
}
.btn {
    display: block;

    margin-bottom: 31rpx;
    margin-left: 25rpx;
}

</style>