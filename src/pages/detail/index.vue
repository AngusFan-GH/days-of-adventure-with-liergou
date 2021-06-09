<template>
  <view class="container u-skeleton">
    <view class="theme-describe">
      <view class="u-relative bg">
        <view
          class="u-absolute bg-img"
          v-show="data.headPic"
          :style="{ backgroundImage: 'url(' + data.headPic + ')' }"
        ></view>
        <view class="u-flex-col u-col-center u-relative u-padding-30 theme-info">
          <view class="u-flex u-margin-top-30 theme-content">
            <view
              class="u-relative head-pic u-skeleton-fillet"
              :style="{ backgroundImage: 'url(' + data.headPic + ')' }"
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
                <text class="tag-item">{{ data.advicePeopleMin }}人起订</text>
                <text class="tag-item">
                  建议{{
                  data.advicePeopleMin !== data.advicePeopleMax
                  ? `${data.advicePeopleMin}-${data.advicePeopleMax}`
                  : `${data.advicePeopleMin}`
                  }}人
                </text>
                <text class="tag-item">{{ data.duration }}分钟</text>
              </view>
              <view class="u-flex u-flex-wrap u-margin-top-10 theme-style u-skeleton-rect">
                <text class="style-tag">{{ data.style }}</text>
                <text
                  class="u-margin-right-12 style-tags"
                  v-for="(tags, index) in data.tags"
                  :key="index"
                >{{ tags }}</text>
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
            <view class="u-flex u-row-between desc-title">剧情简介</view>
            <view class="desc-text">{{ data.desc }}</view>
          </view>
        </view>
      </view>
    </view>
    <view class="u-flex pool-detail u-skeleton-fillet">
      <view class="u-flex u-row-center pool-text">可拼场</view>
      <view class="u-flex-col u-flex-1 pool-tips">
        <view class="u-flex single-tip">
          <view class="dot">.</view>
          <view class="tip">部分场次1人起拼，满{{data.advicePeopleMin}}人即可开场，每场最多{{data.advicePeopleMax}}人</view>
        </view>
        <view class="u-flex single-tip">
          <view class="dot">.</view>
          <view class="tip">未拼成前随时退，拼成后不可退款</view>
        </view>
      </view>
      <view class="pool-icon"></view>
    </view>
    <u-skeleton :loading="loading" :animation="true" bgcolor="#FFF"></u-skeleton>
  </view>
</template>

<script>
import defaultThumb from '@/static/image/bg_login.png';
export default {
  onLoad(options) {
    console.log(options);
    this.productItemId = +options.productItemId || 696115513;
    this.getDetail();
  },
  data() {
    return {
      productItemId: null,
      loading: true,
      data: {
        headPic: defaultThumb,
      },
    };
  },
  methods: {
    getDetail() {
      this.$u.api
        .getCardList({
          pageNum: 1,
          pageSize: 1000,
          longitude: uni.getStorageSync('position').longitude,
          latitude: uni.getStorageSync('position').latitude,
        })
        .then(res => {
          const data = res.records.find(
            v => v.productItemId === this.productItemId
          );
          data.tags = data.tags.split(',');
          data.desc =
            '唐朝乃是歌舞盛华之朝，乐文取得了辉煌之成，同时也将女伎们的身价推向了巅峰，青楼之市火爆，歌舞伎成了热门之业，虽然沦落为青楼女子并不光彩，但依然有很多人选择这一职业，在这些女子中琴棋书画兼备的也大有人在……';
          this.data = data;
          console.log(this.data);
          this.loading = false;
        })
        .catch(err => console.error(err));
    },
  },
};
</script>

<style lang="scss">
@import '../../common/style/variable.scss';
.container {
    min-height: 100%;

    background-color: $background-color;
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
            }
            .desc-text {
                font-size: 26rpx;
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
    .pool-icon {
        width: 22rpx;
        height: 22rpx;

        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAsCAYAAAAacYo8AAACwUlEQVRoQ+3ZPYgTQRQA4De7QfODQmYISAJWAQvFFFqKBM7zRBtTBE4RtBK1SOFPq3u2pxYpVKwURKw8C0XPHwhiqUXCCYIBo5KgLDMrFkkUd58M5HDZw8tls7uXAdNuGL7Mvrz35g0BRT9EUTeMBS+Xy3qtVtuZSqU+tlqt71Fugm84IhLG2CIiTgOAiMViJdM0X0WF9w1Pp9NbAeDTMpQQ0gOAkhBiMQq8b3ixWIw1Go0lRNzmgv7SNO0I5/xB2HjfcAkb7PpLAMi7oLamaSc453fDxI8Fl7BMJrPFtu3niLjDBUUAOGNZ1s2w8GPDJSyXy7Fer/cUEXe7oYSQC0KIK2HgA4FLGKV0MyI+BoA9HvycEMIIGh8YXMKy2Wyy3+8vIOJ+D/6aEOJckPhA4RKWz+c3cs7vA8BhD/5WpVI5bRiGE8QPCBwuUTJV1uv1OwBw1IO8VygUjtdqtd/j4kOBS5RhGFq1Wr2BiCc9yIeMsdlms/lzHHxo8GUUpfQqIp71hM2zeDxe6nQ6Xb/40OGDjDOHiBc9yNeEkENCiB9+8JHAB/jziDjvQb5NJpMz7Xabj4qPDC5h6XT6FABcB/jbThNC3um6vs80za+j4COFSxhj7JjjOLcBQHdBmwAwZVnW57XiI4cP8CXHcWSu37AMJYR80XV9yjTND2vBrwt8EPMzACCrbMKF/0YIKXLO3w/DrxtcwjKZzF7bth8h4iYX/okQ4uB/+LAdGPU5pVS9UGGMqffnVDId/qMALem6Pj2xBYhSuqLkE0LeJBKJAxNb8imlBiJeUqrJUq6tVfIgoeTRTcnDspLjiVUGQpeFEN6MMmqHsOL7gXSHcgTX7XbleHmX51A8uSO4wdDzBSJud6Ene+ip5Jh5lcH+LOd8YewgHrKA7xhX9ipF2csr+SaVvC4MO4aHre87xoctHPbzP8hhczwaPeppAAAAAElFTkSuQmCC) no-repeat;
        background-size: cover;
    }
}

</style>