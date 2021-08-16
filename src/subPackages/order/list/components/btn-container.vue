<template>
  <view class="btn-container">
    <u-button
      size="mini"
      :ripple="true"
      v-show="status == '1'"
      shape="circle"
      type="error"
      @click="continuePay(orderId)"
    >
      立即付款
    </u-button>
    <u-button
      size="mini"
      :ripple="true"
      v-show="status == '2'"
      shape="circle"
      type="warning"
      @click="refundOrderRefund(orderId)"
    >
      退款
    </u-button>
    <u-button
      size="mini"
      :ripple="true"
      v-show="status == '1'"
      shape="circle"
      type="warning"
      @click="cancelOrder(orderId)"
    >
      取消
    </u-button>
    <u-button
      class="u-margin-right-10"
      size="mini"
      :ripple="true"
      shape="circle"
      @click="isShowDeleteModal = true"
    >
      删除
    </u-button>
    <u-modal
      v-model="isShowDeleteModal"
      title="确认删除订单？"
      content="删除后将无法恢复和查看订单"
      show-cancel-button
      @confirm="deleteOrder(orderId)"
    ></u-modal>
  </view>
</template>

<script>
export default {
  props: {
    orderId: String,
    status: String,
  },
  data() {
    return {
      isShowDeleteModal: false,
    };
  },
  methods: {
    cancelOrder(id) {
      this.$u.api
        .cancelOrder({
          orderId: id,
          operate: 'cancel',
        })
        .then(e => {
          console.log(e);
          this.$emit('change', { type: 'cancel', id });
        });
    },
    deleteOrder(id) {
      this.$u.api
        .cancelOrder({
          orderId: id,
          operate: 'delete',
        })
        .then(e => {
          console.log(e);
          this.$emit('change', { type: 'delete', id });
        });
    },
    continuePay(id) {
      this.$u.api.continuePay(id).then(e => {
        console.log(e);
        this.$emit('change', { type: 'pay', id });
      });
    },
    refundOrderRefund(id) {
      this.$u.api.refundOrderRefund(id).then(e => {
        console.log(e);
        this.$emit('change', { type: 'refund', id });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.btn-container {
    u-button {
        margin-left: 20rpx;
    }
}

</style>