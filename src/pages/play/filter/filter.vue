<template>
  <view class="u-relative filter" :style="{ '--background': displayBackground }">
    <view class="u-flex main">
      <view class="tabs">
        <!-- <scroll-view :scroll-y="true" style="height: 100%"> -->
        <view class="u-flex-col" style="height: 100%">
          <view
            v-for="(tab, index) in filterTabs"
            :key="index"
            class="u-flex-1 u-flex u-row-center tab"
            :class="{
              selected: currentFiltertab === filterTabs[index].value,
              actived: filterData[tab.value] != null,
            }"
            @click="handleClickFilterTab(index)"
          >
            <text class="tab-text">{{ tab.label }}</text>
          </view>
        </view>
        <!-- </scroll-view> -->
      </view>
      <view class="u-flex-1 form">
        <scroll-view :scroll-y="true" style="height: 100%">
          <view class="tab-content">
            <filterAdress
              class="filter-adress"
              v-if="currentFiltertab === 'position'"
              v-model="filterData.position"
            ></filterAdress>
            <filterType
              class="filter-type"
              v-if="currentFiltertab === 'styles'"
              v-model="filterData.styles"
            ></filterType>
            <filterFeature
              class="filter-feature"
              v-if="currentFiltertab === 'features'"
              v-model="filterData.features"
            ></filterFeature>
            <filterTime
              v-if="currentFiltertab === 'time'"
              v-model="filterData.time"
              :dateLength="dateLength"
            ></filterTime>
            <filterPeopleCount
              class="filter-people-count"
              v-if="currentFiltertab === 'people'"
              v-model="filterData.people"
            ></filterPeopleCount>
            <filterPrice
              v-if="currentFiltertab === 'price'"
              v-model="filterData.price"
            ></filterPrice>
            <filterBlockBooking
              class="filter-block-booking"
              v-if="currentFiltertab === 'blockBooking'"
              v-model="filterData.blockBooking"
            ></filterBlockBooking>
          </view>
        </scroll-view>
      </view>
      <view class="preview" v-show="showPreview">
        <view class="preview-item" v-for="(item, index) in displayFilterTabs" :key="index">
          <view class="preview-item-label">{{ item.label }}</view>
          <view class="preview-item-value" v-if="item.value === 'position'">
            <text>{{ displayPosition }}</text>
          </view>
          <view class="preview-item-value" v-if="item.value === 'styles'">
            <text class="u-padding-right-10" v-for="(style, i) in filterData[item.value]" :key="i">
              {{ style }}
            </text>
          </view>
          <view class="preview-item-value" v-if="item.value === 'features'">
            <text
              class="u-padding-right-10"
              v-for="(feature, i) in filterData[item.value]"
              :key="i"
            >
              {{ feature }}
            </text>
          </view>
          <view class="preview-item-value" v-if="item.value === 'time'">
            <text>{{ displayTime }}</text>
          </view>
          <view class="preview-item-value" v-if="item.value === 'people'">
            <text>{{ filterData[item.value] > 10 ? '10+' : filterData[item.value] + '人' }}</text>
          </view>
          <view class="preview-item-value" v-if="item.value === 'price'">
            <text v-if="filterData[item.value][0] && filterData[item.value][1] != null">
              {{ filterData[item.value][0] + '-' + filterData[item.value][1] + '元' }}
            </text>
            <text v-if="filterData[item.value][0] && !filterData[item.value][1]">
              {{ filterData[item.value][0] + '元以上' }}
            </text>
            <text v-if="!filterData[item.value][0] && filterData[item.value][1]">
              {{ filterData[item.value][1] + '元以下' }}
            </text>
          </view>
          <view class="preview-item-value" v-if="item.value === 'blockBooking'">
            <text>
              {{ filterData[item.value] == 1 ? '是' : '否' }}
            </text>
          </view>
        </view>

        <view v-if="!displayFilterTabs.length" class="empty">这里还什么配置都没有呢</view>
      </view>
      <view v-show="false" class="preview-btn" @touchstart="touchStart()" @touchend="touchEnd()">
        <u-icon
          class="preview-btn-icon"
          :name="showPreview ? 'eye-fill' : 'eye'"
          color="#ccc"
          size="34"
        ></u-icon>
      </view>
    </view>
    <view class="u-absolute u-flex u-row-center btn-container">
      <u-button
        :ripple="true"
        @click="reset()"
        size="medium"
        shape="circle"
        :custom-style="cancelBtnStyle"
      >
        重置
      </u-button>
      <u-button
        :ripple="true"
        @click="confirm()"
        size="medium"
        shape="circle"
        :custom-style="confirmBtnStyle"
      >
        确定
      </u-button>
    </view>
    <preload-image :srcs="preloadImages" @load="getPreloadImage"></preload-image>
  </view>
