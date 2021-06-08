<template>
  <view class="container">
    <view class="info-tab-header u-flex">
      <view class="bar-image"
        :class="{
          left: mode === 0,
          right: mode === 1,
        }">
        <view class="mode-choose-btn left-btn"
          :class="{ selected: mode === 0 }"
          @click="changeMode(0)">
          <text class="btn-icon"></text>
          <text>拼场预订</text>
        </view>
        <view class="mode-choose-btn right-btn"
          :class="{ selected: mode === 1 }"
          @click="changeMode(1)">
          <text class="btn-icon"></text>
          <text>包场预订<text>({{ screening.advicePeopleMin }}人起)</text></text>
        </view>
      </view>
    </view>
    <view class="info-item">
      <view class="ping-tips-wrapper">
        <view class="tip-item">
          <view class="dot"></view>
          <view class="content">
            <text v-if="screening.restPeople > 0">1人起拼，还差{{ screening.restPeople }}人可开场，最多可订{{
                screening.morePeople
              }}人</text>
            <text v-else>该场次已拼成，还可加入{{ screening.morePeople }}人</text>
          </view>
        </view>
        <view class="tip-item">
          <view class="dot"></view>
          <view class="content">多人同行建议玩家统一下单，否则满{{
              screening.advicePeopleMin
            }}人开场后，其他玩家不可预订</view>
        </view>
        <view class="tip-item">
          <view class="dot"></view>
          <view class="content">
            该场次未拼成前,若其他玩家选择包场预订,则拼场未成功,系统将自动退款
          </view>
        </view>
      </view>
    </view>
    <view class="info-item">
      <view class="product-info-wrapper">
        <!-- <view class="shop-name u-line-1">空白·沉浸式剧情推理桌游馆(总店)</view> -->
        <view class="product-info u-flex u-row-between">
          <view class="product-name">{{ screening.productName }}</view>
          <view class="price-block">
            <text class="sign">￥</text><text class="price">{{ price }}</text>
          </view>
        </view>
        <view class="order-time">
          <text class="time-desc">{{ time }} | {{ screening.duration }}分钟</text>
        </view>
      </view>
    </view>
    <view class="info-item">
      <view class="pack-counter-wrapper">
        <view class="counter-wrapper u-flex">
          <view class="info-block u-flex-1">
            <view class="title u-line-1">拼场人数</view>
          </view>
          <u-number-box v-model="count"
            :min="1"
            :max="screening.morePeople"></u-number-box>
        </view>
        <view class="desc u-padding-right-20"
          v-show="count >= screening.restPeople">
          <text class="high-light"> 已达可开场人数， </text><text> 订单 </text><text class="high-light"> 不可退款， </text><text> 其他玩家不可加入。 </text>
        </view>
      </view>
    </view>
    <view class="general-gap"></view>
    <view class="info-item">
      <view class="common-usertable-wrapper">
        <view class="mobile-item u-flex u-padding-right-30">
          <view class="prefix">联系人</view>
          <u-input class="u-flex-1 u-margin-right-18"
            placeholder="请输入联系人姓名"
            v-model="name"
            type="text"
            input-align="right"
            maxlength="20"
            height="60" />
          <u-icon name="arrow-right"></u-icon>
        </view>
        <view class="mobile-item u-flex u-padding-right-30">
          <view class="prefix">手机号码</view>
          <u-input class="u-flex-1 u-margin-right-18"
            placeholder="请输入手机号"
            v-model="phone"
            type="tel"
            input-align="right"
            maxlength="11"
            height="60" />
          <u-icon name="arrow-right"></u-icon>
        </view>
        <view class="remark-info">
          <view class="label">备注</view>
          <u-input placeholder="可将您的其他要求告知商家"
            v-model="remark"
            type="text"
            maxlength="20"
            height="60" />
        </view>
      </view>
    </view>
    <view class="general-gap"></view>
    <view class="info-item">
      <view class="rule-bottom-wrapper u-padding-30">
        <view class="title">预订须知:</view>
        <view class="text-wraper u-margin-bottom-12">开场前凭手机号码入场</view>
        <view class="title refund-rule u-margin-top-32">退款规则:</view>
        <view class="text-wraper">
          <view class="tip-item u-flex">
            <view class="dot"></view>
            <view class="content">
              <text class="high-light"> 未达到开场要求前 </text>可随时退款，拼场成功后不可退款
            </view>
          </view>
          <view class="tip-item u-flex">
            <view class="dot"></view>
            <view class="content">周六(06.12) 09:00前未达开场要求，系统将自动退款</view>
          </view>
        </view>
      </view>
    </view>
    <view class="footer u-flex u-row-between">
      <view class="price">
        <text class="price-logo">¥</text><text class="price-num">{{ totalPrice }}</text>
      </view>
      <view>
        <u-button :custom-style="customStyle"
          @click="createPay"
          shape="circle">立即支付</u-button>
      </view>
    </view>
  </view>
