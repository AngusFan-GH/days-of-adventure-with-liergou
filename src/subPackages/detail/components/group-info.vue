<template>
  <view
    class="u-padding-30 u-p-t-60 group-info"
    v-if="data && data.length"
    :style="{ '--background': 'url(' + backgroundImage + ')' }"
  >
    <view class="screw left"></view>
    <view class="screw right"></view>
    <view class="u-p-10 box-container">
      <view class="u-flex u-row-between title u-skeleton-fillet">组队信息</view>
      <view class="u-flex u-p-t-30 wrapper">
        <view class="u-m-6 mumber" v-for="(item, index) in data" :key="index">
          <u-avatar
            class="avatar"
            :class="{
              paid: item.status === 'paid',
              lock: item.status === 'lock',
            }"
            size="60"
            :src="item.avatarUrl"
          ></u-avatar>
          <view class="u-line-1 name">{{ item.nickName || '神秘人' }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { fileUrl } from '@/common/js/config';
export default {
  name: 'group-info',
  props: {
    data: null,
  },
  data() {
    return {
      backgroundImage: fileUrl + 'plank_bg.png!s1',
    };
  },
};
</script>

<style lang="scss" scoped>
.group-info {
    position: relative;

    margin: 0 25rpx;

    border-radius: 8rpx;
    background: #f3eaea var(--background)  bottom / 100%;
    .box-container {
        background-color: rgba(255,255,255,.7);;
    }
    .title {
        font-size: 34rpx;
        font-weight: 700;

        color: #111;
    }
    .wrapper {
        flex-wrap: wrap;
        .mumber {
            width: 70rpx;
            .avatar {
                display: block;

                width: 60rpx;
                height: 60rpx;
                margin: 0 auto 10rpx;

                border: 2px solid #ccc;
                border-radius: 100%;
                &.paid {
                    border: 2px solid #f0ba43;
                }
                &.lock {
                    border: 2px solid #fa3534;
                }
            }
            .name {
                font-size: 22rpx;

                width: 100%;

                text-align: center;
            }
        }
    }
    .screw {
        position: absolute;
        top: 14rpx;

        width: 30rpx;
        height: 30rpx;

        background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAL20lEQVR4Xu2dXWwcVxWAz9m1d91USiJj0YgHZKlGbUlViZlRmhCSFhANaZD6h3ksatqHvsALKrQPlEIfGn76Ai99gFT0EQNtJVw3RZTQEOxYcwdRNaQVjmQhgRJkrDhSHXvXuwed7V2z9v7MnZk7f557pdFa9rn33HPO57l37y/CDkyHDh0ardfrdwDA7UTEn/yMAsCujudm+TN7YBUAPpSf/DM/ywBwCREvAcD7w8PDl2ZnZ/l3Oyph3q2ZmJio7t69+wAi3gsAX5DBviUmu64yFADwNhGdvX79+vzCwsJ6TLoSKTaXAFiWdQwRDwDA3QDwRQAYScRb3UrWAOAPAHCBiOY9zzuTUj1Cq80NAI7jHCei4wDAz0Roi+PNuAAAM4g447ruTLyq9JSeaQByEvR+kcgFDJkEwLbtSUQ8SURf1sN5uqUg4ptEdFoIMZVuTbq1ZwoAx3EebTabJxHxnqw5Skd9iOhPpVLptOu6r+goT0cZmQDAsqzHEPFJAOCOXRHSPBG95Hney2kbmyoAlmXZAPAMIj6StiPS0E9EvwGAFzzPE2noZ52pAGDb9jAAPM3BB4Cb0jI+I3pvMAQAcEoIUU+6TokBMDk5edvU1NQHjuM8QEQc/INJG5txfXOIeMp13deTrGciAHDwNzY2pmu12tqVK1f2J2lg3nQR0XOe530/qXrHDgAHv16vv4WIn2SjVldXYWlpKSn78qrnVQB4SghxOW4DYgWAg1+r1c6WSqV9nYYYCJTCepmInvI8j2GILcUGgAz+X0qlEs/CdSUDgVpM424SYgGAg7++vj5fLpd3DzLTQKAGAQD8QgjxhLJ0AEHtAMjge+VymefefZOBwNdFbYEzQgjtQ+NaAZDBf7dcLleUzTIdwyCuuiiEuDNIBj9ZbQDI4P+9XC6X/JSaPkEYD23muS6E2BOphI7MWgDg4K+trV0cGhoqR6mYaQ6UvfcfIYSWVU+RAZD/+X8tl8tahnQNBMoQvC2E4NVQkVIkAORXvQulUknbK4mtMRAox/RnQohvKkv3EAwNgAz+XKlU2hulAv3yGgjUvEpEP/I87ztq0t1SoQDwG+QJW5nt+QwEap6MMlgUGIB+w7tqVQ0uZSBQ8xkRPRxm2DgQANsndtSqFl3KQKDkQ544OhZ0AkkZgPaULgDcqlQdzUIGAiWHviqEeFhJUgopA8DyJ06ceK9SqaQ2n28g8A9t0P6AMgByJc9rY2NjsGuX0jC/f21DSBgI/J2GiA+qrixSAkCu4XunvYzLQOAfhJQl5gDgqMoaQ1UAvgsAP+g0ykCQcoj91T8rhHjeT8wXAF66jYjneq3eNRD4uTfVv98goiN+S85VAPj1oHX7BoJUgzxQOe878Dzvq4OEBgIgd+yc9jPRQODnofT+TkQnB+1AGgiAbdsXVLdrGQjSC7KP5nkhBJ+j0DP1BYA3ahLRL4OYZSAI4q3kZBHx6/02pPYFwLKss2F26RoIkgusqibelex5Hh+h05V6AsD78wHgV6oKtssZCMJ6LtZ8X+t1PkFPABzHmYl6OIOBINZgBi6cD6lwXZeP19mSugCQx7K8EVhDjwwGAh1e1FcGIt6//eyiLgBs2/4pAHxDl1oDgS5PaimnawlZLwD+ofsULgOBluDpKGRBCPGpzoK2AKDz9W86hjripb+M7c3AFgB0v/4NBPoDqKHELc3AdgC0v/4NBBpCpreILc3AJgDy+NU39erqXZrpEyTh5f46+Ct++1jbTQBs2+b5fp73TyQZCBJxcz8lzwshnuU/dgLAhx7zaduJJQNBYq7ermhzW1kLgPHx8ZHR0dFriFhNukoGgqQ9DkBE68vLy3sXFxfXWgA4jvMlInor+ap8pNFAkLznEfE+13V/3wIg6fa/l7kGgsQhaPUD2gD8EQB6ThcmWS0DQZLehrNCiM+3AbgCAFoOHIhqgoEgqgeV818VQuxDvmCpVqv9VzlbAoIGggScDACVSuVj6DjOYSL6czIq1bUYCNR9FVYSET/HADxORD8PW0ic+QwEcXoXABGfQNu2fwIA34pXVfjSDQThfaeQ80UGYBoA7lcQTk3EQBCb699gAGbzcHa/gSAWCOYYgL8BwF2xFK+5UAOBZocCvMsAxL4GQGe1DQQ6vQkLDMC/AOATWouNuTADgTYH/5sBuAYAWg961Fa9AQUZCLR4eYUBqAEA3+KVu2QgiByyeq4BYPMNBJEgaAGQyyag02wDQWgIWk1A7jqBvcw1EISCoNUJzNXXwEFmGggCQ9D6GpibgSAV8wwEKl7alGkNBOViKDiIWQYCZW+1hoIzPxmkbE6HoIFAyWutyaBMTwcrmdFHyEDg670XM70gxLf6CgIGgv5Oai0IyeqSMIXYKosYCHq7qrUkLIuLQpUjG0DQQNDtrNaiUP61bduZWRYeIKaBRQ0EW1z20bJwCUAmNoYEjmiIDAaCTadt2RjSdRx8CN/mJouBoBWq1nHyrTeAZVlHEJEvhChMKjoERHTU87xzLQAmJiaqe/bs4VnBkcIQUOyp5LWVlZW9CwsL650HRPyO74UqEgBsa0HfBNNCiK+w/Z0AFKof0Al6ASHYvE4mlUOisviWKRIEPQ+Jkl8Hd8zagDCQFQSC3sfESQC0nhMcJghp5ykABP0PiozzqNi0AxtE/06GYOBRsaYZ+D8mOxSCwYdFm2Zg63tiB0Lgf1y8aQZ2LgRKF0aw+TqujAnS5mZddie8CZSvjJHNQKRLo7Ie0DD12wEQqF8aJSeIQl0bF8a5ecmTVwgCXxsnm4HAF0fmJZBR6plHCEJdHCmbAuWrY6M4NW95cwZBuKtjZTPwGCL6Xh6dtwDqqG9eIIh0ebSEYOD18Tqcmdcysg5B5OvjJQA2Ip4DgJvyGqg4651hCG4Q0RHP88Qg+wdeH9/OaNt2YdcKqMCTUQg25/x1AMBHyPCawYMqDimiTMYgmAOAo0KIul8slN4A8mvhA0T0ml+BRf57ViBAxAdd131dJRbKAMj+wPcQ8TmVgosqkzYEtVrt4vT09J2q/g8EgBwb+C0APKSqoIhyKUNweWho6MTU1NQHKr4PA8CtAHAGAPjTpD4eSAMCIvrn8PDwfarB56oHBkA2BQ8hIr8JTBrggSQhaDabVyqVyr1Bgh8aANMfUOc+CQiazeZypVL5bNDgRwJA9gf4ppHH1d1RTMk4IWg0Gter1eqBMMGPDICEgC+cPlbM0KpbHQcEjUZjtVqtWmGDrwUACcF7ALBf3R3FlNQJQaPRqFWr1buiBF8bABKCFQDYXczQqlutA4JGo9GsVqufjhp8rQBICK4CwMfV3VFMySgQbGxsNEZGRvbrCL52ACQEiV9Dn0eMwkDQaDRuVKvVz+gKfiwASAgKv8VMBcogEDSbzZVKpXK3zuDHBoAcJ/ghIn5bxRFFllGBoNlsXqtUKgd1Bz9WACQEZvJIge5BEEQZ5FFQHW4oWKXgtoxlWTxs/GMzdzDYa70gCDu8GyQ+oeYCgiiQfQKeOGIIzCziAOd1QhBmYidoXGJvArZXyLIs0yT4RGnfvn0XK5XKSJAp3TCBb+dJ5A3QWUHHcXhl0dNmeVlX2OYQ8RSv5JmcnLwtjg5fL1ASB0A2CbzGkCF4xqw2hhsA8AIAnFJZwxflvz0zAHR0EG2GABEf0W1YHsrjdfscfL+l23HaksoboEffgHcgPQkAB+I0NkNlzxPRS57nvZx2nTIBQNsJjuM82mw2TyLiPWk7Jg79vEu3VCqddl33lTjKD1NmpgBoG2Db9iQinuTz7MIYlbU8fDgDEZ0WQkxlrm5Zq9C2bwzHieg4APAzkeW69qjbAgDMIOKM67ozWa17Jt8AvZwlzy7KOgy5CHqnf3MDQGelLcs6hoiHAeAwER1GxGoa/2FEtI6I5wHgPBGd9zyPl8vnKuUSgE4Pj4+Pj4yNjR3hnbAAwM8dAHBLTFHgBS+XAOAc75heWlo6t7i4uBaTrkSKzT0AvbzEF2HV63UG4XYi4k9+RgFgV8dzs/yZi1gFgA/lJ//MzzIHGxE54O8PDw9fmp2d5d/tqPQ/H2nbiP6A78YAAAAASUVORK5CYII=') no-repeat top / 100%;
        &.left {
            left: 15%;
        }
        &.right {
            right: 15%;
        }
    }
}


</style>>