<template>
  <view class="u-padding-top-20 u-flex date-slide-selection">
    <view
      v-for="(item, index) in dateList"
      :key="index"
      class="item"
      :class="{ active: current === index }"
      @click="chooseDate(index)"
    >
      <view class="date">
        <view class="date-week">{{ item.week }}</view>
        <view class="date-day">{{ item.day }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import { dateSlideSelectionDataMaker, isToday, timeFmt } from '@/common/js/time-fmt';
export default {
  name: 'date-slide-selection',
  props: {
    date: null,
    length: {
      type: Number,
      default: 15,
    },
  },
  watch: {
    date(newVal) {
      const index = this.dateList.findIndex(v => timeFmt(newVal, 'YYYY-MM-DD') === v.date);
      this.current = index >= 0 ? index : 0;
    },
  },
  computed: {
    dateList() {
      return dateSlideSelectionDataMaker(Date.now(), this.length);
    },
  },
  data() {
    return {
      current: 0,
    };
  },
  methods: {
    chooseDate(index) {
      this.current = index;
      const date = this.dateList[index].date;
      this.$emit('change', this.dateToTimeRange(date));
    },
    dateToTimeRange(date) {
      return {
        start: isToday(date) ? timeFmt(Date.now(), 'YYYY-MM-DD HH:mm:DD') : date + ' 00:00:00',
        end: date + ' 23:59:59',
      };
    },
  },
};
</script>

<style lang="scss">
.date-slide-selection {
    overflow: auto;

    width: 100%;

    background-color: #fff;
    &::-webkit-scrollbar {
        display: none;

        width: 0;
        height: 0;

        color: transparent;
    }
    .item {
        display: inline-block;

        width: 136rpx;
        padding: 0 15rpx;
        &:nth-child(1) {
            padding-left: 30rpx;
        }
        &:nth-last-child(1) {
            padding-right: 30rpx;
        }
        &.active {
            color: #f63;
            border-bottom: 2px solid #f63;
        }
        .date {
            display: inline-block;

            margin-right: 2rpx;

            text-align: center;
            &-week,
            &-day {
                white-space: nowrap;
            }
            &-week {
                font-size: 30rpx;
                line-height: 100%;
            }
            &-day {
                font-size: 24rpx;
                line-height: 220%;
            }
        }
    }
}

</style>