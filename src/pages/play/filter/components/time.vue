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
        <time-picker v-model="startTime" @change="startTimeChange"></time-picker>
      </view>
      <view class="u-margin-left-10 u-margin-right-10">至</view>
      <view class="u-flex-1">
        <time-picker
          v-model="endTime"
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
        console.log('time from index:', time, this.date, this.startTime, this.endTime);
      },
    },
  },
  data() {
    return {
      minDate: $moment().format('YYYY-MM-DD'),
      date: null,
      startTime: null,
      endTime: null,
    };
  },
  computed: {
    maxDate() {
      return $moment()
        .add(this.dateLength - 1, 'days')
        .format('YYYY-MM-DD');
    },
  },
  methods: {
    changeDay() {
      this.$emit('input', {
        ...this.value,
        date: this.date,
      });
    },
    startTimeChange() {
      this.$emit('input', {
        ...this.value,
        startTime: this.startTime,
      });
    },
    endTimeChange() {
      this.$emit('input', {
        ...this.value,
        endTime: this.endTime,
      });
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