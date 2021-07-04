<template>
  <view class="calendar-wrapper" :style="{ backgroundColor: backgroundColor }">
    <view class="header" v-if="headerBar">
      <view class="pre" @click="changeMonth('pre')">
        <u-icon name="arrow-left" size="24" color="#000"></u-icon>
      </view>
      <view>{{ y + '年' + formatNum(m) + '月' }}</view>
      <view class="next" @click="changeMonth('next')">
        <u-icon name="arrow-right" size="24" color="#000"></u-icon>
      </view>
    </view>
    <view class="week">
      <view class="week-day" v-for="(item, index) in weekDay" :key="index">{{ item }}</view>
    </view>
    <view :class="{ hide: !monthOpen }" class="content" :style="{ height: height }">
      <view :style="{ top: positionTop + 'rpx' }" class="days">
        <view
          class="item"
          v-for="(item, index) in dates"
          :key="index"
          @click="selectOne(item, $event)"
        >
          <view
            class="day"
            :class="{
              choose: choose == `${item.year}/${item.month}/${item.date}` && item.isCurM,
              today: isToday(item.year, item.month, item.date),
              isWorkDay: isWorkDay(item.year, item.month, item.date),
              nolm: !item.isCurM,
              disabled: isDisabled(item.year, item.month, item.date),
            }"
          >
            {{ Number(item.date) }}
          </view>
        </view>
      </view>
    </view>
    <u-icon
      :name="monthOpen ? 'arrow-up' : 'arrow-down'"
      v-if="collapsible"
      @click="toggle"
      size="32"
    ></u-icon>
  </view>
</template>

