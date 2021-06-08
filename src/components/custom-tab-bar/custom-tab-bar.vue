<template>
  <u-tabbar
    :list="tabBarList"
    :mid-button="true"
    :active-color="activeColor"
    :mid-button-size="60"
    :before-switch="beforeSwitch"
  ></u-tabbar>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'custom-tab-bar',
  props: {
    tabBarIndex: 0,
  },
  data() {
    return {
      borderTop: false,
      inactiveColor: '#909399',
      activeColor: '#5098FF',
    };
  },
  computed: {
    ...mapGetters(['tabBarList']),
  },
  methods: {
    beforeSwitch(index) {
      // this为当前pages页面this，而非tab-bar的this
      if (this.tabBarIndex !== index) {
        console.log('current', this.tabBarIndex, index);
        uni.switchTab({
          url: this.$store.state.tabBar.list[index].pagePath,
          success: () => {
            this.loading = true;
            this.list = [];
            uni.pageScrollTo({
              scrollTop: 0,
              duration: 0,
            });
          },
        });
      }
      return false;
    },
  },
};
</script>

<style>
</style>