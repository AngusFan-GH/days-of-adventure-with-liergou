<template>
  <view class="common-custome-style activity">
    <u-notice-bar
      mode="horizontal"
      volume-size="36"
      :speed="200"
      :list="showList"
      :autoplay="true"
      :is-circular="false"
      @click="handleClick"
    ></u-notice-bar>
  </view>
</template>

<script>
export default {
  name: 'activity',
  props: {
    list: Array,
  },
  computed: {
    showList() {
      return this.list.map(item => item.title);
    },
  },
  methods: {
    handleClick(index) {
      this.jumpToActivityDetail(this.list[index]);
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
.activity {
    display: block;
}

</style>