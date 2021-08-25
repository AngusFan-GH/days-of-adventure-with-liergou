<template>
  <view class="wrap" v-if="bannerList.length">
    <u-swiper
      title
      :list="bannerList"
      :bg-color="styleVariable.backgroundColor"
      @click="handleClickBanner"
    ></u-swiper>
  </view>
</template>

<script>
import { stylesMixin } from '@/common/js/mixin/styles.js';
export default {
  name: 'banner',
  mixins: [stylesMixin],
  data() {
    return {
      bannerList: [],
    };
  },
  methods: {
    init() {
      return this.getActivityList();
    },
    getActivityList() {
      return new Promise(res => {
        this.$u.api.getActivityList({ location: '1' }).then(e => {
          this.bannerList = e.map(v => {
            v.image = v.banner;
            return v;
          });
          res();
        });
      });
    },
    handleClickBanner(index) {
      this.jumpToActivityDetail(this.bannerList[index]);
    },
    jumpToActivityDetail({ id, templateId, type }) {
      if (id) {
        uni.navigateTo({
          url: `/subPackages/activity/index?id=${id}&templateId=${templateId}&type=${type}`,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.wrap {
    height: 250rpx;
    margin: 0 24rpx;
}

</style>