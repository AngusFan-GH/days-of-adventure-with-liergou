<template>
  <view class="pay-container">
    <view
      class="header"
      :class="{
        center: !blockBooking,
        left: mode === 0 && blockBooking,
        right: mode === 1 && blockBooking,
      }"
      :style="{
        '--left-background': leftBackground,
        '--right-background': rightBackground,
        '--center-background': centerBackground,
      }"
    >
      <view class="bar-image">
        <view
          v-if="!blockBooking"
          class="mode-single-btn u-flex u-row-center"
          :class="{ selected: mode === 0 }"
        >
          <text class="btn-icon"></text>
          <text>拼场预订</text>
        </view>
        <view
          v-if="blockBooking"
          class="mode-choose-btn left-btn"
          :class="{ selected: mode === 0 }"
          @click="changeMode(0)"
        >
          <text class="btn-icon"></text>
          <text>拼场预订</text>
        </view>
        <view
          v-if="blockBooking"
          class="mode-choose-btn right-btn"
          :class="{ selected: mode === 1 }"
          @click="changeMode(1)"
        >
          <text class="btn-icon"></text>
          <text>
            包场预订
            <text>({{ screening.advicePeopleMin }}人起)</text>
          </text>
        </view>
      </view>
      <view class="info-item" v-show="mode === 0">
        <view class="ping-tips-wrapper">
          <view class="tip-item">
            <view class="dot"></view>
            <view class="content">
              <text v-if="screening.restPeople > 0">
                1人起拼，还差{{ screening.restPeople }}人可开场，最多可订{{
                  screening.morePeople
                }}人
              </text>
              <text v-else>该场次已拼成，还可加入{{ screening.morePeople }}人</text>
            </view>
          </view>
          <view class="tip-item">
            <view class="dot"></view>
            <view class="content">
              多人同行建议玩家统一下单，否则满{{
                screening.advicePeopleMin
              }}人开场后，其他玩家不可预订
            </view>
          </view>
          <view class="tip-item">
            <view class="dot"></view>
            <view class="content">
              该场次未拼成前,若其他玩家选择包场预订,则拼场未成功,系统将自动退款
            </view>
          </view>
        </view>
      </view>
      <view class="info-item" v-show="mode === 1">
        <view class="ping-tips-wrapper">
          <view class="tip-item">
            <view class="dot"></view>
            <view class="content">
              <text>{{ screening.advicePeopleMin }}人起订，</text>
              <text v-show="screening.advicePeopleMax > screening.advicePeopleMin">
                最多可订{{ screening.advicePeopleMax }}人
              </text>
            </view>
          </view>
          <view class="tip-item">
            <view class="dot"></view>
            <view class="content">
              <text>包场成功后，其他拼场玩家不可预定，</text>
              <text>订单</text>
              <text class="high-light">不可退款</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="product-info-wrapper" :style="{ '--product-info-bg-image': productIndoBgImage }">
      <view class="u-flex product-info">
        <image class="u-margin-right-22 pic" :src="screening.headPic" mode="aspectFill"></image>
        <view class="main-info">
          <view class="u-margin-bottom-18 u-line-1 shop-name">{{ screening.shopName }}</view>
          <view class="u-margin-bottom-20 u-line-1 product-name">{{ screening.productName }}</view>
          <view class="u-margin-bottom-20 order-time">
            {{ time }} | {{ screening.duration }}分钟
          </view>
          <view class="price-block">
            <view class="price">￥{{ price }}</view>
          </view>
        </view>
      </view>
      <view class="pack-counter-wrapper">
        <view class="counter-wrapper u-flex" v-if="mode === 1">
          <view class="info-block u-flex-1">
            <view class="title u-line-1">到店人数</view>
          </view>
          <u-number-box
            v-model="count"
            :min="screening.advicePeopleMin"
            :max="screening.advicePeopleMax"
          ></u-number-box>
        </view>
        <view class="counter-wrapper u-flex" v-if="mode === 0">
          <view class="info-block u-flex-1">
            <view class="title u-line-1">拼场人数</view>
          </view>
          <u-number-box v-model="count" :min="1" :max="screening.morePeople"></u-number-box>
        </view>
        <view class="desc u-padding-right-20" v-show="mode === 0 && count >= screening.restPeople">
          <text class="high-light">已达可开场人数，</text>
          <text>订单</text>
          <text class="high-light">不可退款，</text>
          <text>其他玩家不可加入。</text>
        </view>
        <view class="desc u-padding-right-20" v-show="mode === 1">
          <text>{{ screening.advicePeopleMin }}人起订，</text>
          <text v-show="screening.advicePeopleMax > screening.advicePeopleMin">
            最多可订{{ screening.advicePeopleMax }}人，
          </text>
          <text>订单</text>
          <text class="high-light">不可退款，</text>
          <text>其他玩家不可加入。</text>
        </view>
      </view>
      <view class="common-usertable-wrapper">
        <view class="mobile-item u-flex">
          <view class="u-padding-top-26 u-padding-bottom-30 prefix">联系人</view>
          <u-input
            class="u-flex-1 u-margin-right-18"
            placeholder="请输入联系人姓名"
            v-model="name"
            type="text"
            input-align="right"
            maxlength="20"
            height="60"
          />
          <u-icon name="arrow-right" class="arrow-right"></u-icon>
        </view>
        <view class="mobile-item u-flex">
          <view class="u-padding-top-34 u-padding-bottom-34 prefix">手机号码</view>
          <u-input
            class="u-flex-1 u-margin-right-18"
            placeholder="请输入手机号"
            v-model="phone"
            type="tel"
            input-align="right"
            maxlength="11"
            height="60"
          />
          <u-icon name="arrow-right" class="arrow-right"></u-icon>
        </view>
        <view class="u-flex u-padding-top-28 remark-info">
          <view class="u-margin-right-14 prefix">备注:</view>
          <u-input
            class="u-flex-1"
            placeholder="可将您的其他要求告知商家"
            v-model="remark"
            type="text"
            maxlength="20"
            height="60"
          />
        </view>
      </view>
    </view>
    <view class="rule-bottom-wrapper u-padding-30" :style="{ '--notice-bg-image': noticeBgImage }">
      <view class="title">预订须知:</view>
      <view class="text-wraper u-margin-bottom-12">开场前凭手机号码入场</view>
      <view class="title refund-rule u-margin-top-32">退款规则:</view>
      <view class="text-wraper" v-show="mode === 1">
        <view class="tip-item u-flex">
          <view class="dot"></view>
          <view class="content">
            预订成功后
            <text class="high-light">不可退款</text>
          </view>
        </view>
      </view>
      <view class="text-wraper" v-show="mode === 0">
        <view class="tip-item u-flex">
          <view class="dot"></view>
          <view class="content">
            <text class="high-light">未达到开场要求前</text>
            可随时退款，拼场成功后不可退款
          </view>
        </view>
        <view class="tip-item u-flex" v-show="startTime">
          <view class="dot"></view>
          <view class="content">{{ startTime }} 前未达开场要求，系统将自动退款</view>
        </view>
      </view>
    </view>
    <view class="footer">
      <view class="u-flex u-row-between footer-main">
        <view class="price">
          <text class="price-label">合计：</text>
          <text class="price-logo">¥</text>
          <text class="price-num">{{ totalPrice }}</text>
        </view>
        <view>
          <u-button
            :custom-style="customStyle"
            hover-class="none"
            :ripple="true"
            :hair-line="false"
            @click="createPay"
          >
            立即支付
          </u-button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { timeRangeFmt } from '@/common/js/time-fmt';
