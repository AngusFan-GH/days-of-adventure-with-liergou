<template>
  <view class="container" :style="{ '--background': 'url(' + backgroundImage + ')' }">
    <view class="u-flex user-info">
      <u-avatar
        :src="user.avatarUrl"
        size="large"
        mode="square"
        :show-sex="true"
        :sex-icon="user.gender == 1 ? 'man' : 'woman'"
      ></u-avatar>
      <view class="u-flex-1 u-margin-left-20 main">
        <view class="u-margin-bottom-10 u-line-1 name">{{ user.nickName }}</view>
        <view class="u-margin-bottom-10 u-line-1 id">
          <text class="u-margin-right-6">ID：{{ user.id }}</text>
          <u-icon name="copy" custom-prefix="custom-icon" size="22" @click="copy(user.id)"></u-icon>
        </view>
      </view>
      <u-icon
        class="edit-btn"
        name="map-edit"
        custom-prefix="custom-icon"
        size="30"
        @click="edit(user.id)"
      ></u-icon>
    </view>
    <view class="op-list">
      <view class="u-flex u-row-between list-item" @click="goToOrderList()">
        <text class="label">余额</text>
        <view class="balance">
          ¥
          <text class="u-font-36">{{ balance }}</text>
        </view>
      </view>
      <view class="u-flex u-row-between list-item" @click="goToOrderList()">
        <text class="label">订单</text>
        <u-icon name="arrow-right" custom-prefix="custom-icon" size="30"></u-icon>
      </view>
      <view class="u-flex u-row-between list-item" @click="goToCouponList()">
        <view class="label">优惠券</view>
        <u-icon name="arrow-right" custom-prefix="custom-icon" size="30"></u-icon>
      </view>
    </view>
    <loading class="loading" v-if="loading" :label="labels[current]"></loading>
    <custom-tabbar :tabbarIndex="tabbarIndex"></custom-tabbar>
  </view>
</template>

<script>
import { customTabbar } from '@/components/custom-tabbar/custom-tabbar.vue';
import loading from '@/components/loading/loading.vue';
import { fileUrl } from '../../common/js/config';
import { mapState } from 'vuex';
export default {
  components: {
    customTabbar,
    loading,
  },
  onShow() {
    this.getUserInfo();
    this.getBalanceInfo();
    this.user && this.resetLabels();
  },
  data() {
    return {
      tabbarIndex: 2,
      user: null,
      loading: true,
      labels: [
        '欢迎来到这里',
        '很高兴认识你',
        '我是个动画',
        '在这看家的',
        '这里没别的了',
        '暂时先这些',
        '别看了',
        '就这些',
        '真就这些了',
        '也不用着急',
        '面包会有的',
        '功能也会有的',
        '都在路上了',
        '等等就有了',
        '玩着玩着就有了',
        '都看这么久了',
        '这么无聊么',
        '剧本不香了么',
        '赶快去玩吧',
        '我记性不好',
        '刚才说了啥',
        '马上就忘了',
      ],
      current: 0,
      timer: null,
      first: true,
      balance: 0,

      backgroundImage: fileUrl + 'background_image.png!d1',
    };
  },
  computed: {
    ...mapState('user', ['userInfo']),
  },
  methods: {
    getUserInfo() {
      const user = this.userInfo;
      if (!user) {
        return uni.navigateTo({
          url: '/pages/login/index',
        });
      }
      this.user = user;
    },
    resetLabels() {
      this.current = 0;
      if (this.first) {
        this.labels.unshift((this.user.gender == 1 ? '少侠' : '女侠') + '，你好');
        this.first = false;
      }
      this.timer = setInterval(() => {
        if (this.current === this.labels.length - 1) {
          this.labels.splice(
            2,
            1,
            Math.ceil(Math.random() * 5) === 5 ? '又见面了' : '我们是不是见过'
          );
          return (this.current = 0);
        }
        this.current++;
      }, 2 * 1000);
    },
    getBalanceInfo() {
      this.$u.api.getBalanceInfo().then(e => {
        console.log('getBalanceInfo', e);
        this.balance = e.balance;
      });
    },
    goToOrderList() {
      uni.navigateTo({
        url: '/subPackages/order/list/index',
      });
    },
    goToCouponList() {
      uni.navigateTo({
        url: '/subPackages/coupon/index',
      });
    },
    copy(text) {
      uni.setClipboardData({
        data: text,
        success: function () {
          console.log('copy success');
        },
      });
    },
    edit(userId) {
      uni.navigateTo({
        url: '/subPackages/user/edit/index?id=' + userId,
      });
    },
  },
  onHide() {
    clearInterval(this.timer);
    this.timer = null;
  },
};
</script>

<style lang="scss">
@import '../../common/style/variable.scss';
.container {
    overflow: hidden;

    min-height: 100%;

    background: $background-color var(--background) no-repeat bottom / 100%;
}
.user-info {
    position: relative;

    padding: 30rpx 40rpx;

    background-image: linear-gradient(to right, $theme-color, $difficult-icon-color);
    .main {
        overflow: hidden;
    }
    .name {
        font-size: 40rpx;
        font-weight: bold;

        color: $title-color;
    }
    .id {
        font-size: 22rpx;

        color: $text-common-color;
    }
    .edit-btn {
        position: absolute;
        top: 30rpx;
        right: 30rpx;

        color: $text-common-color;
    }
}
.op-list {
    padding: 60rpx 50rpx;
    .list-item {
        font-size: 30rpx;

        padding: 20rpx 0;

        color: $title-color;
        border-bottom: 2rpx solid $line-color;
        .label {
            color: $title-color;
        }
    }
    .balance {
      color: $theme-color;
    }
}
.loading {
    position: fixed;
    top: 45%;
    left: 50%;

    transform: translate(-50%,-50%);
}


</style>