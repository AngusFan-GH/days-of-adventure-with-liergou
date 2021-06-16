<template>
  <view class="filter-time">
    <ren-calendar v-model="date" :collapsible="false" @onDayClick="changeDay"></ren-calendar>
  </view>
</template>

<script>
import renCalendar from '@/components/ren-calendar/ren-calendar.vue';
import { isToday, timeFmt } from '@/common/js/time-fmt';
export default {
  name: 'filter-time',
  components: { renCalendar },
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
      date: null,
    };
  },
  watch: {
    value: {
      immediate: true,
      handler(time) {
        this.date = time && timeFmt(time.start, 'YYYY-MM-DD');
        console.log('date---', this.date);
      },
    },
  },
  methods: {
    changeDay({ date }) {
      console.log(date);
      this.$emit('input', {
        start: isToday(date) ? timeFmt(Date.now(), 'YYYY-MM-DD HH:mm:DD') : date + ' 00:00:00',
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