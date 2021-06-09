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
      <u-loadmore
        v-if="list.length"
        :status="status"
        @loadmore="loadmore"
        :loadText="loadText"
      />
      <view class="empty-display" v-if="!loading && !list.length">
        <image src="/static/image/empty.png"></image>
        <text>暂无数据</text>
      </view>
      <loading class="loading" v-if="loading && !list.length"></loading>
    </view>
    <u-back-top :scroll-top="scrollTop"></u-back-top>
    <custom-tab-bar :tabBarIndex="tabBarIndex"></custom-tab-bar>
  </view>
</template>

<script>
import { customTabBar } from '@/components/custom-tab-bar/custom-tab-bar.vue';
import listCard from '@/components/list-card/list-card.vue';
import loading from '@/components/loading/loading.vue';
export default {
  components: {
    listCard,
    customTabBar,
    loading,
  },
  data() {
    return {
      tabBarIndex: 1,
      loading: true,
      status: 'loadmore',
      loadText: {
        loadmore: '轻轻上拉',
        loading: '努力加载中',
        nomore: '暂时没有了',
      },
      scrollTop: 0,
      list: [],
      pageNum: 1,
      pageSize: 10,
      pages: 1,
    };
  },
  created() {
    this.getPositon();
  },
  onShow() {
    if (this.loading) {
      this.getCardList(true);
    }
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
      this.loading = true;
      this.status = 'loading';
      if (isRefrash) {
        this.pageNum = 1;
      }
      const { latitude, longitude } = uni.getStorageSync('position');
      this.$u.api
        .getCardList({
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          latitude,
          longitude,
        })
        .then(res => {
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
      this.loading = false;
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
.loading {
    position: fixed;
    top: 40%;
    left: 50%;

    transform: translate(-50%,-50%);
}

</style>