import style from '../../../common/style/variable.scss';
import BigNumber from 'bignumber.js';
import { fileUrl } from '../../../common/js/config';
export default {
  onShow() {
    this.init();
  },
  onLoad() {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('submitOrder', data => {
      console.log('data from submitOrder', data);
      this.price = data.price;
      this.screening = {
        morePeople: data.advicePeopleMax - data.currentPeople,
        restPeople: data.advicePeopleMin - data.currentPeople,
        ...data,
      };
      this.blockBooking = data.blockBooking === 1;
      const currentTabPage = uni.getStorageSync('current_tab_page') || 'play';
      const filterData = uni.getStorageSync(currentTabPage + '_filter_data');
      this.filterData = filterData;
      console.log('filterData', this.filterData);
      // 不可以包场，只能拼场
      if (!this.blockBooking) {
        return this.changeMode(0);
      }
      const { blockBooking, peopleFrom } = this.filterData || {};
      // 选择了优先包场或拼场
      if (blockBooking != null) {
        return this.changeMode(blockBooking);
      }
      // 根据人数是否达到包场最小人数
      if ((peopleFrom || 1) >= data.advicePeopleMin) {
        return this.changeMode(1);
      }
      // 拼场
      this.changeMode(0);
    });
  },
  data() {
    return {
      mode: null, // 1包场，0拼场
      blockBooking: false,
      phone: null,
      name: null,
      screening: {},
      price: 0,
      count: 1,
      remark: '',
      customStyle: {
        backgroundColor: style.paySubmitBtnBgColor,
        color: style.textCommonColor,
        borderRadius: '0rpx',
        height: '109rpx',
        lineHeight: '33rpx',
        fontSize: '33rpx',
        textAlign: 'center',
        fontWeight: 'bold',
        width: '243rpx',
      },
      filterData: null,
      leftBackground: `url(${fileUrl}pay_pinchange_image.png!d1)`,
      rightBackground: `url(${fileUrl}pay_baochang_image.png!d1)`,
      centerBackground: `url(${fileUrl}pay_pinchang_single_image.png!d1)`,
      productIndoBgImage: `url(${fileUrl}pay_product_info_bg_image.png!d1)`,
      noticeBgImage: `url(${fileUrl}pay_notice_bg_image.png!d1)`,
    };
  },
  watch: {
    mode(val) {
      const { peopleFrom } = this.filterData || {};
      if (peopleFrom != null) {
        this.count = peopleFrom;
        return;
      }
      switch (val) {
        case 1:
          this.count = this.screening.advicePeopleMin;
          break;
        case 0:
          this.count = 1;
          break;
      }
    },
  },
  computed: {
    totalPrice() {
      return BigNumber(this.price).multipliedBy(this.count);
    },
    time() {
      return timeRangeFmt(this.screening.roomBeginTime, this.screening.roomEndTime, true);
    },
    startTime() {
      return this.time && this.time.split('~')[0];
    },
  },
  methods: {
    init() {
      const token = uni.getStorageSync('token');
      const userInfo = uni.getStorageSync('userInfo');
      const phone = uni.getStorageSync('phone');
      if (!token || !userInfo || !phone) {
        return this.goToLogin();
      }
      this.name = userInfo.nickName;
      this.phone = phone;
    },
    changeMode(mode) {
      this.mode = mode;
    },
    createPay() {
      if (!/\d{11}/.test(this.phone)) {
        uni.showToast({
          title: this.phone == null || this.phone === '' ? '请填写手机号' : '手机号输入有误',
          icon: 'none',
        });
        return;
      }
      this.$u.api
        .createPay({
          itemCount: this.count,
          payerName:
            this.name ||
            (uni.getStorageSync('userInfo') && uni.getStorageSync('userInfo').nickName),
          payerPhone: this.phone,
          productItemUniqueId: this.screening.uniqueId,
          userNote: this.remark,
        })
        .then(res => {
          const { orderInfo } = res;
          this.pay(orderInfo);
        })
        .catch(err => console.error(err));
    },
    pay(orderInfo) {
      const [appId, timeStamp, nonceStr, prepayId, paySign] = orderInfo;
      console.log('requestPayment', {
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
        success: e => {
          if (e.errMsg === 'requestPayment:ok') {
            uni.showToast({
              title: '支付成功',
            });
            // 跳转支付成功结果页面
            return this.goToResultPage();
          }
        },
        fail: err => {
          console.error(err);
          uni.showToast({
            title: err.errMsg === 'requestPayment:fail cancel' ? '取消支付' : '支付失败，请重试',
            icon: 'none',
          });
        },
      });
    },
    goToLogin() {
      uni.navigateTo({
        url: '/pages/login/index',
      });
    },
    goToResultPage() {
      uni.navigateTo({
        url: '/subPackages/order/pay/result',
      });
    },
  },
};
</script>

