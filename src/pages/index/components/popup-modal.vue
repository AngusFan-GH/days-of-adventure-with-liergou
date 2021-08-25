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
        @click="ignoreActivity(popupList[0].id)"
      ></u-icon>
    </view>
  </view>
</template>

<script>
import $wechatPay from '@/common/js/utils/wechat-pay';
import { env } from '@/common/js/config';
export default {
  name: 'popup-modal',
  data() {
    return {
      popupList: [],
      isSkipNextTime: false,
    };
  },
  methods: {
    init() {
      return this.getPopupList();
    },
    getPopupList() {
      return new Promise(res => {
        if (!this.isSkipNextTime) {
          this.isSkipNextTime = false;
          return this.$u.api.getActivityList({ location: '2' }).then(e => {
            this.popupList = e;
            res();
          });
        }
        res();
      });
    },
    ignoreActivity(id, time = 60) {
      this.$u.api
        .ignoreActivity({
          activityId: id,
          ignoreDuration: time,
        })
        .then(() => this.removeFromList(id));
    },
    removeFromList(id) {
      const index = this.popupList.findIndex(v => v.id === id);
      index >= 0 && this.popupList.splice(index, 1);
    },
    handleClickPopup() {
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
      const { nickname } = uni.getStorageSync('userInfo') || {};
      const phone = uni.getStorageSync('phone');
      this.$u.api
        .createActivityPay({
          activityId: id,
          payerName: nickname,
          payerPhone: phone,
        })
        .then(res => {
          const { orderInfo } = res;
          $wechatPay(orderInfo).then(() => {
            this.isSkipThisTime = true;
            if (env === 'release') {
              this.ignoreActivity(id, 60 * 60 * 24 * 365 * 100); // 生产环境打开
            } else {
              this.ignoreActivity(id, 60 * 5); // 方便测试
            }
            uni.navigateTo({
              url: `/subPackages/coupon/index`,
            });
          });
        });
    },
    skipNextTime() {
      this.isSkipNextTime = true;
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