</template>

<script>
import { timeRangeFmt } from '@/common/js/time-fmt';
export default {
  onLoad() {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('acceptDataFromOpenerPage', (data) => {
      this.price = data.price;
      this.screening = data;
    });
  },
  data() {
    return {
      mode: 0,
      phone: uni.getStorageSync('phone'),
      name:
        uni.getStorageSync('userInfo') &&
        uni.getStorageSync('userInfo').nickName,
      screening: {},
      price: 0,
      count: 1,
      remark: '',
      customStyle: {
        backgroundColor: '#f63',
        color: '#fff',
        height: '80rpx',
        lineHeight: '80rpx',
        fontSize: '32rpx',
        textAlign: 'center',
        fontWeight: '500',
        width: '240rpx',
        borderRadius: '100rpx',
      },
    };
  },
  computed: {
    totalPrice() {
      return this.price * this.count;
    },
    time() {
      return timeRangeFmt(
        this.screening.roomBeginTime,
        this.screening.roomEndTime,
        true
      );
    },
  },
  methods: {
    changeMode(mode) {
      this.mode = mode;
    },
    createPay() {
      if (!/\d{11}/.test(this.phone)) {
        uni.showToast({
          title:
            this.phone == null || this.phone === ''
              ? '请填写手机号'
              : '手机号输入有误',
          icon: 'none',
        });
        return;
      }
      this.$u.api
        .createPay({
          itemCount: this.count,
          payerName:
            this.name ||
            (uni.getStorageSync('userInfo') &&
              uni.getStorageSync('userInfo').nickName),
          payerPhone: this.phone,
          productItemId: this.screening.productItemId,
        })
        .then((res) => {
          console.log(res);
          const { orderInfo } = res;
          this.pay(orderInfo);
        })
        .catch((err) => console.error(err));
    },
    pay(orderInfo) {
      const [appId, timeStamp, nonceStr, prepayId, paySign] = orderInfo;
      console.log({
        appId,
        timeStamp,
        nonceStr,
        package: prepayId,
        signType: 'RSA',
        paySign,
      });
      uni.requestPayment({
        // appId,
        timeStamp,
        nonceStr,
        package: prepayId,
        signType: 'RSA',
        paySign,
        success: (e) => {
          if (e.errMsg === 'requestPayment:ok') {
            uni.showToast({
              title: '支付成功',
            });
          }
        },
        fail: (err) => {
          console.error(err);
          uni.showToast({
            title:
              err.errMsg === 'requestPayment:fail cancel'
                ? '取消支付'
                : '支付失败，请重试',
            icon: 'none',
          });
        },
      });
    },
  },
};
</script>

