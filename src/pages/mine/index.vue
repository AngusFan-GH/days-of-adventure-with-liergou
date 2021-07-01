<template>
  <view class="container">
    <view class="u-flex user-info" @click="goToOrderList()">
      <u-avatar
        :src="user.avatarUrl"
        size="large"
        mode="square"
        :show-sex="true"
        :sex-icon="user.gender == 1 ? 'man' : 'woman'"
      ></u-avatar>
      <view class="u-flex-1 u-margin-left-20 main">
        <view class="u-margin-bottom-10 u-line-1 name">{{ user.nickName }}</view>
      </view>
    </view>
    <loading class="loading" v-if="loading" :label="labels[current]"></loading>
    <custom-tab-bar :tabBarIndex="tabBarIndex"></custom-tab-bar>
  </view>
</template>

<script>
import { customTabBar } from '@/components/custom-tab-bar/custom-tab-bar.vue';
import loading from '@/components/loading/loading.vue';
export default {
  components: {
    customTabBar,
    loading,
  },
  onShow() {
    this.getUserInfo();
    this.user && this.resetLabels();
  },
  data() {
    return {
      tabBarIndex: 2,
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
    };
  },
  methods: {
    getUserInfo() {
      const user = uni.getStorageSync('userInfo');
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
    goToOrderList() {
      console.log('/subPackages/order/list/index');
      uni.navigateTo({
        url: '/subPackages/order/list/index',
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

    background-color: $background-color;
}
.user-info {
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
}
.loading {
    position: fixed;
    top: 40%;
    left: 50%;

    transform: translate(-50%,-50%);
}

</style>