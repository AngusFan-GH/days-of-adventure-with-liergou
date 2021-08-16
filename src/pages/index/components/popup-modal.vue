<template>
  <view class="popup-container" v-if="popupList.length" @touchmove.stop.prevent="moveHandle">
    <view class="popup">
      <image
        class="pic"
        :src="popupList[0].banner"
        mode="widthFix"
        @click="handleClickPopup"
      ></image>
      <u-icon
        class="close-btn"
        name="close-circle"
        size="60"
        color="#fff"
        @click="laterView(60)"
      ></u-icon>
    </view>
  </view>
</template>

<script>
export default {
  name: 'popup-modal',
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    value: Boolean,
  },
  data() {
    return {
      popupList: [],
    };
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        val && this.getPopupList();
      },
    },
  },
  methods: {
    getPopupList() {
      this.$u.api.getActivityList({ location: '2' }).then(e => {
        this.popupList = e;
        this.$emit('input', false);
        uni.stopPullDownRefresh();
      });
    },
    laterView(time = 60) {
      const activityId = this.popupList[0].id;
      console.log('isIgnore:', activityId, time);
      this.$u.api
        .ignoreActivity({
          activityId,
          ignoreDuration: time,
        })
        .then(() => console.log('ignoreActivity', activityId));
      this.popupList.shift();
    },
    handleClickPopup() {
      console.log(this.popupList[0]);
      const { templateId, id } = this.popupList[0];
      if (templateId === '1') {
        this.createActivityPay(id);
      } else {
        this.jumpToActivityDetail(this.popupList[0]);
      }
    },
    jumpToActivityDetail({ id, templateId, type }) {
      if (id) {
        uni.navigateTo({
          url: `/subPackages/activity/index?id=${id}&templateId=${templateId}&type=${type}`,
        });
      }
    },
    createActivityPay(id) {
      const { nickname } = uni.getStorageSync('userInfo');
      const phone = uni.getStorageSync('phone');
      this.$u.api
        .createActivityPay({
          activityId: id,
          payerName: nickname,
          payerPhone: phone,
        })
        .then(res => {
          const { orderInfo } = res;
          this.pay(id, orderInfo);
        })
        .catch(err => console.error(err));
    },
    pay(id, orderInfo) {
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
            this.$u.api
              .takeCoupon(id)
              .then(e => {
                uni.showToast({
                  title: '领取成功',
                });
                if (this.popupList[0] && this.popupList[0].id === id) {
                  this.laterView(3600);
                }
                uni.navigateTo({
                  url: `/subPackages/coupon/index`,
                });
              })
              .catch(err => {
                console.error(err);
                if (this.popupList[0] && this.popupList[0].id === id) {
                  this.laterView(3600);
                }
              });
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
    moveHandle() {},
  },
};
</script>

<style lang="scss">
.popup-container {
    position: fixed;
    z-index: 999999;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    background-color: rgba($color: #000, $alpha: .8);
    .popup {
        position: absolute;
        top: 50%;
        left: 50%;

        display: block;

        width: 70vw;

        transform: translate(-50%, -50%);
        .pic {
            display: block;

            width: 100%;
        }
    }
    .close-btn {
        position: absolute;
        top: 0;
        right: 0;
    }
}

</style>