<template>
  <view class="container" :style="{ '--background': 'url(' + backgroundImage + ')' }">
    <view class="u-page list-container">
      <u-sticky :bg-color="styleVariable.backgroundColor">
        <view class="wrap" v-if="bannerList.length">
          <u-swiper :list="bannerList" @click="handleClickBanner" title></u-swiper>
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
    <custom-tabbar :tabbarIndex="tabbarIndex"></custom-tabbar>
    <position-popup
      ref="positionRef"
      v-model="gettingPosition"
      @gotPosition="handleGotPosition"
    ></position-popup>

    <view class="popup-container" v-if="popupList.length">
      <view class="popup">
        <view>
          <image class="pic" :src="popupList[0].banner" mode="aspectFit"></image>
        </view>
        <view class="u-m-t-20 u-flex u-row-around btn-container">
          <u-button size="mini" :ripple="true" @click="laterView(true, $event)">关闭</u-button>
          <u-button type="primary" size="mini" :ripple="true" @click="laterView(false, $event)">
            稍后再看
          </u-button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { customTabbar } from '@/components/custom-tabbar/custom-tabbar.vue';
import listCard from '@/components/list-card/list-card.vue';
import loading from '@/components/loading/loading.vue';
import positionPopup from '@/components/position-popup/position-popup.vue';
import style from '../../common/style/variable.scss';
import { fileUrl } from '../../common/js/config';
export default {
  components: {
    listCard,
    customTabbar,
    loading,
    positionPopup,
  },
  onShow() {
    uni.setStorageSync('current_tab_page', this.tabPageName);
    this.$refs.positionRef.startLocationUpdate();
  },
  mounted() {
    this.getCardList(true);
    this.getActivityList();
    this.getPopupList();
  },
  data() {
    return {
      tabPageName: 'index',
      tabbarIndex: 0,
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
      bannerList: [],
      popupList: [],
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
    handleClickBanner(index) {
      console.log(this.bannerList[index]);
      const banner = this.bannerList[index];
      if (banner.activity) {
        uni.navigateTo({
          url: '/subPackages/activity/index?id=' + banner.activity,
        });
      }
    },
    getActivityList() {
      this.$u.api.getActivityList({ location: '1' }).then(e => {
        this.bannerList = e.map(v => {
          v.image = v.banner;
          return v;
        });
      });
    },
    getPopupList() {
      this.$u.api.getActivityList({ location: '2' }).then(e => {
        console.log(e);
        this.popupList = e;
      });
    },
    laterView(isIgnore = true, e) {
      const activityId = this.popupList[0].id;
      console.log('isIgnore:', isIgnore, activityId);
      isIgnore &&
        this.$u.api
          .ignoreActivity({
            activityId,
            ignoreDuration: 30,
          })
          .then(() => console.log('ignoreActivity', activityId));
      this.popupList.shift();
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
    height: 250rpx;
    margin: 0 24rpx;
}
.list {
    overflow: hidden;

    margin: 0 24rpx 10rpx;
}
.empty-display {
    position: absolute;
    top: 600rpx;
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

.popup-container {
    position: fixed;
    z-index: 999999;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    background-color: rgba($color: #000, $alpha: .5);
    .popup {
        position: absolute;
        top: 40%;
        left: 50%;

        display: block;

        width: 70vw;

        transform: translate(-50%, -50%);
        .pic {
            display: block;

            width: 100%;
        }
    }
}

</style>
