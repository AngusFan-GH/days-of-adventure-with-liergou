<template>
  <u-tabbar
    v-model="current"
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
    current: 0,
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
      console.log('current', index);
      return true;
    },
  },
};
</script>

<style>
</style>