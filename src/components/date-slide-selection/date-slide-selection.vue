<template>
  <scroll-view :scroll-x="true" class="container">
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
  </scroll-view>
</template>

<script>
import { dateSlideSelectionDataMaker, timeFmt, dateStr2timestamp } from '@/common/js/time-fmt';
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
      const date = newVal && timeFmt(newVal, 'YYYY-MM-DD');
      const index = this.dateList.findIndex(v => date === v.date);
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
      this.$emit('change', dateStr2timestamp(date));
    },
  },
};
</script>

<style lang="scss">
@import '../../common/style/variable.scss';
.container {
    width: 100%;

    color: $text-common-color;
    // border-bottom: 1px solid $background-color;
    // background-color: $background-color;
}
.date-slide-selection {
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
        &.active {
            color: $theme-color;
            // border-bottom: 2px solid $theme-color;
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