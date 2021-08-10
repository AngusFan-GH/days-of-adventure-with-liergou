<template>
  <view
    class="container u-skeleton safe-area-inset-bottom"
    :style="{ '--background': 'url(' + backgroundImage + ')' }"
  >
    <view class="theme-describe">
      <view class="u-relative bg">
        <view
          class="u-absolute bg-img"
          :style="{ backgroundImage: 'url(' + data.headPicUrl + ')' }"
        ></view>
        <view class="u-flex-col u-col-center u-relative u-padding-30 theme-info">
          <view class="u-flex u-margin-top-30 theme-content">
            <view
              class="u-relative head-pic u-skeleton-fillet"
              :style="{ backgroundImage: 'url(' + data.headPicUrl + ')' }"
            ></view>
            <view class="u-flex-col u-margin-left-20 theme-base">
              <view class="title u-skeleton-rect">{{ data.productName }}</view>
              <view class="u-flex u-margin-top-10 level u-skeleton-rect">
                <view class="u-margin-right-10 label">难度</view>
                <view class="star">
                  <u-rate
                    v-show="data.difficultLevel"
                    :count="5"
                    v-model="data.difficultLevel"
                    disabled
                    active-color="#f6be45"
                    active-icon="lock-fill"
                    inactive-icon="lock"
                    gutter="0"
                  ></u-rate>
                  <view v-show="!data.difficultLevel">有待探索</view>
                </view>
              </view>
              <view class="u-margin-top-10 u-line-1 theme-tag u-skeleton-rect">
                <text class="tag-item" v-for="(tip, index) in data.tipList" :key="index">
                  {{ tip }}
                </text>
              </view>
              <view class="u-flex u-flex-wrap u-margin-top-10 theme-style u-skeleton-rect">
                <text class="style-tag">{{ data.style }}</text>
                <text
                  class="u-margin-right-12 style-tags"
                  v-for="(tag, index) in data.tagList"
                  :key="index"
                >
                  {{ tag }}
                </text>
              </view>
              <view class="u-flex u-row-between u-margin-top-10 u-skeleton-rect">
                <view class="u-flex price">
                  <text class="price-num">¥{{ data.price || '--' }}</text>
                  <text class="u-margin-left-6 price-desc">起</text>
                </view>
                <view class="book-num">{{ salesFmt(data.sales) }}人订过</view>
              </view>
            </view>
          </view>
          <view class="u-flex-col u-margin-top-20 u-padding-20 theme-desc u-skeleton-fillet">
            <view class="u-flex u-row-between desc-title">
              <text class="title-left">剧情简介</text>
              <text
                class="u-relative u-margin-right-26 title-right"
                :class="{ 'arrow-bottom': hasExpandDesc }"
                v-show="showExpandDescBtn"
                @click="toggleExpandDesc"
              >
                {{ hasExpandDesc ? '收起' : '展开' }}
              </text>
            </view>
            <view class="desc-text" :class="{ 'u-line-3': !hasExpandDesc }">
              <text class="text">{{ data.introduction }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="u-flex pool-detail" @click="openPoolRuleDesc()" v-if="data.poolRuleDescMap.length">
      <view class="u-flex u-row-center pool-text u-skeleton-rect">可拼场</view>
      <view class="u-flex-col u-flex-1 pool-tips u-skeleton-rect">
        <view class="u-flex single-tip">
          <view class="dot">.</view>
          <view class="tip">
            部分场次1人起拼，满{{ data.advicePeopleMin }}人即可开场，每场最多{{
              data.advicePeopleMax
            }}人
          </view>
        </view>
        <view class="u-flex single-tip">
          <view class="dot">.</view>
          <view class="tip">未拼成前随时退，拼成后不可退款</view>
        </view>
      </view>
      <u-icon name="arrow-right" custom-prefix="custom-icon" size="20"></u-icon>
    </view>
    <view class="u-flex u-flex-wrap theme-icon" :style="{ '--skull-bg-image': skullBgImage }">
      <view
        class="u-flex u-flex-col u-col-center theme-icon-item u-skeleton-fillet"
        v-for="(icon, index) in data.iconTagList"
        :key="index"
      >
        <img :src="data.iconMaps[icon]" alt />
        <view class="u-margin-top-18 icon-name">{{ icon }}</view>
      </view>
    </view>
    <view class="u-padding-30 theme-shop link" v-if="data.shopInfo">
      <view class="u-flex u-row-between title common u-skeleton-fillet">门店信息</view>
      <view
        class="u-relative u-padding-top-30 u-padding-bottom-30 u-flex u-row-between description"
      >
        <view>
          <view class="u-line-1 name u-skeleton-fillet">
            {{ data.shopInfo.shopName }}
          </view>
          <view class="u-margin-top-6 star u-skeleton-fillet">
            <u-rate
              :count="5"
              v-model="data.shopInfo.star"
              disabled
              active-color="#ea120e"
              active-icon="star-fill"
              inactive-icon="star"
              gutter="0"
            ></u-rate>
          </view>
        </view>
        <text class="u-absolute phone-line"></text>
        <navigator
          class="u-margin-right-20 phone u-skeleton-circle"
          @click="makePhoneCall()"
        ></navigator>
      </view>
      <view class="u-flex u-row-between u-padding-top-30 location" @click="openLocation()">
        <view class="u-flex u-skeleton-rect">
          <u-icon name="map" color="#bbb" size="32"></u-icon>
          <text class="u-relative u-margin-left-20 u-line-1 address">
            {{ data.shopInfo.address }}
          </text>
        </view>
        <u-icon name="arrow-right" custom-prefix="custom-icon" size="20"></u-icon>
      </view>
    </view>
    <view class="u-padding-30 theme-ugc" v-if="data.commits.length">
      <view class="u-flex u-row-between title common u-skeleton-fillet" @click="goToCommitList()">
        当前主题评价({{ data.commitCount }})
        <u-icon name="arrow-right" custom-prefix="custom-icon" size="20"></u-icon>
      </view>
      <view class="u-margin-top-20 ugc-content">
        <view
          class="u-flex u-col-top ugc-review"
          v-for="(commit, index) in displayCommits"
          :key="index"
        >
          <view class="u-margin-right-20 review-avatar">
            <u-avatar :src="commit.avatar"></u-avatar>
          </view>
          <view class="review-content">
            <view class="u-flex u-row-between user-info">
              <view class="u-flex info-left">
                <text class="username">{{ commit.username }}</text>
                <image class="u-margin-left-2 user-lv" :src="commit.lv" mode="scaleToFill" />
              </view>
            </view>
            <view class="review-time">{{ commit.time }}</view>
            <view class="u-flex u-margin-top-8 review-star">
              <text class="u-margin-right-6 star-txt">打分：</text>
              <u-rate
                :count="5"
                v-model="commit.star"
                disabled
                active-color="#ea120e"
                active-icon="star-fill"
                inactive-icon="star"
                gutter="0"
              ></u-rate>
            </view>
            <view class="u-line-2 u-margin-top-14 recommend">{{ commit.recommend }}</view>
            <view class="review-pics">
              <view
                class="pic"
                v-for="(pic, i) in commit.pics"
                :key="i"
                @click="previewImage(pic, commit.pics)"
              >
                <u-lazy-load
                  :image="pic"
                  height="174"
                  threshold="300"
                  img-mode="scaleToFill"
                ></u-lazy-load>
              </view>
            </view>
          </view>
        </view>
        <view class="ugc-line"></view>
      </view>
      <view
        class="u-flex u-row-between u-margin-top-30 ugc-more u-skeleton-fillet"
        @click="goToCommitList()"
      >
        查看全部网友点评
        <u-icon name="arrow-right" custom-prefix="custom-icon" size="20"></u-icon>
      </view>
    </view>
    <view class="theme-detail link">
      <view class="detail">
        <view class="u-margin-bottom-20 title common u-skeleton-fillet">主题描述</view>
        <view class="theme-description">【写在前面】</view>
        <view class="theme-description" v-for="(desc, index) in data.descriptionList" :key="index">
          {{ desc }}
        </view>
        <view class="theme-description">【故事背景】</view>
        <view class="theme-description">{{ data.introduction }}</view>
        <view>
          <u-lazy-load
            class="u-margin-bottom-20 pic"
            v-for="(url, index) in data.detailPicList"
            :key="index"
            :image="url"
          ></u-lazy-load>
        </view>
      </view>
    </view>
    <view class="rules">
      <view class="u-margin-bottom-20 title common u-skeleton-fillet">购买须知</view>
      <view class="u-margin-bottom-20 buy-rules">
        <view class="u-margin-bottom-8 rule-name u-skeleton-rect">预订须知</view>
        <view class="u-relative u-margin-left-14 rule-content">无需提前入场</view>
      </view>
      <view class="u-margin-bottom-20 buy-rules u-skeleton-rect">
        <view class="u-margin-bottom-8 rule-name">温馨提示</view>
        <view class="u-relative u-margin-left-14 rule-content">
          为了保障您的权益，建议使用线上支付。若使用其他支付方式导致纠纷，本公司不承担任何责任，感谢您的理解和支持！
        </view>
        <view class="u-relative u-margin-left-14 rule-content">
          温馨提醒：您在到店使用本商品/服务期间，如涉及潜水、骑马、滑雪、热气球、游艇等项目，请关注商家的安全提示内容，了解相关注意事项，做好安全防护措施，保护您的安全。
        </view>
      </view>
    </view>
    <u-gap height="104"></u-gap>
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
        <u-button
          shape="circle"
          :ripple="true"
          :custom-style="customStyle"
          @click="openChooseSession()"
        >
          <text class="btn-text">选择场次并预订</text>
        </u-button>
      </view>
    </view>
    <u-skeleton :loading="loading" :animation="true" bgcolor="#FFF"></u-skeleton>
    <!-- 拼场规则弹框 -->
    <u-popup
      v-model="showPoolRuleDesc"
      mode="bottom"
      :safe-area-inset-bottom="true"
      :border-radius="40"
      :closeable="true"
    >
      <view class="u-flex-col pool-rule-desc">
        <view class="u-flex u-row-center u-padding-left-30 u-padding-right-30 title">
          <text>拼场规则</text>
        </view>
        <view
          class="u-margin-bottom-40 content"
          v-for="(rule, index) in data.poolRuleDescMap"
          :key="index"
        >
          <view class="content-title">{{ rule.label }}</view>
          <view
            class="u-margin-top-10 content-info"
            v-for="(info, index) in rule.value"
            :key="index"
          >
            {{ info }}
          </view>
        </view>
        <view class="btn">
          <u-button
            shape="circle"
            :custom-style="customStyle"
            @click="this.showPoolRuleDesc = false"
          >
            我知道了
          </u-button>
        </view>
      </view>
    </u-popup>
    <!-- 选择预定场次弹框 -->
    <u-popup
      v-model="showChooseSession"
      mode="bottom"
      :safe-area-inset-bottom="true"
      :closeable="true"
    >
      <view class="u-padding-top-20 choose-session">
        <view class="u-flex u-row-center title">
          <text class="gray-line"></text>
          选择预订场次
          <text class="gray-line"></text>
        </view>
        <view class="week">
          <date-slide-selection
            v-if="showChooseSession"
            :date="date"
            :length="15"
            @change="dateChange"
          ></date-slide-selection>
        </view>
        <view class="main">
          <scroll-view scroll-y="true" class="session-list" v-if="displaySession.length">
            <view
              class="u-flex u-margin-bottom-20 u-padding-left-30 u-padding-right-30 session"
              v-for="(session, index) in displaySession"
              :key="index"
              :class="{
                disabled: session.disabled,
                selected: chosenSession && session.uniqueId === chosenSession.uniqueId,
              }"
              @click="chooseSession(session)"
            >
              <view class="u-flex-1 info">
                <view class="u-flex info-content">
                  <text class="u-margin-right-12 info-time">{{ session.time }}</text>
                  <text class="info-joint" v-show="data.blockBooking === 1 && !session.timeout">
                    可包场/拼场
                  </text>
                  <text class="info-joint" v-show="data.blockBooking === 0 && !session.timeout">
                    可拼场
                  </text>
                  <text class="info-joint" v-show="session.timeout">已结束</text>
                </view>
                <view
                  class="u-line-1 tip"
                  v-show="
                    !session.disabled &&
                    session.currentPeople &&
                    data.advicePeopleMin - session.currentPeople > 0
                  "
                >
                  已加入{{ session.currentPeople }}人，差
                  <text class="high-light">
                    {{ data.advicePeopleMin - session.currentPeople }}
                  </text>
                  人可开场，最多再加入{{ data.advicePeopleMax - session.currentPeople }}人
                </view>
                <view
                  class="u-line-1 tip"
                  v-show="
                    !session.disabled &&
                    session.currentPeople &&
                    data.advicePeopleMin - session.currentPeople <= 0
                  "
                >
                  已开场，最多再加入
                  <text class="high-light">{{ data.advicePeopleMax - session.currentPeople }}</text>
                  人
                </view>
              </view>
              <view class="price">
                ¥{{ session.price }}/人
                <text v-show="session.disabled && !session.timeout">订满</text>
              </view>
            </view>
          </scroll-view>
          <view v-if="!displaySession.length" class="u-text-center empty">
            <view class="empty-icon"></view>
            <view class="empty-text">暂无可订场次</view>
          </view>
        </view>
        <view class="btn-container">
          <view class="choosed" v-show="!chosenSession">尚未选择预订场次</view>
          <view class="choosed" v-show="chosenSession">
            <view>
              预订场次：
              <text class="choosed-msg">{{ chosenSession.date }} {{ chosenSession.time }}</text>
            </view>
            <view v-show="data.blockBooking === 0 && chosenSession.currentPeople">
              已加入玩家：
              <text>{{ chosenSession.currentPeople }}人</text>
            </view>
          </view>
          <view class="btn" :class="{ disabled: !chosenSession }">
            <u-button
              shape="circle"
              :custom-style="customStyle"
              :disabled="!chosenSession"
              @click="goToOrder()"
            >
              下一步
              <text v-show="!chosenPeople">，选择人数</text>
            </u-button>
          </view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import defaultThumb from '@/static/image/bg_login.png';
