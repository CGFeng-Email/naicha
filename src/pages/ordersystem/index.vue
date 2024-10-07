<template>
	<!-- 顶部组件 -->
	<TopArea></TopArea>
	<!-- 点单列表 -->
	<view class="order-menu">
		<!-- 左边 -->
		<scroll-view class="scroll-height-left" scroll-y enhanced enable-passive :show-scrollbar="false">
			<view class="left-goods" :class="{ activeStyle: index == leftIndex }" v-for="(item, index) in cartgoryList" :key="item._id" @click="leftItem(index, item._id)">
				<view class="icon">
					<i :class="'iconfont' + ' ' + item.icon"></i>
				</view>
				<text class="title">{{ item.category_name }}</text>
			</view>
		</scroll-view>

		<!-- 右边 -->
		<scroll-view class="scroll-height-right" scroll-y enhanced enable-passive :show-scrollbar="false" :scroll-into-view="scrollToViewId" @scroll="rightScroll">
			<view class="item-goods" v-for="(item, index) in cartgoryList" :key="item._id" :id="`A${item._id}`">
				<view class="category-title">{{ item.category_name }}</view>
				<view class="goods-infor" v-for="(item_a, index2) in item.category" :key="item_a.category_id" @click="jumpOrderDetails(item._id, item_a)">
					<image :src="item_a.goods_image" mode="aspectFit" />
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
								<view class="select-quantity" v-if="item_a.goods_stats">
									<button>选规格</button>
									<view class="state_quantity" v-if="item_a.quantity > 0">
										{{ item_a.quantity }}
									</view>
								</view>
								<!-- 选择数量 -->
								<view v-else class="select-goods single-goods">
									<image
										src="/static/jian-goods.png"
										mode="widthFix"
										v-if="item_a.quantity > 0"
										@click.stop="
											deCrement(index, index2, item._id, item_a.category_id, item_a.goods_image, item_a.goods_name, item_a.goods_describe, item_a.goods_price)
										"
									/>
									<text v-if="item_a.quantity > 0">{{ item_a.quantity }}</text>
									<image
										src="/static/jia-goods.png"
										mode="widthFix"
										@click.stop="
											inCrement(index, index2, item._id, item_a.category_id, item_a.goods_image, item_a.goods_name, item_a.goods_describe, item_a.goods_price)
										"
									/>
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
import { ref, getCurrentInstance, watch } from 'vue';
// 顶部组件
import TopArea from './components/Top-area.vue';
// 底部购物车组件
import ShoppingCart from './components/Shopping-cart.vue';
// 接口api
import { cartgoryAPI } from '@/api/api.js';
import require from '@/api/require.js';
// store
import { useStore } from 'vuex';
const useStorefn = useStore();
import { useState } from '@/hooks/useState.js';
const { shoppingList } = useState(['shoppingList']);
console.log('shoppingList', shoppingList);

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
	leftIndex.value = index;
	scrollToViewId.value = 'A' + _id;

	// 解决：跳转到指定位置之后，重新再点击不会再触发点击跳转到指定位置
	setTimeout(() => {
		scrollToViewId.value = '';
	}, 200);
};

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
};

// 获取右边列表节点信息
const getRightItem = () => {
	let itemHeight = 0;
	const query = uni.createSelectorQuery().in(that);
	query
		.selectAll('.item-goods')
		.boundingClientRect((data) => {
			// 累计之前的item高度，生成一个新的数组
			data.forEach((item) => {
				itemHeight += item.height;
				rightScrollItemHeight.value.push(itemHeight);
			});
		})
		.exec();
	// console.log('rightScrollItemHeight:', rightScrollItemHeight.value);
};

// 跳转订单详情
const jumpOrderDetails = (_id, item) => {
	item._id = _id;
	uni.navigateTo({
		url: '/pages/placeOrder/index?item=' + JSON.stringify(item)
	});
};