</template>

<script>
import filterAdress from './components/adress.vue';
import filterType from './components/type.vue';
import filterTime from './components/time.vue';
import filterPrice from './components/price.vue';
import filterFeature from './components/feature.vue';
import filterBlockBooking from './components/block-booking.vue';
import filterPeopleCount from './components/people-count.vue';
import preloadImage from '@/components/preload-image/preload-image.vue';
import { timeFmt, isToday } from '@/common/js/time-fmt';
import areaList from '../modal/area';
import style from '../../../common/style/variable.scss';
import { fileUrl } from '../../../common/js/config';
export default {
  name: 'filter',
  components: {
    filterAdress,
    filterType,
    filterTime,
    filterPrice,
    filterFeature,
    filterBlockBooking,
    filterPeopleCount,
    preloadImage,
  },
  props: {
    data: Object,
    dateLength: {
      type: Number,
      default: 0,
    },
  },
  created() {
    this.currentFiltertab = this.filterTabs[0].value;
    this.preloadImages = this.displayBackground
      .match(/url\((.*?)!s1\)/g)
      .map(v => v.match(/url\((.*?)!s1\)/)[1] + '!d1');
  },
  watch: {
    data: {
      immediate: true,
      handler(newVal) {
        this.filterData = newVal || {};
      },
      deep: true,
    },
  },
  data() {
    return {
      filterTabs: [
        {
          label: '人 数',
          value: 'people',
        },
        {
          label: '商 圈',
          value: 'position',
        },
        {
          label: '类 型',
          value: 'styles',
        },
        {
          label: '特 色',
          value: 'features',
        },
        {
          label: '时 间',
          value: 'time',
        },
        {
          label: '价 格',
          value: 'price',
        },
        {
          label: '优先包场',
          value: 'blockBooking',
        },
      ],
      currentFiltertab: null,
      filterData: {},
      showPreview: false,
      background: [
        `url(${fileUrl}filter_background_grass.png!s1) bottom / 100% no-repeat`,
        `url(${fileUrl}filter_background_hourse.png!s1) 60% 75% / 110% 50% no-repeat`,
        `url(${fileUrl}filter_background_image.png!s1) bottom / 100% 100% no-repeat`,
      ],
      cancelBtnStyle: {
        backgroundColor: style.filterCancelBtnColor,
        color: style.filterCancelTextColor,
        width: '196rpx',
        height: '74rpx',
      },
      confirmBtnStyle: {
        backgroundColor: style.filterConfirmBtnColor,
        color: style.filterConfirmTextColor,
        width: '196rpx',
        height: '74rpx',
      },
      preloadImages: [],
    };
  },
  computed: {
    displayBackground() {
      return this.background.join(',');
    },
    displayFilterTabs() {
      return this.filterTabs.filter(v => this.filterData[v.value] != null);
    },
    displayTime() {
      const { date, startTime, endTime } = this.filterData.time || {};
      return `${isToday(date) ? '今日' : timeFmt(date, 'MM月DD日')} ${timeFmt(
        startTime,
        'HH:mm'
      )}-${timeFmt(endTime, 'HH:mm')}`;
    },
    displayPosition() {
      const { position } = this.filterData || {};
      if (''.startsWith.call(position, 'r')) {
        let label = '商圈';
        const area = areaList.find(area => {
          const res = area.children.find(v => v.value === position);
          return res && (label = res.label);
        });
        return area ? area.label + ' ' + label : label;
      }
      return position ? '附近' + position / 1000 + '公里' : '附近';
    },
  },
  methods: {
    handleClickFilterTab(index) {
      this.currentFiltertab = this.filterTabs[index].value;
    },
    confirm() {
      this.$emit('confirm', this.filterData);
    },
    reset() {
      this.currentFiltertab = this.filterTabs[0].value;
      Object.keys(this.filterData).forEach(key => {
        switch (key) {
          case 'position':
            this.filterData[key] = 0;
            break;
          case 'people':
            this.filterData[key] = 1;
            break;
          default:
            this.filterData[key] = null;
            break;
        }
      });
    },
    touchStart() {
      this.showPreview = true;
    },
    touchEnd() {
      this.showPreview = false;
    },
    getPreloadImage(e) {
      this.background[e.index].replace('!s1', '!d1');
    },
  },
};
</script>

