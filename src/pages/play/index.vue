<template>
  <view class="container">
    <view class="u-page list-container">
      <u-sticky bg-color="#f0f0f0">
        <date-slide-selection
          :date="filterData.time && filterData.time.date"
          :length="dateLength"
          @change="dateChange"
        ></date-slide-selection>
        <view class="u-flex sort">
          <view class="label">排序规则</view>
          <view class="u-flex u-row-around">
            <u-button
              class="btn"
              size="mini"
              type="primary"
              v-for="(btn, index) in sortList"
              :key="index"
              :plain="btn.value !== sort"
              :throttle-time="300"
              @click="changeSort(btn.value)"
            >
              {{ btn.label }}
            </u-button>
          </view>
        </view>
      </u-sticky>
      <view
        class="u-flex u-row-between empty-tip"
        v-if="!loading && !list.length && !recommends.length"
        @click="showFilter = true"
      >
        <text>搜索结果太少，请尝试调整筛选条件</text>
        <text class="arrow-right"></text>
      </view>
      <view class="list">
        <list-card v-for="(card, index) in list" :key="index" :data="card"></list-card>
        <view class="tip" v-if="recommends.length">没有更多匹配结果，为您智能推荐更多结果</view>
        <list-card v-for="(card, index) in displayRecommends" :key="index" :data="card"></list-card>
      </view>
      <u-loadmore
        v-if="list.length || recommends.length"
        :status="status"
        @loadmore="loadmore"
        :loadText="loadText"
      />
      <view class="empty-display" v-if="!loading && !list.length && !recommends.length">
        <image src="/static/image/empty.png"></image>
        <text>暂无数据</text>
      </view>
      <loading class="loading" v-if="loading && !list.length && !recommends.length"></loading>
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
import filter from './filter/filter.vue';
import dateSlideSelection from '@/components/date-slide-selection/date-slide-selection.vue';
import { timeFmt, defaultStartTimeMaker } from '@/common/js/time-fmt';
import positionPopup from '@/components/position-popup/position-popup.vue';
export default {
  components: {
    listCard,
    customTabBar,
    loading,
    filter,
    dateSlideSelection,
    positionPopup,
  },
  onShow() {
    uni.setStorageSync('current_tab_page', this.tabPageName);
    // 开始实时监控位置
    this.$refs.positionRef.startLocationUpdate();
  },
  data() {
    return {
      tabPageName: 'play',
      tabBarIndex: 1,
      loading: true,
      // 加载更多
      status: 'loadmore',
      loadText: {
        loadmore: '轻轻上拉',
        loading: '努力加载中',
        nomore: '暂时没有了',
      },
      // 返回顶部
      scrollTop: 0,
      // 列表
      list: [],
      pageNum: 1,
      pageSize: 10,
      pages: 1,
      isRefrash: true,
      // 推荐列表
      recommends: [],
      recommendDisplayPageNum: 1,
      recommendPageNum: 1,
      recommendPageSize: 10,
      recommendPages: 1,
      // 筛选
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
      gettingPosition: false,
      // 排序
      sortList: [
        {
          label: '智能推荐',
          value: null,
        },
        {
          label: '距离',
          value: 2,
        },
        {
          label: '评分',
          value: 3,
        },
        {
          label: '购买数量',
          value: 1,
        },
      ],
      sort: null,
    };
  },
  mounted() {
    this.getCardList(true);
    this.showFilter = true;
  },
  onPullDownRefresh() {
    if (this.gettingPosition) {
      return;
    }
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
    displayRecommends() {
      return this.recommends.slice(0, this.recommendDisplayPageNum * this.pageSize);
    },
  },
  methods: {
    // 列表
    getCardList(isRefrash = false) {
      this.isRefrash = isRefrash;
      this.loading = true;
      uni.showNavigationBarLoading();
      this.loadText.loading = '努力加载中';
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
            this.backToTop();
            this.resetRecommendsParams();
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
        sort: this.sort,
      };
      const { longitude, latitude } = uni.getStorageSync('position');
      if (latitude == null && longitude == null) {
        // 获取经纬度，终止本次请求，在handleGotPosition中重新发起请求
        return (this.gettingPosition = true);
      }
      params.longitude = longitude;
      params.latitude = latitude;
      const { position, blockBooking, price, styles, features, people, time } =
        this.filterData || {};
      if (position) {
        if (''.startsWith.call(position, 'r')) {
          params.region = position;
        } else {
          params.distanceTo = position;
        }
      }
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
    backToTop() {
      uni.pageScrollTo({
        duration: 0,
        scrollTop: 0,
      });
    },
    resetRecommendsParams() {
      this.recommendPageNum = 1;
      this.recommendDisplayPageNum = 1;
      this.recommendPages = 1;
      this.recommends = [];
    },
    handleRecord(v) {
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
    },
    handleResult(res) {
      const { records, pages, total } = res;
      this.pages = pages;
      this.list.push(...records.map(v => this.handleRecord(v)));
      this.stopLoading();
      // 列表最后一页，请求推荐列表
      if (total <= this.list.length) {
        this.recommendPageSize = this.list.length + this.pageSize;
        this.getRecommendList();
      }
    },
    handleErr(err) {
      if (!this.recommends.length) {
        this.pageNum--;
      } else {
        this.recommendPageNum--;
        this.recommendDisplayPageNum--;
      }
      this.handleReadBottomStatus();
      console.error(err);
    },
    getRecommendList(displayPageNum = this.recommendDisplayPageNum) {
      uni.showNavigationBarLoading();
      this.loading = true;
      if (displayPageNum > 1) {
        this.loadText.loading = '努力加载中';
      } else {
        this.loadText.loading = '没有更多匹配结果，正在为您智能推荐';
      }
      this.status = 'loading';
      if (this.recommends.length < displayPageNum * this.pageSize) {
        if (displayPageNum > 1) {
          this.recommendPageNum++;
        }
        const params = this.handleRecommendParams();
        this.$u.api
          .getCardList(params)
          .then(res => {
            const { records, pages } = res;
            this.recommendPages = pages;
            this.recommends.push(
              ...records
                .filter(record => this.list.findIndex(v => v.productId === record.productId) === -1)
                .map(v => this.handleRecord(v))
            );
            if (
              this.recommends.length < displayPageNum * this.pageSize &&
              this.recommendPageNum < pages
            ) {
              this.recommendPageNum++;
              this.getRecommendList();
            } else {
              this.stopLoading();
              console.log('recommends', this.recommends);
            }
          })
          .catch(err => this.handleErr(err));
      } else {
        this.stopLoading();
      }
    },
    stopLoading() {
      uni.hideNavigationBarLoading();
      this.handleReadBottomStatus();
      this.loading = false;
    },
    handleRecommendParams() {
      let params = this.handleParams();
      params = Object.assign({}, params, {
        pageNum: this.recommendPageNum,
        pageSize: this.recommendPageSize,
      });
      switch (params.blockBooking) {
        case 1:
          params.blockBooking = 0;
          break;
        case 0:
          params.peopleFrom++;
          if (params.peopleFrom) {
            params.peopleTo++;
          }
          break;
        default:
          params.peopleFrom++;
          if (params.peopleFrom) {
            params.peopleTo++;
          }
          break;
      }
      return params;
    },
    handleGotPosition() {
      !this.recommends.length ? this.getCardList(this.isRefrash) : this.getRecommendList();
    },
    handleReadBottomStatus() {
      if (
        !this.recommends.length
          ? this.pageNum >= this.pages
          : this.recommendPageNum >= this.recommendPages
      ) {
        this.status = 'nomore';
      } else {
        this.status = 'loadmore';
      }
    },
    onReachBottom() {
      if (
        !this.recommends.length
          ? this.pageNum >= this.pages
          : this.recommendPageNum >= this.recommendPages
      ) {
        return;
      }
      this.loadmore();
    },
    loadmore() {
      if (!this.recommends.length) {
        this.pageNum++;
        this.getCardList();
      } else {
        this.recommendDisplayPageNum++;
        this.getRecommendList();
      }
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
    changeSort(value) {
      this.sort = this.sort === value ? null : value;
      this.getCardList(true);
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
    min-height: 100%;

    background-color: $background-color;
}
.sort {
    margin: 2rpx 0 10rpx;
    padding: 8rpx;

    background-color: #fff;
    .label {
        margin-right: 20rpx;
        padding: 0 10rpx;

        border-right: 2px solid #f63;
        border-left: 2px solid #f63;
    }
    .btn {
        &:not(:nth-child(1)) {
            margin-left: 20rpx;
        };
    }
}
.list {
    overflow: hidden;

    margin: 0 24rpx 10rpx;
    .tip {
        display: block;

        padding: 0 20rpx 24rpx;

        color: #aaa;
    }
}
.empty-tip {
    font-size: 24rpx;

    margin-bottom: 10rpx;
    padding: 20rpx;

    color: #111;
    background-color: #fff;
    .arrow-right {
        width: 22rpx;
        height: 22rpx;

        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAsCAYAAAAacYo8AAACwUlEQVRoQ+3ZPYgTQRQA4De7QfODQmYISAJWAQvFFFqKBM7zRBtTBE4RtBK1SOFPq3u2pxYpVKwURKw8C0XPHwhiqUXCCYIBo5KgLDMrFkkUd58M5HDZw8tls7uXAdNuGL7Mvrz35g0BRT9EUTeMBS+Xy3qtVtuZSqU+tlqt71Fugm84IhLG2CIiTgOAiMViJdM0X0WF9w1Pp9NbAeDTMpQQ0gOAkhBiMQq8b3ixWIw1Go0lRNzmgv7SNO0I5/xB2HjfcAkb7PpLAMi7oLamaSc453fDxI8Fl7BMJrPFtu3niLjDBUUAOGNZ1s2w8GPDJSyXy7Fer/cUEXe7oYSQC0KIK2HgA4FLGKV0MyI+BoA9HvycEMIIGh8YXMKy2Wyy3+8vIOJ+D/6aEOJckPhA4RKWz+c3cs7vA8BhD/5WpVI5bRiGE8QPCBwuUTJV1uv1OwBw1IO8VygUjtdqtd/j4kOBS5RhGFq1Wr2BiCc9yIeMsdlms/lzHHxo8GUUpfQqIp71hM2zeDxe6nQ6Xb/40OGDjDOHiBc9yNeEkENCiB9+8JHAB/jziDjvQb5NJpMz7Xabj4qPDC5h6XT6FABcB/jbThNC3um6vs80za+j4COFSxhj7JjjOLcBQHdBmwAwZVnW57XiI4cP8CXHcWSu37AMJYR80XV9yjTND2vBrwt8EPMzACCrbMKF/0YIKXLO3w/DrxtcwjKZzF7bth8h4iYX/okQ4uB/+LAdGPU5pVS9UGGMqffnVDId/qMALem6Pj2xBYhSuqLkE0LeJBKJAxNb8imlBiJeUqrJUq6tVfIgoeTRTcnDspLjiVUGQpeFEN6MMmqHsOL7gXSHcgTX7XbleHmX51A8uSO4wdDzBSJud6Ene+ip5Jh5lcH+LOd8YewgHrKA7xhX9ipF2csr+SaVvC4MO4aHre87xoctHPbzP8hhczwaPeppAAAAAElFTkSuQmCC);
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }
}
.empty-display {
    position: absolute;
    top: 475rpx;
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
