<template>
  <view class="filter-block-booking">
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
  name: 'filter-block-booking',
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    value: null,
  },
  watch: {
    value: {
      immediate: true,
      handler(newVal) {
        const index = this.btnList.findIndex(v => v.value === newVal);
        this.current = index >= 0 ? index : null;
      },
    },
  },
  data() {
    return {
      btnList: [
        {
          label: '优先包场',
          value: 1,
        },
        {
          label: '优先拼场',
          value: 0,
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
      this.$emit('input', this.btnList[index].value);
    },
  },
};
</script>

<style lang="scss">
.filter-block-booking {
    display: block;

    width: 100%;
    padding: 40rpx;
}
.btn {
    display: block;

    margin: 20rpx;
}

</style>