<script>
import { timeFmt, dateStr2timestamp } from '@/common/js/time-fmt';
export default {
  name: 'ren-calendar',
  created() {
    this.dates = this.monthDay(this.y, this.m);
    !this.open && this.toggle();
  },
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    value: null,
    // 星期几为第一天(0为星期日)
    weekstart: {
      type: Number,
      default: 0,
    },
    // 是否展示月份切换按钮
    headerBar: {
      type: Boolean,
      default: true,
    },
    // 是否展开
    open: {
      type: Boolean,
      default: true,
    },
    // 是否可收缩
    collapsible: {
      type: Boolean,
      default: true,
    },
    // 背景色
    backgroundColor: {
      type: String,
      default: 'transparent',
    },
    min: null,
    max: null,
  },
  watch: {
    value: {
      immediate: true,
      handler(date) {
        if (date) {
          this.y = new Date(date).getFullYear();
          this.m = new Date(date).getMonth() + 1;
        } else {
          this.y = new Date().getFullYear();
          this.m = new Date().getMonth() + 1;
        }
        this.choose = date && timeFmt(date, 'YYYY/MM/DD');
        this.dates = this.monthDay(this.y, this.m);
      },
    },
  },
  data() {
    return {
      weektext: ['日', '一', '二', '三', '四', '五', '六'],
      y: new Date().getFullYear(), // 年
      m: new Date().getMonth() + 1, // 月
      dates: [], // 当前月的日期数据
      positionTop: 0,
      monthOpen: true,
      choose: '',
    };
  },
  computed: {
    // 顶部星期栏
    weekDay() {
      return this.weektext.slice(this.weekstart).concat(this.weektext.slice(0, this.weekstart));
    },
    height() {
      return (this.dates.length / 7) * 68 + 'rpx';
    },
  },
  methods: {
    formatNum(num) {
      let res = Number(num);
      return res < 10 ? '0' + res : res;
    },
    getToday() {
      let date = new Date();
      let y = date.getFullYear();
      let m = date.getMonth();
      let d = date.getDate();
      let week = new Date().getDay();
      let weekText = ['日', '一', '二', '三', '四', '五', '六'];
      let formatWeek = '星期' + weekText[week];
      let today = {
        date: y + '/' + this.formatNum(m + 1) + '/' + this.formatNum(d),
        week: formatWeek,
      };
      return today;
    },
    // 获取当前月份数据
    monthDay(y, month) {
      let dates = [];
      let m = Number(month);
      let firstDayOfMonth = new Date(y, m - 1, 1).getDay(); // 当月第一天星期几
      let lastDateOfMonth = new Date(y, m, 0).getDate(); // 当月最后一天
      let lastDayOfLastMonth = new Date(y, m - 1, 0).getDate(); // 上一月的最后一天
      let weekstart = this.weekstart == 7 ? 0 : this.weekstart;
      let startDay = (() => {
        // 周初有几天是上个月的
        if (firstDayOfMonth == weekstart) {
          return 0;
        } else if (firstDayOfMonth > weekstart) {
          return firstDayOfMonth - weekstart;
        } else {
          return 7 - weekstart + firstDayOfMonth;
        }
      })();
      let endDay = 7 - ((startDay + lastDateOfMonth) % 7); // 结束还有几天是下个月的
      for (let i = 1; i <= startDay; i++) {
        dates.push({
          date: this.formatNum(lastDayOfLastMonth - startDay + i),
          day: weekstart + i - 1 || 7,
          month: m - 1 > 0 ? this.formatNum(m - 1) : 12,
          year: m - 1 > 0 ? y : y - 1,
          isPreM: true,
        });
      }
      for (let j = 1; j <= lastDateOfMonth; j++) {
        dates.push({
          date: this.formatNum(j),
          day: (j % 7) + firstDayOfMonth - 1 || 7,
          month: this.formatNum(m),
          year: y,
          isCurM: true, //是否当前月份
        });
      }
      for (let k = 1; k <= endDay; k++) {
        dates.push({
          date: this.formatNum(k),
          day: (lastDateOfMonth + startDay + weekstart + k - 1) % 7 || 7,
          month: m + 1 <= 12 ? this.formatNum(m + 1) : 1,
          year: m + 1 <= 12 ? y : y + 1,
          isNextM: true,
        });
      }
      return dates;
    },
    isWorkDay(y, m, d) {
      //是否工作日
      let ymd = `${y}/${m}/${d}`;
      let week = new Date(ymd).getDay();
      if (week == 0 || week == 6) {
        return false;
      } else {
        return true;
      }
    },
    isDisabled(y, m, d) {
      let ymd = `${y}/${m}/${d}`;
      let date = new Date(ymd).getTime();
      if (
        (this.min && dateStr2timestamp(this.min) > date) ||
        (this.max && dateStr2timestamp(this.max) < date)
      ) {
        return true;
      }
      return false;
    },
    isToday(y, m, d) {
      let checkD = y + '/' + m + '/' + d;
      let today = this.getToday().date;
      if (checkD == today) {
        return true;
      } else {
        return false;
      }
    },
    // 展开收起
    toggle() {
      this.monthOpen = !this.monthOpen;
      if (this.monthOpen) {
        this.positionTop = 0;
      } else {
        let index = -1;
        this.dates.forEach((i, x) => {
          this.isToday(i.year, i.month, i.date) && (index = x);
        });
        this.positionTop = -((Math.ceil((index + 1) / 7) || 1) - 1) * 68;
      }
    },
    // 点击回调
    selectOne(i) {
      let date = `${i.year}/${i.month}/${i.date}`;
      const dateTimestamp = new Date(date).getTime();
      if (
        (this.min && dateStr2timestamp(this.min) > dateTimestamp) ||
        (this.max && dateStr2timestamp(this.max) < dateTimestamp)
      ) {
        return;
      }
      let week = new Date(date).getDay();
      let weekText = ['日', '一', '二', '三', '四', '五', '六'];
      let formatWeek = '星期' + weekText[week];
      let response = {
        date: date,
        week: formatWeek,
      };
      if (!i.isCurM) {
        if (i.isPreM) {
          this.changeMonth('pre');
        } else {
          this.changeMonth('next');
        }
        return false;
      }
      this.$emit('input', new Date(date).getTime());
      this.$emit('onDayClick', response);
    },
    changeMonth(type) {
      if (type == 'pre') {
        if (this.m + 1 == 2) {
          this.m = 12;
          this.y = this.y - 1;
        } else {
          this.m = this.m - 1;
        }
      } else {
        if (this.m + 1 == 13) {
          this.m = 1;
          this.y = this.y + 1;
        } else {
          this.m = this.m + 1;
        }
      }
      this.dates = this.monthDay(this.y, this.m);
      this.$emit('changeMonth', { y: this.y, m: this.m });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../common/style/variable.scss';
.calendar-wrapper {
    font-size: 28rpx;

    padding-bottom: 10rpx;

    text-align: center;

    color: #bbb7b7;

    .header {
        font-size: 24rpx;
        font-weight: bold;

        display: flex;

        color: #000;

        align-items: center;
        justify-content: center;

        .pre,
        .next {
            font-size: 28rpx;
            font-weight: normal;

            padding: 8rpx 15rpx;

            color: #333;
        }

        .pre {
            margin-right: 30rpx;
        }

        .next {
            margin-left: 30rpx;
        }
    }

    .week {
        font-weight: bold;

        display: flex;

        margin-bottom: 31rpx;
        padding-top: 17rpx;

        border-top: 4rpx solid #aa6532;

        align-items: center;
        &-day {
            font-size: 19rpx;

            display: flex;
            flex: 1;

            height: 35rpx;

            color: #fff;
            background-color: #dc782f;

            align-items: center;
            justify-content: center;
        }
    }

    .content {
        position: relative;

        overflow: hidden;

        transition: height .4s ease;

        .days {
            position: relative;

            display: flex;

            transition: top .3s;

            align-items: center;
            flex-wrap: wrap;

            .item {
                line-height: 68rpx;

                position: relative;

                display: flex;

                width: calc(100% / 7);
                height: 68rpx;

                align-items: center;
                justify-content: center;

                .day {
                    font-size: 24rpx;
                    font-weight: bold;
                    line-height: 40rpx;

                    display: flex;
                    overflow: hidden;

                    width: 40rpx;
                    height: 40rpx;

                    color: #aa2b25;

                    align-items: center;
                    justify-content: center;

                    &.choose {
                        color: #333;
                        border-radius: 4rpx;
                        background-color: $theme-color;
                    }

                    &.nolm {
                        opacity: .7;
                    }
                    &.disabled {
                        opacity: .2;
                    }
                }

                .isWorkDay {
                    color: #000;
                }

                .notSigned {
                    position: absolute;
                    bottom: 0;
                    left: 50%;

                    width: 8rpx;
                    height: 8rpx;

                    pointer-events: none;

                    border-radius: 10rpx;
                    background: #fa7268;
                }

                .today {
                    color: #fff;
                    border-radius: 100%;
                    background-color: #dc782f;
                }
            }
        }
    }

    .hide {
        height: 68rpx !important;
    }
}

</style>
