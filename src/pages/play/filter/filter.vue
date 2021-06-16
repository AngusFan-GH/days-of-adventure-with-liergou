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
            <filterTime v-if="currentFiltertab === 'time'" v-model="filterData.time"></filterTime>
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
    </view>
    <view class="u-absolute u-flex u-row-around btn-container" :class="{ reverse: revertFilter }">
      <u-button :ripple="true" @click="reset()">重置</u-button>
      <u-icon name="fingerprint" size="32" @longtap="handleRevertFilter()"></u-icon>
      <u-button :ripple="true" @click="confirm()">确定</u-button>
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
    };
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
      console.log('reset', this.filterData);
      Object.keys(this.filterData).forEach(key => {
        this.filterData[key] = null;
      });
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
        width: 100%;
        height: 100%;
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
                    top: 22px;
                    right: 10px;

                    display: block;

                    content: '*';

                    color: #2979ff;
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