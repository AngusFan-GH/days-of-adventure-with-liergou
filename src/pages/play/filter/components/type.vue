<template>
  <view class="filter-type">
    <u-button
      class="btn"
      v-for="(btn, index) in btnList"
      :key="index"
      :throttle-time="0"
      :type="btn.active ? 'primary' : 'default'"
      @click="handleClick(btn, index)"
    >
      {{ btn.label }}
    </u-button>
  </view>
</template>

<script>
export default {
  name: 'filter-type',
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
        this.btnList.map(v => {
          v.active = newVal.findIndex(value => v.value === value) >= 0;
          return v;
        });
      },
    },
  },
  data() {
    return {
      btnList: [
        {
          label: '桌面剧本杀',
          value: '桌面剧本杀',
          active: false,
        },
        {
          label: '实景推理',
          value: '实景推理',
          active: false,
        },
        {
          label: '密室逃脱',
          value: '密室逃脱',
          active: false,
        },
        {
          label: '剧场',
          value: '剧场',
          active: false,
        },
      ],
    };
  },
  methods: {
    handleClick(btn) {
      const index = this.getIndexInValue(btn.value);
      if (index >= 0) {
        btn.active = false;
        this.value.splice(index, 1);
        this.$emit('input', this.value.length ? this.value : null);
        return;
      }
      btn.active = true;
      this.value.push(btn.value);
      this.$emit('input', this.value);
    },
    getIndexInValue(value) {
      return this.value.findIndex(v => v === value);
    },
  },
};
</script>

<style lang="scss">
.filter-type {
    display: block;

    width: 100%;
    padding: 40rpx;
}
.btn {
    display: block;

    margin: 20rpx;
}

</style>