<style lang="scss">
@import '../../../common/style/variable.scss';
.pay-container {
    min-height: 100%;
    padding: 0 22rpx 120rpx;

    background-color: $background-color;
    .header {
        position: relative;

        margin-bottom: 16rpx;

        border-radius: 0 0 20rpx 20rpx;
        background-repeat: no-repeat;
        background-size: 100%;
        &.left {
            background-image: var(--left-background);
        }
        &.right {
            background-image: var(--right-background);
        }
        &.center {
            background-image: var(--center-background);
            background-size: 100% 100%;
            .bar-image {
                height: auto;
                padding-top: 34rpx;
            }
        }
        .bar-image {
            display: flex;

            width: 100%;
            height: 84rpx;

            align-items: center;
            .mode-single-btn {
                font-size: 34rpx;
                font-weight: bold;

                width: 100%;

                color: #fff;
            }
            .mode-choose-btn {
                font-size: 26rpx;
                font-weight: bold;

                position: relative;

                display: flex;

                width: 50%;
                height: 50%;

                color: #6f6f6f;

                justify-content: center;
                align-items: center;
            }
            .btn-icon {
                display: none;

                width: 43rpx;
                height: 43rpx;
                margin-right: 12rpx;

                background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAArCAMAAADWg4HyAAABxVBMVEUAAAD//wD/zAD/tgD/nwD/vwD/swD/uQD/vwD/sQD/tgD/qgD/rwD/vwD/tAD/wwD/rgD/swD/tgD/rgD/uQD/sQD/vAD/tQD/vwD/uAD/tgD/twD/tAD/tgD/sQD/rgD/swD/tgD/tgD/sQD/swD/swD/sAD/tAD/sQD/tQD/swD/swD/tgD/tAD/tQD/swD/sQD/swD/tQD/swD/sgD/tQD/swD/tAD/swD/tAD/swD/tQD/tAD/swD/sQD/tAD/swD/sgD/tQD/swD/tAD/tAD/sgD/swD/swD/sgD/swD/tQD/swD/sgD/tAD/swD/swD/sgD/swD/swD/tAD/swD/tAD/swD/tAD/swD/tAD/tAD/swD/tAD/sgD/swD/swD/swD/tAD/tAD/tQD/sgD/tAD/swD/tQD/tAD/sgD/tAD/swD/tAD/tAD/sgD/swD/tAD/tAD/tAD/swD/tQD/tAD/tAD/tAD/swD/tAD/tAD/swD/swD/tAD/tAD/tAD/tAD/swD/tAD/tAD/tAD/swD/swD/tAD/tAD/swD/tAD/tAD/tAD/swD/tAD/tAH/swH/tAH/swD/swH/tAD/tAHvKiiyAAAAk3RSTlMAAQUHCAgKCwwNDg8QEBERExQVFhYXFxgYGRwgIiMkJigqMT5AQ0RERUVGTVBSU1RYWlpbXV1eYmVmaGhqbHN0dXh4eXp9foCDhYaGh4iIjI2PkZOam5yen6Kmp6urvb2/wMPFx8jIysrMzc/R0tPU1NTV1tfY2d3g4uPk5ejo6uvt7+/w8fLz9PX29vf4+fr7/f6EgQnnAAAB2UlEQVQYGY3BCUPSYAAG4DctyzIiiMii+1C677TL7gOxQ4votLKiY1GhWZJlByVbZUHj/b3tg21scxs8DxzW9KZG8oWZQn4k1RODj8iZN2XWlbInQ3DXcUWmU/HSQrjY+4luJnfBqe0WPajpVtiEM/T2YAkswjn6eR6AaV6G/u61wHCTjQxCd1BlI+VtqAp+ZmPv50MYZDPOQROR2YwvCwCcp7efh2M9MmuOAXPe0ZOyFcAp1mSADSq9KHFodrKmtBIn6EWJQ7hL3QHcoWE6+4sWShxCgoYh5KiTooi9pUnphpCgaRjfqdsNoHOMOqULQn+FpnH8pW4fNJ2jrFK6ISRoMYU/1I0vgyY6Ro3cBSFBq98o0pCNQBN5TcqbISQrtCpikqaXYWhWvJK3QEjQLo+nrMuGoFm+EUI/HZ4gTQspDEOyQocUjtJKCqEmqdKpF+vKtJKWQhhQ6VRaDYzS5kUIwMA/ziIBOE277Kb111XOdhxAcJrN+LYImstsxgUIiz+ysYl2VO1R2Uh5O3RpNjIEw9zH9DfcAlMoRz/PArAIZ+jtfgds2m7Tg5pqhdP+KbrJ74CLwFWFTj8utsNd9OxomXUlqS8IH2uP3Hj0oTDzdeLhtUOrYPcfQRT9MRQ3Wk4AAAAASUVORK5CYII=);
                background-repeat: no-repeat;
                background-size: 100% 100%;
            }
            .selected {
                font-size: 30rpx;
                font-weight: bold;

                color: #fff;
                .btn-icon {
                    display: inline-block;
                }
            }
        }
        .ping-tips-wrapper {
            margin-left: 36rpx;
            padding: 26rpx 19rpx 47rpx 0;
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
                    background-color: #fff;

                    flex-shrink: 0;
                }
                .content {
                    font-size: 22rpx;

                    color: #fff;
                }
            }
        }
        &:before,
        &:after {
            position: absolute;
            z-index: 9;
            bottom: -42rpx;

            display: block;

            width: 14rpx;
            height: 60rpx;

            content: '';

            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAA8CAYAAABW+ot3AAACbElEQVRIid2XP2gVQRDGf3cvxn+NJpWoKKKFnU9Qg4VoVARLwcruLfZaiq3a2tltLRZavC42SSMqwiNFCNgogqCVJujT/JGczGMGlvNu3+0JFg4c7O3Nt/PtzOzyXdbr9QgsAyaB3cB2YBMYAmtAETpOBONtwBHgEnAO2AesAq+AOWAZ+FEGCug0cBc4D+wIFrwKXAMeAM+BbzKZFUWBc+4Y8BC4qBSFcmhCcxG4Dbz03m/kzjlxnAVmakDo3AngCrBHJnJgF3BG6VWBQvApYK9zLst1f1NAJwIym7IAAvwFfAW2GgDFb92oSopfa63G2RvgiyQr1xXmtV7rEeCi1nPVe190BoMB/X5favMOOAQcLDWGge4BL7z3oyYY1VHMOTepnSMplz48DnwCngBPgSXv/dBWym0gRQXeyhB4BqwAC8Aj3dswpJCHL8Id+KlOW5q4taqM5+WJpt/rPsQ6KAoUapk2d1HlUAcUZ9tXZfQY1TyImgQs2lI1iklUDVxrMWC0JHXAcD6JqpTC9ll5wGNZtcxW+oxLTnIdoxkdF5FSPRsBW5+OEJiUVTtWWWpWLWJyk9eWIYVqclZbn46oNWmApIhh7ZKz2opqeN8k3zmtIv41sNW9SixJTW65JAerY20DTDjnwvdMZZnITll0pz6j3g19O91u18aisI4C14EbwAFgWhda0WezDDTZeR+4CexXySKC76xquM/AR2Aj3ONh4A5woUIMik9XtexJVdCjyX8nO009/s+y04DSVu/190BEXxXYZOfAvpsulaIKjVvA5dIPi2xDIi2FCjIUtCY7PwCPg1+k738oSOA3mCSyMcoPTx8AAAAASUVORK5CYII=);
            background-repeat: no-repeat;
            background-size: 100% 100%;
        }
        &:before {
            left: 92rpx;
        }
        &:after {
            right: 92rpx;
        }
    }
    .product-info-wrapper {
        position: relative;

        margin-bottom: 16rpx;
        padding: 33rpx 26rpx 41rpx 23rpx;

        border-radius: 44rpx;
        background: #fff var(--product-info-bg-image) no-repeat center / 100% 100%;
        box-shadow: 0 0 24px 0 rgba(0, 0, 0, .88);
        .product-info {
            .main-info {
                overflow: hidden;
            }
            .pic {
                width: 158rpx;
                height: 177rpx;

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
            .price {
                font-size: 34rpx;
                font-weight: bold;

                color: #f0ba43;
            }
        }
    }
    .pack-counter-wrapper {
        position: relative;

        overflow: hidden;

        padding-bottom: 20rpx;

        border-bottom: 2rpx dashed #cacaca;
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
        .mobile-item {
            border-bottom: 1rpx solid #cacaca;
        }
        .prefix {
            font-size: 30rpx;
            font-weight: 500;
            line-height: 30rpx;

            color: #333;
        }
    }
    .rule-bottom-wrapper {
        padding: 33rpx 26rpx 41rpx 23rpx;

        border-radius: 44rpx;
        background: #fff var(--notice-bg-image) no-repeat center / 102% 105%;
        box-shadow: 0 0 24px 0 rgba(0, 0, 0, .88);
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
        color: #f0ba43;
    }
    .gap-line {
        height: 1rpx;
        margin: 20rpx 0 10rpx;

        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAr8AAAABAQMAAADtiFSBAAAAA1BMVEXKyspx5jomAAAAC0lEQVQIHWOgFQAAAFkAAeqVGXIAAAAASUVORK5CYII=);
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }
    .footer {
        position: fixed;
        bottom: 0;
        left: 0;

        width: 100%;

        border-top: #ccc;
        background-color: #fff;
        &-main {
            height: 109rpx;
            padding-left: 30rpx;
        }
        .price {
            height: 35rpx;
            margin-top: 35rpx;
            margin-bottom: 39rpx;

            color: $theme-color;
            &-label {
                font-size: 33rpx;
                line-height: 33rpx;

                color: #333;
            }
            &-logo {
                font-size: 33rpx;
                font-weight: bold;
                line-height: 33rpx;
            }
            &-num {
                font-size: 35rpx;
                font-weight: bold;
                line-height: 35rpx;
            }
        }
    }
}


</style>