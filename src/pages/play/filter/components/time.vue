<template>
  <view class="filter-time">
    <view class="u-margin-bottom-40">
      <view class="u-margin-bottom-10 label">最早开始时间：</view>
      <view class="btn" v-show="value.start">
        <text @click="chooseTime('start')">{{ value.start }}</text>
        <u-icon
          name="close-circle"
          class="u-margin-left-40"
          color="#2979ff"
          size="28"
          @click="clear('start')"
        ></u-icon>
      </view>
      <view class="btn" v-show="!value.start" @click="chooseTime('start')">设置</view>
    </view>
    <view class="u-margin-bottom-40">
      <view class="u-margin-bottom-10 label">最晚开始时间：</view>
      <view class="btn" v-show="value.end">
        <text @click="chooseTime('end')">{{ value.end }}</text>
        <u-icon
          name="close-circle"
          class="u-margin-left-40"
          color="#2979ff"
          size="28"
          @click="clear('end')"
        ></u-icon>
      </view>
      <view class="btn" v-show="!value.end" @click="chooseTime('end')">设置</view>
    </view>
    <u-picker
      mode="time"
      :z-index="1000"
      v-model="show"
      :params="config"
      :safe-area-inset-bottom="true"
      :title="title"
      @confirm="confirm"
    ></u-picker>
  </view>
</template>

<script>
export default {
  name: 'filter-time',
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    value: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      config: {
        year: true,
        month: true,
        day: true,
        hour: true,
        minute: true,
        second: true,
      },
      title: '选择时间',
      show: false,
      current: null,
    };
  },
  watch: {
    show(newVal) {
      this.$store.commit('toggleTabBar', !newVal);
    },
  },
  methods: {
    chooseTime(type) {
      this.show = true;
      this.current = type;
    },
    confirm(e) {
      const { day, hour, minute, month, second, year } = e;
      this.$emit(
        'input',
        this.value
          ? { [this.current]: `${year}-${month}-${day} ${hour}:${minute}:${second}`, ...this.value }
          : { [this.current]: `${year}-${month}-${day} ${hour}:${minute}:${second}` }
      );
    },
    clear(type) {
      const res = { ...this.value, [type]: null };
      this.$emit('input', Object.values(res).every(v => !v) ? null : res);
    },
  },
};
</script>

<style lang="scss">
.filter-time {
    display: block;

    width: 100%;
    padding: 40rpx;
    .label {
        font-size: 32rpx;
    }
    .btn {
        color: #2979ff;
    }
}

</style>