<style lang="scss">
@import '../../../common/style/variable.scss';
$btn-container-height: 108rpx;
.filter {
    overflow: hidden;

    width: 100%;
    height: 100%;
    padding-bottom: $btn-container-height;

    background: var(--background);
    background-color: #85817c;
    .filter-adress,
    .filter-type,
    .filter-feature,
    .filter-block-booking,
    .filter-people-count {
        display: block;

        height: 100%;
    }
    .main {
        position: relative;

        width: 100%;
        height: 100%;
        .tabs {
            position: absolute;
            z-index: 9;
            top: 0;
            left: 0;

            width: $filter-tab-width;

            box-shadow: 0 -2rpx 20rpx #f0f0f0 inset;
            .tab {
                font-size: 36rpx;
                font-weight: 400;

                position: relative;

                padding: 40rpx 10rpx;

                color: $filter-tab-text-color;
                &-text {
                    opacity: 1;
                }
                &.selected {
                    background-color: $filter-active-color;
                }
                &.actived:after {
                    font-size: 32rpx;

                    position: absolute;
                    top: 0;
                    left: 0;

                    display: block;

                    content: ' ';

                    border-bottom: 20rpx solid transparent;
                    border-left: 20rpx solid $filter-tab-text-color;
                }
            }
        }
        .tabs,
        .form {
            height: 100%;
        }
        .form {
            .tab-content {
                width: 100%;
                height: 100%;
            }
        }
        .preview {
            position: absolute;
            z-index: 10;
            top: 0;
            left: 0;

            width: 100%;
            height: 100%;
            padding: 50rpx;

            background-color: #ccc;
            &-item {
                padding: 10rpx;
                &-label {
                    font-weight: bold;

                    margin-bottom: 10rpx;
                }
                &-value {
                    margin-left: 2em;
                }
            }
            .empty {
                position: absolute;
                top: 50%;
                left: 50%;

                transform: translate(-50%, -50%);
            }
        }
        .preview-btn {
            position: absolute;
            z-index: 10;
            right: -100rpx;
            bottom: -100rpx;

            clip: rect(0,100rpx,100rpx,0);

            width: 200rpx;
            height: 200rpx;

            opacity: .5;
            border-radius: 50%;
            background-color: #000;
            &-icon {
                position: absolute;
                top: 25%;
                left: 25%;

                transform: translate(-25%, -25%);
            }
        }
    }
    .btn-container {
        z-index: 1;
        bottom: 0;
        left: 0;

        width: 100%;
        height: $btn-container-height;

        opacity: .8;
        background-color: $filter-btn-container-bg-color;
        u-button:nth-child(1) {
            margin-right: 95rpx;
        }
    }
}



</style>