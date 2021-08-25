<template>
  <u-search
    class="search"
    placeholder="输入剧本名，快速找到哈"
    v-model="keyword"
    :clearabled="true"
    :show-action="false"
    shape="square"
    :border-color="styleVariable.textCommonColor"
    margin="10rpx 24rpx"
    @search="search"
    @clear="clear"
  ></u-search>
</template>

<script>
import { stylesMixin } from '@/common/js/mixin/styles.js';
export default {
  name: 'search',
  mixins: [stylesMixin],
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    value: null,
  },
  computed: {
    keyword: {
      set(value) {
        this.$emit('input', value);
      },
      get() {
        return this.value;
      },
    },
  },
  methods: {
    search(e) {
      const value = e.trim();
      this.$emit('input', value);
      this.$emit('search', value);
    },
    clear() {
      this.$emit('search');
    },
  },
};
</script>

<style>
</style>