<template>
  <view class="filter-price">
    <label class="label" label="价格区间" />
    <view class="u-padding-left-16 u-padding-right-14 u-margin-top-48 u-margin-bottom-60">
      <view class="u-flex u-margin-bottom-30 title">
        <text class="u-margin-right-6">¥</text>
        <text>{{ displayPrice }}</text>
      </view>
      <view class="u-flex">
        <view class="u-margin-right-10 title">{{ slideMin }}</view>
        <view>
          <range-slider
            :width="slideStyle.width"
            :barHeight="slideStyle.barHeight"
            :blockSize="slideStyle.blockSize"
            :min="slideMin"
            :max="slideMax"
            :values="rangeValues"
            :step="step"
            :liveMode="isLiveMode"
            @rangechange="handleRangeChange"
          >
            <view slot="minBlock" class="range-slider-block"></view>
            <view slot="maxBlock" class="range-slider-block"></view>
          </range-slider>
        </view>
        <view class="u-margin-left-10 title">{{ slideMax - step }}+</view>
      </view>
    </view>
    <label class="label" label="快捷选择" />
    <u-button
      class="btn"
      v-for="(btn, index) in btnList"
      :key="index"
      shape="circle"
      :ripple="true"
      :throttle-time="0"
      :custom-style="current === index ? activeBtnStyle : btnStyle"
      @click="handleClick(index)"
    >
      {{ btn.label }}
    </u-button>
  </view>
</template>

<script>
import RangeSlider from '@/components/range-slider/range-slider.vue';
import style from '../../../../common/style/variable.scss';
import label from '../common/label.vue';
export default {
  name: 'filter-price',
  components: {
    RangeSlider,
    label,
  },
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    value: {
      type: Array,
      default: [],
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(newVal) {
        const [from, to] = newVal || [];
        const index = this.btnList.findIndex(v => v.priceFrom === from && v.priceTo === to);
        this.current = index >= 0 ? index : null;
        const [minValue, maxValue] = this.rangeValues || [];
        if (from === minValue && to === maxValue) {
          return;
        }
        if (from != null || to != null) {
          this.setRangeValue(newVal, false);
        } else {
          this.setRangeValue(null, false);
        }
      },
    },
  },
  data() {
    return {
      btnList: [
        {
          label: '200元以下',
          priceFrom: 0,
          priceTo: 200,
        },
        {
          label: '200~400元',
          priceFrom: 200,
          priceTo: 400,
        },
        {
          label: '400~600元',
          priceFrom: 400,
          priceTo: 600,
        },
        {
          label: '600元以上',
          priceFrom: 600,
          priceTo: null,
        },
      ],
      current: null,
      rangeValues: [0, 1050],
      slideStyle: {
        width: 355,
        blockSize: 25,
        barHeight: 17,
      },
      slideMin: 0,
      slideMax: 1050,
      isLiveMode: true,
      step: 50,
      btnStyle: {
        backgroundColor: style.filterBtnBgColor,
        color: style.filterBtnTextColor,
        width: '388rpx',
        height: '58rpx',
        border: '4rpx solid ' + style.filterBtnBorderColor,
      },
      activeBtnStyle: {
        backgroundColor: style.filterBtnActiveBgColor,
        color: style.filterBtnActiveTextColor,
        width: '388rpx',
        height: '58rpx',
        border: '4rpx solid ' + style.filterBtnBorderColor,
      },
    };
  },
  computed: {
    displayPrice() {
      let [min, max] = this.rangeValues || [];
      min = min || this.slideMin;
      if (!max || max >= this.slideMax) {
        max = this.slideMax - this.step;
      }
      if (min === max) {
        return max + '+';
      }
      if (max === this.slideMax - this.step) {
        return min + '+';
      }
      return min + '~' + max;
    },
  },
  methods: {
    handleClick(index) {
      if (this.current === index) {
        this.current = null;
        this.setRangeValue();
        return;
      }
      this.current = index;
      const { priceFrom, priceTo } = this.btnList[index];
      this.setRangeValue([priceFrom || this.slideMin, priceTo || this.slideMax]);
    },
    handleRangeChange(e) {
      let { minValue, maxValue } = e;
      minValue = +minValue;
      maxValue = +maxValue;
      if (minValue === maxValue) {
        maxValue += this.step;
      }
      if (minValue === this.slideMax) {
        minValue -= this.step;
      }
      this.setRangeValue([minValue, maxValue]);
    },
    setRangeValue(value, isEmit = true) {
      if (!value) {
        this.rangeValues = [this.slideMin, this.slideMax];
        isEmit && this.emitPrice(null);
        return;
      }
      let [minValue, maxValue] = value;
      minValue = minValue || this.slideMin;
      maxValue = maxValue || this.slideMax;
      this.rangeValues = [minValue, maxValue];
      isEmit && this.emitPrice([minValue, maxValue]);
    },
    emitPrice(value) {
      if (!value) {
        this.$emit('input', null);
        return;
      }
      let [priceFrom, priceTo] = value;
      if (priceTo > this.slideMax - this.step) {
        priceTo = null;
      }
      this.$emit('input', [priceFrom, priceTo]);
    },
  },
};
</script>

<style lang="scss">
@import '../../../../common/style/variable.scss';
.filter-price {
    display: block;

    width: 100%;
    padding: 50rpx 20rpx;
    padding-left: $filter-tab-width;
    .label {
        display: inline-block;

        margin-left: 13rpx;
    }
    .title {
        font-size: 26rpx;

        color: $text-common-color;
    }
}
.btn {
    display: block;

    margin-top: 26rpx;
}

</style>