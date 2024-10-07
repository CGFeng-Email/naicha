<template>
	<!-- 禁止滚动穿透，要在第一个节点 -->
	<page-meta :page-style="'overflow:' + (popup ? 'hidden' : 'visible')"></page-meta>

	<view class="bottom_cart" @click="openPopup" v-if="total_shoppingList_quatity > 0">
		<view class="content">
			<view class="icon">
				<image src="/static/gouwuche.png" mode="aspectFit"></image>
				<text class="num">{{ total_shoppingList_quatity }}</text>
			</view>
			<view class="price">合计:￥{{ total_shoppingList_price }}</view>
		</view>
		<view class="btn">去结算</view>
	</view>

	<!-- 列表弹窗 -->
	<uni-popup class="uni_popup" ref="popup" type="bottom" border-radius="10px 10px 0 0" mask-background-color="rgba(0,0,0,.7)" @change="popupChange">
		<view class="store_list">
			<view class="clear">
				<uni-icons class="icon" type="trash" size="24" color="#999" @click="cartEmpty"></uni-icons>
			</view>
			<view class="list">
				<block v-for="item in shoppingList" :key="item._id">
					<view class="item">
						<image :src="item.goods_image" mode="aspectFit"></image>
						<view class="content">
							<view class="title">{{ item.goods_name }}</view>
							<view class="specification" v-if="item.selectAttrList">
								<text class="text" v-for="item2 in item.selectAttrList" :key="item2.name">{{ item2.name2 }}/</text>
							</view>
							<view class="price">￥{{ item.goods_price }}</view>
						</view>
						<view class="goods_select">
							<image src="/static/jian-goods.png" mode="widthFix" @click.stop="deCrement(item)" />
							<text>{{ item.quantity }}</text>
							<image src="/static/jia-goods.png" mode="widthFix" @click.stop="inCrement(item)" />
						</view>
					</view>
				</block>
			</view>
		</view>
	</uni-popup>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useState } from '@/hooks/useState.js';
import { useGetters } from '@/hooks/useGetters';
const useStorefn = useStore();

const popup = ref(false);
const openPopup = () => {
	popup.value.open();
};

const popupChange = (e) => {
	popup.value = e.show;
};

const { shoppingList } = useState(['shoppingList']);
const { total_shoppingList_price, total_shoppingList_quatity } = useGetters(['total_shoppingList_price', 'total_shoppingList_quatity']);

// 商品数量 - 加
const inCrement = (item) => {
	useStorefn.commit('cartShoppingQuantityAdd', item);
};

// 商品数量 - 减
const deCrement = (item) => {
	useStorefn.commit('cartShoppingQuantitydel', item);
};

// 监听购物车列表， 当商品数量 == 0，关闭弹窗
watch(total_shoppingList_quatity, (newVal) => {
	if (newVal == 0) {
		popup.value.close();
	}
});

// 一键清空购物车商品列表
const cartEmpty = () => {
	useStorefn.commit('emptyShoppingList');
};
</script>

<style lang="scss" scoped>
.bottom_cart {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 750rpx;
	height: 100rpx;
	background: #fff;
	box-shadow: 0 0 6rpx rgba(0, 0, 0, 0.1);
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx;
	z-index: 10000;

	.content {
		flex: 1;
		display: flex;
		align-items: center;
		.icon {
			height: 80rpx;
			display: flex;
			align-items: center;
			position: relative;
			image {
				width: 60rpx;
			}
			.num {
				position: absolute;
				top: 0;
				right: -6rpx;
				width: 30rpx;
				height: 30rpx;
				background: #204cd4;
				text-align: center;
				line-height: 30rpx;
				border-radius: 50%;
				font-size: 24rpx;
				color: #fff;
			}
		}

		.price {
			padding-left: 30rpx;
			font-size: 32rpx;
			color: #ff0000;
			font-weight: 600;
		}
	}
	.btn {
		flex: none;
		width: 220rpx;
		height: 80rpx;
		text-align: center;
		line-height: 80rpx;
		background: #204cd4;
		border-radius: 8rpx;
		color: #fff;
	}
}

.uni_popup {
	bottom: 100px;
}

.store_list {
	background: #fff;
	border-radius: 20rpx 20rpx 0 0;
	padding: 20rpx 20rpx 50rpx;
	.clear {
		text-align: right;
		.icon {
			display: inline-block;
		}
	}

	.list {
		max-height: 800rpx;
		overflow-y: auto;
		.item {
			display: flex;
			padding: 20rpx 0;
			border-bottom: 1px solid rgba(0, 0, 0, 0.1);
			image {
				width: 140rpx;
				height: 140rpx;
				flex: none;
			}

			.content {
				padding-left: 20rpx;
				flex: 1;
				display: flex;
				justify-content: space-between;
				flex-direction: column;
				justify-content: flex-start;

				.title {
					font-size: 28rpx;
					line-height: 38rpx;
					color: #000;
					font-weight: 600;
				}

				.specification {
					font-size: 26rpx;
					color: #ddd;
					padding: 10rpx 0;
					display: flex;
					align-items: center;
				}

				.price {
					font-size: 32rpx;
					color: #ff0000;
					font-weight: bold;
				}
			}

			.goods_select {
				flex: none;
				display: flex;
				align-items: center;
				image {
					width: 64rpx;
				}
				text {
					padding: 0 24rpx;
				}
			}
		}
	}
}
</style>
