<template>
  <view class="u-padding-30 theme-ugc" v-if="value && commits.length">
    <view class="u-flex u-row-between title u-skeleton-fillet" @click="goToCommitList()">
      当前主题评价({{ commitCount }})
      <u-icon name="arrow-right" custom-prefix="custom-icon" size="20"></u-icon>
    </view>
    <view class="u-margin-top-20 ugc-content">
      <view
        class="u-flex u-col-top ugc-review"
        v-for="(commit, index) in displayCommits"
        :key="index"
      >
        <view class="u-margin-right-20 review-avatar">
          <u-avatar :src="commit.avatar"></u-avatar>
        </view>
        <view class="review-content">
          <view class="u-flex u-row-between user-info">
            <view class="u-flex info-left">
              <text class="username">{{ commit.username }}</text>
              <image class="u-margin-left-2 user-lv" :src="commit.lv" mode="scaleToFill" />
            </view>
          </view>
          <view class="review-time">{{ commit.time }}</view>
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
          <view class="u-line-2 u-margin-top-14 recommend">{{ commit.recommend }}</view>
          <view class="review-pics">
            <view
              class="pic"
              v-for="(pic, i) in commit.pics"
              :key="i"
              @click="previewImage(pic, commit.pics)"
            >
              <u-lazy-load
                :image="pic"
                height="174"
                threshold="300"
                img-mode="scaleToFill"
              ></u-lazy-load>
            </view>
          </view>
        </view>
      </view>
      <view class="ugc-line"></view>
    </view>
    <view
      class="u-flex u-row-between u-margin-top-30 ugc-more u-skeleton-fillet"
      @click="goToCommitList()"
    >
      查看全部网友点评
      <u-icon name="arrow-right" custom-prefix="custom-icon" size="20"></u-icon>
    </view>
  </view>
</template>

<script>
import { timeFmt } from '@/common/js/utils/time-fmt';
export default {
  name: 'theme-ugc',
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    productId: null,
  },
  data() {
    return {
      commits: [],
      commitCount: 0,
    };
  },
  mounted() {
    this.getCommits();
  },
  computed: {
    displayCommits() {
      let commits = this.commits || [];
      commits = commits.length >= 2 ? commits.slice(0, 2) : commits;
      const res = JSON.parse(JSON.stringify(commits)).map(c => {
        if (c.pics.length > 3) {
          c.pics.length = 3;
        }
        return c;
      });
      return res;
    },
  },
  methods: {
    getCommits() {
      if (this.productId == null) {
        return console.warn('There is no productId');
      }
      this.$u.api
        .getProductCommits({
          productId: this.productId,
          pageNum: 1,
          pageSize: 2,
        })
        .then(data => {
          const commits = data.records || [];
          this.commits = commits.map(({ content, reviewTime }) => {
            return {
              username: content.userNickName,
              lv: content.userLevel,
              time: timeFmt(reviewTime, 'YYYY年MM月DD日'),
              avatar: content.userHeadPic,
              pics: (content.pics || []).map(pic => pic.picUrl),
              recommend: content.title,
              star: content.accurateStarValue,
            };
          });
          this.commitCount = data.total;
          console.log('commits', this.commits);
          if (commits.length) {
            this.$emit('input', true);
          }
        })
        .catch(err => console.error(err));
    },
    goToCommitList() {
      uni.navigateTo({
        url: '/subPackages/commit/index?productId=' + this.productId,
      });
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

<style lang="scss" scoped>
.theme-ugc {
    margin: 0 25rpx;

    border-radius: 20rpx;
    background: #fff;
    .title {
        font-size: 34rpx;
        font-weight: 700;

        color: #111;
    }
    .ugc-content {
        .review-avatar {
            height: 90rpx;
        }
        .user-info {
            .username {
                font-size: 26rpx;
                font-weight: 500;

                color: #222;
            }
            .user-lv {
                width: 54rpx;
                height: 28rpx;
            }
        }
        .review-time {
            font-size: 22rpx;
            font-weight: 400;

            color: #777;
        }
        .review-star {
            .star-txt {
                font-size: 26rpx;

                color: #111;
            }
        }
        .recommend {
            font-size: 26rpx;
            font-weight: 400;
        }
        ::v-deep .review-pics {
            display: inline-flex;
            overflow: hidden;

            width: 100%;
            margin: 14rpx 0 20rpx;

            border-radius: 20rpx;
            .pic {
                image {
                    display: block;

                    width: 174rpx;
                    height: 174rpx;
                }
            }
            .pic + .pic {
                margin-left: 7rpx;
            }
        }
        .ugc-line {
            width: 100%;
            height: 2rpx;

            transform: scaleY(.5);

            opacity: .5;
            background: #e1e1e1;
        }
    }
    .ugc-more {
        font-size: 26rpx;
        font-weight: 400;

        color: #111;
    }
}

</style>