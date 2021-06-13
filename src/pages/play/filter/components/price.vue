<template>
  <view class="filter-price">
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
export default {
  name: 'filter-price',
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
          label: '200-400元',
          priceFrom: 200,
          priceTo: 400,
        },
        {
          label: '400元以上',
          priceFrom: 400,
          priceTo: null,
        },
      ],
      current: null,
    };
  },
  methods: {
    handleClick(index) {
      if (this.current === index) {
        this.current = null;
        this.$emit('input', null);
        return;
      }
      this.current = index;
      const { priceFrom, priceTo } = this.btnList[index];
      this.$emit('input', [priceFrom, priceTo]);
    },
  },
};
</script>

<style lang="scss">
.filter-price {
    display: block;

    width: 100%;
    padding: 40rpx;
}
.btn {
    display: block;

    margin: 20rpx;
}

</style>