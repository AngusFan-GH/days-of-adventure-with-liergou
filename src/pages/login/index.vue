<template>
  <view class="login">
    <image class="bg"
      src="/static/image/bg_login.png"
      mode="widthFix"></image>
    <view class="btn-box">
      <view class="login-btn">
        <template v-if="step == 1">
          <u-button class="btn"
            type="primary"
            shape="circle"
            :ripple="true"
            @click="getuserinfo">登录授权</u-button>
        </template>
        <template v-if="step == 2">
          <u-button class="btn"
            type="primary"
            shape="circle"
            :ripple="true"
            open-type="getPhoneNumber"
            @getphonenumber="getPhoneNumber">授权手机号</u-button>
        </template>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      step: 1,
      userInfo: null,
    };
  },
  methods: {
    getuserinfo() {
      uni.getUserProfile({
        desc: '必须授权才可以继续使用',
        success: (res) => {
          this.userInfo = res.userInfo;
          console.log('getUserProfile', this.userInfo);
          uni.setStorageSync('userInfo', res.userInfo);
          this.weChatLogin();
        },
        fail: () => {
          uni.showToast({
            title: '授权失败',
            icon: 'none',
          });
        },
      });
    },
    weChatLogin() {
      uni.login({
        provider: 'weixin',
        success: (res) => {
          this.$u.api
            .weChatLogin({
              code: res.code,
            })
            .then((result) => {
              console.log('weChatLogin', result);
              const { token, user } = result;
              uni.setStorageSync('token', token);
              this.$u.api
                .updateUserInfo({
                  userInfo: this.userInfo,
                })
                .then((res) => console.log(res))
                .catch((err) => console.error(err));
              uni.setStorageSync('openId', user.openId);
              if (user.phoneNumber) {
                uni.setStorageSync('phone', user.phoneNumber);
                this.navigateBack();
              } else {
                this.step = 2;
                uni.showToast({
                  title: '请授权手机号',
                  icon: 'none',
                });
              }
            })
            .catch((err) => {
              console.error(err);
            });
        },
        fail: (err) => {
          console.error(err);
        },
      });
    },
    getPhoneNumber(e) {
      console.log('getPhoneNumber', e);
      if (e.detail.errMsg == 'getPhoneNumber:ok') {
        const { encryptedData, iv } = e.detail;
        this.$u.api
          .decryptUserInfo({
            encryptedData,
            iv,
          })
          .then((res) => {
            console.log('decryptUserInfo', res);
            this.navigateBack();
          })
          .catch((err) => console.error(err));
      }
    },
    navigateBack() {
      uni.navigateBack({
        delta: 1,
        success: (res) => {
          console.log('navigateBack', res);
        },
        fail: (res) => {
          console.log('navigateBack', res);
          uni.switchTab({
            url: '/pages/index/index',
          });
        },
      });
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