<style lang="scss">
@import '../../common/style/variable.scss';
.container {
    min-height: 100%;
    padding-bottom: 120rpx;

    background-color: $background-color;
}
.info-tab-header {
    .bar-image {
        display: flex;

        width: 100%;
        height: 84rpx;

        background-repeat: no-repeat;
        background-size: 100% 100%;

        align-items: center;
        &.left {
            background-image: url('data:image/png;base64,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');
        }
        &.right {
            background-image: url('data:image/png;base64,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');
        }
        .mode-choose-btn {
            font-size: 32rpx;

            position: relative;

            display: flex;

            width: 50%;
            height: 50%;

            color: #666;

            justify-content: center;
            align-items: center;
            &.selected {
                font-weight: 700;

                top: 0;

                color: #111;
                .btn-icon {
                    display: inline-block;
                }
            }
            .btn-icon {
                font-size: 32rpx;

                display: none;

                width: 46rpx;
                height: 46rpx;
                margin-right: 12rpx;

                background-image: url(data:image/png;base64,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);
                background-repeat: no-repeat;
                background-size: 100% 100%;
            }
        }
    }
}
.info-item {
    background-color: #fff;
    .ping-tips-wrapper,
    .product-info-wrapper,
    .pack-counter-wrapper,
    .common-usertable-wrapper {
        margin-left: 40rpx;
        padding: 24rpx 40rpx 24rpx 0;

        border-bottom: 1px solid $background-color;
    }
    .ping-tips-wrapper {
        .tip-item {
            display: flex;

            margin-bottom: 8rpx;
            .dot {
                position: relative;
                top: 12rpx;

                width: 6rpx;
                height: 6rpx;
                margin-right: 12rpx;

                border-radius: 50%;
                background-color: #111;

                flex-shrink: 0;
            }
            .content {
                font-size: 24rpx;

                color: #111;
            }
        }
    }
    .product-info-wrapper {
        .shop-name {
            font-size: 24rpx;
            line-height: 1;

            margin-bottom: 5px;

            color: #646464;
        }
        .product-info {
            font-size: 34rpx;
            font-weight: 700;
            line-height: 46rpx;

            margin-bottom: 10rpx;

            color: #111;
        }
        .order-time {
            font-size: 24rpx;
            line-height: 1;

            margin-top: 5px;

            color: #111;
        }
    }
    .pack-counter-wrapper {
        position: relative;

        overflow: hidden;
        .counter-wrapper {
            .title {
                font-size: 30rpx;

                color: #777;
            }
        }
        .desc {
            font-size: 24rpx;

            float: left;

            width: 70%;

            color: #777;
            color: rgb(17, 17, 17);
        }
    }
    .common-usertable-wrapper {
        .prefix {
            font-size: 30rpx;
            line-height: 40rpx;

            width: 160rpx;

            white-space: nowrap;

            color: #111;
            .mobile-item {
                border-bottom: 1px solid $background-color;
            }
        }
        .remark-info {
            min-height: 88rpx;
            padding: 30rpx 30rpx 30rpx 0;
            .label {
                font-size: 30rpx;
                line-height: 40rpx;

                width: 160rpx;

                color: #777;
            }
        }
    }
    .rule-bottom-wrapper {
        .title {
            font-size: 26rpx;

            margin-bottom: 20rpx;

            color: #111;
        }
        .dot {
            position: relative;

            width: 6rpx;
            height: 6rpx;
            margin-right: 12rpx;

            border-radius: 50%;
            background-color: #111;

            flex-shrink: 0;
        }
        .content {
            font-size: 22rpx;

            color: rgb(17, 17, 17);
        }
    }

    .high-light {
        color: rgb(255, 102, 51);
    }
}
.general-gap {
    width: 100%;
    height: 20rpx;

    opacity: 0;
}
.footer {
    position: fixed;
    bottom: 0;
    left: 0;

    width: 100%;
    height: 120rpx;
    padding: 30rpx;
    padding: 0 30rpx;

    border-top: #ccc;
    background-color: #fff;
    .price {
        font-size: 60rpx;
        font-weight: bolder;

        color: #f63;
        &-logo {
            font-size: 32rpx;

            margin-right: 4rpx;
        }
    }
}

</style>
