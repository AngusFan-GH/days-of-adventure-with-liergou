<template>
  <view class="commit-list u-padding-top-30 safe-area-inset-bottom">
    <view class="list">
      <view class="u-padding-top-20 item" v-for="(commit, index) in commits" :key="index">
        <view class="ugc-review">
          <view class="u-flex review-avatar">
            <view class="u-margin-right-20 avatar-left">
              <u-avatar :src="commit.avatar"></u-avatar>
            </view>
            <view class="u-flex-1 avatar-right">
              <view class="u-flex u-row-between user-info">
                <text class="u-line-1 username">{{ commit.username }}</text>
                <view class="review-time">
                  <text class="u-margin-right-6">大众点评网友</text>
                  <text>{{ commit.time }}</text>
                </view>
              </view>
              <view class="u-flex u-margin-top-8 review-star">
                <text class="u-margin-right-6 star-txt">打分：</text>
                <u-rate
                  :count="5"
                  v-model="commit.star"
                  disabled
                  active-color="#ea120e"
                  active-icon="star-fill"
                  inactive-icon="star"
                  gutter="0"
                ></u-rate>
              </view>
            </view>
          </view>
          <view class="u-margin-top-12 u-margin-right-10 review-content">
            <u-read-more
              :toggle="true"
              :text-indent="0"
              color="#436489"
              open-text="收起"
              close-text="全文"
            >
              <rich-text :nodes="commit.recommend"></rich-text>
            </u-read-more>
            <view class="u-flex review-pics">
              <view
                class="pic"
                v-for="(pic, i) in commit.pics"
                :key="i"
                @click="previewImage(pic, commit.pics)"
              >
                <image :src="pic" mode="scaleToFill" />
              </view>
            </view>
          </view>
        </view>
        <u-gap height="14" bg-color="#f6f6f6" v-show="index !== commits.length - 1"></u-gap>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'commit-list',
  onLoad() {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('submitCommits', data => {
      console.log('submitCommits', data);
      this.commits = data || [];
    });
  },
  data() {
    return {
      commits: [],
    };
  },
  methods: {
    previewImage(index, pics) {
      uni.previewImage({
        current: index,
        urls: pics,
      });
    },
  },
};
</script>

<style lang="scss">
.commit-list {
    overflow: auto;

    height: 100%;
    .list {
        .item {
            width: 100%;
        }
    }
    .ugc-review {
        padding: 0 30rpx;
        .review-avatar {
            width: 100%;
            .avatar-left {
                width: 80rpx;
                height: 80rpx;
            }
            .username {
                font-size: 30rpx;
                font-weight: 500;

                max-width: 240rpx;

                word-wrap: normal;

                color: #222;
            }
            .review-time {
                font-size: 24rpx;
                font-weight: 400;

                color: #999;
            }
            .review-star {
                .star-txt {
                    font-size: 26rpx;

                    color: #111;
                }
            }
        }
        .review-content {
            width: 670rpx;
            .review-pics {
                overflow: hidden;

                width: 100%;
                margin: 14rpx 10rpx 20rpx;

                border-radius: 14rpx;

                flex-wrap: wrap;
                .pic {
                    image {
                        display: block;

                        width: 218rpx;
                        height: 218rpx;
                    }
                    &:nth-of-type(3n),
                    &:nth-of-type(3n-1) {
                        margin-left: 8rpx;
                    }
                    &:nth-of-type(n+4) {
                        margin-top: 8rpx;
                    }
                }
            }
        }
    }
}

</style>