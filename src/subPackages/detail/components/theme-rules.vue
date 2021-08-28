<template>
  <view class="theme-rules">
    <view class="u-margin-bottom-20 title u-skeleton-fillet">购买须知</view>
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
</template>

<script>
export default {
  name: 'theme-rules',
};
</script>

<style lang="scss" scoped>
.theme-rules {
    margin: 0 25rpx;
    padding: 30rpx 24rpx;

    border-radius: 20rpx;
    background: #fff;
    .title {
        font-size: 34rpx;
        font-weight: 700;

        color: #111;
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

</style>