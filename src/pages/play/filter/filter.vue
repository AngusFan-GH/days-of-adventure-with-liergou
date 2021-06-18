<template>
  <view class="u-relative filter">
    <view class="u-flex main" :class="{ reverse: revertFilter }">
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
            {{ tab.label }}
          </view>
        </view>
        <!-- </scroll-view> -->
      </view>
      <view class="u-flex-1 form">
        <scroll-view :scroll-y="true" style="height: 100%">
          <view class="tab-content">
            <filterAdress
              v-if="currentFiltertab === 'position'"
              v-model="filterData.position"
            ></filterAdress>
            <filterType
              v-if="currentFiltertab === 'styles'"
              v-model="filterData.styles"
            ></filterType>
            <filterFeature
              v-if="currentFiltertab === 'features'"
              v-model="filterData.features"
            ></filterFeature>
            <filterTime
              v-if="currentFiltertab === 'time'"
              v-model="filterData.time"
              :dateLength="dateLength"
            ></filterTime>
            <filterPeopleCount
              v-if="currentFiltertab === 'people'"
              v-model="filterData.people"
            ></filterPeopleCount>
            <filterPrice
              v-if="currentFiltertab === 'price'"
              v-model="filterData.price"
            ></filterPrice>
            <filterBlockBooking
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
            <text>
              {{
                filterData[item.value] ? '附近' + filterData[item.value] / 1000 + '公里' : '附近'
              }}
            </text>
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
        <view v-if="!displayFilterTabs.length">这里还什么都没有</view>
      </view>
      <view
        class="preview-btn"
        :class="{ reverse: revertFilter }"
        @touchstart="touchStart()"
        @touchend="touchEnd()"
      >
        <u-icon
          class="preview-btn-icon"
          :name="showPreview ? 'eye-fill' : 'eye'"
          color="#ccc"
          size="34"
        ></u-icon>
      </view>
    </view>
    <view class="u-absolute u-flex u-row-around btn-container" :class="{ reverse: revertFilter }">
      <u-button :ripple="true" @click="reset()" size="medium">重置</u-button>
      <u-icon name="fingerprint" size="36" @longpress="handleRevertFilter()"></u-icon>
      <u-button :ripple="true" @click="confirm()" type="primary" size="medium">确定</u-button>
    </view>
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
import { timeFmt, isToday } from '@/common/js/time-fmt';
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
  },
  props: {
    data: Object,
    dateLength: {
      type: Number,
      default: 0,
    },
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
      revertFilter: uni.getStorageSync('revert-filter'),
      filterTabs: [
        {
          label: '位置',
          value: 'position',
        },
        {
          label: '类型',
          value: 'styles',
        },
        {
          label: '特色',
          value: 'features',
        },
        {
          label: '时间',
          value: 'time',
        },
        {
          label: '人数',
          value: 'people',
        },
        {
          label: '价格',
          value: 'price',
        },
        {
          label: '优先包场',
          value: 'blockBooking',
        },
      ],
      currentFiltertab: 'position',
      filterData: {},
      showPreview: false,
    };
  },
  computed: {
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
  },
  methods: {
    handleRevertFilter() {
      this.revertFilter = !this.revertFilter;
      uni.setStorageSync('revert-filter', this.revertFilter);
    },
    handleClickFilterTab(index) {
      this.currentFiltertab = this.filterTabs[index].value;
    },
    confirm() {
      this.$emit('confirm', this.filterData);
    },
    reset() {
      Object.keys(this.filterData).forEach(key => {
        this.filterData[key] = null;
      });
    },
    touchStart() {
      this.showPreview = true;
    },
    touchEnd() {
      this.showPreview = false;
    },
  },
};
</script>

<style lang="scss">

.filter {
    width: 100%;
    height: 100%;
    padding-bottom: 100rpx;
    .main {
        position: relative;

        width: 100%;
        height: 100%;
        .preview {
            position: absolute;
            z-index: 9;
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
            &.reverse {
                right: auto;
                bottom: -100rpx;
                left: -100rpx;

                transform: rotate(90deg);
                .preview-btn-icon {
                    transform: rotate(-90deg);
                }
            }
        }
        .tabs,
        .form {
            height: 100%;
        }
        .tabs {
            .tab {
                position: relative;

                padding: 40rpx 10rpx;

                border-right: 1px solid #999;
                &:not(:nth-last-child(1)) {
                    border-bottom: 1px solid #999;
                }
                &.selected {
                    color: #f63;
                    border-right: 0 none;
                }
                &.actived:after {
                    font-size: 32rpx;

                    position: absolute;
                    top: 0;
                    right: 0;

                    display: block;

                    content: ' ';

                    border-right: 20rpx solid #2979ff;
                    border-bottom: 20rpx solid transparent;
                }
            }
        }
        &.reverse {
            .tab {
                border-right: 0;
                border-left: 1px solid #999;
                &.selected {
                    border-left: 0 none;
                }
            }
        }
        .form {
            box-sizing: border-box;
            padding: 50rpx 40rpx;
        }
    }
    .btn-container {
        z-index: 1;
        bottom: 0;
        left: 0;

        width: 100%;
        height: 100rpx;

        border-top: 1px solid #999;
    }
    .reverse {
        flex-direction: row-reverse;
    }
}


</style>