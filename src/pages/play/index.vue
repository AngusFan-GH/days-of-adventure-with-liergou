<template>
  <view class="container">
    <view class="u-page list-container">
      <u-sticky bg-color="#f0f0f0">
        <date-slide-selection
          :date="filterData.time && filterData.time.date"
          :length="dateLength"
          @change="dateChange"
        ></date-slide-selection>
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
    <u-popup
      v-if="showFilter"
      v-model="showFilter"
      mode="center"
      :safe-area-inset-bottom="true"
      :mask-close-able="false"
      z-index="997"
      width="90%"
      height="85%"
      border-radius="8"
      negative-top="100"
      :mask-custom-style="filterMaskStyle"
    >
      <filter :data="filterData" :dateLength="dateLength" @confirm="handleFilterConfirm"></filter>
    </u-popup>
    <u-back-top :scroll-top="scrollTop"></u-back-top>
    <custom-tab-bar :tabBarIndex="tabBarIndex"></custom-tab-bar>
  </view>
</template>

<script>
import { customTabBar } from '@/components/custom-tab-bar/custom-tab-bar.vue';
import listCard from '@/components/list-card/list-card.vue';
import loading from '@/components/loading/loading.vue';
import filter from './filter/filter.vue';
import dateSlideSelection from '@/components/date-slide-selection/date-slide-selection.vue';
import { timeFmt, defaultStartTimeMaker } from '@/common/js/time-fmt';
export default {
  components: {
    listCard,
    customTabBar,
    loading,
    filter,
    dateSlideSelection,
  },
  onShow() {
    uni.setStorageSync('current_tab_page', this.tabPageName);
  },
  data() {
    return {
      tabPageName: 'play',
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
      showFilter: true,
      filterData: {
        position: 0,
        blockBooking: null,
        price: null,
        styles: null,
        features: null,
        people: 1,
        time: null,
      },
      dateLength: 15,
    };
  },
  mounted() {
    this.showFilter = true;
    this.getPositon();
  },
  onPullDownRefresh() {
    this.getCardList(true);
  },
  computed: {
    filterMaskStyle() {
      const imgUrl =
        this.list.length && this.list[Math.floor(Math.random() * this.list.length)].headPic;
      return imgUrl
        ? {
            filter: 'blur(20px)',
            backgroundImage: `url(${imgUrl})`,
            backgroundSize: '200%',
            transition: 'background-image 2s',
          }
        : {
            filter: 'blur(20px)',
          };
    },
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
          uni.setStorageSync('position', position);
          this.getCardList(true);
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
      const params = this.handleParams();
      uni.setStorageSync(this.tabPageName + '_filter_data', params);
      this.$u.api
        .getCardList(params)
        .then(res => {
          if (isRefrash) {
            this.list = [];
            uni.pageScrollTo({
              duration: 0,
              scrollTop: 0,
            });
            uni.stopPullDownRefresh();
          }
          this.handleResult(res);
        })
        .catch(err => this.handleErr(err));
    },
    handleParams() {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      const { position, blockBooking, price, styles, features, people, time } =
        this.filterData || {};
      if (position) {
        if (''.startsWith.call(position, 'r')) {
          params.region = position;
        } else {
          params.distanceTo = position;
        }
      }
      const { longitude, latitude } = uni.getStorageSync('position');
      params.longitude = longitude;
      params.latitude = latitude;
      if (blockBooking != null) {
        params.blockBooking = blockBooking;
      }
      if (price != null) {
        const [priceFrom, priceTo] = price;
        params.priceFrom = priceFrom;
        if (priceTo) {
          params.priceTo = priceTo;
        }
      }
      if (styles && styles.length) {
        params.styles = styles;
      }
      if (features && features.length) {
        params.tags = features;
      }
      if (people != null) {
        if (people > 10) {
          params.peopleFrom = 11;
        } else {
          params.peopleFrom = params.peopleTo = people;
        }
      } else {
        params.peopleFrom = params.peopleTo = 1;
      }
      if (time != null) {
        const { startTime, endTime, date } = time;
        params.roomBeginTimeFrom = `${timeFmt(date, 'YYYY-MM-DD')} ${
          startTime ? timeFmt(startTime, 'HH:mm:ss') : '00:00:00'
        }`;
        params.roomBeginTimeTo = `${timeFmt(date, 'YYYY-MM-DD')} ${
          endTime ? timeFmt(endTime, 'HH:mm:ss') : '23:59:59'
        }`;
      } else {
        params.roomBeginTimeFrom = timeFmt(defaultStartTimeMaker(), 'YYYY-MM-DD HH:mm:ss');
        params.roomBeginTimeTo = timeFmt(Date.now(), 'YYYY-MM-DD') + ' 23:59:59';
      }
      return params;
    },
    handleResult(res) {
      const { records, pages } = res;
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
    handleFilterConfirm(e) {
      this.filterData = e;
      this.showFilter = false;
      this.getCardList(true);
    },
    handletabBarClick() {
      if (!this.showFilter) {
        this.showFilter = true;
      }
    },
    dateChange(e) {
      this.filterData.time = {
        date: e,
        startTime: defaultStartTimeMaker(e),
        endTime: new Date(`${timeFmt(e, 'YYYY/MM/DD')} 23:59:59`).getTime(),
      };
      this.getCardList(true);
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
