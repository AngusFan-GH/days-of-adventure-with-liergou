<template>
  <view class="progress_box">
    <canvas class="progress_bg" canvas-id="cpbg"></canvas>
    <canvas class="progress_bar" canvas-id="cpbar"></canvas>
    <view class="progress_info" :class="{ overtime: duration > 300 }">{{ vduration }}</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      progress_num: 0, // 进度条占比
      duration: 300, // 剩余倒计时时间（5分钟），秒
    };
  },
  /**
   * mask遮罩
   * @description 圆弧倒计时
   * @property {number} countDownTime 默认是5分钟倒计时
   * @property {String} orderUpdateTime 接口返回的updateTime，根据这个来判断是否在5分钟倒计时内
   */
  props: {
    countDownTime: {
      type: Number,
      default: 300,
    },
    orderUpdateTime: {
      type: String,
      default: 0,
    },
    overTimeLabel: {
      type: String,
      default: '已取消',
    },
  },
  watch: {
    progress_num(newV, oldV) {
      newV = parseInt(newV);
      if (newV >= 300) {
        let s = Math.round((this.progress_num / this.countDownTime) * 100);
        this.drawCircle(s, '#F39780');
      } else {
        let s = Math.round((this.progress_num / this.countDownTime) * 100);
        this.drawCircle(s);
      }
    },
  },
  computed: {
    // 圆环内的内容，倒计时或者文字提示
    vduration() {
      let h;
      let s = this.duration;
      if (s <= 300 && s > 0) {
        h = Math.floor(s / 60);
        s = s % 60;
        h += '';
        s += '';
        h = h.length == 1 ? '0' + h : h;
        s = s.length == 1 ? '0' + s : s;
        return h + ':' + s;
      } else {
        this.$emit('onOverTimeHander');
        this.drawProgressbg('#F39780');
        return this.overTimeLabel;
      }
    },
  },
  mounted: function () {
    this.drawProgressbg('#E9E9E9');
    this.init();
  },
  methods: {
    init() {
      let _this = this;
      let updateTime = this.orderUpdateTime.replace(/-/g, '/'); // 时间格式化
      var date = new Date(updateTime).getTime();
      let currentTime = new Date().getTime();
      this.progress_num = Math.round((currentTime - date) / 1000);
      let differTime = this.countDownTime - this.progress_num; // 时间差
      if (differTime <= 0) {
        // 已超时
        this.progress_num = this.countDownTime;
        this.duration = this.countDownTime + 1;
        this.$emit('onOverTimeHander');
        this.drawProgressbg('#F39780');
      } else {
        // 未超时
        this.duration = differTime;
        let interval = setInterval(function () {
          // 圆环进度++
          _this.progress_num++;
          // 倒计时--
          _this.duration--;
          if (_this.progress_num >= _this.countDownTime || _this.duration <= 0) {
            _this.progress_num = this.countDownTime;
            _this.duration = this.countDownTime + 1;
            clearInterval(interval);
            interval = null;
          }
        }, 1000);
      }
    },
    drawProgressbg: function (bgcolor) {
      // 自定义组件实例 this ，表示在这个自定义组件下查找拥有 canvas-id 的 <canvas/>
      var ctx = uni.createCanvasContext('cpbg', this);
      ctx.setLineWidth(12); // 设置圆环的宽度
      ctx.setStrokeStyle(bgcolor); // 设置圆环的颜色
      ctx.setLineCap('round'); // 设置圆环端点的形状
      ctx.beginPath(); //开始一个新的路径
      ctx.arc(55, 55, 40, 0.75 * Math.PI, 0.25 * Math.PI, false);
      //设置一个原点(55,55)，半径为100的圆的路径到当前路径
      ctx.stroke(); //对当前路径进行描边
      ctx.draw();
    },
    drawCircle: function (step, bgcolor) {
      var ctx = uni.createCanvasContext('cpbar', this);
      // 进度条的渐变(中心x坐标-半径-边宽，中心Y坐标，中心x坐标+半径+边宽，中心Y坐标)
      var gradient = ctx.createLinearGradient(28, 55, 192, 55);
      gradient.addColorStop('0', bgcolor ? bgcolor : '#8ABEFD');
      gradient.addColorStop('1.0', bgcolor ? bgcolor : '#157dfb');
      ctx.setLineWidth(12);
      ctx.setStrokeStyle(gradient);
      ctx.setLineCap('round');
      ctx.beginPath();
      // 参数step 为绘制的百分比
      step = 0.015 * step + 0.75;
      if (step >= 2) {
        step = step % 2;
      }
      ctx.arc(55, 55, 40, 0.75 * Math.PI, step * Math.PI, false);
      ctx.stroke();
      ctx.draw();
    },
  },
};
</script>

<style>
.progress_box {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.progress_bg,
.progress_bar {
  position: absolute;
  width: 110px;
  height: 110px;
}
.progress_info {
  font-size: 30upx;
  letter-spacing: 2upx;
  color: rgb(21, 125, 251);
}
.overtime {
  color: #f39780;
}
</style>
