<template>
  <view class="list-card">
    <view
      class="u-flex shop"
      :style="{ '--background': backgroundImage ? 'url(' + backgroundImage + ')' : 'none' }"
      :class="{ hasScreening: data.screenings.length }"
      @click="goToDetail()"
    >
      <image
        class="u-margin-right-18 pic"
        :src="data.headPic || defaultThumb"
        mode="aspectFill"
      ></image>
      <view class="txt">
        <view class="u-flex u-row-between">
          <view class="u-flex-1 u-line-1 title">{{ data.productName }}</view>
          <view class="u-line-1 u-flex">
            <text class="u-margin-right-10 map"></text>
            <text class="distance">{{ distanceFmt(data.distance) }}</text>
          </view>
        </view>
        <view class="difficult desc u-flex u-margin-top-22 u-flex-nowrap">
          <view class="label">难度</view>
          <view class="star">
            <u-rate
              v-show="data.difficultLevel"
              :count="5"
              v-model="data.difficultLevel"
              disabled
              :active-color="styleVariable.difficultIconColor"
              active-icon="star-fill"
              inactive-icon="star"
              size="22"
              gutter="9"
            ></u-rate>
            <view v-show="!data.difficultLevel">有待探索</view>
          </view>
        </view>
        <view class="u-margin-top-16 u-margin-bottom-6 u-flex u-col-top desc attributes-list">
          <text class="label">类型</text>
          <view class="attributes-tag desc u-flex-1 u-flex u-flex-wrap">
            <text class="u-margin-bottom-10 u-margin-right-12 tag type">
              {{ data.style }}
            </text>
            <text
              class="u-margin-bottom-10 u-margin-right-12 tag"
              v-for="(tags, index) in data.tags"
              :key="index"
            >
              {{ tags }}
            </text>
          </view>
        </view>
        <view class="limit u-flex">
          <view class="desc">
            <text class="label">建议</text>
            <text class="u-margin-right-12 tag">
              {{
                data.advicePeopleMin !== data.advicePeopleMax
                  ? `${data.advicePeopleMin}-${data.advicePeopleMax}`
                  : `${data.advicePeopleMin}`
              }}人
            </text>
            <text class="tag">{{ data.duration }}分钟</text>
          </view>
          <view class="space u-flex-1"></view>
          <view class="book u-margin-top-16">{{ salesFmt(data.sales) }}人订过</view>
        </view>
      </view>
    </view>
    <view class="togather u-margin-top-18" v-if="data.screenings.length">
      <view v-for="(screening, index) in data.screenings" :key="index" class="screening">
        <card-screening :screening="screening" v-show="index < displayCount"></card-screening>
      </view>
      <!-- <view class="screening" v-if="!data.screenings || !data.screenings.length">暂无场次</view> -->
      <view
        class="u-flex u-row-center read-more"
        v-show="data.screenings.length > 1"
        @click="switchReadMoreStatus()"
      >
        <text class="u-margin-right-6 close-text">{{ closeText }}</text>
        <u-icon
          :name="step === 2 ? 'arrow-up' : 'arrow-down'"
          :color="style.textGrayColor"
          size="26"
        ></u-icon>
      </view>
    </view>
  </view>
</template>

