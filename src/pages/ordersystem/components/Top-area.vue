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
        <text>预计需要：{{ duration }}</text>
      </view>
    </view>
  </view>
  <!-- 整个组件占位符 -->
  <view :style="{ 'height': topHeight }"></view>
</template>


<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue';
import useMenuButton from '@/hooks/useMenuButton.js';
// 店铺信息
import { useShopInfo } from '@/hooks/useShopInfo.js';
console.log(useShopInfo());
// 计算距离
import { useDistance, useTime } from '@/hooks/useHooks.js';

// 整个组件的占位符高度
const topHeight = ref(0);
// that
const that = getCurrentInstance();
// 腾讯地图key
const mapKey = ref('M7ABZ-A7FKG-UXXQ4-QLQJF-XACTJ-FLBBB');
// 交通计算方式
const mapMode = ref('driving');
// 用户经纬度
const userLocation = ref('');
// 店铺经纬度
const shopLocation = ref('');
// 距离
const km = ref('');
// 预计到达分钟
const duration = ref('');


// 顶部组件脱离了文本流，获取到顶部组件的具体高度，做一个占位符
// 使用获取节点api，需要在mounted后
onMounted(() => {
  const query = uni.createSelectorQuery().in(that);
  query.select(".search-view").boundingClientRect((data) => {
    console.log('data', data);
    topHeight.value = data.height + 'px'
  }).exec();
})

// 根据店铺的经纬度和用户的经纬度计算出到达的距离km，和到达时间

// 计算距离
const distance = async (from, to) => {
  uni.request({
    url: `https://apis.map.qq.com/ws/distance/v1/matrix?key=${mapKey.value}&mode=${mapMode.value}&from=${from}&to=${to}`,
    success: res => {
      console.log('距离', res);
      if (res.statusCode == 200) {
        if (res.data.result) {
          const distance = res.data.result.rows[0].elements[0].distance;
          console.log('distance', distance);
          km.value = useDistance(Number(distance))
          const time = res.data.result.rows[0].elements[0].duration;
          duration.value = useTime(time);

        } else {
          uni.showToast({
            title: res.data.message,
            icon: 'none'
          });
        }
      }
    }
  })
}

// 获取用户经纬度
const getLocation = () => {
  uni.getLocation({
    type: 'wgs84',
    success: function (res) {
      // console.log('获取经纬度', res);
      // 计算到达店铺的距离
      userLocation.value = res.latitude + ',' + res.longitude;
      shopLocation.value = useShopInfo().location[1] + ',' + useShopInfo().location[0]
      if (userLocation.value && shopLocation.value) {
        distance(userLocation.value, shopLocation.value);
      }
    }
  });
}

// 提示必须要开启定位授权
const hintLocation = () => {
  uni.authorize({
    scope: 'scope.userLocation',
    success: scope => {
      // 授权了
      if (scope.errMsg == 'authorize:ok') {
        // 获取经纬度
        getLocation();
      }
    },
    fail: err => {
      uni.getSetting({
        success(res) {
          if (res.authSetting['scope.userLocation']) {
            // 获取经纬度
            getLocation()
          } else {
            uni.showModal({
              title: '地址位置未授权',
              content: '请开启定位才可以下单',
              success: res => {
                if (res.confirm) {
                  // 跳转到权限设置页面
                  uni.openSetting({
                    success(setting) {
                      if (setting.authSetting['scope.userLocation']) {
                        // 获取经纬度
                        getLocation();
                      }
                    }
                  });
                } else if (res.cancel) {
                  // 再次调起提示弹窗
                  hintLocation();
                }
              }
            })
          }
        }
      })
    }
  })
}

hintLocation()

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

.distance-view {
  display: flex;
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

.distance-view text:nth-child(2) {
  flex: 1;
}
</style>
