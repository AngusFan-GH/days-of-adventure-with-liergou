<template>
  <view class="u-flex filter-feature">
    <u-button
      class="btn"
      v-for="(btn, index) in btnList"
      :key="index"
      size="mini"
      :throttle-time="0"
      :type="btn.active ? 'primary' : 'default'"
      @click="handleClick(btn, index)"
    >
      {{ btn.label }}
    </u-button>
  </view>
</template>

<script>
import feature from '../../modal/feature';
export default {
  name: 'filter-feature',
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
      btnList: feature.map(v => {
        v.active = false;
        return v;
      }),
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
.filter-feature {
    width: 100%;
    padding: 40rpx 50rpx;

    flex-wrap: wrap;
}
.btn {
    display: block;

    margin: 20rpx;
}

</style>