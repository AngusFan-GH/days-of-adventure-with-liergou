<template>
  <u-tabbar
    :show="showTabBar"
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
    tabBarIndex: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      borderTop: false,
      inactiveColor: '#909399',
      activeColor: '#f63',
    };
  },
  computed: {
    ...mapGetters(['tabBarList', 'showTabBar']),
  },
  methods: {
    beforeSwitch(index) {
      // this为当前pages页面this，而非tab-bar的this
      console.log('current', this.tabBarIndex, index);
      if (this.tabBarIndex === index) {
        this.handletabBarClick && this.handletabBarClick();
        return false;
      }
      return true;
    },
  },
};
</script>

<style>
</style>