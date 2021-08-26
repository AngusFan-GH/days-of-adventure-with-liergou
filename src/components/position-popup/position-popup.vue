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
import { mapMutations } from 'vuex';
export default {
  name: 'position-popup',
  components: {
    openSetting,
  },
  data() {
    return {
      showSettingPopup: false,
    };
  },
  methods: {
    ...mapMutations('position', { $setPosition: 'setPosition' }),
    getPositon() {
      uni.getLocation({
        type: 'gcj02',
        success: res => {
          const position = {
            longitude: res.longitude,
            latitude: res.latitude,
          };
          this.$setPosition(position);
          this.$emit('gotPosition', position);
        },
        fail: err => {
          console.log(err);
          if (err.errMsg === 'getLocation:fail auth deny') {
            this.showSettingPopup = true;
          }
        },
      });
    },
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
          wx.offLocationChange(this.handlerLocationChange);
          console.log('stopLocationUpdate');
        },
        fail: err => {
          console.log(err);
        },
      });
    },
    handlerLocationChange(res) {
      const { latitude, longitude } = res;
      console.log('onLocationChange', { latitude, longitude });
      this.$setPosition({ latitude, longitude });
    },
    handleAfterSetting() {
      this.showSettingPopup = false;
      this.getPositon();
    },
  },
  destroyed() {
    this.stopLocationUpdate();
    console.log('stopLocationUpdate');
  },
};
</script>

<style>
</style>