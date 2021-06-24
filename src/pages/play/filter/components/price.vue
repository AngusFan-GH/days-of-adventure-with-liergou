<template>
  <view class="filter-price">
    <view class="label">价格区间</view>
    <view class="u-padding-left-10 u-padding-right-10 u-margin-bottom-40">
      <view class="u-flex title">
        <text class="u-margin-right-6">¥</text>
        <text>{{ displayPrice }}</text>
      </view>
      <view class="u-flex">
        <view class="u-margin-right-20">{{ slideMin }}</view>
        <view>
          <range-slider
            :width="slideStyle.width"
            :height="slideStyle.height"
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
        <view class="u-margin-left-20">{{ slideMax - step }}+</view>
      </view>
    </view>
    <view class="label">快捷选择</view>
    <u-button
      class="btn"
      v-for="(btn, index) in btnList"
      :key="index"
      :throttle-time="0"
      :type="current === index ? 'primary ' : 'default'"
      @click="handleClick(index)"
    >
      {{ btn.label }}
    </u-button>
  </view>
</template>

<script>
import RangeSlider from '@/components/range-slider/range-slider.vue';
export default {
  name: 'filter-price',
  components: {
    RangeSlider,
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
        width: 300,
        height: 80,
        blockSize: 30,
      },
      slideMin: 0,
      slideMax: 1050,
      isLiveMode: true,
      step: 50,
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
.filter-price {
    display: block;

    width: 100%;
    padding: 40rpx 20rpx;
    .label {
        position: relative;

        display: inline-block;

        margin-bottom: 30rpx;
        margin-left: 10rpx;
        &:before {
            position: absolute;
            right: -8rpx;
            bottom: -4rpx;

            display: block;

            width: 4rpx;
            height: 20rpx;

            content: '';

            background-color: #f63;
        }
        &:after {
            position: absolute;
            right: -8rpx;
            bottom: -4rpx;

            display: block;

            width: 20rpx;
            height: 4rpx;

            content: '';

            background-color: #f63;
        }
    }
}
.btn {
    display: block;

    margin: 20rpx;
}

</style>