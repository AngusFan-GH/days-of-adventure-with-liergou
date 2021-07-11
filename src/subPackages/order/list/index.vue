<template>
  <view
    class="u-flex-col order-list safe-area-inset-bottom"
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
          <u-card
            v-for="(order, i) in item.orders"
            :key="i"
            :title="order.shopName"
            :sub-title="order.blockBooking === 1 ? '包场' : '拼场'"
            padding="18"
          >
            <view slot="body">
              <view class="u-body-item u-flex u-col-between u-p-t-0">
                <image :src="order.headPicUrl" mode="aspectFill"></image>
                <view>
                  <view class="u-line-1 u-margin-bottom-20">{{ order.productName }}</view>
                  <view class="u-line-1 u-margin-bottom-20 high-light">¥{{ order.price }}</view>
                  <view class="u-line-1">{{ order.time }}</view>
                </view>
              </view>
            </view>
            <view class="u-flex u-row-right" slot="foot">
              <u-button class="u-margin-right-10" size="mini" :ripple="true">删除</u-button>
              <u-button size="mini" :ripple="true" v-show="list[current].type === 1">评价</u-button>
              <u-button size="mini" :ripple="true" v-show="list[current].type === 2">退款</u-button>
            </view>
          </u-card>
          <u-loadmore
            v-if="item.orders.length"
            :status="status"
            @loadmore="loadmore"
            :loadText="loadText"
          />
          <view class="empty-display" v-if="!loading && !item.orders.length">
            <image src="/static/image/empty.png"></image>
            <text>暂无数据</text>
          </view>
          <loading class="loading" v-if="loading && !item.orders.length"></loading>
        </scroll-view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
import loading from '@/components/loading/loading.vue';
import style from '../../../common/style/variable.scss';
import { fileUrl } from '../../../common/js/config';
export default {
  components: {
    loading,
  },
  data() {
    return {
      list: [
        {
          name: '待消费',
          type: 0,
          orders: [],
        },
        {
          name: '已消费',
          type: 1,
          orders: [],
        },
        {
          name: '退款',
          type: 2,
          orders: [],
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

      backgroundImage: fileUrl + 'background_image.png',
    };
  },
  onShow() {
    this.getOrderList(true);
  },
  onPullDownRefresh() {
    this.getOrderList(true);
  },
  methods: {
    getOrderList(isRefrash = false) {
      uni.showNavigationBarLoading();
      this.loading = true;
      this.status = 'loading';
      if (isRefrash) {
        this.pageNum = 1;
        this.list[this.current].orders.length = 0;
        uni.pageScrollTo({
          duration: 0,
          scrollTop: 0,
        });
      }
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        type: this.list[this.current].type,
      };
      this.$u.api
        .getOrderList(params)
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
      this.list[this.current].orders.push(...records);
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
      this.getOrderList();
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
      this.list[this.current].orders.length = 0;
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
      this.getOrderList(true);
    },
    onreachBottom() {
      if (this.pageNum >= this.pages) return;
      this.loadmore();
    },
  },
};
</script>

<style lang="scss">
@import '../../../common/style/variable.scss';
.order-list {
    height: 100%;

    background: $background-color var(--background) no-repeat bottom / 100%;
    .u-card-wrap {
        background-color: $u-bg-color;
    }

    .u-body-item {
        font-size: 32rpx;

        color: #333;
    }

    .u-body-item image {
        flex: 0 0 145rpx;

        width: 145rpx;
        height: 211rpx;
        margin-right: 20rpx;

        border-radius: 8rpx;
    }
}
.empty-display {
    position: absolute;
    top: 375rpx;
    left: 50%;

    transform: translate(-50%, -50%);
    text-align: center;

    color: $black;
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