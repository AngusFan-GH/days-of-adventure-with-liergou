<template>
  <view
    class="u-flex-col coupon-list safe-area-inset-bottom"
    :style="{ '--background': 'url(' + backgroundImage + ')' }"
  >
    <view class="u-padding-left-20 u-padding-right-20">
      <u-tabs-swiper
        ref="uTabs"
        :list="list"
        :current="current"
        @change="tabsChange"
        :active-color="tabActiveColor"
        :bg-color="styleVariable.backgroundColor"
        :inactive-color="styleVariable.textCommonColor"
      ></u-tabs-swiper>
    </view>
    <swiper
      class="u-flex-1 content"
      :current="swiperCurrent"
      @transition="transition"
      @animationfinish="animationfinish"
    >
      <swiper-item class="swiper-item" v-for="(item, index) in list" :key="index">
        <scroll-view scroll-y style="height: 100%; width: 100%" @scrolltolower="onreachBottom">
          <coupon-card v-for="(coupon, i) in item.coupons" :key="i" :coupon="coupon"></coupon-card>
          <u-loadmore
            v-if="item.coupons.length"
            :status="status"
            @loadmore="loadmore"
            :loadText="loadText"
          />
          <view class="empty-display" v-if="!loading && !item.coupons.length">
            <image src="/static/image/empty.png"></image>
            <text>暂无数据</text>
          </view>
          <loading class="loading" v-if="loading && !item.coupons.length"></loading>
        </scroll-view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
import loading from '@/components/loading/loading.vue';
import style from '@/common/style/variable.scss';
import { fileUrl } from '@/common/js/config';
import couponCard from './components/coupon-card.vue';
export default {
  components: {
    loading,
    couponCard,
  },
  data() {
    return {
      list: [
        {
          name: '全部',
          status: '',
          coupons: [],
        },
        {
          name: '待使用',
          status: '1',
          coupons: [],
        },
        {
          name: '已使用',
          status: '2',
          coupons: [],
        },
        {
          name: '已过期',
          status: '3',
          coupons: [],
        },
      ],
      pageNum: 1,
      pageSize: 10,
      pages: 1,
      current: 0,
      swiperCurrent: 0,
      tabActiveColor: style.themeColor,
      loading: true,
      status: 'loadmore',
      loadText: {
        loadmore: '轻轻上拉',
        loading: '努力加载中',
        nomore: '暂时没有了',
      },
      styleVariable: style,

      backgroundImage: fileUrl + 'background_image.png!d1',
    };
  },
  mounted() {
    this.getCouponList(true);
  },
  onPullDownRefresh() {
    this.getCouponList(true);
  },
  methods: {
    getCouponList(isRefrash = false) {
      uni.showNavigationBarLoading();
      this.loading = true;
      this.status = 'loading';
      if (isRefrash) {
        this.pageNum = 1;
        this.list[this.current].coupons.length = 0;
        uni.pageScrollTo({
          duration: 0,
          scrollTop: 0,
        });
      }
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        status: this.list[this.current].status,
      };
      this.$u.api
        .getCouponList(params)
        .then(res => {
          if (isRefrash) {
            uni.stopPullDownRefresh();
          }
          this.handleResult(res);
        })
        .catch(err => this.handleErr(err));
    },
    handleResult(res) {
      const { records, pages } = res;
      this.pages = pages;
      this.list[this.current].coupons.push(...records);
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
    loadmore() {
      this.pageNum++;
      this.getCouponList();
    },
    handleReadBottomStatus() {
      if (this.pageNum >= this.pages) {
        this.status = 'nomore';
      } else {
        this.status = 'loadmore';
      }
    },
    tabsChange(index) {
      this.swiperCurrent = index;
      this.loading = true;
      this.list[this.current].coupons.length = 0;
    },
    transition(e) {
      let dx = e.detail.dx;
      this.$refs.uTabs.setDx(dx);
    },
    animationfinish(e) {
      let current = e.detail.current;
      this.$refs.uTabs.setFinishCurrent(current);
      this.swiperCurrent = current;
      this.current = current;
      this.getCouponList(true);
    },
    onreachBottom() {
      if (this.pageNum >= this.pages) return;
      this.loadmore();
    },
  },
};
</script>

<style lang="scss">
@import '../../common/style/variable.scss';
.coupon-list {
    height: 100%;

    background: $background-color var(--background) no-repeat bottom / 100%;
}
.empty-display {
    position: absolute;
    top: 375rpx;
    left: 50%;

    transform: translate(-50%, -50%);
    text-align: center;

    color: $white;
}
.loading {
    position: fixed;
    top: 40%;
    left: 50%;

    transform: translate(-50%,-50%);
}
.high-light {
    color: $theme-color;
}


</style>