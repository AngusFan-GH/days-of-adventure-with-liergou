<template>
  <u-popup
    class="position-setting-popup"
    v-model="value"
    mode="bottom"
    border-radius="14"
    :mask-close-able="false"
    :safe-area-inset-bottom="true"
  >
    <view class="u-flex u-row-between u-m-t-20 u-p-l-20 u-p-r-20 date-btn-container">
      <u-button @click="close" plain size="mini">取消</u-button>
      选择生日
      <u-button type="primary" @click="confirmDate" size="mini">确定</u-button>
    </view>
    <picker-view
      v-if="date.visible"
      :indicator-style="date.indicatorStyle"
      :value="date.value"
      @change="bindChange"
      class="picker-view"
    >
      <picker-view-column>
        <view class="item" v-for="(item, index) in date.years" :key="index">{{ item }}年</view>
      </picker-view-column>
      <picker-view-column>
        <view class="item" v-for="(item, index) in date.months" :key="index">{{ item }}月</view>
      </picker-view-column>
      <picker-view-column>
        <view class="item" v-for="(item, index) in date.days" :key="index">{{ item }}日</view>
      </picker-view-column>
    </picker-view>
  </u-popup>
</template>

<script>
export default {
  name: 'picker-view-date',
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    value: false,
  },
  data() {
    return {
      date: this.dateMaker(),
    };
  },
  methods: {
    dateMaker() {
      const date = new Date();
      const years = [];
      const year = date.getFullYear();
      const months = [];
      const month = date.getMonth() + 1;
      const days = [];
      const day = date.getDate();
      for (let i = 1949; i <= year; i++) {
        years.push(i);
      }
      for (let i = 1; i <= month; i++) {
        months.push(i);
      }
      for (let i = 1; i <= day; i++) {
        days.push(i);
      }
      return {
        title: 'picker-view',
        years,
        year,
        months,
        month,
        days,
        day,
        value: [year, month - 1, day - 1],
        visible: true,
        indicatorStyle: `height: 50px;`,
      };
    },
    bindChange(e) {
      const val = e.detail.value;
      this.date.year = this.date.years[val[0]];
      this.date.month = this.date.months[val[1]];
      this.date.day = this.date.days[val[2]];
      console.log(this.date);
    },
    showDatePopup() {
      this.$emit('input', true);
    },
    close() {
      this.$emit('input', false);
    },
    confirmDate() {
      console.log(this.date);
      this.$emit('confirmDate', this.date);
      this.close();
    },
  },
};
</script>

<style lang="scss" scoped>
.picker-view {
    width: 750rpx;
    height: 600rpx;
    margin-top: 20rpx;
    .item {
        height: 50px;
        line-height: 50px;

        text-align: center;

        align-items: center;
        justify-content: center;
    }
}

</style>