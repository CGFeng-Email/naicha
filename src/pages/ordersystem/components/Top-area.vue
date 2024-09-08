<template>
  <view class="search-view">
    <!-- 占位符,手机顶部到胶囊的高度 -->
    <view :style="{ 'height': useMenuButton().top }"></view>
    <!-- 搜索 -->
    <view class="search-input">
      <image src="/static/sousuo.png" mode="widthFix" />
      <input placeholder="搜索商品" placeholder-class="input-color" disabled />
    </view>
    <!-- 店铺信息 -->
    <view class="merchant-store">
      <view class="address-view">
        <image src="/static/xing.png" mode="widthFix" />
        <text>拯救星球</text>
        <text>外送到家</text>
      </view>
      <view class="distance-view">
        <image src="/static/weizhi.png" mode="widthFix" />
        <text>商家距离你16.88km</text>
      </view>
    </view>
  </view>
  <!-- 整个组件占位符 -->
  <view :style="{ 'height': topHeight }"></view>
</template>


<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue';
import useMenuButton from '@/hooks/useMenuButton.js';

// 整个组件的占位符高度
const topHeight = ref(0);
// that
const that = getCurrentInstance();

// 顶部组件脱离了文本流，获取到顶部组件的具体高度，做一个占位符
// 使用获取节点api，需要在mounted后
onMounted(() => {
  const query = uni.createSelectorQuery().in(that);
  query.select(".search-view").boundingClientRect((data) => {
    console.log('data', data);
    topHeight.value = data.height + 'px'
  }).exec();
})
</script>

<style lang="scss" scoped>
/* 顶部搜索框 */
.search-view {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9;
  background-color: #FFFFFF;
}

.search-input {
  height: v-bind('useMenuButton().height');
  width: v-bind('useMenuButton().left');
}

.search-input input {
  height: v-bind('useMenuButton().height');
}

/*  距离和配送范围 */
.merchant-store {
  height: 150rpx;
  font-size: 34rpx;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 20rpx;
}

.merchant-store view {
  display: flex;
  align-items: center;
  padding: 10rpx 0;
}

.address-view text {
  padding: 0 10rpx;
}

.address-view text:nth-child(2) {
  flex: 1;
}

.address-view image {
  width: 30rpx;
}

.distance-view image {
  width: 27rpx;
}

.distance-view text {
  font-size: 28rpx;
  color: #999999;
  font-weight: initial;
  padding-left: 15rpx;
}
</style>
