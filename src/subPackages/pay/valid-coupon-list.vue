<template>
  <view
    class="u-flex-col u-col-between wrapper"
    :style="{ '--background': 'url(' + backgroundImage + ')' }"
  >
    <view class="u-m-30">
      <text class="u-m-r-20 title">{{ title }}</text>
      <text class="count">共{{ couponList.length }}张</text>
    </view>
    <view class="u-flex-1 list">
      <scroll-view scroll-y style="height: 100%; width: 100%">
        <u-radio-group v-model="value" wrap active-color="#f0ba43">
          <view
            class="u-flex u-row-between coupon-wrapper"
            v-for="(item, index) in couponList"
            :key="index"
            @click="handleClick(index)"
          >
            <view class="u-flex-1 u-line-1 u-flex u-row-between u-m-r-30">
              <view class="u-flex-1 u-line-1">
                <view class="u-line-1 u-m-b-20 name">{{ item.title }}</view>
                <view class="u-line-1 time">有效期至 {{ item.validStartTime }}</view>
              </view>
              <view class="u-flex-col u-col-center">
                <view class="u-m-b-20 price">
                  ¥
                  <text class="price-count">{{ item.offsetAmount }}</text>
                </view>
                <view class="range">满{{ item.withAmount }}可用</view>
              </view>
            </view>
            <u-radio :name="item.id" label-size="0"></u-radio>
          </view>
        </u-radio-group>
        <loading class="loading" v-if="!couponList.length"></loading>
      </scroll-view>
    </view>
    <view class="footer">
      <view class="u-flex u-row-between footer-main">
        <view class="price">
          <text class="u-m-r-6 price-label">可优惠</text>
          <text class="price-logo">¥</text>
          <text class="price-num">{{ chosenCoupon ? chosenCoupon.offsetAmount : 0 }}</text>
        </view>
        <view>
          <u-button
            :custom-style="customStyle"
            hover-class="none"
            :ripple="true"
            :hair-line="false"
            @click="chooseCoupon"
          >
            {{ btnText }}
          </u-button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { fileUrl } from '@/common/js/config';
import style from '@/common/style/variable.scss';
import loading from '@/components/loading/loading.vue';
export default {
  components: {
    loading,
  },
  data() {
    return {
      type: 'choose',
      title: '可用优惠券',
      btnText: '确定',
      eventChannel: null,
      couponList: [],
      value: null,
      backgroundImage: fileUrl + 'background_image.png!d1',
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
    };
  },
  onLoad(options) {
    this.type = options.type || 'choose';
    if (this.type === 'take') {
      this.title = '可领优惠券';
      this.btnText = '领取';
    }
    this.eventChannel = this.getOpenerEventChannel();
    this.eventChannel.on('validCouponList', ({ value, list }) => {
      this.couponList = list;
      this.value = value || this.couponList[0].id;
    });
  },
  computed: {
    chosenCoupon() {
      return this.couponList.find(v => v.id === this.value);
    },
  },
  methods: {
    handleClick(index) {
      this.value = this.couponList[index].id;
    },
    chooseCoupon() {
      this.eventChannel.emit('chooseCoupon', { id: this.value });
      uni.navigateBack({
        delta: 1,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../common/style/variable';
.wrapper {
    height: 100%;
    padding-top: 40rpx;

    background: $background-color var(--background) no-repeat bottom / 100%;
    .title {
        font-size: 40rpx;
        font-weight: 900;

        color: $theme-color;
    }
    .count {
        font-size: 24rpx;

        color: $white;
    }

    .list {
        overflow: hidden;
        .name {
            font-size: 30rpx;
            font-weight: 600;
        }
        .time {
            font-size: 24rpx;

            color: #6e6e6e;
        }
        .price {
            color: red;
            &-count {
                font-size: 40rpx;
            }
        }
        .range {
            font-size: 24rpx;

            color: red;
        }
        u-radio {
            width: 36rpx;
        }
    }
    .coupon-wrapper {
        margin: 30rpx;
        padding: 20rpx;

        border-radius: 8px;
        background-color: $white;
        box-shadow: none;
    }
    .footer {
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
                font-size: 26rpx;
                line-height: 26rpx;

                color: #333;
            }
            &-logo {
                font-size: 26rpx;
                font-weight: bold;
                line-height: 26rpx;
            }
            &-num {
                font-size: 36rpx;
                font-weight: bold;
                line-height: 36rpx;
            }
        }
        .tip {
            font-size: 24rpx;

            color: #6e6e6e;
        }
    }
}
.loading {
    position: fixed;
    top: 40%;
    left: 50%;

    transform: translate(-50%,-50%);
}

</style>