<template>
  <!-- 顶部组件 -->
  <TopArea></TopArea>
  <!-- 点单列表 -->
  <view class="order-menu">
    <!-- 左边 -->
    <scroll-view class="scroll-height-left" scroll-y enhanced enable-passive :show-scrollbar="false">
      <view class="left-goods" :class="{ 'activeStyle': index == leftIndex }" v-for="(item, index) in cartgoryList"
        :key="item._id" @click="leftItem(index, item._id)">
        <view class="icon">
          <i :class="'iconfont' + ' ' + item.icon"></i>
        </view>
        <text class="title">{{ item.category_name }}</text>
      </view>
    </scroll-view>
    <!-- 右边 -->

    <scroll-view class="scroll-height-right" scroll-y enhanced enable-passive :show-scrollbar="false"
      :scroll-into-view="scrollToViewId" @scroll="rightScroll">
      <view class="item-goods" v-for="(item) in cartgoryList" :key="item._id" :id="`A${item._id}`">
        <view class="category-title">{{ item.category_name }}</view>
        <view class="goods-infor" v-for="(item_a) in item.category" :key="item_a.category_id" @click="jumpOrderDetails(item_a)">
          <image :src="item_a.goods_image" mode="aspectFill" />
          <view class="product-name">
            <view class="googs-name">{{ item_a.goods_name }}</view>
            <view class="googs-intro over3">{{ item_a.goods_describe }}</view>
            <view class="select-goods">
              <view class="goods-price">
                <text>¥{{ item_a.goods_price }}</text>
                <text>起</text>
              </view>
              <!-- 有库存 -->
              <block v-if="item_a.goods_stock > 0">
                <!-- 默认展示选规格 -->
                <view class="select-quantity" v-if="item_a.quantity <= 0">
                  <button>选规格</button>
                </view>
                <!-- 选择数量 -->
                <view v-else class="select-goods single-goods">
                  <image src="/static/jian-goods.png" mode="widthFix" v-if="item_a.quantity > 0" />
                  <text v-if="item_a.quantity > 0">{{ item_a.quantity }}</text>
                  <image src="/static/jia-goods.png" mode="widthFix" />
                </view>
              </block>
              <view v-else>
                <button disabled>已售罄</button>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view style="height: 400rpx"></view>
    </scroll-view>
  </view>
  <!-- 底部购物车组件 -->
  <ShoppingCart></ShoppingCart>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue';
// 顶部组件
import TopArea from './components/Top-area.vue';
// 底部购物车组件
import ShoppingCart from "./components/Shopping-cart.vue";
// 接口api
import { cartgoryAPI } from '@/api/api.js';
import require from '@/api/require.js';

// 分类列表
const cartgoryList = ref([]);

// 左边scroll索引
const leftIndex = ref(0);

// 右边列表滚动到指定id
const scrollToViewId = ref('');

// that
const that = getCurrentInstance();

// 记录，计算右边每个节点的高度，从第二个开始，累加之前的高度
const rightScrollItemHeight = ref([]);

// 左边scroll - item点击
const leftItem = (index, _id) => {
  leftIndex.value = index
  scrollToViewId.value = 'A' + _id;

  // 解决：跳转到指定位置之后，重新再点击不会再触发点击跳转到指定位置
  setTimeout(() => {
    scrollToViewId.value = '';
  }, 200)
}

// 右边scroll - 滚动回调
const rightScroll = (e) => {
  let scrollTop = e.detail.scrollTop;
  // console.log('scrollTop', scrollTop);

  if (scrollTop >= rightScrollItemHeight.value[leftIndex.value]) {
    // 往上滚动
    leftIndex.value += 1;
  } else if (scrollTop < rightScrollItemHeight.value[leftIndex.value - 1]) {
    // 往下滚动
    leftIndex.value -= 1;
  }
}

// 获取右边列表节点信息
const getRightItem = () => {
  let itemHeight = 0;
  const query = uni.createSelectorQuery().in(that);
  query.selectAll(".item-goods").boundingClientRect((data) => {
    // 累计之前的item高度，生成一个新的数组
    data.forEach(item => {
      itemHeight += item.height;
      rightScrollItemHeight.value.push(itemHeight);
    })
  }).exec();
  console.log('rightScrollItemHeight:', rightScrollItemHeight.value);
}

// 跳转订单详情
const jumpOrderDetails = (item) => {
  uni.navigateTo({
    url: '/pages/placeOrder/index?item=' + JSON.stringify(item)
  })
}

// 获取分类列表
const cartgory = async () => {
  const res = await require(cartgoryAPI);
  console.log('分类列表', res);
  cartgoryList.value = res.data;

  // 延迟1秒获取节点数据
  setTimeout(() => {
    getRightItem();
  }, 1000)
}

cartgory();

</script>

<style lang="scss" scoped>
/* 点餐区域 */
.order-menu {
  display: flex;
}

/* 左边商品分类滚动 */
.scroll-height-left {
  height: 100vh;
  width: 175rpx;
  background-color: #f8f8f8;
  position: fixed;
  left: 0;
}

.left-goods {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 25rpx;
  padding: 15rpx 0;
}

.icon {
  .iconfont {
    font-size: 44rpx;
    color: #777777;
  }
}

.left-goods .title {
  padding-top: 10rpx;
  color: #777777;
}

.activeStyle {
  background-color: antiquewhite;
}

/* 右边商品 */
.scroll-height-right {
  flex: 1;
  padding: 0 20rpx;
  height: 100vh;
  position: fixed;
  right: 0;
  left: 175rpx;
  width: auto;
}

.item-goods {
  padding-top: 35rpx;
}

.category-title {
  font-weight: bold;
}

.goods-infor {
  display: flex;
  align-items: center;
  padding-top: 35rpx;
}

.goods-infor image {
  width: 170rpx;
  height: 170rpx;
  border-radius: 15rpx;
}

.product-name {
  flex: 1;
  padding-left: 15rpx;
}

.googs-name {
  font-weight: bold;
  font-size: 29rpx;
}

.googs-intro {
  line-height: 1.4;
  color: #b8b8b8;
  font-size: 25rpx;
  margin: 13rpx 0;
}

.select-goods {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.goods-price {
  display: flex;
  flex: 1;
}

.goods-price text:nth-child(1) {
  font-size: 30rpx;
  font-weight: bold;
  padding-right: 10rpx;
}

.goods-price text:nth-child(2) {
  font-size: 24rpx;
  color: #b8b8b8;
  align-self: flex-end;
}

.select-quantity {
  position: relative;
}

.select-quantity button {
  font-size: 28rpx;
  line-height: inherit;
  background-color: #214bd5;
  color: #ffffff;
  padding: 5rpx 20rpx;
  border-radius: 40rpx;
}

.select-quantity text {
  position: absolute;
  top: -7rpx;
  right: 0;
  background: bisque;
  border-radius: 50%;
  width: 30rpx;
  height: 30rpx;
  font-size: 18rpx;
  text-align: center;
  line-height: 30rpx;
}

.single-goods image {
  width: 45rpx;
}

.single-goods text {
  font-size: 26rpx;
  width: 63rpx;
  text-align: center;
}
</style>