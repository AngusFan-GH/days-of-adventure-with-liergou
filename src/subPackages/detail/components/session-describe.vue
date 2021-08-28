<template>
  <view class="u-p-25 u-flex u-col-bottom session-describe">
    <view class="u-m-r-40 status">{{ status }}</view>
    <view class="u-m-r-10 u-m-b-6 u-m-r-18 current">{{ data.advicePeopleMin }}人成团</view>
    <view class="u-m-b-4 u-flex-1 u-line-1 rest">
      还可加入
      <text class="rest-count">{{ restPeople }}</text>
      人
    </view>
  </view>
</template>

<script>
export default {
  name: 'session-describe',
  props: {
    uniqueId: null,
    data: null,
  },
  data() {
    return {
      restPeople: 0,
      status: '待成团',
    };
  },
  watch: {
    data(data) {
      if (data) {
        const session = this.getSessionDescribe();
        this.restPeople = data.advicePeopleMax - session.currentPeople;
        if (session.currentPeople >= data.advicePeopleMin) {
          this.status = '已成团';
        }
      }
    },
  },
  methods: {
    getSessionDescribe() {
      return this.uniqueId
        ? Object.values(this.data.rooms)
            .reduce((prev, cur) => prev.concat(cur), [])
            .find(v => v.uniqueId === this.uniqueId)
        : {};
    },
  },
};
</script>

<style lang="scss" scoped>
.session-describe {
    position: absolute;
    top: 0;

    width: 100%;

    transform: translateY(-100%);

    border-top-left-radius: 20rpx;
    border-top-right-radius: 20rpx;
    background-color: #f3dc9b;
    .status {
        font-size: 40rpx;
        font-weight: 600;

        position: relative;

        border-bottom: 4rpx solid #faef57;
        &:after {
            position: absolute;
            top: 50%;
            right: -20rpx;

            display: block;

            width: 2rpx;
            height: .5em;

            content: '';
            transform: translate(-50%, -50%);

            background: #000;
        }
    }
    .current {
        font-size: 18rpx;
        font-weight: 600;

        padding: 6rpx 8rpx;

        border-radius: 4px;
        background: #f0ba43;
    }
    .rest {
        font-size: 24rpx;
        font-weight: 600;
        &-count {
            font-size: 40rpx;

            color: #f01b1b;
        }
    }
}

</style>