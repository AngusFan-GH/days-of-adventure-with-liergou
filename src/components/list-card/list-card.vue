<template>
  <view class="list-card">
    <u-card :show-head="false" :foot-border-top="false" :padding="0">
      <view class="u-flex list-card-body" slot="body">
        <image
          class="list-card-body-img u-margin-right-20"
          :src="data.headPic || defaultThumb"
          mode="aspectFill"
        ></image>
        <view class="list-card-body-desc u-flex-col u-row-between">
          <view class="desc-title">{{ data.productName }}</view>
          <view class="desc-item u-flex u-flex-nowrap">
            <view class="desc-item-label u-margin-right-10">难度</view>
            <u-rate :count="5" v-model="data.difficultLevel" disabled></u-rate>
          </view>
          <view class="desc-item u-flex u-flex-nowrap">
            <view class="desc-item-label u-margin-right-10">类型</view>
            <view class="desc-item-value u-flex-1 u-line-1">{{
              data.style
            }}</view>
          </view>
          <view class="desc-item u-flex u-flex-nowrap">
            <view class="desc-item-label u-margin-right-10">特色</view>
            <view class="desc-item-value u-flex-1 u-line-1">
              <text
                class="u-margin-right-8"
                v-for="(tags, index) in data.tags"
                :key="index"
                >{{ tags }}</text
              >
            </view>
          </view>
          <view class="desc-item u-flex u-flex-nowrap">
            <view class="desc-item-label u-margin-right-10">建议</view>
            <view class="desc-item-value u-flex-1 u-flex u-row-between">
              <view>
                <text
                  >{{
                    data.advicePeopleMin !== data.advicePeopleMax
                      ? `${data.advicePeopleMin}-${data.advicePeopleMax}`
                      : `${data.advicePeopleMin}`
                  }}人</text
                >
                <text class="u-padding-left-8 u-padding-right-8">|</text>
                <text>{{ data.duration }}分钟</text>
              </view>
              <view>{{ data.sales }}人订过</view>
            </view>
          </view>
        </view>
      </view>
      <view class="list-card-footer" slot="foot">
        <u-read-more
          :toggle="true"
          :show-height="110"
          :shadow-style="shadowStyle"
          :close-text="closeText"
          color="#aaa"
        >
          <view v-for="(screening, index) in data.screenings" :key="index">
            <card-screening
              class="screening"
              :screening="screening"
            ></card-screening>
          </view>
          <view
            class="screening"
            v-if="!data.screenings || !data.screenings.length"
            >暂无场次</view
          >
        </u-read-more>
      </view>
    </u-card>
  </view>
</template>

<script>
import defaultThumb from "@/static/image/bg_login.png";
import cardScreening from "@/components/card-screening/card-screening.vue";
export default {
  name: "list-card",
  components: {
    cardScreening,
  },
  props: {
    data: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      defaultThumb,
      shadowStyle: {
        backgroundImage: "none",
        paddingTop: "0",
        marginTop: "20rpx",
      },
    };
  },
  computed: {
    closeText() {
      return `查看全部${this.data.screenings.length}个场次`;
    },
  },
};
</script>

<style lang="scss">
.list-card-body {
  overflow: hidden;

  width: 100%;
  padding: 30rpx 30rpx 15rpx;
}
.list-card-footer {
  width: 100%;
  padding: 0 30rpx 15rpx;
}
.list-card-body-img {
  width: 20%;
  min-width: 20%;
  flex-shrink: 1;
  height: 100px;

  border-radius: 4px;
}
.list-card-body-desc {
  flex: 1;
  overflow: hidden;
  .desc-title {
    font-weight: 600;
  }
  .desc-item {
    &-label {
      color: #ccc;
    }
    &-value {
      overflow: hidden;

      color: rgb(139, 133, 133);
    }
  }
}
</style>