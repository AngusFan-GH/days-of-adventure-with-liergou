<template>
  <view class="wrapper safe-area-inset-bottom">
    <view class="main">
      <view class="u-flex u-row-around u-m-b-30 top">
        <view v-if="!isOverTime">
          <view class="title">待支付</view>
          <view class="u-m-t-20 tip">请在倒计时结束前完成支付</view>
        </view>
        <view v-else>
          <view class="title">已取消</view>
          <view class="u-m-t-20 tip">请返回订单页重新下单</view>
        </view>
        <view class="circle">
          <count-down-circle
            :orderUpdateTime="time"
            @onOverTimeHander="handleOverTime"
          ></count-down-circle>
        </view>
      </view>
      <view class="product-info-wrapper" :style="{ '--product-info-bg-image': productIndoBgImage }">
        <view class="u-flex product-info">
          <image class="u-margin-right-22 pic" :src="screening.headPic" mode="aspectFill"></image>
          <view class="main-info">
            <view class="u-margin-bottom-18 u-line-1 shop-name">{{ screening.shopName }}</view>
            <view class="u-margin-bottom-20 u-line-1 product-name">
              {{ screening.productName }}
            </view>
            <view class="u-margin-bottom-20 order-time">
              {{ screening.count }}人 | {{ screening.duration }}分钟
            </view>
            <view class="u-margin-bottom-20 order-time">
              {{ screeningTime }}
            </view>
          </view>
        </view>
      </view>
      <view class="price-info">
        <view class="u-flex u-row-between price-info-item">
          <view class="u-m-r-10 label">总价</view>
          <view class="u-flex-1 u-line-1 value">¥{{ screening.totalPrice }}</view>
        </view>
        <view class="u-flex u-row-between price-info-item">
          <view class="u-m-r-10 label">优惠</view>
          <view class="u-flex-1 u-line-1 value">¥-{{ screening.discountAmount }}</view>
        </view>
        <view class="u-flex u-row-between price-info-item sum">
          <view class="u-m-r-10 label">合计</view>
          <view class="u-flex-1 u-line-1 value">
            ¥
            <text class="high-light">{{ screening.price }}</text>
          </view>
        </view>
      </view>
      <view class="u-flex footer">
        <template v-if="!isOverTime">
          <view class="u-p-l-30 u-p-r-30 u-m-r-10" @click="cancel">取消订单</view>
          <u-button class="u-flex-1" type="error" @click="pay">立即支付</u-button>
        </template>
        <u-button class="u-flex-1" type="primary" v-else @click="goback">返回</u-button>
      </view>
    </view>
  </view>
</template>

<script>
import { timeRangeFmt } from '@/common/js/utils/time-fmt';
import { fileUrl } from '@/common/js/config';
import { mapState, mapMutations } from 'vuex';
import { countDownCircle } from '@/components/count-down-circle/count-down-circle.vue';
import $wechatPay from '@/common/js/utils/wechat-pay';
const $moment = require('moment');
export default {
  components: {
    countDownCircle,
  },
  onLoad() {
    const { time, orderId, orderInfo, screening } = this.unpaidOrder || {};
    console.log(this.unpaidOrder);
    this.time = $moment(time).format('YYYY/MM/DD HH:mm:ss');
    this.orderId = orderId;
    this.orderInfo = orderInfo;
    this.screening = screening;
    this.isOverTime = false;
  },
  data() {
    return {
      time: null,
      orderId: null,
      orderInfo: null,
      screening: null,
      isOverTime: false,
      productIndoBgImage: `url(${fileUrl}pay_product_info_bg_image.png!d1)`,
    };
  },
  computed: {
    ...mapState('pay', ['unpaidOrder']),
    screeningTime() {
      return (
        this.screening &&
        timeRangeFmt(this.screening.roomBeginTime, this.screening.roomEndTime, true)
      );
    },
  },
  methods: {
    ...mapMutations('pay', { clearUnpaidOrder: 'clearUnpaidOrder' }),
    async pay() {
      if (!this.orderInfo) {
        try {
          const { orderInfo } = await this.$u.api.continuePay(this.orderId);
          this.orderInfo = orderInfo;
        } catch (error) {
          console.error(error);
        }
      }
      $wechatPay(this.orderInfo).then(() => {
        uni.showToast({
          title: '支付成功',
        });
        this.clearUnpaidOrder();
        // 跳转支付成功结果页面
        return this.goToResultPage();
      });
    },
    cancel() {
      this.$u.api
        .cancelOrder({
          orderId: this.orderId,
          operate: 'cancel',
        })
        .then(() => {
          this.clearUnpaidOrder();
          uni.navigateBack({
            delta: 1,
          });
        });
    },
    handleOverTime() {
      this.isOverTime = true;
    },
    goToResultPage() {
      uni.redirectTo({
        url: `/subPackages/detail/index?productId=${this.screening.productId}&uniqueId=${this.screening.uniqueId}&baseOutTradeNo=${this.orderId}&from=pay`,
      });
    },
    goback() {
      uni.navigateBack({
        delta: 1,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../common/style/variable.scss';
.wrapper {
    box-sizing: border-box;
    height: 100%;
}
.main {
    position: relative;

    min-height: 100%;
    padding: 30rpx 22rpx 80rpx;
    .top {
        border-bottom: 2px solid #ccc;

        .title {
            font-size: 50rpx;
        }
        .tip {
            color: #59503f;
        }
        .circle {
            display: block;

            width: 220rpx;
            height: 220rpx;
        }
    }
    .product-info-wrapper {
        position: relative;

        margin-bottom: 16rpx;
        .product-info {
            .main-info {
                overflow: hidden;
            }
            .pic {
                width: 185rpx;
                height: 208rpx;

                border-radius: 21rpx;
                background-color: $tag-background-color;

                flex-shrink: 0;
            }
            .shop-name {
                font-size: 24rpx;

                color: #999;
            }
            .product-name {
                font-size: 34rpx;
                font-weight: 500;

                color: #333;
            }
            .order-time {
                font-size: 20rpx;
                font-weight: 400;

                color: #999;
            }
        }
    }
    .price-info {
        &-item {
            padding: 20rpx 0;
        }
        .label {
            font-size: 32rpx;

            margin-right: 20rpx;
        }
        .value {
            text-align: right;
        }
        .sum {
            .label {
                font-size: 40rpx;
                font-weight: 600;
            }
            .value {
                font-size: 40rpx;

                color: $theme-color;
                .high-light {
                    font-size: 50rpx;
                }
            }
        }
    }
    .footer {
        position: absolute;
        bottom: 0;
        left: 0;

        width: 100%;
        padding: 0 20rpx;
    }
}

</style>