import { timeFmt } from '@/common/js/utils/time-fmt';
import style from '../../common/style/variable.scss';
import { fileUrl } from '../../common/js/config';
export default {
  onLoad(options) {
    this.productId = +options.productId;
    const currentTabPage = uni.getStorageSync('current_tab_page') || 'play';
    const { peopleFrom } = uni.getStorageSync(currentTabPage + '_filter_data') || {};
    this.chosenPeople = !!peopleFrom;
    this.getDetail();
    this.getCommits();
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
      data: {
        headPicUrl: defaultThumb,
      },
      showExpandDescBtn: false,
      hasExpandDesc: false,
      customStyle: {
        backgroundColor: style.themeColor,
        color: style.textCommonColor,
        height: '74rpx',
        lineHeight: '74rpx',
      },
      showPoolRuleDesc: false,
      showChooseSession: false,
      date: null,
      displaySession: [],
      chosenSession: null,
      chosenPeople: true,
      backgroundImage: fileUrl + 'background_image.png!d1',
      skullBgImage: `url(${fileUrl}skull_bg_image.png!d1)`,
    };
  },
  computed: {
    displayCommits() {
      let commits = this.data.commits || [];
      commits = commits.length >= 2 ? commits.slice(0, 2) : commits;
      const res = JSON.parse(JSON.stringify(commits)).map(c => {
        if (c.pics.length > 3) {
          c.pics.length = 3;
        }
        return c;
      });
      return res;
    },
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
          this.setDescTextBtn();
        })
        .catch(err => console.error(err));
    },
    getCommits() {
      if (this.productId == null) {
        return console.warn('There is no productId');
      }
      this.$u.api
        .getProductCommits({
          productId: this.productId,
          pageNum: 1,
          pageSize: 2,
        })
        .then(data => {
          const commits = data.records || [];
          this.data.commits = commits.map(({ content, reviewTime }) => {
            return {
              username: content.userNickName,
              lv: content.userLevel,
              time: timeFmt(reviewTime, 'YYYY年MM月DD日'),
              avatar: content.userHeadPic,
              pics: (content.pics || []).map(pic => pic.picUrl),
              recommend: content.title,
              star: content.accurateStarValue,
            };
          });
          this.data.commitCount = data.total;
          console.log('commits', this.data.commits);
        })
        .catch(err => console.error(err));
    },
    setDescTextBtn() {
      this.$nextTick(() => {
        const query = uni.createSelectorQuery().in(this);
        const descTextView = query.select('.desc-text .text');
        descTextView
          .boundingClientRect(({ height }) => {
            this.showExpandDescBtn = height > 17 * 3; // px
          })
          .exec();
      });
    },
    toggleExpandDesc() {
      this.hasExpandDesc = !this.hasExpandDesc;
    },
    makePhoneCall() {
      const { phoneNumberList } = this.data.shopInfo || {};
      uni.makePhoneCall({
        phoneNumber: phoneNumberList[0],
      });
    },
    openLocation() {
      const { latitude, longitude, shopName } = this.data.shopInfo || {};
      uni.openLocation({
        latitude,
        longitude,
        name: shopName,
        success: res => {
          console.log('openLocation success:', res);
        },
        fail: err => console.error(err),
      });
    },
    openPoolRuleDesc() {
      this.showPoolRuleDesc = true;
    },
    openChooseSession() {
      this.date = null;
      this.chosenSession = null;
      this.showChooseSession = true;
      this.handleDisplaySession();
    },
    dateChange(e) {
      this.date = e;
      // this.chosenSession = null;
      this.handleDisplaySession(e);
    },
    handleDisplaySession(date) {
      let { rooms, advicePeopleMax } = this.data || {};
      rooms = rooms || {};
      date = date || Date.now();
      date = timeFmt(date, 'MM-DD');
      const res = rooms[date] || [];
      this.displaySession = res.map(room => {
        const timeout = new Date(room.roomEndTime.replace(/-/g, '/')).getTime() <= Date.now();
        return {
          time: `${timeFmt(room.roomBeginTime, 'HH:mm')}-${timeFmt(room.roomEndTime, 'HH:mm')}`,
          date: `${timeFmt(this.date, 'dddd')}(${timeFmt(this.date, 'MM-DD')})`,
          disabled: room.status === '2' || room.currentPeople >= advicePeopleMax || timeout,
          timeout,
          ...room,
        };
      });
    },
    chooseSession(session) {
      if (session.disabled) {
        return;
      }
      this.chosenSession = session;
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
    salesFmt(sales) {
      if (sales >= 10000 && sales < 10000 * 10000) {
        return parseFloat((sales / 10000).toFixed(1)) + '万';
      }
      if (sales >= 10000 * 10000) {
        return parseFloat((sales / (10000 * 10000)).toFixed(1)) + '亿';
      }
      return sales;
    },
    previewImage(index, pics) {
      uni.previewImage({
        current: index,
        urls: pics,
      });
    },
    goToCommitList() {
      uni.navigateTo({
        url: '/subPackages/commit/index?productId=' + this.productId,
      });
    },
  },
};
</script>

