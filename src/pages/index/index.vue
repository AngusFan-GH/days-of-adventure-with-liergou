<template>
  <view class="container">
    <view class="u-page list-container">
      <view class="list">
        <list-card
          v-for="(card, index) in list"
          :key="index"
          :data="card"
        ></list-card>
      </view>
      <u-loadmore v-show="!first" :status="status" @loadmore="loadmore" />
      <view class="empty-display" v-if="!list.length">
        <image src="/static/image/empty.png"></image>
        <text>暂无数据</text>
      </view>
    </view>
    <u-back-top :scroll-top="scrollTop"></u-back-top>
    <custom-tab-bar :current="0"></custom-tab-bar>
  </view>
</template>

<script>
import { customTabBar } from '@/components/custom-tab-bar/custom-tab-bar.vue';
import listCard from '@/components/list-card/list-card.vue';
export default {
  components: {
    listCard,
    customTabBar,
  },
  data() {
    return {
      first: true,
      status: 'loadmore',
      list: [],
      pageNum: 1,
      pageSize: 10,
      pages: 1,
      scrollTop: 0,
    };
  },
  created() {
    this.getPositon();
  },
  mounted() {
    this.getCardList(true);
  },
  onPullDownRefresh() {
    this.getCardList(true);
  },
  methods: {
    getPositon() {
      uni.getLocation({
        type: 'wgs84',
        success: res => {
          const position = {
            longitude: res.longitude,
            latitude: res.latitude,
          };
          uni.setStorageSync('position', position);
        },
      });
    },
    getCardList(isRefrash = false) {
      uni.showNavigationBarLoading();
      if (isRefrash) {
        this.pageNum = 1;
      }
      this.status = 'loading';
      const { latitude, longitude } = uni.getStorageSync('position');
      this.$u.api
        .getCardList({
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          latitude,
          longitude,
        })
        .then(res => {
          if (this.first) {
            this.first = false;
          }
          if (isRefrash) {
            this.list = [];
            uni.stopPullDownRefresh();
          }
          this.handleResult(res);
        })
        .catch(err => this.handleErr(err));
    },
    handleResult(res) {
      const { records, pages } = res;
      console.table(records);
      this.pages = pages;
      this.list.push(
        ...records.map(v => {
          v.tags = v.tags.split(',');
          v.difficultLevel = v.difficultLevel / 10;
          v.screenings = [
            {
              price: v.price,
              productItemId: v.productItemId,
              roomBeginTime: v.roomBeginTime,
              roomEndTime: v.roomEndTime,
              currentPeople: v.currentPeople,
              morePeople: v.advicePeopleMax - v.currentPeople,
              restPeople: v.advicePeopleMin - v.currentPeople,
              ...v,
            },
          ];
          return v;
        })
      );
      uni.hideNavigationBarLoading();
      this.handleReadBottomStatus();
    },
    handleErr(err) {
      this.pageNum--;
      this.handleReadBottomStatus();
      console.error(err);
    },
    handleReadBottomStatus() {
      if (this.pageNum >= this.pages) {
        this.status = 'nomore';
      } else {
        this.status = 'loadmore';
      }
    },
    onReachBottom() {
      if (this.pageNum >= this.pages) return;
      this.loadmore();
    },
    loadmore() {
      this.pageNum++;
      this.getCardList();
    },
    onPageScroll(e) {
      this.scrollTop = e.scrollTop;
    },
  },
};
</script>

<style lang="scss">
@import '../../common/style/variable.scss';
.container {
    min-height: 100%;

    background-color: $background-color;
}
.list-container {
    position: relative;
}
.list {
    overflow: hidden;

    margin: 0 24rpx 10rpx;
}
.empty-display {
    position: absolute;
    top: 375rpx;
    left: 50%;

    transform: translate(-50%, -50%);
    text-align: center;
}

</style>
