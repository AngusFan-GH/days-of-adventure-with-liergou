<template>
  <view class="safe-area-inset-bottom page-container">
    <view class="form-container">
      <u-cell-group>
        <u-cell-item title="头像" :arrow="false" @click="chooseImage">
          <u-avatar class="u-margin-right-20" :src="userInfo.avatarUrl"></u-avatar>
        </u-cell-item>
        <u-cell-item title="昵称" :value="userInfo.nickName"></u-cell-item>
        <u-cell-item title="性别" :value="gender + '（不可修改）'" :arrow="false"></u-cell-item>
        <u-cell-item title="生日" :value="birthday" @click="isShowDatePopup = true"></u-cell-item>
        <u-cell-item title="星座" :value="constellation" :arrow="false"></u-cell-item>
        <u-cell-item title="职业"></u-cell-item>
        <u-cell-item title="常住地"></u-cell-item>
        <u-cell-item title="角色"></u-cell-item>
        <u-cell-item title="个性标签"></u-cell-item>
        <u-cell-item title="可玩时间段"></u-cell-item>
      </u-cell-group>
    </view>

    <picker-view-date v-model="isShowDatePopup" @confirm="handleConfirmDate"></picker-view-date>

    <view class="btn-container safe-area-inset-bottom">
      <view class="u-p-20">
        <u-button type="primary">保存</u-button>
      </view>
    </view>
  </view>
</template>

<script>
import { pickerViewDate } from '@/components/picker-view-date/picker-view-date.vue';
export default {
  components: {
    pickerViewDate,
  },
  data() {
    return {
      userInfo: uni.getStorageSync('userInfo') || {},
      isShowDatePopup: false,
      birthday: '',
      constellation: '',
    };
  },
  computed: {
    gender() {
      switch (+this.userInfo.gender) {
        case 1:
          return '男';
        case 2:
          return '女';
        default:
          return '未知';
      }
    },
  },
  methods: {
    chooseImage() {
      uni.chooseImage({
        success: chooseImageRes => {
          const tempFilePaths = chooseImageRes.tempFilePaths;
          console.log(tempFilePaths);
          this.userInfo.avatarUrl = tempFilePaths;
          // uni.uploadFile({
          //   url: 'https://www.example.com/upload', //仅为示例，非真实的接口地址
          //   filePath: tempFilePaths[0],
          //   name: 'file',
          //   formData: {
          //     user: 'test',
          //   },
          //   success: uploadFileRes => {
          //     console.log(uploadFileRes.data);
          //   },
          // });
        },
      });
    },
    handleConfirmDate(date) {
      const [year, month, day] = date;
      this.birthday = `${year}年${month}月${day}日`;
      this.constellation = this.getConstellation(month, day);
    },
    getConstellation(m, d) {
      var s = '魔羯水瓶双鱼白羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯';
      var arr = [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22];
      return s.substr(m * 2 - (d < arr[m - 1] ? 2 : 0), 2) + '座';
    },
  },
};
</script>

<style lang="scss" scoped>
.page-container {
    position: relative;

    overflow: auto;

    height: 100%;
}

.form-container {
    padding-bottom: 120rpx;
}

.btn-container {
    position: fixed;
    z-index: 9;
    bottom: 0;

    width: 100%;

    background: #fff;
}



</style>