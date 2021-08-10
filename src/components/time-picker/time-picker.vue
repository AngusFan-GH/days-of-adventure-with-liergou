<template>
  <picker-view
    class="time-picker"
    mask-class="time-picker-mask"
    indicator-class="time-picker-item"
    :value="timeIndexValue"
    @change="change"
  >
    <picker-view-column>
      <view class="item" v-for="(v, i) in 24" :key="i">{{ formatNum(i) }}时</view>
    </picker-view-column>
    <picker-view-column>
      <view class="item" v-for="(v, i) in seconds" :key="i">{{ formatNum(v) }}分</view>
    </picker-view-column>
  </picker-view>
</template>

<script>
import { timeFmt } from '@/common/js/utils/time-fmt';
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
      default: [0, 0],
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
        const [hour, minute] = timeValue;
        this.seconds.length = 2;
        if (hour === 23) {
          this.seconds.push(59);
        }
        let minuteIndex = this.seconds.findIndex(s => s === minute);
        if (minuteIndex === -1) {
          minuteIndex = 0;
        }
        this.$nextTick(() => this.$set(this, 'timeIndexValue', [hour, minuteIndex]));
      },
    },
  },
  data() {
    return {
      seconds: [0, 30],
      timeIndexValue: [0, 0], //时间选择器的索引值
    };
  },
  methods: {
    //时间选择变更
    change(e) {
      let [hour, minuteIndex] = e.detail.value;
      if (hour === 23) {
        this.seconds.length = 2;
        this.seconds.push(59);
      } else {
        this.seconds.length = 2;
        if (minuteIndex === 2) {
          minuteIndex--;
        }
      }
      const minute = this.seconds[minuteIndex] || 0;
      let timeArr = [hour, minute];
      if (this.min && this.compareEarlierTimeArray(timeArr, this.min)) {
        timeArr = this.min;
      } else if (this.max && this.compareEarlierTimeArray(this.max, timeArr)) {
        timeArr = this.max;
      }
      let time = timeFmt(this.value, 'YYYY/MM/DD') + ' ' + this.formatTimeArray(timeArr);
      time = new Date(time).getTime();
      if (this.value !== time) {
        this.emitTime(time);
      } else {
        this.$set(this, 'timeIndexValue', null);
        minuteIndex = this.seconds.findIndex(s => s === timeArr[1]);
        this.$nextTick(() => (this.timeIndexValue = [timeArr[0], minuteIndex]));
      }
    },
    formatNum(e) {
      return e < 10 ? '0' + e : e;
    },
    formatTimeArray(t, s) {
      let r = [...t];
      r.length = 2;
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
    .item {
        display: flex;

        color: #000;

        justify-content: center;
        align-items: center;
    }
}
picker-view-column {
    color: #000;
    background-image: none;
}

</style>