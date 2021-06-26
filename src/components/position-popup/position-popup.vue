<template>
  <u-popup
    class="position-setting-popup"
    v-model="showSettingPopup"
    mode="bottom"
    border-radius="14"
    :mask-close-able="false"
    :safe-area-inset-bottom="true"
  >
    <open-setting
      title="地理位置授权"
      desc="地理位置授权后方可使用"
      authSetting="scope.userLocation"
      @afterSetting="handleAfterSetting"
    ></open-setting>
  </u-popup>
</template>

<script>
import openSetting from '@/components/open-setting/open-setting.vue';
export default {
  name: 'position-popup',
  components: {
    openSetting,
  },
  modal: {
    prop: 'value',
    event: 'input',
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    value(isShow) {
      if (isShow) {
        this.getPositon();
      }
    },
  },
  data() {
    return {
      showSettingPopup: false,
    };
  },
  methods: {
    startLocationUpdate() {
      wx.startLocationUpdate({
        success: () => {
          console.log('startLocationUpdate');
          wx.onLocationChange(this.handlerLocationChange);
        },
        fail: err => {
          console.log(err);
          if (err.errMsg === 'startLocationUpdate:fail auth deny') {
            this.showSettingPopup = true;
          }
        },
      });
    },
    stopLocationUpdate() {
      wx.stopLocationUpdate({
        success: () => {
          console.log('stopLocationUpdate');
          wx.offLocationChange(this.handlerLocationChange);
        },
        fail: err => {
          console.log(err);
        },
      });
    },
    handlerLocationChange(res) {
      const { latitude, longitude } = res;
      console.log('onLocationChange', { latitude, longitude });
      uni.setStorageSync('position', { latitude, longitude });
    },
    handleAfterSetting() {
      this.showSettingPopup = false;
      this.getPositon();
      this.startLocationUpdate();
    },
    getPositon() {
      uni.getLocation({
        type: 'gcj02',
        success: res => {
          const position = {
            longitude: res.longitude,
            latitude: res.latitude,
          };
          console.log('position', position);
          uni.setStorageSync('position', position);
          this.$emit('gotPosition', position);
          this.$emit('input', false);
        },
        fail: err => {
          console.log(err);
          if (err.errMsg === 'getLocation:fail auth deny') {
            this.showSettingPopup = true;
          }
        },
      });
    },
  },
  destroyed() {
    console.log('destroyed');
    this.stopLocationUpdate();
  },
};
</script>

<style>
</style>