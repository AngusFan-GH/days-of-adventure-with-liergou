<template>
  <view>
    <view class="btn-container">
      <u-button>保存</u-button>
    </view>
    <u-cell-group>
      <u-cell-item title="头像" :arrow="false">
        <u-avatar class="u-margin-right-20" :src="userInfo.avatarUrl"></u-avatar>
      </u-cell-item>
      <u-cell-item title="昵称" :value="userInfo.nickName"></u-cell-item>
      <u-cell-item title="性别" :value="gender + '（不可修改）'" :arrow="false"></u-cell-item>
      <u-cell-item title="生日"></u-cell-item>
      <u-cell-item title="星座"></u-cell-item>
      <u-cell-item title="职业"></u-cell-item>
      <u-cell-item title="常住地"></u-cell-item>
      <u-cell-item title="角色"></u-cell-item>
      <u-cell-item title="个性标签"></u-cell-item>
      <u-cell-item title="可玩时间段"></u-cell-item>
    </u-cell-group>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userInfo: uni.getStorageInfoSync('userInfo'),
    };
  },
  computed: {
    gender() {
      switch (this.userInfo.gender) {
        case 1:
          return '男';
        case 2:
          return '女';
        default:
          return '未知';
      }
    },
  },
};
</script>

<style>
</style>