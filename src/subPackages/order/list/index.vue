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
          <template v-for="(order, i) in item.orders">
            <order-theme v-if="order.orderType === '1'" :order="order" :key="i">
              <view class="btn-container" slot="btn-container" slot-scope="{ status, orderId }">
                <u-button
                  size="mini"
                  :ripple="true"
                  v-show="status == '1'"
                  @click="continuePay(orderId)"
                >
                  立即付款
                </u-button>
                <u-button
                  size="mini"
                  :ripple="true"
                  v-show="status == '2'"
                  @click="refundOrderRefund(orderId)"
                >
                  退款
                </u-button>
                <u-button
                  size="mini"
                  :ripple="true"
                  v-show="status == '1'"
                  @click="cancelOrder(orderId)"
                >
                  取消
                </u-button>
                <u-button
                  class="u-margin-right-10"
                  size="mini"
                  :ripple="true"
                  @click="deleteOrder(orderId)"
                >
                  删除
                </u-button>
              </view>
            </order-theme>
            <order-activity v-if="order.orderType === '2'" :order="order" :key="i">
              <view class="btn-container" slot="btn-container" slot-scope="{ status, orderId }">
                <u-button
                  size="mini"
                  :ripple="true"
                  v-show="status == '1'"
                  @click="continuePay(orderId)"
                >
                  立即付款
                </u-button>
                <u-button
                  size="mini"
                  :ripple="true"
                  v-show="status == '2'"
                  @click="refundOrderRefund(orderId)"
                >
                  退款
                </u-button>
                <u-button
                  size="mini"
                  :ripple="true"
                  v-show="status == '1'"
                  @click="cancelOrder(orderId)"
                >
                  取消
                </u-button>
                <u-button
                  class="u-margin-right-10"
                  size="mini"
                  :ripple="true"
                  @click="deleteOrder(orderId)"
                >
                  删除
                </u-button>
              </view>
            </order-activity>
          </template>
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
import { orderTheme } from './components/theme.vue';
import { orderActivity } from './components/activity.vue';
export default {
  components: {
    loading,
    orderTheme,
    orderActivity,
  },
  data() {
    return {
      list: [
        {
          name: '全部',
          payStatus: '',
          orders: [],
        },
        {
          name: '未支付',
          payStatus: '1',
          orders: [],
        },
        {
          name: '已支付',
          payStatus: '2',
          orders: [],
        },
        {
          name: '已取消',
          payStatus: '3',
          orders: [],
        },
        {
          name: '退款',
          payStatus: '4',
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

      backgroundImage: fileUrl + 'background_image.png!d1',
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
        payStatus: this.list[this.current].payStatus,
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
      const { orders, pages } = res;
      this.pages = pages;
      this.list[this.current].orders.push(...orders);
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
    cancelOrder(id) {
      this.$u.api
        .cancelOrder({
          orderId: id,
          operate: 'cancel',
        })
        .then(e => {
          console.log(e);
        });
    },
    deleteOrder(id) {
      this.$u.api
        .cancelOrder({
          orderId: id,
          operate: 'delete',
        })
        .then(e => {
          console.log(e);
        });
    },
    continuePay(id) {
      this.$u.api.continuePay(id).then(e => {
        console.log(e);
      });
    },
    refundOrderRefund(id) {
      this.$u.api.refundOrderRefund(id).then(e => {
        console.log(e);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../../common/style/variable.scss';
.order-list {
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
.btn-container {
    /deep/ u-button {
        margin-left: 20rpx;
    }
}

</style>