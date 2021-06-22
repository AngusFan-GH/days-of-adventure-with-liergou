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
      btnList: [
        { label: '恐怖', value: '恐怖', active: false },
        { label: '真人NPC', value: '真人NPC', active: false },
        { label: '机械', value: '机械', active: false },
        { label: '小朋友可玩', value: '小朋友可玩', active: false },
        { label: '单人任务', value: '单人任务', active: false },
        { label: '悬疑', value: '悬疑', active: false },
        { label: '古风', value: '古风', active: false },
        { label: '对抗', value: '对抗', active: false },
        { label: '角色扮演', value: '角色扮演', active: false },
        { label: '有剧情', value: '有剧情', active: false },
        { label: '多种支线', value: '多种支线', active: false },
        { label: '情感', value: '情感', active: false },
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