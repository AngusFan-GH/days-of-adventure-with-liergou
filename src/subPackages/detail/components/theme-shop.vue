<template>
  <view class="u-padding-30 theme-shop" v-if="data.shopInfo">
    <view class="u-flex u-row-between title u-skeleton-fillet">门店信息</view>
    <view class="u-relative u-padding-top-30 u-padding-bottom-30 u-flex u-row-between description">
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
</template>

<script>
export default {
  name: 'theme-shop',
  props: {
    data: null,
  },
  methods: {
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
  },
};
</script>

<style lang="scss" scoped>
.theme-shop {
    margin: 0 25rpx;

    border-radius: 20rpx;
    background: #fff;
    .title {
        font-size: 34rpx;
        font-weight: 700;

        color: #111;
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

</style>