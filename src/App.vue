<script setup>
import require from '@/api/require';
import { shopInfo } from '@/api/api';
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
onLaunch(async () => {
  // 获取胶囊坐标
  const getMenuButton = uni.getStorageSync('menuButton');
  if (!getMenuButton) {
    // 获取胶囊信息api
    const res = uni.getMenuButtonBoundingClientRect();
    uni.setStorageSync('menuButton', res);
  }

  // 获取店铺信息
  const getShopInfo = uni.getStorageSync('shopInfo');
  if (!getShopInfo) {
    const res = await require(shopInfo);
    uni.setStorageSync('shopInfo', res)
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
