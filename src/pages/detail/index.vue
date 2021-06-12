<template>
  <view class="container u-skeleton safe-area-inset-bottom">
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
                    :count="5"
                    v-model="data.difficultLevel"
                    disabled
                    active-color="#f6be45"
                    active-icon="lock-fill"
                    inactive-icon="lock"
                    gutter="0"
                  ></u-rate>
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
                  <text class="price-num">¥{{ data.price }}</text>
                  <text class="u-margin-left-6 price-desc">起</text>
                </view>
                <view class="book-num">{{ data.sales }}人订过</view>
              </view>
            </view>
          </view>
          <view class="u-flex-col u-margin-top-20 u-padding-20 theme-desc u-skeleton-fillet">
            <view class="u-flex u-row-between desc-title">
              <text class="title-left">剧情简介</text>
              <text
                class="u-relative u-margin-right-26 title-right"
                :class="{ 'arrow-bottom': hasExpandDesc }"
                v-if="showExpandDescBtn"
                @click="toggleExpandDesc"
              >
                {{ hasExpandDesc ? '收起' : '展开' }}
              </text>
            </view>
            <view class="desc-text" :class="{ 'u-line-3': !hasExpandDesc }">
              {{ data.introduction }}
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="u-flex pool-detail">
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
      <view class="arrow-right"></view>
    </view>
    <view class="u-flex u-flex-wrap theme-icon">
      <view
        class="u-flex theme-icon-item u-skeleton-fillet"
        v-for="(icon, index) in data.iconTagList"
        :key="index"
      >
        <img :src="data.iconMaps[icon]" alt />
        <view class="u-margin-left-10 icon-name">{{ icon }}</view>
      </view>
    </view>
    <u-gap height="20" bg-color="#f6f6f6"></u-gap>
    <view class="u-padding-30 theme-shop" v-if="data.shop">
      <view class="u-flex u-row-between title common u-skeleton-fillet">门店信息</view>
      <view
        class="u-relative u-padding-top-30 u-padding-bottom-30 u-flex u-row-between description"
      >
        <view>
          <view class="u-line-1 name u-skeleton-fillet">
            {{ data.shop.name }}
          </view>
          <view class="u-margin-top-6 star u-skeleton-fillet">
            <u-rate
              :count="5"
              v-model="data.shop.level"
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
        <view class="u-flex dp-address u-skeleton-rect">
          <u-icon name="map" color="#bbb" size="32"></u-icon>
          <text class="u-relative u-margin-left-20 u-line-1 address">
            {{ data.shop.address }}
          </text>
        </view>
        <text class="arrow-right"></text>
      </view>
    </view>
    <u-gap height="20" bg-color="#f6f6f6"></u-gap>
    <view class="u-padding-30 theme-ugc" v-if="false">
      <view class="u-flex u-row-between title common u-skeleton-fillet">
        当前主题评价(3)
        <text class="arrow-right"></text>
      </view>
    </view>
    <u-gap height="20" bg-color="#f6f6f6"></u-gap>
    <view class="theme-detail">
      <view class="u-padding-30 detail">
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
      <u-gap height="20" bg-color="#f6f6f6"></u-gap>
      <view class="u-padding-30 rules">
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
    </view>
    <u-gap height="20" bg-color="#f6f6f6"></u-gap>
    <u-gap height="200" bg-color="#f6f6f6"></u-gap>
    <view class="theme-submit safe-area-inset-bottom">
      <view class="u-relative u-flex u-row-between notice">
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
      </view>
      <view class="btn-group">
        <u-button shape="circle" :custom-style="customStyle">选择场次并预订</u-button>
      </view>
    </view>
    <u-skeleton :loading="loading" :animation="true" bgcolor="#FFF"></u-skeleton>
  </view>
</template>

