<template>
  <view class="filter-time">
    <calendar
      v-model="date"
      :collapsible="false"
      :min="minDate"
      :max="maxDate"
      @onDayClick="changeDay"
    ></calendar>
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
          :default="[23, 59, 59]"
          @change="endTimeChange"
        ></time-picker>
      </view>
    </view>
  </view>
</template>

<script>
import calendar from '@/components/calendar/calendar.vue';
import timePicker from '@/components/time-picker/time-picker.vue';
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
        startTime: this.isToday(this.date) ? Date.now() : this.date,
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
    isToday(date) {
      return $moment(date).isSame(Date.now(), 'days');
    },
    timestamp2timeArr(time) {
      if (!time) return null;
      return $moment(time).format('HH:mm:ss').split(':');
    },
  },
};
</script>

<style lang="scss">
.filter-time {
    display: block;

    width: 100%;
}

</style>