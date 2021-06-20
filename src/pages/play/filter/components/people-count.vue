<template>
  <view class="u-flex filter-people-count">
    <u-button
      class="btn"
      v-for="(count, index) in btnList"
      :key="index"
      size="medium"
      :custom-style="customStyle"
      :throttle-time="0"
      :type="current === index ? 'primary ' : 'default'"
      @click="handleClick(index)"
    >
      {{ count.label }}
    </u-button>
  </view>
</template>

<script>
export default {
  name: 'filter-people-count',
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
        if (newVal == null) {
          return this.handleClick(0);
        }
        const index = this.btnList.findIndex(v => v.value === newVal);
        this.current = index >= 0 ? index : null;
      },
    },
  },
  data() {
    return {
      btnList: new Array(10)
        .fill(null)
        .map((v, i) => {
          return {
            label: i + 1 + '人',
            value: i + 1,
          };
        })
        .concat({
          label: '10+',
          value: 11,
        }),
      current: null,
      customStyle: {
        width: '120rpx',
      },
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
.filter-people-count {
    width: 100%;

    flex-wrap: wrap;
}
.btn {
    display: block;

    margin: 20rpx;
}

</style>