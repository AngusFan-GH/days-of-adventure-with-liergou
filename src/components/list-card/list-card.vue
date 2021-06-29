<template>
  <view class="list-card">
    <view class="shop u-flex" @click="goToDetail()">
      <image
        class="pic u-margin-right-20"
        :src="data.headPic || defaultThumb"
        mode="aspectFill"
      ></image>
      <view class="txt attributes u-line-1">
        <view class="u-flex u-row-between">
          <view class="u-flex-1 u-line-1 title">{{ data.productName }}</view>
          <view class="u-line-1 u-flex">
            <u-icon name="map"></u-icon>
            <text class="distance">{{ distanceFmt(data.distance) }}</text>
          </view>
        </view>
        <view class="difficult desc u-flex u-margin-top-16 u-flex-nowrap">
          <view class="label">难度</view>
          <view class="star">
            <u-rate
              :count="5"
              v-model="data.difficultLevel"
              disabled
              active-color="#f6be45"
              active-icon="lock-fill"
              inactive-icon="lock"
              gutter="0"
            ></u-rate>
          </view>
        </view>
        <view class="desc">
          <text class="label">类型</text>
          <text>{{ data.style }}</text>
        </view>
        <view class="desc attributes-list u-flex">
          <text class="label">特色</text>
          <text class="attributes-tag u-flex-1 u-line-1">
            <text class="u-margin-right-12" v-for="(tags, index) in data.tags" :key="index">
              {{ tags }}
            </text>
          </text>
        </view>
        <view class="limit u-flex">
          <view class="desc">
            <text class="label">建议</text>
            <text>
              {{
                data.advicePeopleMin !== data.advicePeopleMax
                  ? `${data.advicePeopleMin}-${data.advicePeopleMax}`
                  : `${data.advicePeopleMin}`
              }}人
            </text>
            <text class="line"></text>
            <text>{{ data.duration }}分钟</text>
          </view>
          <view class="space u-flex-1"></view>
          <view class="book u-margin-top-16">{{ salesFmt(data.sales) }}人订过</view>
        </view>
      </view>
    </view>
    <view class="togather u-margin-top-20">
      <view v-for="(screening, index) in data.screenings" :key="index">
        <card-screening
          class="screening"
          :screening="screening"
          v-show="index < displayCount"
        ></card-screening>
      </view>
      <!-- <view class="screening" v-if="!data.screenings || !data.screenings.length">暂无场次</view> -->
      <view
        class="u-flex u-row-center read-more"
        v-show="data.screenings.length > 1"
        @click="switchReadMoreStatus()"
      >
        <text class="u-margin-right-6">{{ closeText }}</text>
        <u-icon :name="step === 2 ? 'arrow-up' : 'arrow-down'" color="#777" size="26"></u-icon>
      </view>
    </view>
  </view>
</template>

<script>
import defaultThumb from '@/static/image/bg_login.png';
import cardScreening from '@/components/card-screening/card-screening.vue';
export default {
  name: 'list-card',
  components: {
    cardScreening,
  },
  props: {
    data: {
      type: Object,
      default: {},
    },
  },
  watch: {
    data: {
      immediate: true,
      handler(data) {
        const len = data.screenings.length;
        this.step = len > 4 ? 0 : 1;
      },
    },
  },
  data() {
    return {
      defaultThumb,
      step: this.data.screenings.length > 1,
    };
  },
  computed: {
    closeText() {
      switch (this.step) {
        case 0:
          return '再看3场';
        case 1:
          return `查看全部${this.data.screenings.length}个场次`;
        case 2:
          return '收起';
      }
    },
    displayCount() {
      const len = this.data.screenings.length;
      switch (this.step) {
        case 0:
          return 1;
        case 1:
          return len > 4 ? 4 : 1;
        case 2:
          return len;
      }
    },
  },
  methods: {
    goToDetail() {
      uni.navigateTo({
        url: '/subPackages/detail/index?productId=' + this.data.productId,
      });
    },
    distanceFmt(distance) {
      if (distance < 10) {
        return '＜10m';
      }
      if (distance >= 10 && distance < 1000) {
        return distance + 'm';
      }
      if (distance >= 1000 && distance < 100000) {
        return (distance / 1000).toFixed(0) + 'km';
      }
      if (distance >= 10000) {
        return '＞100km';
      }
    },
    salesFmt(sales) {
      if (sales >= 10000 && sales < 10000 * 10000) {
        return parseFloat((sales / 10000).toFixed(1)) + '万';
      }
      if (sales >= 10000 * 10000) {
        return parseFloat((sales / (10000 * 10000)).toFixed(1)) + '亿';
      }
      return sales;
    },
    switchReadMoreStatus() {
      const len = this.data.screenings.length;
      switch (this.step) {
        case 0:
          this.step = 1;
          break;
        case 1:
          this.step = 2;
          break;
        case 2:
          this.step = len > 4 ? 0 : 1;
          break;
      }
    },
  },
};
</script>

<style lang="scss">
.list-card {
    margin-bottom: 24rpx;
    padding: 24rpx 24rpx 22rpx;

    border-radius: 14rpx;
    background: #fff;
    .pic {
        width: 170rpx;
        height: 228rpx;

        border-radius: 8rpx;

        flex-shrink: 0;
    }
    .txt {
        width: 100%;
        .title {
            font-size: 30rpx;
            font-weight: 700;

            color: #111;
        }
        .distance {
            font-size: 24rpx;

            color: #ff4101d1;
        }
        .difficult {
            height: 30rpx;
        }
        .desc {
            line-height: 30rpx;

            margin-top: 16rpx;

            color: #666;
        }
        .label {
            font-size: 26rpx;

            margin-right: 10rpx;

            color: #999;
        }
        .attributes-tag {
            width: 90%;
        }
        .line {
            display: inline-block;

            width: 1px;
            height: 20rpx;
            margin: 0 10rpx;

            background: #999;
        }
        .book {
            font-size: 26rpx;

            color: #999;
        }
    }
    .read-more {
        font-size: 26rpx;

        color: #777;
    }
}

</style>