<template>
  <view class="container u-skeleton safe-area-inset-bottom">
    <view class="wrapper" :style="{ '--background': 'url(' + backgroundImage + ')' }">
      <!-- 主题描述 -->
      <theme-describe :data="data"></theme-describe>
      <!-- 组队信息 -->
      <group-info v-if="isShowGroupInfo" :data="groupInfo"></group-info>
      <!-- 拼场规则 -->
      <pool-detail :data="data" v-if="isShowPoolDetail"></pool-detail>
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
      <!-- 场次描述 -->
      <session-describe
        :data="data"
        :uniqueId="uniqueId"
        v-if="isShowSessionDescribe"
      ></session-describe>
      <view class="btn-group">
        <!-- 选择场次 -->
        <choose-session
          :data="data"
          :day="date"
          v-model="chosenSession"
          v-if="isShowChooseSessionBtn"
        ></choose-session>
        <!-- 邀请朋友 -->
        <share-button :data="data" v-if="isShowShareBtn"></share-button>
        <!-- 立即加入 -->
        <join-button
          v-if="isShowJoinBtn"
          :data="data"
          :uniqueId="uniqueId"
          @getSession="handleGetSession"
        ></join-button>
      </view>
    </view>
    <u-skeleton :loading="loading" :animation="true" bgcolor="#FFF"></u-skeleton>
  </view>
</template>

<script>
import defaultThumb from '@/static/image/bg_login.png';
import { fileUrl } from '@/common/js/config';
import ThemeDescribe from './components/theme-describe.vue';
import GroupInfo from './components/group-info.vue';
import PoolDetail from './components/pool-detail.vue';
import ThemeIcon from './components/theme-icon.vue';
import ThemeShop from './components/theme-shop.vue';
import ThemeUgc from './components/theme-ugc.vue';
import ThemeDetail from './components/theme-detail.vue';
import ThemeRules from './components/theme-rules.vue';
import LinkIcon from './components/link-icon.vue';
import SessionDescribe from './components/session-describe.vue';
import ChooseSession from './components/choose-session.vue';
import ShareButton from './components/share-button.vue';
import { mapState } from 'vuex';
import JoinButton from './components/join-button.vue';
export default {
  components: {
    ThemeDescribe,
    GroupInfo,
    PoolDetail,
    ThemeIcon,
    ThemeShop,
    ThemeUgc,
    ThemeDetail,
    ThemeRules,
    LinkIcon,
    ChooseSession,
    SessionDescribe,
    ShareButton,
    JoinButton,
  },
  onLoad(options) {
    const { productId, uniqueId, from, id } = options || {};
    this.productId = +productId;
    this.uniqueId = uniqueId;
    this.from = from || 'share';
    this.handleFrom(from);
    console.log('@@@', options);
    this.getDetail();
    uni.showShareMenu();
  },
  data() {
    return {
      productId: null,
      uniqueId: null,
      groupInfo: [],
      from: null,
      loading: true,
      data: {
        headPicUrl: defaultThumb,
      },
      date: null,
      chosenPeople: true,
      hasCommits: false,
      chosenSession: null,
      backgroundImage: fileUrl + 'background_image.png!d1',
      fromMap: {
        index: {
          showList: ['isShowPoolDetail', 'isShowChooseSessionBtn'],
        },
        play: {
          showList: ['isShowPoolDetail', 'isShowChooseSessionBtn'],
        },
        pay: {
          title: '支付成功',
          showList: ['isShowGroupInfo', 'isShowShareBtn', 'isShowSessionDescribe'],
        },
        share: {
          title: '场次详情',
          showList: ['isShowGroupInfo', 'isShowSessionDescribe', 'isShowJoinBtn'],
        },
      },
      isShowGroupInfo: false,
      isShowPoolDetail: false,
      isShowChooseSessionBtn: false,
      isShowShareBtn: false,
      isShowSessionDescribe: false,
      isShowJoinBtn: false,
    };
  },
  computed: {
    ...mapState('filter', ['filter']),
    ...mapState('user', ['userInfo']),
  },
  onShareAppMessage(res) {
    console.log(res.target);
    const { id } = this.userInfo;
    const query = {
      productId: this.productId,
      from: 'share',
      id,
    };
    if (this.uniqueId) {
      query.uniqueId = this.uniqueId;
    }
    return {
      title: this.data.productName,
      path: `/subPackages/detail/index?${this.paramsMaker(query)}`,
      imageUrl: this.data.headPicUrl,
    };
  },
  methods: {
    handleFrom(from) {
      const { title, showList } = this.fromMap[from] || {};
      this.setNavigationBarTitle(title);
      this.handleShowContent(showList);
      switch (from) {
        case 'play':
          const { peopleFrom, roomBeginTimeFrom } = from === 'play' ? this.filter : {};
          this.date = roomBeginTimeFrom
            ? new Date(roomBeginTimeFrom.replace(/-/g, '/')).getTime()
            : null;
          this.chosenPeople = !!peopleFrom;
          break;
        case 'pay':
          this.uniqueId && this.getViewScene(this.uniqueId);
          break;
        case 'share':
          this.uniqueId && this.getViewScene(this.uniqueId);
          break;
      }
    },
    setNavigationBarTitle(title) {
      title &&
        uni.setNavigationBarTitle({
          title,
        });
    },
    handleShowContent(showList = []) {
      showList.forEach(isShow => (this[isShow] = true));
    },
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
    getViewScene(uniqueId) {
      this.$u.api
        .getViewScene(uniqueId)
        .then(e => {
          const { paidDetails, room } = e || {};
          console.log('222', e);
          const { currentPeople, lockPeople, paidPeople } = room;
          const mumbers = paidDetails.reduce((p, c) => {
            const others = new Array(c.buyCount - 1).fill({
              avatarUrl: null,
              nickName: `${c.nickName}的小伙伴`,
            });
            return p.concat([c, ...others]);
          }, []);
          if (room.currentPeople - mumbers.length > 0) {
            this.groupInfo = mumbers.concat(
              new Array(room.currentPeople - mumbers.length).fill({ avatarUrl: null })
            );
          } else {
            mumbers.length = room.currentPeople;
            this.groupInfo = mumbers;
          }
          console.log(this.groupInfo);
        })
        .catch(err => {
          console.error(err);
          this.isShowGroupInfo = false;
          this.isShowSessionDescribe = false;
        });
    },
    goToOrder() {
      const {
        advicePeopleMin,
        advicePeopleMax,
        duration,
        blockBooking,
        productId,
        productName,
        headPicUrl,
      } = this.data;
      const shopInfo = this.data.shopInfo || {};
      const data = {
        ...this.chosenSession,
        productId,
        productName,
        advicePeopleMin,
        advicePeopleMax,
        duration,
        shopName: shopInfo.shopName,
        blockBooking,
        headPic: headPicUrl,
      };
      console.log('goToOrder', data);
      uni.navigateTo({
        url: '/subPackages/pay/index?from=' + this.from,
        success: res => {
          res.eventChannel.emit('submitOrder', data);
        },
      });
    },
    paramsMaker(params) {
      return Object.keys(params)
        .reduce((res, key) => (res += `&${key}=${params[key]}`), '')
        .substr(1);
    },
    handleGetSession(session) {
      this.chosenSession = session;
      console.log(this.chosenSession);
    },
  },
  provide() {
    return {
      goToOrder: this.goToOrder,
    };
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