<script>
import defaultThumb from '@/static/image/bg_login.png';
export default {
  onLoad(options) {
    console.log(options);
    this.productItemId = +options.productItemId || 764556152;
    this.getDetail();
  },
  data() {
    return {
      productItemId: null,
      loading: true,
      data: {
        headPicUrl: defaultThumb,
      },
      showExpandDescBtn: false,
      hasExpandDesc: false,
      customStyle: {
        backgroundColor: '#f63',
        color: '#fff',
      },
    };
  },
  methods: {
    getDetail() {
      this.$u.api
        .getDetail(this.productItemId)
        .then(data => {
          console.log(data);
          const exec = /建议(.+)人/.exec(data.tipList[1])[1].split('-');
          // 临时获取人数上下限
          data.advicePeopleMin = exec[0];
          data.advicePeopleMax = exec[1] || exec[0];
          data.difficultLevel = data.difficultLevel / 10;
          // 临时店铺信息
          const shop = {
            name: '空白·沉浸式剧情推理桌游馆(总店)',
            address: '知春路108号豪景大厦C座1603',
            tel: '18519333232',
            level: 4,
            latitude: 39.97558,
            longitude: 116.321927,
          };
          data.shop = shop;
          this.data = data;
          this.loading = false;
          this.setDescTextBtn();
        })
        .catch(err => console.error(err));
    },
    setDescTextBtn() {
      this.$nextTick(() => {
        const query = uni.createSelectorQuery().in(this);
        const descTextView = query.select('.desc-text');
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
      const { tel } = this.data.shop || {};
      uni.makePhoneCall({
        phoneNumber: tel,
      });
    },
    openLocation() {
      const { latitude, longitude } = this.data.shop || {};
      uni.openLocation({
        latitude,
        longitude,
        name: this.data.shopName,
        success: res => {
          console.log('success', res);
        },
        fail: err => console.error(err),
      });
    },
  },
};
</script>

<style lang="scss">
.container {
    min-height: 100%;
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
                box-shadow: 0 4rpx 20rpx rgb(0,0,0 / 20%);

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

                        color: #ff7445;
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
    box-sizing: border-box;
    width: 100%;
    height: 120rpx;
    padding: 24rpx 30rpx;

    background: #f8f8f8;
    .pool-text {
        font-size: 20rpx;

        width: 78rpx;
        height: 36rpx;

        color: #4ca419;
        border-radius: 4rpx;
        background: rgba(102,192,122,.08);
    }
    .pool-tips {
        font-size: 24rpx;
        font-weight: 400;

        min-width: 0;
        margin-left: 20rpx;

        color: #666;
        .single-tip {
            .dot {
                margin: -6rpx 8rpx 8rpx 0;
            }
        }
    }
}
.theme-icon {
    padding: 20rpx 0 20rpx 40rpx;
    &-item {
        width: 33%;
        height: 90rpx;
        img {
            width: 46rpx;
            height: 46rpx;
        }
    }
    .icon-name {
        font-size: 26rpx;
        font-weight: 400;

        color: #111;
    }
}
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

        background: url('data: image/png;base64,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') no-repeat;
        background-size: contain;
    }
    .location {
        .address {
            font-size: 26rpx;

            width: 500rpx;
        }
    }
}
.theme-detail {
    .detail {
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
            color: #f63;
        }
        .join {
            font-size: 22rpx;

            color: #999;
        }
    }
    .btn-group {
        padding: 14rpx 30rpx;
    }
}

.common.title {
    font-size: 34rpx;
    font-weight: 700;

    color: #111;
}

.arrow-right {
    width: 22rpx;
    height: 22rpx;

    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAsCAYAAAAacYo8AAACwUlEQVRoQ+3ZPYgTQRQA4De7QfODQmYISAJWAQvFFFqKBM7zRBtTBE4RtBK1SOFPq3u2pxYpVKwURKw8C0XPHwhiqUXCCYIBo5KgLDMrFkkUd58M5HDZw8tls7uXAdNuGL7Mvrz35g0BRT9EUTeMBS+Xy3qtVtuZSqU+tlqt71Fugm84IhLG2CIiTgOAiMViJdM0X0WF9w1Pp9NbAeDTMpQQ0gOAkhBiMQq8b3ixWIw1Go0lRNzmgv7SNO0I5/xB2HjfcAkb7PpLAMi7oLamaSc453fDxI8Fl7BMJrPFtu3niLjDBUUAOGNZ1s2w8GPDJSyXy7Fer/cUEXe7oYSQC0KIK2HgA4FLGKV0MyI+BoA9HvycEMIIGh8YXMKy2Wyy3+8vIOJ+D/6aEOJckPhA4RKWz+c3cs7vA8BhD/5WpVI5bRiGE8QPCBwuUTJV1uv1OwBw1IO8VygUjtdqtd/j4kOBS5RhGFq1Wr2BiCc9yIeMsdlms/lzHHxo8GUUpfQqIp71hM2zeDxe6nQ6Xb/40OGDjDOHiBc9yNeEkENCiB9+8JHAB/jziDjvQb5NJpMz7Xabj4qPDC5h6XT6FABcB/jbThNC3um6vs80za+j4COFSxhj7JjjOLcBQHdBmwAwZVnW57XiI4cP8CXHcWSu37AMJYR80XV9yjTND2vBrwt8EPMzACCrbMKF/0YIKXLO3w/DrxtcwjKZzF7bth8h4iYX/okQ4uB/+LAdGPU5pVS9UGGMqffnVDId/qMALem6Pj2xBYhSuqLkE0LeJBKJAxNb8imlBiJeUqrJUq6tVfIgoeTRTcnDspLjiVUGQpeFEN6MMmqHsOL7gXSHcgTX7XbleHmX51A8uSO4wdDzBSJud6Ene+ip5Jh5lcH+LOd8YewgHrKA7xhX9ipF2csr+SaVvC4MO4aHre87xoctHPbzP8hhczwaPeppAAAAAElFTkSuQmCC);
    background-repeat: no-repeat;
    background-size: 100% 100%;
}

</style>