<style lang="scss">
@import '../../common/style/variable.scss';
.container {
    min-height: 100%;

    background: $background-color var(--background) no-repeat bottom / 100%;
}
.bg {
    overflow: hidden;
    &-img {
        z-index: 1;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;

        overflow: hidden;

        transform: scale(1.2);

        opacity: 1;
        background-color: $background-color;
        background-size: 100% 100%;

        filter: blur(40rpx);
    }
    .theme-info {
        z-index: 99;
        .theme-content {
            align-items: stretch;
            .head-pic {
                width: 226rpx;
                height: 302rpx;

                border-radius: 6rpx;
                background-repeat: no-repeat;
                background-size: 100% 100%;
                box-shadow: 0 4rpx 20rpx rgba(0,0,0,.2);

                flex-shrink: 0;
            }
            .theme-base {
                font-size: 26rpx;
                font-weight: 400;

                width: 440rpx;

                color: #fff;
                .title {
                    font-size: 38rpx;
                    font-weight: 600;

                    min-height: 38rpx;

                    color: #fff;
                }
                .level {
                    .label {
                        opacity: .6;
                    }
                }
                .theme-tag {
                    opacity: .6;
                    .tag-item:not(:nth-child(1)):before {
                        position: relative;
                        top: 2rpx;

                        display: inline-block;

                        width: 2rpx;
                        height: 20rpx;
                        margin: 0 12rpx;

                        content: '';

                        background-color: hsla(0,0%,100%,.3);
                    }
                }
                .theme-style {
                    overflow: hidden;

                    height: 36rpx;

                    opacity: .6;
                    .style-tag:after {
                        position: relative;
                        top: 2rpx;

                        display: inline-block;

                        width: 2rpx;
                        height: 20rpx;
                        margin: 0 12rpx;

                        content: '';

                        background-color: hsla(0,0%,100%,.3);
                    }
                }
                .price {
                    &-num {
                        font-size: 38rpx;
                        font-weight: 500;

                        color: $theme-color;
                    }
                    &-desc {
                        font-size: 26rpx;

                        opacity: .6;
                    }
                }
                .book-num {
                    font-size: 26rpx;

                    opacity: .6;
                }
            }
        }
        .theme-desc {
            font-size: 26rpx;
            font-weight: 400;

            box-sizing: border-box;
            width: 100%;

            opacity: .6;
            color: #fff;
            border-radius: 8rpx;
            background: rgba(0,0,0,.2);
            .desc-title {
                font-size: 30rpx;
                .title-right {
                    font-size: 26rpx;
                    &:after {
                        position: absolute;
                        top: 45%;
                        right: -50%;

                        width: 20rpx;
                        height: 12rpx;

                        content: '';
                        transform: translateY(-46%);

                        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAALCAYAAAByF90EAAAABGdBTUEAALGPC/xhBQAAAJ5JREFUKBWNkkESgyAMRUnHM3TXM7jz/uvuPIM7LkHzbGCgmtDMIDH/56EZpJQiKaWnLiKLSPmm8fO3b1E7kM3aDjXsM5hBVu15Wd/7YUndEFYz1tqw30BOHVDWdXRuF+ZA6M3MJwWG9pszzwmawdA1+pnwzpe0gxoIJTgVuQ6WfIBQGEAUHBhSjQsE4QKiGMBuIS7IgbmQENTB/rr1H8jPVeRH7I9YAAAAAElFTkSuQmCC) 50% no-repeat;
                        background-size: 100% 100%;
                    }
                    &.arrow-bottom:after {
                        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAARCAYAAAAsT9czAAAABGdBTUEAALGPC/xhBQAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAG6ADAAQAAAABAAAAEQAAAACfd25iAAAA8klEQVQ4Ea2UQQrCQAxFO1VcFRHP4BUKvf+q4NqdeAQX0pUg4/8yGdJqp0kxEDIt+f+102mqyhkxxi3ywOqUVsEjAOCI/ha5Qz6R5xDCHdUUZlgCdXDdKOcX1r0VaILNgIRpBi7CFkAuYBFmBJmBtXROawHEbbsgWXXwW3ZJp+/n9U/YAogH4gaHHukCfm2jAZSPuqeXrzeCecU08GgyzCMiRIdV+4FZmzVgurZ41GjijOMI0pOBXuaflc1piswdmpYcnsYGyVmnwwUSYQFI/4awAcmhKrEKJOIZIP0H+WZ7XJyS4ArBQ8RrK7bt756uZ3kDcnSQPDzQU3sAAAAASUVORK5CYII=) 50% no-repeat;
                        background-size: 100% 100%;
                    }
                }
            }
            .desc-text {
                font-size: 26rpx;

                white-space: pre-wrap;
            }
        }
    }
}
.pool-detail {
    position: relative;

    box-sizing: border-box;
    width: 100%;
    height: 120rpx;
    padding: 24rpx 55rpx;
    &:after {
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;

        display: block;

        height: 4rpx;

        content: '';
        transform: translateY(-50%);

        background: url(data:image/png;base64,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) no-repeat center / 100%;
    }

    .pool-text {
        font-size: 20rpx;
        line-height: 20rpx;

        padding: 5rpx 12rpx;

        color: #171715;
        border-radius: 20rpx;
        background: $theme-color;
    }
    .pool-tips {
        font-size: 20rpx;
        font-weight: 400;
        line-height: 32rpx;

        min-width: 0;
        margin-left: 20rpx;

        color: #666;
        .single-tip {
            .dot {
                margin: -6rpx 8rpx 8rpx 0;
            }
            .tip {
                color: #808080;
            }
        }
    }
}
.theme-icon {
    padding: 27rpx 56rpx 90rpx;

    background: var(--skull-bg-image) no-repeat left 200rpx / 90%;
    &-item {
        width: 25%;
        height: 90rpx;
        &:nth-child(n+5) {
            margin-top: 48rpx;
        }
        img {
            width: 50rpx;
            height: 50rpx;
        }
    }
    .icon-name {
        font-size: 22rpx;
        font-weight: bold;

        color: #fff;
    }
}
.theme-shop {
    margin: 0 25rpx 16rpx;

    border-radius: 20rpx;
    background: #fff;
    .description {
        border-bottom: 1px solid #e1e1e1;
        .name {
            font-size: 26rpx;
            font-weight: 700;

            max-width: 540rpx;

            color: #111;
        }
        .phone-line {
            right: 18%;

            width: 2rpx;
            height: 42rpx;

            transform: scaleX(.5);

            background: #e1e1e1;
        }
        .phone {
            width: 40rpx;
            height: 40rpx;

            background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAArCAMAAADWg4HyAAAClFBMVEUAAAAAAACAgACqqgC/gED/v0DMmTPVqirfn0D/v0Djqjn/xjnmszPouS7/uUbqqkD/v0DrsTv/tjfuqjPvv0DwwzzjuDnxuEfms0Dntj3ouTrzuUb0vEPqtUD0v0D1uD31ukXss0L2vULttkD2v0D2uT7uu0T3u0TvvULvt0D3v0DwuT7wvEPptkLwvULxuEDxuj7yt0HyvkHss0Dttj3zvEPzvkHuuUDuvEPvuEHvukDvu0TwuELwvULxvD/xvEPxuELxuUHxu0DyvEPyuULuukHyukHuu0Dyu0DzukHvuEPwuULwvEDwukLxu0HxukHuu0Hxu0HyuULvuUDvuUPwu0HxuUPxu0HuukPxukPvukLxukLvukLvuUHvu0HwuUDwukLwuELwuUPwukLxukPvuULxuULvukPxukPvu0LvuUHvukPvukPwuUHwuUHwu0LxuULxu0LxuULvukHvuULwuULwukPwukPwu0LwukLwuUPwukLxukPvuULvukLvuULvukLwuUPwuULwukLwuUPwukLvuELvukLxukPxuUPvukLvuUPwukLwuUPwuUPvukLwukLwukLvuUPvukLxukLvukLvuULvukPwuULwuUPwuULvukLvuULwukLwuULwukPvukLvuULvuULvukHvuULwuULwuUPwuULwukPwukPwuULvuULwukPvukPwukPvuULwuULvukPvukLvukPwuULwuULwukPwukPwuULwuULwukPwuULvukPvuUPvuULvukLvukPvuUPwuULwukPwukPwuULwukLwukLwukPwuUPwukPwukLvukPwukPvuUPvukLvukPvuUPvukLwukLwuUPwukPwuUPwukLwukLwuUPwukLwukO/RUL/AAAA23RSTlMAAQIDBAQFBggICQkKCwsMDA0ODxAREhIUFRYWFxgYGRobGxwcHR4eHyAgISIjIyQlJycoKiorLC4vMDEyMjU1Njc4OTo7Ozw8P0FCREZHSktLTVBQVlhaXFxdXWBiYmNkZWZoa21tb29wcXJzdXl7fH+AgYOEhYaHiIqMjY+QkpOZmpudnp+fn6GipKaorK2trrCxsbKztLa3uby9vb6/wMHCw8XGxsnKy8zNzs/P0NDS09XX2Nna29ze3+Hi4+Tl5ufo6err7Ozt7e/w8PHz9PX29/j4+fr7/P6K5zKPAAAC/0lEQVQYGY3Bi2OVcwDH4e/ZmVazpKh1ijWvXKfX3IpGhIiESTRCZm4r11m5tdxDK5ehMKxcKnJ5ybzr8qY4U2Jta2rnfP4Zv/d9z7FzTuvM8yg05oHm5vqx+j8qd2F0Xquh2dsI7K/UUGwPSGL8dLzym+oBzinnesCaiEKlLdu/eb/x+mOUZVoccGLSzEPAowo9TCD+bJkGFHcATkxGHZC4UYFaUnoeKVRaDeDEFFgF7KuQb/hznzj/EGibqJQX4PcJCo38EdhUoJTozKZ9GO4ZCr0O7ymtsguo1oBxTQmgvVSB5dCm/9wDNMqYvG7rR8/MkHRTF7AuIt8i6C1WWjXQKGMZvvXTpapuYKF8U4DblWJ7wC0yniDQVyPNS8LuYvm+gy8UsnYAW6Iyxr24YQ9Gcp60GrhPvgeB6+SzXMA7W2mzNwIHJumsw7BZvtH7YWNE0uh2wLM1oOgt4GVpLWDJ9yRQI+k2oNNWppHboGeU7gTmy3dCHH4bK10F9F+sLHVAtS4EGhRYBLwm6V3g62HKdAGwREX98JICBV8Bt0pn9gBLlWlUEpZKf8ArCp13EDrLpSVAYq4yvc3By6QmEtVKqQc2FCraBuytUIaCa06VccU5Sot8CDwvndYJbD1ReU3YCdwhzUkAXx6rvC7vg77ZUi3G52OUV00S9p4vNWB8O0kpVz507zQd4SlgpyU9jeFdKt/ENiDZUqockVcBt0xqwOhdKMlyCWyvUo5oC+BYUm0CY+Vxlgv0Y/QuUI7iVsCtkObEMX52AefkWXswVgxTtpJW4NdLpMmfEXJiUvkmjPUnKVtJK9A1VypY3I3hxGQMfxNj11RlK/kASNwv6fR34IeYQosTQIdyFL2BsXKEpBnzS5R2w5+AckWWYXxfqWzTAR3p7kPAgbuU5SJAg7h6N8bacg2wXECDKfsU46+6QqVYLtCuQUUfO4zh3KyA5QKeraOo2oJv84IRkuUCnq2jKqz/G1/3x81xwLOVz/jlvaR5toYw/vEOAr/YMv4FsMUA5U6MECwAAAAASUVORK5CYII=) no-repeat;
            background-size: contain;
        }
    }
    .location {
        .address {
            font-size: 26rpx;

            width: 500rpx;
        }
    }
}
.theme-ugc {
    margin: 0 25rpx 35rpx;

    border-radius: 20rpx;
    background: #fff;
    .ugc-content {
        .review-avatar {
            height: 90rpx;
        }
        .user-info {
            .username {
                font-size: 26rpx;
                font-weight: 500;

                color: #222;
            }
            .user-lv {
                width: 54rpx;
                height: 28rpx;
            }
        }
        .review-time {
            font-size: 22rpx;
            font-weight: 400;

            color: #777;
        }
        .review-star {
            .star-txt {
                font-size: 26rpx;

                color: #111;
            }
        }
        .recommend {
            font-size: 26rpx;
            font-weight: 400;
        }
        .review-pics {
            display: inline-flex;
            overflow: hidden;

            width: 100%;
            margin: 14rpx 0 20rpx;

            border-radius: 20rpx;
            .pic {
                image {
                    display: block;

                    width: 174rpx;
                    height: 174rpx;
                }
            }
            .pic + .pic {
                margin-left: 7rpx;
            }
        }
        .ugc-line {
            width: 100%;
            height: 2rpx;

            transform: scaleY(.5);

            opacity: .5;
            background: #e1e1e1;
        }
    }
    .ugc-more {
        font-size: 26rpx;
        font-weight: 400;

        color: #111;
    }
}
.theme-detail {
    margin: 0 25rpx 16rpx;

    border-radius: 20rpx;
    background: #fff;
    .detail {
        padding: 30rpx;
        .theme-description {
            font-size: 28rpx;
            font-weight: 400;

            margin-bottom: 30rpx;

            white-space: pre-wrap;

            opacity: .8;
            color: #111;
        }
        .pic {
            display: block;

            width: 100%;
        }
    }
}
.rules {
    margin: 0 25rpx 375rpx;
    padding: 30rpx 24rpx;

    border-radius: 20rpx;
    background: #fff;
    .buy-rules {
        .rule-name {
            font-size: 26rpx;
            font-weight: 400;

            color: #777;
        }
        .rule-content {
            letter-spacing: 0;

            color: #111;
            &:before {
                position: absolute;
                top: 16rpx;
                left: -16rpx;

                width: 6rpx;
                height: 6rpx;

                content: '';

                border-radius: 50%;
                background: #999;
            }
        }
    }
}
.link {
    position: relative;
    &:before,
    &:after {
        position: absolute;
        bottom: -42rpx;

        display: block;

        width: 14rpx;
        height: 60rpx;

        content: '';

        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAA8CAYAAABW+ot3AAACbElEQVRIid2XP2gVQRDGf3cvxn+NJpWoKKKFnU9Qg4VoVARLwcruLfZaiq3a2tltLRZavC42SSMqwiNFCNgogqCVJujT/JGczGMGlvNu3+0JFg4c7O3Nt/PtzOzyXdbr9QgsAyaB3cB2YBMYAmtAETpOBONtwBHgEnAO2AesAq+AOWAZ+FEGCug0cBc4D+wIFrwKXAMeAM+BbzKZFUWBc+4Y8BC4qBSFcmhCcxG4Dbz03m/kzjlxnAVmakDo3AngCrBHJnJgF3BG6VWBQvApYK9zLst1f1NAJwIym7IAAvwFfAW2GgDFb92oSopfa63G2RvgiyQr1xXmtV7rEeCi1nPVe190BoMB/X5favMOOAQcLDWGge4BL7z3oyYY1VHMOTepnSMplz48DnwCngBPgSXv/dBWym0gRQXeyhB4BqwAC8Aj3dswpJCHL8Id+KlOW5q4taqM5+WJpt/rPsQ6KAoUapk2d1HlUAcUZ9tXZfQY1TyImgQs2lI1iklUDVxrMWC0JHXAcD6JqpTC9ll5wGNZtcxW+oxLTnIdoxkdF5FSPRsBW5+OEJiUVTtWWWpWLWJyk9eWIYVqclZbn46oNWmApIhh7ZKz2opqeN8k3zmtIv41sNW9SixJTW65JAerY20DTDjnwvdMZZnITll0pz6j3g19O91u18aisI4C14EbwAFgWhda0WezDDTZeR+4CexXySKC76xquM/AR2Aj3ONh4A5woUIMik9XtexJVdCjyX8nO009/s+y04DSVu/190BEXxXYZOfAvpsulaIKjVvA5dIPi2xDIi2FCjIUtCY7PwCPg1+k738oSOA3mCSyMcoPTx8AAAAASUVORK5CYII=);
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }
    &:before {
        left: 92rpx;
    }
    &:after {
        right: 92rpx;
    }
}
.theme-submit {
    position: fixed;
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
        .btn-text {
            font-size: 36rpx;
            font-weight: bold;

            letter-spacing: 8rpx;

            color: #fff;
            text-shadow: 0 0 7px #7c2f00;
        }
    }
}
.common.title {
    font-size: 34rpx;
    font-weight: 700;

    color: #111;
}
.pool-rule-desc {
    padding: 35rpx 30rpx;
    .title {
        font-size: 32rpx;
        font-weight: 600;

        color: #111;
    }
    .content {
        &-title {
            font-size: 26rpx;

            color: #999;
        }
        &-info {
            font-size: 26rpx;
            line-height: 36rpx;

            color: #333;
        }
    }
}
.choose-session {
    .title {
        font-size: 28rpx;
        line-height: 60rpx;

        height: 64rpx;
        padding: 0 20rpx;

        color: #999;
        background-color: #fff;
        .gray-line {
            width: 100rpx;
            height: 2rpx;
            margin: 0 20rpx;

            background: #eeeef0;
        }
    }
    .week {
        width: 100%;
    }
    .main {
        box-sizing: border-box;
        height: 40vh;
        padding: 30rpx;
        .session-list {
            height: 100%;
        }
        .session {
            height: 120rpx;

            border: 1px solid #eeeef0;
            border-radius: 4rpx;
            &.selected {
                border: 1px solid $theme-color;
                background-color: #fff5f2;
            }
            &.disabled {
                background: #fafafa;
                .info-time,
                .info-joint,
                .price {
                    color: #ccc!important;
                }
            }
            .info {
                overflow: hidden;
                &-content {
                    flex-wrap: nowrap;
                }
                &-time {
                    font-size: 30rpx;

                    color: #666;
                }
                &-joint {
                    font-size: 24rpx;

                    color: #4ba418;
                }
                .tip {
                    color: #999;
                }
            }
            .price {
                font-size: 24rpx;

                white-space: nowrap;

                color: $theme-color;

                flex-shrink: 0;
            }
        }
        .empty {
            &-icon {
                width: 72rpx;
                height: 72rpx;
                margin: 100rpx auto 30rpx;

                background: url(data:image/png;base64,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) no-repeat;
                background-size: 100% 100%;
            }
            &-text {
                font-size: 28rpx;

                color: #999;
            }
        }
    }
    .btn-container {
        width: 100%;

        border-top: 1px solid #eeeef0;
        background-color: #fff;
        .choosed {
            font-size: 26rpx;

            padding: 30rpx;

            color: #999;
            &-msg {
                color: #333;
            }
        }
        .btn {
            padding: 20rpx 30rpx;
            &.disabled {
                opacity: .5;
            }
        }
    }
    .high-light {
        color: $theme-color;
    }
}

</style>