// 获取分类列表
const cartgory = async () => {
	const res = await require(cartgoryAPI);
	console.log('分类列表', res);
	cartgoryList.value = res.data;

	// 延迟1秒获取节点数据
	setTimeout(() => {
		getRightItem();
	}, 1000);
};

cartgory();

// 是否需要返回上一页
const returnPage = ref(false);
// 没规格 - 添加商品
const inCrement = (index, index2, _id, category_id, goods_image, goods_name, goods_describe, goods_price) => {
	// 当前商品数量加1
	cartgoryList.value[index].category[index2].quantity += 1;
	const quantity = cartgoryList.value[index].category[index2].quantity;
	useStorefn.commit('addShoppingState', { _id, category_id, goods_image, goods_name, goods_describe, goods_price, quantity, returnPage });
};

// 没规格 - 减少/商品
const deCrement = (index, index2, _id, category_id, goods_image, goods_name, goods_describe, goods_price) => {
	// 当前商品数量加1
	cartgoryList.value[index].category[index2].quantity -= 1;
	const quantity = cartgoryList.value[index].category[index2].quantity;
	if (quantity > 0) {
		useStorefn.commit('addShoppingState', { _id, category_id, goods_image, goods_name, goods_describe, goods_price, quantity, returnPage });
	} else {
		// 当购买数量 == 0时，删除商品
		useStorefn.commit('delShoppingState', { _id, category_id });
	}
};

// 同步列表和store商品列表数量
watch([() => shoppingList.value.map((item) => item.quantity), () => shoppingList.value.map((item) => item.category_id)], ([newVal, idNewVal], [oldVal, idOldVal]) => {
	console.log('newVal', newVal);
	console.log('oldVal', oldVal);
	console.log('idNewVal', idNewVal);
	console.log('idOldVal', idOldVal);

	// 底部购物车，减少商品到1时，同步到列表
	if (idNewVal.length < idOldVal.length) {
		for (let i in idOldVal) {
			if (idNewVal[i] != idOldVal[i]) {
				// 得出不等
				var id = idOldVal[i];
				console.log('不等的id', id);
				break;
			}
		}
		// 循环，找出子级id所在的商品
		cartgoryList.value.forEach((item, index) => {
			item.category.forEach((item2, index2) => {
				if (item2.category_id == id) {
					cartgoryList.value[index].category[index2].quantity = 0;
				}
			});
		});
	}

	for (let i in newVal) {
		if (newVal[i] != oldVal[i]) {
			// 得到当前商品数量不相当的哪一项商品
			var shoppingItem = shoppingList.value[i];
			console.log('shoppingItem', shoppingItem);
			break;
		}
	}
	// 如果监听数组长度为0，断掉
	if (newVal.length <= 0) return;

	// 处理规格不相同时的购买数量问题，同一个商品id，所有购买数量累加
	let quantity = 0;
	shoppingList.value.forEach((item) => {
		if (shoppingItem && item.category_id == shoppingItem.category_id) {
			quantity += item.quantity;
		}
	});

	if (shoppingItem) {
		// 根据父分类id查询下标
		const fatherIndex = cartgoryList.value.findIndex((item) => item._id == shoppingItem._id);
		console.log('fatherIndex', fatherIndex);
		if (fatherIndex != -1) {
			// 根据商品id查询子级categort列表下标
			const categoryIndex = cartgoryList.value[fatherIndex].category.findIndex((item) => item.category_id == shoppingItem.category_id);
			console.log('categoryIndex', categoryIndex);
			// 更新对应的商品数量
			cartgoryList.value[fatherIndex].category[categoryIndex].quantity = quantity;
		}
	}
});

// 当购物车一键清空时，所有商品的数量=0
watch(
	() => shoppingList.value,
	(newVal) => {
		console.log('当购物车一键清空时,所有商品的数量=0', newVal);
		if (newVal.length <= 0) {
			if (cartgoryList.value.length > 0) {
				cartgoryList.value.forEach((item) => {
					item.category.forEach((item2) => {
						item2.quantity = 0;
					});
				});
			}
		}
	}
);
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

.select-quantity .state_quantity {
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
