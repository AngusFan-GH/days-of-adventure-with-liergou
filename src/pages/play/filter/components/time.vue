<template>
  <view class="filter-time">
    <view class="filter-time-content">
      <label class="label" label="开场日期" />
      <calendar
        class="calendar"
        v-model="date"
        :collapsible="false"
        :min="minDate"
        :max="maxDate"
        @onDayClick="changeDay"
      ></calendar>
      <label class="label" label="开场时间区间" />
      <view class="u-flex u-row-between u-margin-top-32 time-container">
        <view class="u-flex-1">
          <time-picker
            class="time-picker"
            v-model="startTime"
            :max="startTimeMax"
            :date="date"
            @change="startTimeChange"
          ></time-picker>
        </view>
        <view class="to">至</view>
        <view class="u-flex-1">
          <time-picker
            class="time-picker"
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
          <text class="u-margin-right-10 reset"></text>
          <text class="u-margin-left-4 u-margin-right-20 btn">重置</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import calendar from '@/components/calendar/calendar.vue';
import timePicker from '@/components/time-picker/time-picker.vue';
import { defaultStartTimeMaker } from '@/common/js/utils/time-fmt';
import label from '../common/label.vue';
const $moment = require('moment');
export default {
  name: 'filter-time',
  components: {
    calendar,
    timePicker,
    label,
  },
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
    height: 100%;
    padding-left: $filter-tab-width;
    &-content {
        width: 100%;
        min-height: 100%;
        padding: 24rpx 10rpx 24rpx 13rpx;

        background-color: rgba(255, 255, 255, .56);
    }
    .calendar {
        display: block;

        margin-bottom: 30rpx;
    }
    .time-container {
        height: 54rpx;

        border-top: 4rpx solid #aa6532;
        border-bottom: 4rpx solid #aa6532;
    }
    .time-picker {
        display: flex;
        overflow: hidden;

        height: 46rpx;

        align-items: center;
    }
    .to {
        display: flex;

        height: 100%;

        color: #000;

        align-items: center;
    }
    .reset {
        width: 28rpx;
        height: 28rpx;

        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAdCAMAAACOj/wDAAACIlBMVEUAAAAAAAAAAACAgIBVVVVAQEBmZmZVVVVJSUltbW1gYGBVVVVmZmZdXV1VVVViYmJbW1tmZmZgYGBjY2NeXl5mZmZhYWFoaGhZWVlkZGRgYGBmZmZiYmJeXl5oaGhkZGRhYWFmZmZjY2NgYGBoaGhkZGRiYmJmZmZjY2NlZWViYmJkZGRlZWVjY2NoaGhkZGRiYmJlZWVmZmZkZGRnZ2dmZmZkZGRiYmJlZWVjY2NkZGRkZGRmZmZkZGRjY2NkZGRjY2NlZWVkZGRlZWVlZWVkZGRmZmZkZGRlZWVkZGRlZWVmZmZkZGRmZmZkZGRmZmZjY2NlZWVkZGRlZWVmZmZlZWVkZGRmZmZlZWVmZmZlZWVlZWVlZWVmZmZmZmZlZWVmZmZlZWVmZmZmZmZlZWVlZWVlZWVmZmZlZWVlZWVmZmZmZmZlZWVmZmZlZWVlZWVmZmZlZWVlZWVlZWVlZWVlZWVmZmZmZmZmZmZlZWVmZmZlZWVkZGRlZWVlZWVlZWVlZWVlZWVmZmZmZmZmZmZlZWVmZmZlZWVmZmZmZmZmZmZmZmZmZmZlZWVmZmZlZWVmZmZmZmZlZWVmZmZlZWVmZmZmZmZmZmZlZWVmZmZmZmZlZWVmZmZmZmZlZWVlZWVmZmZmZmZlZWVmZmZmZmZlZWVmZmZlZWVmZmZmZmZlZWVmZmZmZmZlZWVmZmZmZmZlZWVmZmZmZmZlZWVmZmZmZmaAIvAaAAAAtXRSTlMAAQICAwQFBgcHCAkKCwwNDg8QEhMUFRYXFxgZGhsbHB0eHyAgISIjJCYnKSssLC4vMDIzNDc4OTo7PUBBSk1PUFFSU1hZWlxdXmJncHBzc3Z5en6AgYKFhoeIiY2PkZOWl5iZmpydnqGio6WmqKmqqqyur7CxsbK0tbe7vL2/wsPExcbIycvU1dfZ2t3e3+Dh4uPk5efo6err7O3t7u/w8PHy8vP09PX19vf3+Pn6+/z8/f7+PX2FAQAAAgpJREFUKM9jYIAAdjXbsKrOqTMmtZcFWSuwMCADSbeaSXPXbt66devmNbP7S2xFgGKM/GApZp2caRuB4qvnzVoAUrF+UrImI6NWMFjOsnHt1q3LextS/L0DM1smrNq6dVW1gXrBTJB2s7aNW9d3xxjLCvNw8orKWyT1rtu6rjVr7jIGBibd5k1b11SaCsLsZxQ2L5q5afOazXMZGCRy129dk63JiOQ8RvnwRUC3zWFgdZ66dX2lJorbGWRilgIl5zKo1G3c1GEI0cchIi7EysDAqp0xexNQcjmD/ZStCwK5IYZ5pRfFOYsxKKZNngYCExjyVm7t0gLL6RfOWLNhxeR4OSkPVwdHR0cnO4b+zRsqxEGSSqVAzwLBvEgRLlZmFiBgZli4dWEwH1CO128eWG7rlh4LuMuXbp3uAnQEg2z9Zojk1vm+YCewiYgyLN86zQEUCcqdULmtS8IFQE4wSslA6GzcBJVcGgGSZPeavgRhZ8BCqOREGyYgny9k6RKEa9XqNoDlVqaKgrhi+esXIPzJbFI7d9PWddNzNUAaGfS7Ny9FCiEmVZ/Kpjx3abBH+EIXb+pDCVtuKTkxNki8mHVtWhiNPVYYNMrXb2rTwxqfTOppKzdP9mTDlhJEbIpXbJ0XJcyAJQ1ZpfWv2zo/UR6iFC31TVyzdevCWHmYQZjpNkGBQIpHAKx5BQDuHfjSSB01vgAAAABJRU5ErkJggg);
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }
    .btn {
        color: #666;
    }
}


</style>