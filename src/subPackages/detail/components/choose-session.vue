<template>
  <view class="choose-session">
    <u-button
      shape="circle"
      :ripple="true"
      :custom-style="customStyle"
      @click="openChooseSession()"
    >
      <text class="btn-text">选择场次并预订</text>
    </u-button>
    <!-- 选择预定场次弹框 -->
    <u-popup
      v-model="showChooseSession"
      mode="bottom"
      :safe-area-inset-bottom="true"
      :closeable="true"
    >
      <view class="u-padding-top-20 choose-session-popup">
        <view class="u-flex u-row-center title">
          <text class="gray-line"></text>
          选择预订场次
          <text class="gray-line"></text>
        </view>
        <view class="week">
          <date-slide-selection
            v-if="showChooseSession"
            :date="date"
            :length="15"
            @change="dateChange"
          ></date-slide-selection>
        </view>
        <view class="main">
          <scroll-view scroll-y="true" class="session-list" v-if="displaySession.length">
            <view
              class="u-flex u-margin-bottom-20 u-padding-left-30 u-padding-right-30 session"
              v-for="(session, index) in displaySession"
              :key="index"
              :class="{
                disabled: session.disabled,
                selected: value && session.uniqueId === value.uniqueId,
              }"
              @click="chooseSession(session)"
            >
              <view class="u-flex-1 info">
                <view class="u-flex info-content">
                  <text class="u-margin-right-12 info-time">{{ session.time }}</text>
                  <text class="info-joint" v-show="data.blockBooking === 1 && !session.timeout">
                    可包场/拼场
                  </text>
                  <text class="info-joint" v-show="data.blockBooking === 0 && !session.timeout">
                    可拼场
                  </text>
                  <text class="info-joint" v-show="session.timeout">已结束</text>
                </view>
                <view
                  class="u-line-1 tip"
                  v-show="
                    !session.disabled &&
                    session.currentPeople &&
                    data.advicePeopleMin - session.currentPeople > 0
                  "
                >
                  已加入{{ session.currentPeople }}人，差
                  <text class="high-light">
                    {{ data.advicePeopleMin - session.currentPeople }}
                  </text>
                  人可开场，最多再加入{{ data.advicePeopleMax - session.currentPeople }}人
                </view>
                <view
                  class="u-line-1 tip"
                  v-show="
                    !session.disabled &&
                    session.currentPeople &&
                    data.advicePeopleMin - session.currentPeople <= 0
                  "
                >
                  已开场，最多再加入
                  <text class="high-light">{{ data.advicePeopleMax - session.currentPeople }}</text>
                  人
                </view>
              </view>
              <view class="price">
                ¥{{ session.price }}/人
                <text v-show="session.disabled && !session.timeout">订满</text>
              </view>
            </view>
          </scroll-view>
          <view v-if="!displaySession.length" class="u-text-center empty">
            <view class="empty-icon"></view>
            <view class="empty-text">暂无可订场次</view>
          </view>
        </view>
        <view class="btn-container">
          <view class="choosed" v-show="!value">尚未选择预订场次</view>
          <view class="choosed" v-show="value">
            <view>
              预订场次：
              <text class="choosed-msg">{{ value.date }} {{ value.time }}</text>
            </view>
            <view v-show="data.blockBooking === 0 && value.currentPeople">
              已加入玩家：
              <text>{{ value.currentPeople }}人</text>
            </view>
          </view>
          <view class="btn" :class="{ disabled: !value }">
            <u-button
              shape="circle"
              :custom-style="customStyle"
              :disabled="!value"
              @click="goToOrder()"
            >
              下一步
              <text v-show="!chosenPeople">，选择人数</text>
            </u-button>
          </view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import { timeFmt } from '@/common/js/utils/time-fmt';
import style from '@/common/style/variable.scss';
export default {
  name: 'choose-session',
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    value: {
      type: Object,
      default: null,
    },
    data: null,
    day: null,
  },
  inject: ['goToOrder'],
  data() {
    return {
      date: null,
      showChooseSession: false,
      displaySession: [],

      customStyle: {
        backgroundColor: style.themeColor,
        color: style.textCommonColor,
        width: '100%',
        height: '74rpx',
        lineHeight: '74rpx',
      },
    };
  },
  methods: {
    openChooseSession() {
      this.$emit('input', null);
      this.showChooseSession = true;
      this.date = null;
      this.$nextTick(() => {
        this.date = this.day || null;
        this.handleDisplaySession(this.date);
      });
    },
    dateChange(e) {
      this.date = e;
      this.$emit('input', null);
      this.handleDisplaySession(e);
    },
    handleDisplaySession(date) {
      let { rooms, advicePeopleMax } = this.data || {};
      rooms = rooms || {};
      date = date || Date.now();
      date = timeFmt(date, 'MM-DD');
      const res = rooms[date] || [];
      this.displaySession = res.map(room => {
        const timeout = new Date(room.roomEndTime.replace(/-/g, '/')).getTime() <= Date.now();
        return {
          time: `${timeFmt(room.roomBeginTime, 'HH:mm')}-${timeFmt(room.roomEndTime, 'HH:mm')}`,
          date: `${timeFmt(this.date, 'dddd')}(${timeFmt(this.date, 'MM-DD')})`,
          disabled: room.status === '2' || room.currentPeople >= advicePeopleMax || timeout,
          timeout,
          ...room,
        };
      });
    },
    chooseSession(session) {
      if (session.disabled) {
        return;
      }
      this.$emit('input', session);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../../common/style/variable.scss';
.choose-session-popup {
    .title {
        font-size: 28rpx;
        line-height: 60rpx;

        height: 64rpx;
        padding: 0 20rpx;

        color: #999;
        background-color: #fff;
        .gray-line {
            width: 100rpx;
            height: 2rpx;
            margin: 0 20rpx;

            background: #eeeef0;
        }
    }
    .week {
        width: 100%;
    }
    .main {
        box-sizing: border-box;
        height: 40vh;
        padding: 30rpx;
        .session-list {
            height: 100%;
        }
        .session {
            height: 120rpx;

            border: 1px solid #eeeef0;
            border-radius: 4rpx;
            &.selected {
                border: 1px solid $theme-color;
                background-color: #fff5f2;
            }
            &.disabled {
                background: #fafafa;
                .info-time,
                .info-joint,
                .price {
                    color: #ccc!important;
                }
            }
            .info {
                overflow: hidden;
                &-content {
                    flex-wrap: nowrap;
                }
                &-time {
                    font-size: 30rpx;

                    color: #666;
                }
                &-joint {
                    font-size: 24rpx;

                    color: #4ba418;
                }
                .tip {
                    color: #999;
                }
            }
            .price {
                font-size: 24rpx;

                white-space: nowrap;

                color: $theme-color;

                flex-shrink: 0;
            }
        }
        .empty {
            &-icon {
                width: 72rpx;
                height: 72rpx;
                margin: 100rpx auto 30rpx;

                background: url(data:image/png;base64,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) no-repeat;
                background-size: 100% 100%;
            }
            &-text {
                font-size: 28rpx;

                color: #999;
            }
        }
    }
    .btn-container {
        width: 100%;

        border-top: 1px solid #eeeef0;
        background-color: #fff;
        .choosed {
            font-size: 26rpx;

            padding: 30rpx;

            color: #999;
            &-msg {
                color: #333;
            }
        }
        .btn {
            padding: 20rpx 30rpx;
            &.disabled {
                opacity: .5;
            }
        }
    }
    .high-light {
        color: $theme-color;
    }
}

</style>>