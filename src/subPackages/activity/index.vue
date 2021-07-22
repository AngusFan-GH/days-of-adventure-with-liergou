<template>
  <view class="activity-page">
    <image :src="activityUrl" mode="widthFix" />
  </view>
</template>

<script>
import { fileUrl } from '../../common/js/config';
export default {
  onLoad(options) {
    this.activityUrl = `${fileUrl}activity/activity${options.id}.jpg!d1`;
  },
  data() {
    return {
      activityUrl: '',
    };
  },
};
</script>

<style lang="scss">
.activity-page {
    > image {
        width: 100%;
        display: block;
    }
}
</style>