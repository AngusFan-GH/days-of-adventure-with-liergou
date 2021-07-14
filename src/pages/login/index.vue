<template>
  <view class="login">
    <image class="bg" src="/static/image/bg_login.png" mode="widthFix"></image>
    <view class="u-font-30 u-text-center u-margin-top-50 bg-text" v-if="step == 0">
      正在获取授权信息...
    </view>
    <view class="btn-box">
      <view class="login-btn">
        <template v-if="step == 1">
          <u-button class="btn" type="primary" shape="circle" :ripple="true" @click="getuserinfo">
            登录授权
          </u-button>
        </template>
        <template v-if="step == 2">
          <u-button
            class="btn"
            type="primary"
            shape="circle"
            :ripple="true"
            open-type="getPhoneNumber"
            @getphonenumber="getPhoneNumber"
          >
            授权手机号
          </u-button>
        </template>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      step: 0,
      userInfo: null,
      phone: null,
    };
  },
  onShow() {
    this.weChatLogin();
  },
  methods: {
    weChatLogin() {
      uni.login({
        provider: 'weixin',
        success: res => {
          this.$u.api
            .weChatLogin({
              code: res.code,
            })
            .then(result => {
              console.log('weChatLogin', result);
              const { token, user } = result;
              uni.setStorageSync('token', token);
              const { openId, nickName, phoneNumber } = user;
              uni.setStorageSync('openId', openId);
              if (nickName == null) {
                return (this.step = 1);
              }
              uni.setStorageSync('userInfo', {
                avatarUrl: user.avatarUrl,
                city: user.city,
                country: user.country,
                gender: user.gender,
                language: user.language,
                nickName: user.nickName,
                province: user.province,
              });
              if (phoneNumber) {
                uni.setStorageSync('phone', phoneNumber);
                this.navigateBack();
              } else {
                this.step = 2;
              }
            })
            .catch(err => {
              console.error(err);
            });
        },
        fail: err => {
          console.error(err);
        },
      });
    },
    getuserinfo() {
      uni.getUserProfile({
        desc: '必须授权才可以继续使用',
        success: res => {
          this.userInfo = res.userInfo;
          console.log('getUserProfile', this.userInfo);
          uni.setStorageSync('userInfo', res.userInfo);
          this.$u.api
            .updateUserInfo({
              userInfo: this.userInfo,
            })
            .then(res => {
              console.log('updateUserInfo', res);
              this.step = 2;
            })
            .catch(err => console.error(err));
        },
        fail: () => {
          uni.showToast({
            title: '授权失败',
            icon: 'none',
          });
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
          .then(res => {
            console.log('decryptUserInfo', res);
            uni.setStorageSync('phone', res.phoneNumber);
            this.navigateBack();
          })
          .catch(err => console.error(err));
      }
    },
    navigateBack() {
      uni.navigateBack({
        delta: 1,
        success: res => {
          console.log('navigateBack', res);
        },
        fail: res => {
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
@import '../../common/style/variable.scss';
.login {
    position: fixed;
    top: 0;

    width: 100%;
    height: 100%;

    background-color: $background-color;
    background-size: 100% auto;

    .bg {
        width: 509rpx;
        margin: 0 auto;
        margin-top: 190rpx;
        margin-left: 130rpx;
        &-text {
            color: $text-common-color;
        }
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