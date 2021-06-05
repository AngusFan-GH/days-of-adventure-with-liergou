<template>
  <view class="login">
    <image class="bg" src="/static/image/bg_login.png" mode="widthFix"></image>
    <view class="btn-box">
      <view class="login-btn">
        <template v-if="step == 1">
          <u-button
            class="btn"
            type="primary"
            shape="circle"
            :ripple="true"
            @click="getuserinfo"
            >登录授权</u-button
          >
        </template>
        <template v-if="step == 2">
          <u-button
            class="btn"
            type="primary"
            shape="circle"
            :ripple="true"
            open-type="getPhoneNumber"
            @getphonenumber="getPhoneNumber"
            >授权手机号</u-button
          >
        </template>
      </view>
    </view>
  </view>
</template>

<script>
import { appId } from "@/common/config";
import WXBizDataCrypt from "@/common/WXBizDataCrypt";

export default {
  data() {
    return {
      step: 1,
      openId: "",
      sessionKey: "",
      userInfo: null,
      encryptedData: "",
      iv: "",
    };
  },
  methods: {
    getuserinfo() {
      uni.getUserProfile({
        desc: "必须授权才可以继续使用",
        success: (res) => {
          this.userInfo = res.userInfo;
          console.log("userInfo", this.userInfo);
          this.getWeChatOpenId();
        },
        fail: () => {
          uni.showToast({
            title: "授权失败",
            icon: "none",
          });
        },
      });
    },
    getWeChatOpenId() {
      uni.login({
        provider: "weixin",
        success: (loginRes) => {
          console.log(loginRes);
          this.$u.api
            .getWeChatOpenId({
              code: loginRes.code,
            })
            .then((res) => {
              this.openId = res.data.openId;
              this.sessionKey = res.data.sessionKey;
              uni.setStorageSync("openId", this.openId);
              if (res.data.phone) {
                uni.setStorageSync("phone", res.data.phone);
              } else {
                this.step = 2;
                uni.showToast({
                  title: "请授权手机号",
                  icon: "none",
                });
              }
            })
            .catch((err) => {
              console.error(err);
              this.step = 2;
            });
        },
      });
    },
    getPhoneNumber(e) {
      console.log(e);
      if (e.detail.errMsg == "getPhoneNumber:ok") {
        const { encryptedData, iv } = e.detail;
        const pc = new WXBizDataCrypt(appId, this.sessionKey);
        const data = pc.decryptData(encryptedData, iv);
        console.log("解密后 data: ", data);
        // 登录
      }
    },
  },
};
</script>

<style scoped lang="scss">
.login {
  position: fixed;
  top: 0;

  width: 100%;
  height: 100%;

  background-color: #fff;
  background-size: 100% auto;

  .bg {
    width: 509rpx;
    margin: 0 auto;
    margin-top: 190rpx;
    margin-left: 130rpx;
  }

  .btn-box {
    position: fixed;
    bottom: 150rpx;
    left: 30rpx;

    display: flex;

    width: 690rpx;

    align-items: center;
    justify-content: center;
    .login-btn {
      width: 48%;
    }
  }
}
</style>