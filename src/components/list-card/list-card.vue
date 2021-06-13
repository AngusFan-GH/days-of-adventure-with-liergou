<template>
  <view class="list-card">
    <view class="shop u-flex" @click="goToDetail()">
      <image
        class="pic u-margin-right-20"
        :src="data.headPic || defaultThumb"
        mode="aspectFill"
      ></image>
      <view class="txt attributes u-line-1">
        <view class="title u-line-1">{{ data.productName }}</view>
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
          <view class="book u-margin-top-16">{{ data.sales }}人订过</view>
        </view>
      </view>
    </view>
    <view class="togather u-margin-top-20">
      <u-read-more
        ref="uReadMore"
        :toggle="true"
        :show-height="122"
        :shadow-style="shadowStyle"
        :close-text="closeText"
        :text-indent="0"
        color="#aaa"
      >
        <view v-for="(screening, index) in data.screenings" :key="index">
          <card-screening class="screening" :screening="screening"></card-screening>
        </view>
        <view class="screening" v-if="!data.screenings || !data.screenings.length">暂无场次</view>
      </u-read-more>
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
      handler() {
        this.$nextTick(() => {
          this.$refs.uReadMore.init();
        });
      },
    },
  },
  data() {
    return {
      defaultThumb,
      shadowStyle: {
        backgroundImage: 'none',
        paddingTop: '0',
        marginTop: '20rpx',
      },
    };
  },
  computed: {
    closeText() {
      return `查看全部${this.data.screenings.length}个场次`;
    },
  },
  methods: {
    goToDetail() {
      uni.navigateTo({
        // url: `/pages/detail/index?productId=${this.data.productId}`,
        url: `/pages/detail/index?productItemId=${this.data.rooms[0].productItemId}`,
      });
    },
  },
};
</script>

<style lang="scss">
.list-card {
    margin-top: 24rpx;
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
}

</style>