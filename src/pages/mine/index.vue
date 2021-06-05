<template>
  <view class="container">
    <view> 我的 </view>
    <custom-tab-bar :current="2"></custom-tab-bar>
  </view>
</template>

<script>
import { customTabBar } from "@/components/custom-tab-bar/custom-tab-bar.vue";
export default {
  components: {
    customTabBar,
  },
  data() {
    return {};
  },
  onLoad() {},
  methods: {},
};
</script>

<style lang="scss">
.container {
  min-height: 100%;
  background-color: #ccc;
}
</style>