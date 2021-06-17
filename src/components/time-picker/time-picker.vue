<template>
  <picker-view
    class="time-picker"
    indicator-class="time-picker-item"
    :value="timeValue"
    @change="change"
  >
    <picker-view-column>
      <view v-for="(v, i) in 24" :key="i">{{ formatNum(i) }}时</view>
    </picker-view-column>
    <picker-view-column>
      <view v-for="(v, i) in 60" :key="i">{{ formatNum(i) }}分</view>
    </picker-view-column>
    <picker-view-column v-if="showSeconds">
      <view v-for="(v, i) in 60" :key="i">{{ formatNum(i) }}秒</view>
    </picker-view-column>
  </picker-view>
</template>

<script>
import { timeFmt } from '@/common/js/time-fmt';
export default {
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    value: null,
    min: null,
    max: null,
    date: null,
    default: {
      type: Array,
      default: [0, 0, 0],
    },
    showSeconds: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(time) {
        const timeValue = time
          ? timeFmt(time, 'HH:mm:ss')
              .split(':')
              .map(v => +v)
          : this.default;
        this.$nextTick(() => (this.timeValue = timeValue));
      },
    },
  },
  data() {
    return {
      timeValue: [0, 0, 0], //时间选择器的值
    };
  },
  methods: {
    //时间选择变更
    change(e) {
      let timeArr = e.detail.value;
      if (this.min && this.compareEarlierTimeArray(timeArr, this.min)) {
        timeArr = this.min;
      } else if (this.max && this.compareEarlierTimeArray(this.max, timeArr)) {
        timeArr = this.max;
      }
      let time =
        timeFmt(this.value, 'YYYY/MM/DD') + ' ' + this.formatTimeArray(timeArr, this.showSeconds);
      time = new Date(time).getTime();
      if (this.value !== time) {
        this.emitTime(time);
      } else {
        this.$set(this, 'timeValue', null);
        this.$nextTick(() => (this.timeValue = timeArr));
      }
    },
    formatNum(e) {
      return e < 10 ? '0' + e : e;
    },
    formatTimeArray(t, s) {
      let r = [...t];
      if (!s) r.length = 2;
      r.forEach((v, k) => (r[k] = ('0' + v).slice(-2)));
      return r.join(':');
    },
    compareEarlierTimeArray(target, competitor) {
      const dateArr = [0, 0, 0];
      const targetTimestamp = new Date(...dateArr.concat(target)).getTime();
      const competitorTimestamp = new Date(...dateArr.concat(competitor)).getTime();
      return competitorTimestamp > targetTimestamp;
    },
    emitTime(time) {
      this.$emit('input', time);
      this.$emit('change', time);
    },
  },
};
</script>

<style lang="scss" scoped>
.time-picker {
    line-height: 60rpx;

    width: 100%;
    height: 100rpx;

    text-align: center;

    border-radius: 12rpx;
    background: #fff;
}

</style>