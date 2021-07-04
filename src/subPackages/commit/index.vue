<template>
  <view class="commit-list safe-area-inset-bottom">
    <view class="u-margin-top-30 list">
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
              <rich-text
                v-for="(content, index) in commit.contents"
                :key="index"
                :nodes="content"
              ></rich-text>
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
    <u-loadmore
      v-if="commits.length"
      :status="status"
      @loadmore="loadmore"
      :loadText="loadText"
      margin-bottom="50"
    />
    <view class="empty-display" v-if="!loading && !commits.length">
      <image src="/static/image/empty.png"></image>
      <text>暂无数据</text>
    </view>
    <loading class="loading" v-if="loading && !commits.length"></loading>
  </view>
</template>

<script>
import { timeFmt } from '@/common/js/time-fmt';
export default {
  name: 'commit-list',
  onLoad(options) {
    this.productId = options.productId;
    this.getCommits();
  },
  data() {
    return {
      productId: null,
      pageNum: 1,
      pageSize: 10,
      pages: 1,
      commits: [],
      loading: true,
      status: 'loadmore',
      loadText: {
        loadmore: '点击加载更多',
        loading: '努力加载中',
        nomore: '暂时没有了',
      },
    };
  },
  onPullDownRefresh() {
    this.getCommits(true);
  },
  onReachBottom() {
    if (this.pageNum >= this.pages) {
      return;
    }
    this.loadmore();
  },
  methods: {
    getCommits(isRefrash = false) {
      if (this.productId == null) {
        return console.warn('There is no productId');
      }
      this.loading = true;
      uni.showNavigationBarLoading();
      this.status = 'loading';
      if (isRefrash) {
        this.pageNum = 1;
      }
      this.$u.api
        .getProductCommits({
          productId: this.productId,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        })
        .then(data => {
          if (isRefrash) {
            this.commits = [];
            this.backToTop();
            uni.stopPullDownRefresh();
          }
          this.pages = data.pages;
          const commits = data.records || [];
          this.commits.push(
            ...commits.map(({ content, reviewTime }) => {
              return {
                username: content.userNickName,
                lv: content.userLevel,
                time: timeFmt(reviewTime, 'YYYY年MM月DD日'),
                avatar: content.userHeadPic,
                pics: (content.pics || []).map(pic => pic.picUrl),
                contents: content.contentDesc || [],
                star: content.accurateStarValue,
              };
            })
          );
          this.stopLoading();
        })
        .catch(err => {
          this.pageNum--;
          this.stopLoading();
          console.error(err);
        });
    },
    backToTop() {
      uni.pageScrollTo({
        duration: 0,
        scrollTop: 0,
      });
    },
    stopLoading() {
      uni.hideNavigationBarLoading();
      this.handleReadBottomStatus();
      this.loading = false;
    },
    handleReadBottomStatus() {
      if (this.pageNum >= this.pages) {
        this.status = 'nomore';
      } else {
        this.status = 'loadmore';
      }
    },
    loadmore() {
      this.pageNum++;
      this.getCommits();
    },
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
@import '../../common/style/variable.scss';
.commit-list {
    overflow: auto;
    display: block;

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
.empty-display {
    position: absolute;
    top: 375rpx;
    left: 50%;

    transform: translate(-50%, -50%);
    text-align: center;

    color: $text-common-color;
}
.loading {
    position: fixed;
    top: 40%;
    left: 50%;

    transform: translate(-50%,-50%);
}

</style>