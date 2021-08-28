<template>
  <view
    class="container safe-area-inset-bottom"
    :style="{ '--background': 'url(' + backgroundImage + ')' }"
  >
    <view class="u-page u-flex-col safe-area-inset-bottom">
      <!-- 活动轮播 -->
      <banner ref="bannerRef"></banner>
      <!-- 搜索 -->
      <search v-model="keyword" @search="handleSearch"></search>
      <!-- 列表 -->
      <scroll-view
        class="u-flex-1 list"
        :enable-back-to-top="true"
        scroll-y="true"
        :scroll-top="listScrollTop"
        @scroll="scroll"
        @scrolltolower="scrolltolower"
        :refresher-enabled="true"
        refresher-default-style="white"
        :refresher-triggered="refresherTriggered"
        @refresherrefresh="refresherRefresh"
      >
        <list-card v-for="(card, index) in list" :key="index" :data="card"></list-card>
        <u-loadmore v-if="list.length" :status="status" @loadmore="loadmore" :loadText="loadText" />
        <view class="empty-display" v-if="!loading && !list.length">
          <image src="/static/image/empty.png"></image>
          <text>暂无数据</text>
        </view>
        <loading class="loading" v-if="loading && !list.length"></loading>
      </scroll-view>
    </view>
    <!-- 返回顶部 -->
    <back-top :scrollTop="scrollTop" @backTop="handleBackTop"></back-top>
    <!-- 监听实时位置授权弹框 -->
    <position-popup ref="positionRef" @gotPosition="handleGotPosition"></position-popup>
    <!-- 活动弹窗 -->
    <popup-modal ref="popupRef"></popup-modal>
    <!-- 底部导航栏 -->
    <custom-tabbar :tabbarIndex="tabbarIndex"></custom-tabbar>
  </view>
</template>

<script>
import { stylesMixin, backgroundImageMixin } from '@/common/js/mixin/styles.js';
import { customTabbar } from '@/components/custom-tabbar/custom-tabbar.vue';
import listCard from '@/components/list-card/list-card.vue';
import loading from '@/components/loading/loading.vue';
import positionPopup from '@/components/position-popup/position-popup.vue';
import { popupModal } from './components/popup-modal.vue';
import Banner from './components/banner.vue';
import Search from './components/search.vue';
import BackTop from './components/back-top.vue';
import { mapState } from 'vuex';
export default {
  mixins: [stylesMixin, backgroundImageMixin],
  components: {
    listCard,
    customTabbar,
    loading,
    positionPopup,
    popupModal,
    Banner,
    Search,
    BackTop,
  },
  onShow() {
    this.$refs.positionRef.startLocationUpdate();
    this.$refs.bannerRef.init();
    this.$refs.popupRef.init();
  },
  mounted() {
    this.getCardList(true);
  },
  data() {
    return {
      tabbarIndex: 0,
      loading: true,
      status: 'loadmore',
      loadText: {
        loadmore: '轻轻上拉',
        loading: '努力加载中',
        nomore: '暂时没有了',
      },
      scrollTop: 0,
      listScrollTop: 0,
      refresherTriggered: false,
      list: [],
      pageNum: 1,
      pageSize: 10,
      pages: 1,
      keyword: null,
      isRefrash: true,
    };
  },
  computed: {
    ...mapState('position', ['position']),
  },
  onPullDownRefresh() {
    Promise.all([this.$refs.bannerRef.init(), this.$refs.popupRef.init()]).finally(() =>
      uni.stopPullDownRefresh()
    );
  },
  methods: {
    scroll(e) {
      this.scrollTop = e.detail.scrollTop;
    },
    scrolltolower() {
      if (this.pageNum >= this.pages || this.loading) return;
      this.loadmore();
    },
    refresherRefresh() {
      this.refresherTriggered = true;
      this.getCardList(true);
    },
    handleSearch() {
      this.getCardList(true);
    },
    handleBackTop() {
      this.listScrollTop = this.scrollTop;
      this.$nextTick(() => {
        this.listScrollTop = 0;
      });
    },
    getCardList(isRefrash = false) {
      this.isRefrash = isRefrash;
      uni.showNavigationBarLoading();
      this.loading = true;
      this.status = 'loading';
      if (isRefrash) {
        this.pageNum = 1;
      }
      const { latitude, longitude } = this.position || {};
      if (latitude == null && longitude == null) {
        this.$refs.positionRef.getPositon();
        return;
      }
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        latitude,
        longitude,
      };
      if (this.keyword) {
        params.name = this.keyword;
      }
      this.$u.api
        .getCardList(params)
        .then(res => {
          if (isRefrash) {
            this.list = [];
            this.refresherTriggered = false;
            this.handleBackTop();
          }
          this.handleResult(res);
        })
        .catch(err => this.handleErr(err));
    },
    handleGotPosition() {
      this.getCardList(this.isRefrash);
    },
    handleResult(res) {
      const { records, pages } = res;
      this.pages = pages;
      this.list.push(
        ...records.map(v => {
          v.tags = v.tags.split(',').filter(v => v);
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
      if (this.pageNum > 1) {
        this.pageNum--;
      }
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
    loadmore() {
      this.pageNum++;
      this.getCardList();
    },
  },
  onHide() {
    this.$refs.positionRef.stopLocationUpdate();
  },
};
</script>

<style lang="scss" scoped>
@import '../../common/style/variable.scss';
.container {
    overflow: hidden;

    height: 100%;
    padding-bottom: 100rpx;

    background: $background-color;
}
.u-page {
    height: 100%;

    background: var(--background) no-repeat bottom / 100%;
}
.list {
    position: relative;

    overflow: auto;

    box-sizing: border-box;
    margin-bottom: 10rpx;
    padding: 0 24rpx;
}
.empty-display {
    position: absolute;
    top: 50%;
    left: 50%;

    transform: translate(-50%, -50%);
    text-align: center;

    color: $text-common-color;
}
.loading {
    position: absolute;
    top: 40%;
    left: 50%;

    transform: translate(-50%,-50%);
}

</style>
