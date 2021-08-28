<template>
  <view>
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
  </view>
</template>

<script>
import style from '@/common/style/variable.scss';
export default {
  name: 'pool-detail',
  props: {
    data: null,
  },
  data() {
    return {
      showPoolRuleDesc: false,
      customStyle: {
        backgroundColor: style.themeColor,
        color: style.textCommonColor,
        height: '74rpx',
        lineHeight: '74rpx',
      },
    };
  },
  methods: {
    openPoolRuleDesc() {
      this.showPoolRuleDesc = true;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../../common/style/variable.scss';
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
// 拼场规则弹框
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

</style>>