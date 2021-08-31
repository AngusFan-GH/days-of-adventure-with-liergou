<template>
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
</template>

<script>
export default {
  name: 'theme-describe',
  props: {
    data: null,
  },
  data() {
    return {
      showExpandDescBtn: false,
      hasExpandDesc: false,
    };
  },
  watch: {
    'data.introduction'(intro) {
      intro && this.setDescTextBtn();
    },
  },
  methods: {
    salesFmt(sales) {
      if (sales >= 10000 && sales < 10000 * 10000) {
        return parseFloat((sales / 10000).toFixed(1)) + '万';
      }
      if (sales >= 10000 * 10000) {
        return parseFloat((sales / (10000 * 10000)).toFixed(1)) + '亿';
      }
      return sales;
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
  },
};
</script>

<style lang="scss" scoped>
@import '../../../common/style/variable.scss';
.bg {
    overflow: hidden;
    &-img {
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

</style>