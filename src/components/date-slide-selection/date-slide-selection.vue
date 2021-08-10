<template>
  <view class="tabs">
    <scroll-view class="container" scroll-x :scroll-left="scrollLeft" scroll-with-animation>
      <view class="u-padding-top-20 u-flex date-slide-selection">
        <view
          v-for="(item, index) in dateList"
          :key="index"
          class="item"
          :style="{ color: current === index ? activeColor : inactiveColor }"
          :class="[preId + index]"
          @click="chooseDate(index)"
        >
          <view class="date">
            <view class="date-week">{{ item.week }}</view>
            <view class="date-day">{{ item.day }}</view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import style from '../../common/style/variable.scss';
import {
  dateSlideSelectionDataMaker,
  timeFmt,
  dateStr2timestamp,
} from '@/common/js/utils/time-fmt';
const { windowWidth } = uni.getSystemInfoSync();
const preId = 'El_';
export default {
  name: 'date-slide-selection',
  props: {
    date: null,
    length: {
      type: Number,
      default: 15,
    },
    // 选中项的主题颜色
    activeColor: {
      type: String,
      default: style.themeColor,
    },
    // 未选中项的颜色
    inactiveColor: {
      type: String,
      default: style.textCommonColor,
    },
  },
  watch: {
    date(newVal) {
      const date = newVal && timeFmt(newVal, 'YYYY-MM-DD');
      const index = this.dateList.findIndex(v => date === v.date);
      this.current = index >= 0 ? index : 0;
    },
    current() {
      this.setScrollViewToCenter();
    },
  },
  computed: {
    dateList() {
      return dateSlideSelectionDataMaker(Date.now(), this.length);
    },
    getCurrent() {
      const current = Number(this.current);
      // 判断是否超出边界
      if (current > this.dateList.length - 1) {
        return this.dateList.length - 1;
      }
      if (current < 0) return 0;
      return current;
    },
  },
  mounted() {
    this.init();
  },
  data() {
    return {
      scrollLeft: 0,
      current: 0,
      preId,
      barWidth: 40,
      windowWidth: 0, // 屏幕宽度，单位为px
      componentsWidth: 0,
      tabsInfo: [],
    };
  },
  methods: {
    async init() {
      await this.getTabsInfo();
      this.getQuery(() => this.setScrollViewToCenter());
    },
    // 获取各个tab的节点信息
    getTabsInfo() {
      return new Promise(resolve => {
        let view = uni.createSelectorQuery().in(this);
        for (let i = 0; i < this.dateList.length; i++) {
          view.select('.' + preId + i).boundingClientRect();
        }
        view.exec(res => {
          this.tabsInfo = res;
          resolve();
        });
      });
    },
    getQuery(cb) {
      try {
        let view = uni.createSelectorQuery().in(this).select('.tabs');
        view
          .fields(
            {
              size: true,
            },
            data => {
              if (data) {
                this.componentsWidth = data.width;
                if (cb && typeof cb === 'function') cb(data);
              } else {
                this.getQuery(cb);
              }
            }
          )
          .exec();
      } catch (e) {
        this.componentsWidth = windowWidth;
      }
    },
    // 把活动tab移动到屏幕中心点
    setScrollViewToCenter() {
      let tab;
      tab = this.tabsInfo[this.current];
      if (tab) {
        let tabCenter = tab.left + tab.width / 2;
        let fatherWidth = this.componentsWidth;
        this.scrollLeft = tabCenter - fatherWidth / 2;
      }
    },
    chooseDate(index) {
      this.current = index;
      const date = this.dateList[index].date;
      this.$emit('change', dateStr2timestamp(date));
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../common/style/variable.scss';
.container {
    width: 100%;

    background: $background-color;
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

        width: 107rpx;
        padding: 0 15rpx 10rpx;

        flex-shrink: 0;
        .date {
            display: inline-block;

            margin-right: 2rpx;

            text-align: center;
            &-week,
            &-day {
                white-space: nowrap;
            }
            &-week {
                font-size: 24rpx;
            }
            &-day {
                font-size: 24rpx;
            }
        }
    }
}

</style>