<script>
import defaultThumb from '@/static/image/bg_login.png';
import cardScreening from '@/components/card-screening/card-screening.vue';
import style from '../../common/style/variable.scss';
import { fileUrl } from '../../common/js/config';
import getBackgroundImage from '../../common/model/bg-image';
export default {
  name: 'list-card',
  components: {
    cardScreening,
  },
  props: {
    data: {
      type: Object,
      default: {},
    },
  },
  watch: {
    data: {
      immediate: true,
      handler(data) {
        const len = data.screenings.length;
        this.step = len > 4 ? 0 : 1;
      },
    },
  },
  data() {
    return {
      defaultThumb,
      step: this.data.screenings.length > 1,
      styleVariable: style,
    };
  },
  computed: {
    closeText() {
      switch (this.step) {
        case 0:
          return '再看3场';
        case 1:
          return `查看全部${this.data.screenings.length}个场次`;
        case 2:
          return '收起';
      }
    },
    displayCount() {
      const len = this.data.screenings.length;
      switch (this.step) {
        case 0:
          return 1;
        case 1:
          return len > 4 ? 4 : 1;
        case 2:
          return len;
      }
    },
    backgroundImage() {
      return fileUrl + getBackgroundImage(this.data.tags);
    },
  },
  methods: {
    goToDetail() {
      uni.navigateTo({
        url: '/subPackages/detail/index?productId=' + this.data.productId,
      });
    },
    distanceFmt(distance) {
      if (distance < 10) {
        return '＜10m';
      }
      if (distance >= 10 && distance < 1000) {
        return distance + 'm';
      }
      if (distance >= 1000 && distance < 100000) {
        return (distance / 1000).toFixed(0) + 'km';
      }
      if (distance >= 10000) {
        return '＞100km';
      }
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
    switchReadMoreStatus() {
      const len = this.data.screenings.length;
      switch (this.step) {
        case 0:
          this.step = 1;
          break;
        case 1:
          this.step = 2;
          break;
        case 2:
          this.step = len > 4 ? 0 : 1;
          break;
      }
    },
  },
};
</script>

<style lang="scss">
@import '../../common/style/variable.scss';
.list-card {
    margin-bottom: 24rpx;

    .shop {
        position: relative;

        padding: 21rpx 23rpx 42rpx;

        border-radius: 21rpx;
        background: linear-gradient(to right, rgba(44,42,43,1) 0%, rgba(105,105,105,1) 51%, rgba(100,100,100,1) 55%, rgba(44,42,43,1) 100%);
        background-image: var(--background);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        &.hasScreening {
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
        .pic {
            width: 145rpx;
            height: 211rpx;

            border-radius: 19rpx;
            background-color: $tag-background-color;

            flex-shrink: 0;
        }
        .txt {
            width: 100%;
            .title {
                font-size: 28rpx;
                font-weight: bold;

                color: $title-color;
            }
            .map {
                width: 22rpx;
                height: 22rpx;

                background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAEaElEQVRIiZVVTUwjZRier0xb2qH8yFIgkNqmEAKkCR42kpCwBxLTNKVJY7JcNB48YIwezEa9qPHintToQTca1+hFvbClhaGhQENLBVrZAkMpMFCwob/bEqSdTqfTdmo+dEjFoeKTzGG+5/3e//f9kEqlUvNzOByvBgKBUDabLRcKhQr8crkcd3R0lHI4HO9YrVZRrfs1lbvd7p85jqvUgtfrXZqZmbnRSC3lj2tqroLP51v5XwZwHO9lGKa269ewsLAwKaQLRQSgVCofS6VSUM0QBBGMx+PfAwA4pVL5+tDQ0GA1r9FoHiII8s2/tAlZjcfjTLV/KysrT6xWayPP22y2xtXVVby6PqlUqihUC5FQBPX19VeRhcPhbCaT+chkMmX4s/Hx8czZ2dlroVDojD+TSCQiqVRquq5L0MBlcf4GRVFnBoMhcF3GaDSmKYp6xv/DaMrlcvhWKTo8PEzxoSeTSdZut98TaIShWCx2lcpEIlG4dRctLi6+UV2D/f39hN1uf4Hn7Xb7AEmSz3geer+xsfHrrbson8//QFHU1w0NDZed1NfX165QKFaDwWAK/ut0ujtdXV0yXr5UKiGJROIVIV2CEcBu8Hg8P912Bvb29iI3DZpgkY1GI5fNZj+DrSfoVRWKxSJyfHx8/yZe0ACEXq9/GggEPmRZtqYBv9/vKJfLvhsF/mubbm1t7dyUmkgkkpudnW2odR9U9zzE3NzcWFNT0ySKos8DANCOjo4+lUqFCTmXTqeLp6enZDqd/iKfz09jGPby2NjYP9cFb8npdL4XDAbj8BLvIXwDCII42NnZIeE7UA2SJJMbGxveVCrFulyuT2022z34ToRCoT/W1tbwqwhsNptWq9UuqdVqlVwuB9vb2zvhcPgTAMC5SCSKlMvlSF1dnWxwcPBArVY3Qafgrtrc3HyxWCzuw0g5jkvCcWhtbf1Wp9NNKBQKUSKRYAiCMAA4tRqN5o7f719JJpMTHMelTCZTCSqan5+fVKvVHzAMc86ybLq9vf0uiqJoPB73AwDqMAxTxWKxLymKegT3E7wzNTWlbG5ufnd4ePgBn6IKQRAn14vjcDgmIOfz+ZZqPEqPWJaF2/a765zX63VADoVT2NLSorRYLHfNZvNvfG3g4trd3f1dLper1tfXLTRNb1cqlQLcawAAiUwm0ykUil6SJE8Yhlmvruv09HR9T0+PRiwWI8Dj8fwyMjIyEY1G8ycnJzhFUW/p9fokL7y8vPxQLBZ3oyjaIpPJNAAAkM/nT1mWTXAclx0dHX27WrnL5fq8ra3t/sDAQBdBEORlmzqdzo/7+/vf7+zsrI9EInQmkzmnafqUpuk1iqK+MhgMIXjZYrHIEQRBzWbzZb5xHEdlMtmbGIaNYxjWI5VKG3t7e5+DnNvtfnJxcTFxNQc4jg9IJJKXuru7H2i12m6JRIIwDIPkcrkSy7KlQqHAchxXhrIikUgk/guoXC4X80sxGo3SBwcHP9I0PWU0GpcQBEH+BMKiztoKGfryAAAAAElFTkSuQmCC);
                background-repeat: no-repeat;
                background-size: 100% 100%;
            }
            .distance {
                font-size: 22rpx;

                color: $theme-color;
            }
            .desc {
                font-size: 20rpx;

                color: $text-common-color;
            }
            .tag {
                font-size: 20rpx;
                line-height: 20rpx;

                display: inline-block;

                padding: 4rpx 12rpx;

                border-radius: 14px;
                background: $tag-background-color;
            }
            .type {
                background: $theme-color;
            }
            .label {
                font-size: 20rpx;

                margin-right: 10rpx;

                color: $label-color;
            }
            .attributes-tag {
                width: 90%;
            }
            .book {
                font-size: 20rpx;

                color: $text-common-color;
            }
        }
    }
    .togather {
        padding: 24rpx 24rpx 22rpx;

        border-radius: 21rpx;
        background: #fff;
        .screening {
            margin-top: 22rpx;
        }
        .read-more {
            font-size: 26rpx;

            margin-top: 22rpx;

            color: #777;
        }
        .close-text {
            color: $text-gray-color;
        }
    }
}

</style>