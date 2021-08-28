<template>
  <view class="container u-skeleton safe-area-inset-bottom">
    <view class="wrapper" :style="{ '--background': 'url(' + backgroundImage + ')' }">
      <!-- 主题描述 -->
      <theme-describe :data="data"></theme-describe>
      <!-- 拼场规则 -->
      <pool-detail :data="data"></pool-detail>
      <!-- 主题icon -->
      <theme-icon :data="data"></theme-icon>
      <!-- 店铺信息 -->
      <theme-shop :data="data"></theme-shop>
      <link-icon v-show="hasCommits"></link-icon>
      <!-- 评价 -->
      <theme-ugc :productId="productId" v-model="hasCommits"></theme-ugc>
      <u-gap height="35"></u-gap>
      <!-- 主题详情 -->
      <theme-detail :data="data"></theme-detail>
      <link-icon></link-icon>
      <!-- 主题规则 -->
      <theme-rules></theme-rules>
      <u-gap height="479"></u-gap>
    </view>
    <view class="theme-submit safe-area-inset-bottom">
      <!-- <view class="u-relative u-flex u-row-between notice">
        <view class="txt-area">
          <text class="txt">当前有2场在拼，最近一场差</text>
          <text class="txt high-light">{{ data.advicePeopleMin }}</text>
          <text class="txt">人即可开场</text>
        </view>
        <view class="notice-space"></view>
        <view class="u-flex u-margin-left-4 join">
          立即加入
          <navigator class="u-margin-left-8 arrow-right"></navigator>
        </view>
      </view> -->
      <view class="btn-group">
        <choose-session :data="data"></choose-session>
      </view>
    </view>
    <u-skeleton :loading="loading" :animation="true" bgcolor="#FFF"></u-skeleton>
  </view>
</template>

<script>
import defaultThumb from '@/static/image/bg_login.png';
import { fileUrl } from '@/common/js/config';
import ThemeDescribe from './components/theme-describe.vue';
import PoolDetail from './components/pool-detail.vue';
import ThemeIcon from './components/theme-icon.vue';
import ThemeShop from './components/theme-shop.vue';
import ThemeUgc from './components/theme-ugc.vue';
import ThemeDetail from './components/theme-detail.vue';
import ThemeRules from './components/theme-rules.vue';
import LinkIcon from './components/link-icon.vue';
import ChooseSession from './components/choose-session.vue';
export default {
  components: {
    ThemeDescribe,
    PoolDetail,
    ThemeIcon,
    ThemeShop,
    ThemeUgc,
    ThemeDetail,
    ThemeRules,
    LinkIcon,
    ChooseSession,
  },
  provide: {
    goToOrder: 'goToOrder',
  },
  onLoad(options) {
    this.productId = +options.productId;
    const currentTabPage = uni.getStorageSync('current_tab_page') || 'play';
    const { peopleFrom } = uni.getStorageSync(currentTabPage + '_filter_data') || {};
    this.chosenPeople = !!peopleFrom;
    this.getDetail();
    uni.showShareMenu();
  },
  onShareAppMessage(res) {
    console.log(res.target);
    return {
      title: this.data.productName,
      path: `/subPackages/detail/index?productId=${this.productId}`,
      imageUrl: this.data.headPicUrl,
    };
  },
  data() {
    return {
      productId: null,
      loading: true,
      hasCommits: false,
      data: {
        headPicUrl: defaultThumb,
      },
      chosenPeople: true,
      backgroundImage: fileUrl + 'background_image.png!d1',
    };
  },
  methods: {
    getDetail() {
      if (this.productId == null) {
        return console.warn('There is no productId');
      }
      this.$u.api
        .getDetail(this.productId)
        .then(data => {
          data.difficultLevel = data.difficultLevel / 10;
          data.shopInfo.star = data.shopInfo.star / 10;
          // 遍历所有场次取价格最小值
          data.price =
            data.basicPrice != null
              ? data.basicPrice
              : Math.min.apply(
                  Math,
                  Array.from(
                    new Set(
                      Object.values(data.rooms || {}).reduce(
                        (set, room) => set.concat(room.map(v => v.price)),
                        []
                      )
                    )
                  )
                );
          data.poolRuleDescMap = Object.keys(data.poolRuleDescMap).length
            ? ['拼场方式', '详细规则'].map(rule => {
                return {
                  label: rule,
                  value: data.poolRuleDescMap[rule],
                };
              })
            : [];
          data.commits = this.data.commits || [];
          data.commitCount = this.data.commitCount || 0;
          this.data = data;
          this.loading = false;
        })
        .catch(err => console.error(err));
    },
    goToOrder() {
      const { advicePeopleMin, advicePeopleMax, duration, blockBooking, productName, headPicUrl } =
        this.data;
      const shopInfo = this.data.shopInfo || {};
      const data = {
        ...this.chosenSession,
        productName,
        advicePeopleMin,
        advicePeopleMax,
        duration,
        shopName: shopInfo.shopName,
        blockBooking,
        headPic: headPicUrl,
      };
      uni.navigateTo({
        url: '/subPackages/order/pay/index',
        success: res => {
          res.eventChannel.emit('submitOrder', data);
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../common/style/variable.scss';
.container {
    min-height: 100%;

    background: $background-color ;
    .wrapper {
        min-height: 100%;

        background: var(--background) no-repeat bottom / 100%;
    }
}
.theme-submit {
    position: fixed;
    z-index: 999;
    bottom: 0;
    left: 0;

    box-sizing: border-box;
    width: 100%;

    background-color: #fff;
    .notice {
        font-size: 22rpx;
        line-height: 80rpx;

        height: 70rpx;
        padding: 0 30rpx;

        background: #fff;
        .txt-area {
            color: #777;
        }
        .high-light {
            color: $theme-color;
        }
        .join {
            font-size: 22rpx;

            color: #999;
        }
    }
    .btn-group {
        padding: 15rpx 32rpx;
        /deep/ .btn-text {
            font-size: 36rpx;
            font-weight: bold;

            letter-spacing: 8rpx;

            color: #fff;
            text-shadow: 0 0 7px #7c2f00;
        }
    }
}

</style>