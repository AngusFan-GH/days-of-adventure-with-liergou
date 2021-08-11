<template>
  <view class="activity-page">
    <image v-if="templateId === 'img'" :src="activityUrl" mode="widthFix" />
  </view>
</template>

<script>
export default {
  onLoad(options) {
    console.log('activity-page', options);
    this.id = options.id;
    this.templateId = options.templateId;
    this.getDetail(options.id);
  },
  data() {
    return {
      id: '',
      templateId: '',
      activityUrl: '',
    };
  },
  methods: {
    getDetail(id) {
      this.$u.api.getActivityDetail(id).then(e => {
        this.render(e);
      });
    },
    render(e) {
      console.log('render', this.templateId, e);
      switch (this.templateId) {
        case 'img':
          this.activityUrl = e.basic.url;
          break;
        case 'url':
          break;
      }
    },
  },
};
</script>

<style lang="scss">
.activity-page {
    > image {
        display: block;

        width: 100%;
    }
}

</style>