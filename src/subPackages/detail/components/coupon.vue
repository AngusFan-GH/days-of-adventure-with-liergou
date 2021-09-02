<template>
  <view class="u-flex coupon" v-if="isShow && data && value.length">
    <u-icon name="youhuiquan" custom-prefix="custom-icon" color="#f4a56e" size="36"></u-icon>
    <view class="u-flex u-flex-1 u-line-1 u-m-l-20 u-m-r-40 main" @click="openPopup">
      <view class="u-flex-1 u-line-1 text">{{ data.title }}</view>
      <text class="u-m-l-20 btn" v-if="!isAllGot">立即领取</text>
      <text class="u-m-l-20 btn" v-else>已全部领取</text>
    </view>
    <u-icon name="close" size="30" @click="close"></u-icon>
    <!-- 可领取优惠券弹框 -->
    <u-popup v-model="isShowPopup" mode="bottom" :safe-area-inset-bottom="true" :border-radius="40">
      <view class="u-p-t-40 coupon-popup-wrapper">
        <scroll-view scroll-y="true">
          <view class="coupon-list">
            <view
              class="u-flex u-row-between coupon-wrapper"
              v-for="(item, index) in value"
              :key="index"
            >
              <u-icon
                class="icon"
                name="yilingqu"
                custom-prefix="custom-icon"
                size="100"
                v-show="item.hasGot"
              ></u-icon>
              <view class="u-flex-1 u-line-1 u-p-r-20 main">
                <view class="u-line-1 name">{{ item.title }}</view>
                <view class="u-flex">
                  <view class="u-p-30 price">
                    ¥
                    <text class="price-count">{{ item.offsetAmount }}</text>
                  </view>
                  <view class="u-flex-1 u-line-1">
                    <view class="u-m-b-8 range">满{{ item.withAmount }}可用</view>
                    <view class="u-line-1 time">
                      有效期至{{ item.validStartTime || `领取后的${item.validDays}天内` }}
                    </view>
                  </view>
                </view>
              </view>
              <view class="u-p-20 btn-wrapper">
                <text class="btn" @click="getCoupon(item)">立即领取</text>
              </view>
            </view>
          </view>
        </scroll-view>
        <view class="footer">
          <u-button shape="circle" :custom-style="customStyle" @click="this.isShowPopup = false">
            关闭
          </u-button>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import style from '@/common/style/variable.scss';
export default {
  name: 'coupon',
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    data: null,
    value: Array,
  },
  watch: {
    value(list) {
      this.isAllGot = list.every(v => v.hasGot);
    },
  },
  data() {
    return {
      isShow: true,
      isShowPopup: false,
      isAllGot: false,
      customStyle: {
        backgroundColor: style.themeColor,
        color: style.textCommonColor,
        height: '74rpx',
        lineHeight: '74rpx',
      },
    };
  },
  methods: {
    openPopup() {
      this.isShowPopup = true;
    },
    getCoupon(coupon) {
      const { id, hasGot } = coupon;
      if (hasGot) {
        return;
      }
      this.$u.api.takeCoupon(id).then(() => {
        coupon.hasGot = true;
        this.$emit('input', this.value);
        uni.showToast({
          title: '恭喜，抢到了',
          icon: 'none',
        });
      });
    },
    close() {
      this.isShow = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.coupon {
    padding: 14rpx 20rpx;

    background: linear-gradient(90deg, rgba(247,220,220,1) 17%, rgba(245,174,180,1) 100%);
    .text {
        font-size: 28rpx;
        font-weight: 600;
    }
    .btn {
        font-size: 26rpx;
        font-weight: 600;

        color: red;
    }
}
.coupon-popup-wrapper {
    .coupon-list {
        max-height: 50vh;
        padding: 0 12rpx 15rpx;
        .coupon-wrapper {
            position: relative;

            margin: 30rpx 20rpx;

            border-radius: 8px;
            background-color: #fff0f0;
            box-shadow: none;
            &:nth-child(1) {
                margin-top: 0;
            }
            .icon {
                position: absolute;
                top: 0;
                right: 0;
            }
            .main {
                position: relative;
                &:after {
                    position: absolute;
                    top: 50%;
                    right: 0;

                    display: block;

                    height: 80%;

                    content: '';
                    transform: translate(-50%,-50%);

                    border-right: 2rpx dashed;
                }
            }
            .name {
                font-size: 21rpx;
                font-weight: 600;

                display: inline-block;

                max-width: 100%;
                padding: 6rpx 21rpx;

                color: #f92626;
                border-top-left-radius: 8px;
                background: #ffb6b6;
            }
            .time {
                font-size: 24rpx;

                color: #6e6e6e;
            }
            .price {
                font-weight: 900;

                color: red;
                &-count {
                    font-size: 40rpx;
                }
            }
            .range {
                font-size: 24rpx;
                font-weight: 600;

                color: red;
            }
        }
    }
    .footer {
        padding: 15rpx 32rpx;
    }
}

</style>