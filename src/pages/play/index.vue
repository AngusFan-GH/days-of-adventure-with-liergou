<template>
  <view class="container">
    <view class="u-page list-container">
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
      v-model="showFilter"
      mode="center"
      :mask-close-able="false"
      :safe-area-inset-bottom="true"
      z-index="997"
      width="90%"
      height="85%"
      border-radius="8"
      negative-top="100"
      :mask-custom-style="filterMaskStyle"
    >
      <view class="u-relative filter">
        <view class="u-flex main" :class="{ reverse: revertFilter }">
          <view class="u-flex-1 tabs">
            <!-- <scroll-view :scroll-y="true" style="height: 100%"> -->
            <view class="u-flex-col" style="height: 100%">
              <view
                v-for="(tab, index) in filterTabs"
                :key="index"
                class="u-flex-1 u-flex u-row-center u-padding-top-40 u-padding-bottom-40 tab"
                :class="{ selected: currentFiltertab === index }"
                @click="handleClickFilterTab(index)"
              >
                {{ tab.label }}
              </view>
            </view>
            <!-- </scroll-view> -->
          </view>
          <view class="u-flex-4 form">
            <scroll-view :scroll-y="true" style="height: 100%">
              <view class="tab-value"></view>
            </scroll-view>
          </view>
        </view>
        <view
          class="u-absolute u-flex u-row-around btn-container"
          :class="{ reverse: revertFilter }"
        >
          <u-button :ripple="true">重置</u-button>
          <u-icon name="fingerprint" size="32" @longtap="handleRevertFilter()"></u-icon>
          <u-button :ripple="true">确定</u-button>
        </view>
      </view>
    </u-popup>
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
  onShow() {
    this.showFilter = true;
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
      showFilter: true,
      revertFilter: false,
      filterTabs: [
        {
          label: '地址',
        },
        {
          label: '类型',
        },
        {
          label: '特色',
        },
        {
          label: '时间',
        },
        {
          label: '人数',
        },
        {
          label: '价格',
        },
        {
          label: '优先包场',
        },
      ],
      currentFiltertab: 0,
    };
  },
  mounted() {
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
    handleRevertFilter() {
      this.revertFilter = !this.revertFilter;
    },
    handleClickFilterTab(index) {
      this.currentFiltertab = index;
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
.filter {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding-bottom: 100rpx;
    .main {
        width: 100%;
        height: 100%;
        .tabs,
        .form {
            height: 100%;

            background-color: blue;
        }
        .tabs {
            border-right: 1px solid #999;
            .tab {
                &:not(:nth-last-child(1)) {
                    border-bottom: 1px solid #999;
                }
                &.selected {
                    color: red;
                }
            }
        }
        &.reverse {
            .tabs {
                border-right: 0;
                border-left: 1px solid #999;
            }
        }
    }
    .btn-container {
        bottom: 0;
        left: 0;

        width: 100%;
        height: 100rpx;

        border-top: 1px solid #999;
    }
    .reverse {
        flex-direction: row-reverse;
    }
}

</style>
