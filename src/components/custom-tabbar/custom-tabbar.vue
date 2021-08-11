<template>
  <u-tabbar
    :show="showTabbar"
    :list="tabbarList"
    :mid-button="true"
    :active-color="activeColor"
    :mid-button-size="60"
    :before-switch="beforeSwitch"
  ></u-tabbar>
</template>

<script>
import { mapGetters } from 'vuex';
import style from '../../common/style/variable.scss';
export default {
  name: 'custom-tabbar',
  props: {
    tabbarIndex: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      borderTop: false,
      inactiveColor: style.tabbarInactiveColor,
      activeColor: style.tabbarActiveColor,
    };
  },
  computed: {
    ...mapGetters('tabbar', ['tabbarList', 'showTabbar']),
  },
  methods: {
    beforeSwitch(index) {
      // this为当前pages页面this，而非tabbar的this
      console.log('current', this.tabbarIndex, index);
      if (this.tabbarIndex === index) {
        this.handletabbarClick && this.handletabbarClick();
        return false;
      }
      return true;
    },
  },
};
</script>

<style>
</style>