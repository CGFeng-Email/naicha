<template>
  <!-- banner -->
  <view class="swiper_view">
    <swiper class="banner_swiper" autoplay circular :current="indicationIndex" @change="bannerSwiperChange">
      <swiper-item class="item" v-for="(item) in swiperList" :key="item.src">
        <image class="cover" :src="item.src" mode="scaleToFill" />
      </swiper-item>
    </swiper>
    <view class="indication">
      <text class="point" :class="{ 'active': index == indicationIndex }" v-for="(item, index) in swiperList"
        :key="item.src"></text>
    </view>
  </view>

  <!-- 到店自取 -->
  <view class="order_methods">
    <view class="item" v-for="(item) in order_methods" :key="item.src">
      <image class="cover" :src="item.src" mode="widthFix" />
      <view class="title">{{ item.title }}</view>
    </view>
  </view>

  <!-- 广告 -->
  <view class="advertising">
    <swiper class="advertising_swiper" autoplay circular>
      <swiper-item class="item" v-for="(item) in advertisingList" :key="item.src">
        <image class="cover" :src="item.src" mode="scaleToFill" />
      </swiper-item>
    </swiper>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import require from '@/api/require.js';
import { homeBnanerListAPI, advertisingListAPI } from '@/api/api.js';

// 轮播图
const swiperList = ref([]);

// 广告轮播
const advertisingList = ref([]);

// banner swiper 下标
const indicationIndex = ref(0)

// banner swiper切换回调
const bannerSwiperChange = e => {
  indicationIndex.value = e.detail.current
}

const order_methods = ref([
  {
    src: '../../static/daodian.png',
    title: '到店自取'
  },
  {
    src: '../../static/waimai.png',
    title: '外卖送餐'
  }
])

// 请求 - 获取banner轮播
const getSwiperList = async () => {
  const data = await require(homeBnanerListAPI);
  swiperList.value = data.data;
}

// 请求 - 获取广告轮播
const getAdvertisingList = async () => {
  const data = await require(advertisingListAPI);
  advertisingList.value = data.data
}

getSwiperList();
getAdvertisingList()
</script>

<style lang="scss" scoped>
.swiper_view {
  position: relative;

  .banner_swiper {
    height: 1000rpx;

    .cover {
      width: 100%;
      height: 1000rpx;
    }
  }

  .indication {
    position: absolute;
    z-index: 20;
    bottom: 40rpx;
    left: 0;
    width: 100%;
    display: flex;
    padding: 0 40rpx;

    .point {
      width: 40rpx;
      height: 8rpx;
      border-radius: 6rpx;
      background: #c3c5c5;
      margin: 0 4rpx;
    }

    .active {
      background: #1d49c4;
    }
  }
}

.order_methods {
  display: flex;
  padding: 20rpx 10rpx;
  background: #f2f2f2;

  .item {
    width: 50%;
    height: 260rpx;
    margin: 0 10rpx;
    background: #fff;
    border-radius: 12rpx;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .cover {
      width: 150rpx;
    }

    .title {
      margin-top: 10rpx;
      font-size: 28rpx;
      font-weight: 600;
    }
  }
}

.advertising {
  padding: 0 10px 20rpx;
  background: #f2f2f2;

  .advertising_swiper {
    width: 100%;

    .cover {
      width: 100%;
      height: 500rpx;
      border-radius: 12rpx;
    }
  }
}
</style>
