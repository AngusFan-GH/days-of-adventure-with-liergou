<template>
  <view class="container">
    <view class="u-page list-container">
      <list-card
        v-for="(card, index) in list"
        :key="index"
        :data="card"
      ></list-card>
      <u-loadmore :status="status" />
    </view>
    <custom-tab-bar :current="0"></custom-tab-bar>
  </view>
</template>

<script>
import { customTabBar } from "@/components/custom-tab-bar/custom-tab-bar.vue";
import listCard from "@/components/list-card/list-card.vue";
export default {
  components: {
    listCard,
    customTabBar,
  },
  data() {
    return {
      list: [],
      status: "loadmore",
    };
  },
  created() {
    this.getCardList();
  },
  mounted() {
    uni.getLocation({
      type: "wgs84",
      success: function (res) {
        console.log("当前位置的经度：" + res.longitude);
        console.log("当前位置的纬度：" + res.latitude);
      },
    });
  },
  methods: {
    getCardList() {
      this.status = "loading";
      this.$u.api
        .getCardList()
        .then((res) => console.log(res))
        .catch((err) => this.handleResult());
    },
    handleResult() {
      setTimeout(() => {
        this.list.push(
          ...new Array(10).fill({}).reduce((p, c, i) => {
            p.push({
              id: "id" + i,
              thumb:
                "https://img11.360buyimg.com/n7/jfs/t1/94448/29/2734/524808/5dd4cc16E990dfb6b/59c256f85a8c3757.jpg",
              rate: Math.ceil(Math.random() * 5),
              type: ["密室逃脱", "剧本杀"][Math.floor(Math.random() * 2)],
              feature: [
                "玄幻",
                "科幻",
                "大型机械",
                "有剧情",
                "小朋友",
                "大型机械",
                "有剧情",
                "小朋友",
              ],
              suggest: `${Math.ceil(Math.random() * 5)}人 | ${Math.ceil(
                Math.random() * 120
              )}分钟`,
              screenings: new Array(Math.ceil(Math.random() * 10)).fill({}),
            });
            return p;
          }, [])
        );
        console.log(this.list);
        this.status = "loadmore";
      }, 1000);
    },
    onReachBottom() {
      this.getCardList();
    },
  },
};
</script>

<style lang="scss">
.container {
  min-height: 100%;

  background-color: #ccc;
}
.list-container {
  padding-top: 1px;
}
</style>
