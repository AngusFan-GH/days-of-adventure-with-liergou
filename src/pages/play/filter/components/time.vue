<template>
  <view class="filter-time">
    <view class="label">开场日期</view>
    <calendar
      v-model="date"
      :collapsible="false"
      :min="minDate"
      :max="maxDate"
      @onDayClick="changeDay"
    ></calendar>
    <view class="label">开场时间区间</view>
    <view class="u-flex u-row-between u-margin-top-10">
      <view class="u-flex-1">
        <time-picker
          v-model="startTime"
          :max="startTimeMax"
          :date="date"
          @change="startTimeChange"
        ></time-picker>
      </view>
      <view class="u-margin-left-10 u-margin-right-10">至</view>
      <view class="u-flex-1">
        <time-picker
          v-model="endTime"
          :min="endTimeMin"
          :date="date"
          :default="[23, 59]"
          @change="endTimeChange"
        ></time-picker>
      </view>
    </view>
    <view class="u-flex u-row-center u-margin-top-20">
      <view class="u-flex" @click="reset()">
        <u-icon name="reload" color="#ccc" size="42"></u-icon>
        <text class="u-margin-left-4 u-margin-right-20 btn">重置</text>
      </view>
    </view>
  </view>
</template>

<script>
import calendar from '@/components/calendar/calendar.vue';
import timePicker from '@/components/time-picker/time-picker.vue';
import { defaultStartTimeMaker } from '@/common/js/time-fmt';
const $moment = require('moment');
export default {
  name: 'filter-time',
  components: { calendar, timePicker },
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    value: {
      type: Object,
      default: {},
    },
    dateLength: {
      type: Number,
      default: 0,
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(time) {
        this.date = time && time.date;
        this.startTime = time && time.startTime;
        this.endTime = time && time.endTime;
      },
    },
  },
  data() {
    return {
      minDate: $moment().format('YYYY/MM/DD'),
      maxDate: $moment()
        .add(this.dateLength - 1, 'days')
        .format('YYYY/MM/DD'),
      date: null,
      startTime: null,
      endTime: null,
    };
  },
  computed: {
    startTimeMax() {
      return this.timestamp2timeArr(this.endTime);
    },
    endTimeMin() {
      return this.timestamp2timeArr(this.startTime);
    },
  },
  methods: {
    changeDay() {
      this.$emit('input', {
        date: this.date,
        startTime: defaultStartTimeMaker(this.date),
        endTime: new Date(`${$moment(this.date).format('YYYY/MM/DD')} 23:59:59`).getTime(),
      });
    },
    startTimeChange(e) {
      this.$emit('input', {
        ...this.value,
        startTime: e,
      });
    },
    endTimeChange(e) {
      this.$emit('input', {
        ...this.value,
        endTime: e,
      });
    },
    timestamp2timeArr(time) {
      if (!time) return null;
      return $moment(time)
        .format('HH:mm')
        .split(':')
        .map(v => +v);
    },
    reset() {
      this.$emit('input', null);
    },
  },
};
</script>

<style lang="scss">
@import '../../../../common/style/variable.scss';
.filter-time {
    display: block;

    width: 100%;
    .label {
        position: relative;

        display: inline-block;

        margin-left: 10rpx;
        &:before {
            position: absolute;
            right: -8rpx;
            bottom: -4rpx;

            display: block;

            width: 4rpx;
            height: 20rpx;

            content: '';

            background-color: $theme-color;
        }
        &:after {
            position: absolute;
            right: -8rpx;
            bottom: -4rpx;

            display: block;

            width: 20rpx;
            height: 4rpx;

            content: '';

            background-color: $theme-color;
        }
    }
    .btn {
        color: #ccc;
    }
}


</style>