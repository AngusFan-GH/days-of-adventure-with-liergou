<template>
  <view class="filter-time">
    <calendar
      v-model="date"
      :collapsible="false"
      :min="min"
      :max="max"
      @onDayClick="changeDay"
    ></calendar>
  </view>
</template>

<script>
import calendar from '@/components/calendar/calendar.vue';
import { isToday, timeFmt } from '@/common/js/time-fmt';
const $moment = require('moment');
export default {
  name: 'filter-time',
  components: { calendar },
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    value: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      max: $moment().add(14, 'days').format('YYYY-MM-DD'),
      min: $moment().format('YYYY-MM-DD'),
      date: null,
    };
  },
  watch: {
    value: {
      immediate: true,
      handler(time) {
        this.date = time && $moment(time.start).format('YYYY-MM-DD');
      },
    },
  },
  methods: {
    changeDay({ date }) {
      this.$emit('input', {
        start: isToday(date) ? timeFmt(Date.now(), 'YYYY-MM-DD HH:mm:ss') : date + ' 00:00:00',
        end: date + ' 23:59:59',
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