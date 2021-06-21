<template>
  <view class="container">
    <view class="u-page list-container">
      <u-sticky bg-color="#f0f0f0">
        <u-search
          class="search"
          placeholder="输入剧本名，快速找到哈"
          v-model="keyword"
          :clearabled="true"
          :show-action="false"
          shape="square"
          border-color="#fff"
          margin="10rpx 24rpx"
          @search="search"
          @clear="clear"
        ></u-search>
      </u-sticky>
      <view class="list">
        <list-card v-for="(card, index) in list" :key="index" :data="card"></list-card>
      </view>
      <u-loadmore v-if="list.length" :status="status" @loadmore="loadmore" :loadText="loadText" />
      <view class="empty-display" v-if="!loading && !list.length">
        <image src="/static/image/empty.png"></image>
        <text>暂无数据</text>
      </view>
      <loading class="loading" v-if="loading && !list.length"></loading>
    </view>
    <u-back-top :scroll-top="scrollTop"></u-back-top>
    <custom-tab-bar :tabBarIndex="tabBarIndex"></custom-tab-bar>
    <u-popup
      class="position-setting-popup"
      v-model="showPositionPopup"
      mode="bottom"
      border-radius="14"
      :mask-close-able="false"
      :safe-area-inset-bottom="true"
    >
      <open-setting
        title="地理位置授权"
        desc="地理位置授权后方可使用"
        authSetting="scope.userLocation"
        @afterSetting="handleAfterSetting"
      ></open-setting>
    </u-popup>
  </view>
</template>

<script>
import { customTabBar } from '@/components/custom-tab-bar/custom-tab-bar.vue';
import listCard from '@/components/list-card/list-card.vue';
import loading from '@/components/loading/loading.vue';
import openSetting from '@/components/open-setting/open-setting.vue';
export default {
  components: {
    listCard,
    customTabBar,
    loading,
    openSetting,
  },
  onShow() {
    uni.setStorageSync('current_tab_page', this.tabPageName);
  },
  data() {
    return {
      tabPageName: 'index',
      tabBarIndex: 0,
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
      showPositionPopup: false,
      keyword: null,
    };
  },
  mounted() {
    this.getPositon();
  },
  onPullDownRefresh() {
    if (this.showPositionPopup) {
      uni.stopPullDownRefresh();
      return;
    }
    this.getCardList(true);
  },
  methods: {
    getPositon() {
      uni.getLocation({
        type: 'gcj02',
        success: res => {
          const position = {
            longitude: res.longitude,
            latitude: res.latitude,
          };
          console.log('position', position);
          uni.setStorageSync('position', position);
          this.getCardList(true);
        },
        fail: err => {
          console.log(err);
          if (err.errMsg === 'getLocation:fail auth deny') {
            this.showPositionPopup = true;
          }
        },
      });
    },
    search(e) {
      this.keyword = e.trim();
      this.getCardList(true);
    },
    clear() {
      this.keyword = null;
      this.getCardList(true);
    },
    getCardList(isRefrash = false) {
      uni.showNavigationBarLoading();
      this.loading = true;
      this.status = 'loading';
      if (isRefrash) {
        this.pageNum = 1;
      }
      const { latitude, longitude } = uni.getStorageSync('position');
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        latitude,
        longitude,
      };
      if (this.keyword) {
        params.name = this.keyword;
      }
      uni.setStorageSync(this.tabPageName + '_filter_data', params);
      this.$u.api
        .getCardList(params)
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
          v.screenings = v.rooms.map(room => {
            return {
              morePeople: v.advicePeopleMax - room.currentPeople,
              restPeople: v.advicePeopleMin - room.currentPeople,
              ...room,
              ...v,
            };
          });
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
    handleAfterSetting() {
      this.showPositionPopup = false;
      this.getPositon();
    },
  },
};
</script>

<style lang="scss">
@import '../../common/style/variable.scss';
.container {
    overflow: hidden;

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
