<template>
  <view class="u-flex u-col-top filter-adress">
    <view class="u-flex-1 tabs">
      <scroll-view :scroll-y="true" style="height: 100%">
        <view
          class="tab"
          v-for="(btn, index) in btnList"
          :key="index"
          :class="{ selected: tabIndex === index }"
          @click="handleClickTab(index)"
        >
          {{ btn.label }}
        </view>
      </scroll-view>
    </view>
    <view class="u-flex-1 btns">
      <scroll-view :scroll-y="true" style="height: 100%">
        <view
          class="btn"
          v-for="(btn, i) in btnList[tabIndex].children"
          :key="i"
          :class="{ selected: current === i }"
          @click="handleClickBtn(i)"
        >
          {{ btn.label }}
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import areaList from '../../modal/area';
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
          return this.handleClickTab(0);
        }
        const index = this.btnList.findIndex(value => {
          const i = value.children.findIndex(v => v.value === newVal);
          if (i >= 0) {
            this.current = i;
            return true;
          }
          return false;
        });
        this.tabIndex = index >= 0 ? index : null;
      },
    },
  },
  data() {
    return {
      btnList: [
        {
          label: '附近',
          value: 0,
          children: [
            {
              label: '附近',
              value: 0,
            },
            {
              label: '附近10公里',
              value: 10000,
            },
            {
              label: '附近20公里',
              value: 20000,
            },
            {
              label: '附近30公里',
              value: 30000,
            },
            {
              label: '附近50公里',
              value: 50000,
            },
          ],
        },
      ].concat(areaList),
      tabIndex: 0,
      current: 0,
    };
  },
  methods: {
    handleClickTab(index) {
      this.tabIndex = index;
      this.handleClickBtn(0);
    },
    handleClickBtn(index) {
      this.current = index;
      const res = this.btnList[this.tabIndex].children[this.current];
      this.$emit('input', res.value);
    },
  },
};
</script>

<style lang="scss">
@import '../../../../common/style/variable.scss';
.filter-adress {
    width: 100%;
    height: 100%;
    padding-left: $filter-tab-width;
}
.tabs,
.btns {
    overflow: auto;

    height: 100%;
}
.tabs {
    width: 20%;

    background-color: #fff;
    .tab {
        box-sizing: border-box;
        padding: 20rpx;
        &.selected {
            position: relative;

            color: $theme-color;
            background-color: #f0f0f0;
            &:before {
                position: absolute;
                top: 0;
                left: 0;

                display: block;

                width: 4rpx;
                height: 100%;

                content: '';

                background-color: $theme-color;
            }
        }
    }
}
.btns {
    background-color: #f0f0f0;
    .btn {
        padding: 20rpx;
        &.selected {
            color: $theme-color;
        }
    }
}

</style>