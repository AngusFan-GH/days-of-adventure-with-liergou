<template>
  <view class="container">
    <view class="u-page list-container">
      <list-card
        v-for="(card, index) in list"
        :key="index"
        :data="card"
      ></list-card>
      <u-loadmore :status="status" @loadmore="loadmore" />
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
      pageNum: 1,
      pageSize: 10,
      pages: 1,
    };
  },
  created() {
    this.getCardList();
  },
  methods: {
    getCardList() {
      this.status = "loading";
      this.$u.api
        .getCardList({
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        })
        .then((res) => this.handleResult(res))
        .catch((err) => this.handleErr(err));
    },
    handleResult(res) {
      const { records, pages } = res;
      console.table(records);
      this.pages = pages;
      this.list.push(
        ...records.map((v) => {
          v.tags = v.tags.split(",");
          v.difficultLevel = v.difficultLevel / 10;
          v.screenings = [
            {
              price: v.price,
              productItemId: v.productItemId,
              roomBeginTime: v.roomBeginTime,
              roomEndTime: v.roomEndTime,
              currentPeople: v.currentPeople,
              restPeople: v.advicePeopleMax - v.currentPeople,
            },
          ];
          return v;
        })
      );
      this.handleReadBottomStatus();
    },
    handleErr(err) {
      this.pageNum--;
      this.handleReadBottomStatus();
      console.error(err);
    },
    handleReadBottomStatus() {
      if (this.pageNum >= this.pages) {
        this.status = "nomore";
      } else {
        this.status = "loadmore";
      }
    },
    onReachBottom() {
      if (this.pageNum >= this.pages) return;
      this.loadmore();
    },
    loadmore() {
      this.pageNum++;
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
