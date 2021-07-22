<template>
  <view class="container" :style="{ '--background': 'url(' + backgroundImage + ')' }">
    <view class="u-page list-container">
      <u-sticky :bg-color="styleVariable.backgroundColor">
        <view class="wrap">
          <u-swiper :list="bannerList"></u-swiper>
        </view>
        <u-search
          class="search"
          placeholder="输入剧本名，快速找到哈"
          v-model="keyword"
          :clearabled="true"
          :show-action="false"
          shape="square"
          :border-color="styleVariable.textCommonColor"
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
    <u-back-top
      :scroll-top="scrollTop"
      :icon-style="backTopIconStyle"
      :custom-style="backTopCustomStyle"
    ></u-back-top>
    <custom-tab-bar :tabBarIndex="tabBarIndex"></custom-tab-bar>
    <position-popup
      ref="positionRef"
      v-model="gettingPosition"
      @gotPosition="handleGotPosition"
    ></position-popup>
  </view>
</template>

<script>
import { customTabBar } from '@/components/custom-tab-bar/custom-tab-bar.vue';
import listCard from '@/components/list-card/list-card.vue';
import loading from '@/components/loading/loading.vue';
import positionPopup from '@/components/position-popup/position-popup.vue';
import style from '../../common/style/variable.scss';
import { fileUrl } from '../../common/js/config';
export default {
  components: {
    listCard,
    customTabBar,
    loading,
    positionPopup,
  },
  onShow() {
    uni.setStorageSync('current_tab_page', this.tabPageName);
    this.$refs.positionRef.startLocationUpdate();
  },
  mounted() {
    this.getCardList(true);
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
      backTopIconStyle: {
        fontSize: '32rpx',
        color: style.themeColor,
      },
      backTopCustomStyle: {
        background: '#fff',
        border: '2rpx solid ' + style.titleColor,
      },
      list: [],
      pageNum: 1,
      pageSize: 10,
      pages: 1,
      keyword: null,
      gettingPosition: false,
      isRefrash: true,
      styleVariable: style,
      backgroundImage: fileUrl + 'background_image.png!d1',
      bannerList: [
        {
          image: 'https://cdn.uviewui.com/uview/swiper/1.jpg',
          title: '昨夜星辰昨夜风，画楼西畔桂堂东',
        },
        {
          image: 'https://cdn.uviewui.com/uview/swiper/2.jpg',
          title: '身无彩凤双飞翼，心有灵犀一点通',
        },
        {
          image: 'https://cdn.uviewui.com/uview/swiper/3.jpg',
          title: '谁念西风独自凉，萧萧黄叶闭疏窗，沉思往事立残阳',
        },
      ],
    };
  },
  onPullDownRefresh() {
    if (this.gettingPosition) {
      return;
    }
    this.getCardList(true);
  },
  onReachBottom() {
    if (this.pageNum >= this.pages) return;
    this.loadmore();
  },
  onPageScroll(e) {
    this.scrollTop = e.scrollTop;
  },
  methods: {
    search(e) {
      this.keyword = e.trim();
      this.getCardList(true);
    },
    clear() {
      this.keyword = null;
      this.getCardList(true);
    },
    getCardList(isRefrash = false) {
      this.isRefrash = isRefrash;
      uni.showNavigationBarLoading();
      this.loading = true;
      this.status = 'loading';
      if (isRefrash) {
        this.pageNum = 1;
      }
      const { latitude, longitude } = uni.getStorageSync('position');
      if (latitude == null && longitude == null) {
        return (this.gettingPosition = true);
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
    handleGotPosition() {
      this.getCardList(this.isRefrash);
    },
    handleResult(res) {
      const { records, pages } = res;
      // console.table(records);
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

<style lang="scss">
@import '../../common/style/variable.scss';
.container {
    overflow: hidden;

    min-height: 100%;

    background: $background-color var(--background) no-repeat bottom / 100%;
}
.wrap {
  margin: 0 24rpx;
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

    color: $text-common-color;
}
.loading {
    position: fixed;
    top: 40%;
    left: 50%;

    transform: translate(-50%,-50%);
}

</style>
