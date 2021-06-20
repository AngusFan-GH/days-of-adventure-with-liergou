<template>
  <view class="filter-adress">
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
  name: 'filter-adress',
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
      btnList: [
        {
          label: '附近',
          value: 0,
        },
        // {
        //   label: '附近1公里',
        //   value: 1000,
        // },
        // {
        //   label: '附近3公里',
        //   value: 2000,
        // },
        // {
        //   label: '附近5公里',
        //   value: 5000,
        // },
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
.filter-adress {
    display: block;

    width: 100%;
    padding: 40rpx;
}
.btn {
    display: block;

    margin: 20rpx;
}

</style>