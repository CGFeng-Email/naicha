<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
onLaunch(() => {
  // 获取胶囊坐标
  const getMenuButton = uni.getStorageSync('menuButton');
  if (!getMenuButton) {
    const res = uni.getMenuButtonBoundingClientRect();
    uni.setStorageSync('menuButton', res);
  }

});
</script>


<style lang="scss">
view {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

/* 搜索框公用 */
.search-input {
  background: #f7f7f7;
  border-radius: 50rpx;
  margin-left: 20rpx;
  display: flex;
  flex-direction: row;
  flex: 1;
  position: relative;
}

.search-input input {
  width: 100%;
  font-size: 28rpx;
  padding-left: 80rpx;
  padding-right: 20rpx;
}

.search-input image {
  width: 35rpx;
  height: 35rpx;
  position: absolute;
  left: 30rpx;
  align-self: center;
}

.input-color {
  color: #c2c2c2;
}
</style>
