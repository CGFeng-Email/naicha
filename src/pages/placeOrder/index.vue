<template>
	<!-- banner -->
	<view class="banner">
		<image class="cover" :src="detailsData.goods_image" mode="aspectFit"></image>
	</view>

	<view class="main">
		<!-- 标题 -->
		<view class="title">{{ detailsData.goods_name }}</view>

		<!-- 描述 -->
		<view class="describe">{{ detailsData.goods_describe }}</view>

		<!-- 规格列表 -->
		<view class="specification">
			<view class="box" v-for="(item, index) in detailsData.goods_stats" :key="item.name">
				<view class="title">{{ item.name }}</view>
				<!-- 规格属性 -->
				<view class="attr_list">
					<!-- 1、规格分类的selected == 规格的id做选中状态 -->
					<!-- 2、规格属性的disabled决定还有没有库存，判断是否能点击 -->
					<view
						class="select_attr"
						:class="{ active: item.selected == item2.statsid, disablled: item2.disabled }"
						v-for="(item2, index2) in item.subAttributes"
						:key="item2._id"
						@click="selectAttr(index, index2, item.selected, item2.statsid, item.name, item2.name)"
					>
						{{ item2.name }}
					</view>
				</view>
			</view>
		</view>
	</view>

	<!-- 底部购物车 -->
	<view class="shopping_cart">
		<view class="dispose">
			<view class="price">￥{{ detailsData.goods_price }}</view>
			<view class="select_number">
				<image class="cover" src="/static/jian-goods.png" v-if="detailsData.quantity > 0" @click="deCrement"></image>
				<text class="num" v-if="detailsData.quantity > 0">{{ detailsData.quantity }}</text>
				<image class="cover" src="/static/jia-goods.png" @click="inCrement"></image>
			</view>
		</view>
		<view class="attr">
			<text class="text" v-for="item in selectAttrList" :key="item.statsid">{{ item.name2 }}</text>
		</view>
		<view class="join_cart">
			<!-- 根据库存数量显示 -->
			<button v-if="detailsData.goods_stock > 0" class="button" :disabled="isAddCart" :class="{ active: !isAddCart }" @click="addShoppingCart">加入购物车</button>
			<button v-else class="button">已售馨</button>
		</view>
	</view>

	<!-- 占位 -->
	<view style="height: 200px"></view>
</template>

<script setup>
import { ref, watch, computed, getCurrentInstance } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useStore } from 'vuex';
const useStorefn = useStore();

// that
const that = getCurrentInstance();
const detailsData = ref({});

// const _id = ref(''); // 分类父id
// const goods_image = ref(''); // 图片
// const goods_name = ref(''); // 名称
// const goods_describe = ref(''); // 详情描述
// const goods_price = ref(''); // 价格
// const quantity = ref(0); // 购买数量
// const category_id = ref(''); // 商品id
// const goods_stats = ref([]); // 规格列表
// const goods_stock = ref(0); // 库存

onLoad((event) => {
	// 有规格的情况下，如果购买数量大于0，应该初始化购买数量为0
	const item = JSON.parse(event.item);
	if (item.goods_stats) {
		item.quantity = 0;
	}
	detailsData.value = item;
	console.log('detailsData', detailsData.value);
});

// 选中的规格属性列表
const selectAttrList = ref([]);
// 点击选中规格和取消规格
const selectAttr = (index, index2, selected, statsid, name, name2) => {
	// 选中和取消选中
	detailsData.value.goods_stats[index].selected = selected == statsid ? '' : statsid;
	// 获取当前选中的规格-下标索引
	let selectAttrListIndex = selectAttrList.value.findIndex((item) => item.name == name);
	console.log('selectAttrListIndex', selectAttrListIndex);
	// 选中
	if (detailsData.value.goods_stats[index].selected) {
		// 生成规格属性-对象
		let obj = {
			name,
			name2,
			statsid
		};

		// 选中的规格属性列表-已经有了规格属性
		if (selectAttrListIndex > -1) {
			// 替换
			selectAttrList.value.splice(selectAttrListIndex, 1, obj);
		} else {
			// 选中的规格属性列表-没有查询到该规格-新增
			selectAttrList.value.push(obj);
		}
	} else {
		// 取消选中
		// 当前selectAttrListIndex大于-1才有东西需要移除
		if (selectAttrListIndex > -1) {
			// 移除
			selectAttrList.value.splice(selectAttrListIndex, 1);
		}
	}
	console.log('selectAttrList', selectAttrList.value);
};

// 查询库存：规格有3个时，选中2个以上时就得查询是否有库存，并且把最后一项规格没有库存的禁用掉

// 计算价格：当全部选中时查询价格
watch(
	selectAttrList,
	(newVal) => {
		// 当选中的规格属性长度 == 规格属性列表长度
		if (newVal.length == detailsData.value.goods_stats.length) {
			// 查询价格, 根据规格获取对应的价格
		} else if (newVal.length == 0) {
			// 初始化默认价格
			detailsData.value.goods_price = 0;
		}
	},
	{ deep: true }
);

// 购买数量增加
const inCrement = () => {
	// 有规格
	if (detailsData.value.goods_stats) {
		// 必需得要所有规格属性全选才能进行增加数量
		const isLength = selectAttrList.value.length == detailsData.value.goods_stats.length;
		if (isLength) {
			// 全选
			detailsData.value.quantity += 1;
		} else {
			uni.showToast({
				title: '请选择规格属性',
				icon: 'none',
				duration: 2000
			});
		}
	} else {
		// 没规格
		detailsData.value.quantity += 1;
	}
};

// 购买数量减少
const deCrement = () => {
	detailsData.value.quantity -= 1;
};

// 加入购物车:
// 条件1：有规格的情况下，必需全选规格才能加入购物车，没有规格的情况下可以直接加入
// 条件2：购买数量必需大于0
// 使用计算属性完成条件1，条件2
const isAddCart = computed(() => {
	// 判断是否有规格
	if (detailsData.value.goods_stats) {
		// 有规格，规格必需要全部选中
		// 购买数量大于0
		const isLength = selectAttrList.value.length == detailsData.value.goods_stats.length;
		if (isLength && detailsData.value.quantity > 0) {
			// 解除禁用
			return false;
		} else {
			// 禁用 - 点击加入购物车
			return true;
		}
	} else {
		// 没有规格，只需判断一下购买数量大于0

		if (detailsData.value.quantity > 0) {
			// 解除禁用
			return false;
		} else {
			// 禁用 - 点击加入购物车
			return true;
		}
	}
});

// 点击加入购物车
const addShoppingCart = () => {
	// 1、添加商品进vuex
	// 2、判断是否有规格和无规格，无规格的商品直接添加进store
	// 3、根据商品的规格id判断store中没有该商品则。直接添加进store，有同样的商品只累加数量和价格
	// useStorefn.commit('addShoppingState')

	// 判断是否有规格
	if (detailsData.value.goods_stats) {
		// 商品规格id
		detailsData.value.shopping_spec_id = selectAttrList.value.map((item) => {
			return item.statsid;
		});
	}

	// 是否需要返回上一页
	detailsData.value.returnPage = true;

	// 调用store，添加商品
	useStorefn.commit('addShoppingState', detailsData.value);
};
</script>

<style lang="scss" scoped>
.banner {
	.cover {
		margin: auto;
	}
}

.main {
	padding: 20rpx;

	.title {
		font-size: 34rpx;
		font-weight: 600;
	}

	.describe {
		font-size: 28rpx;
		line-height: 38rpx;
		color: #ccc;
		margin: 20rpx 0;
	}

	.specification {
		padding-top: 20rpx;

		.box {
			margin-bottom: 20rpx;

			.title {
				font-size: 28rpx;
				font-weight: 600;
				margin-bottom: 14rpx;
			}

			.attr_list {
				display: flex;
				flex-wrap: wrap;

				.select_attr {
					font-size: 22rpx;
					border: 1px solid #f5f5f5;
					margin: 0 20rpx 20rpx 0;
					padding: 10rpx 20rpx;
				}

				.active {
					background: #214bd5;
					color: #fff;
				}

				.disablled {
					background: #999;
					color: #fff;
				}
			}
		}
	}
}

.shopping_cart {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	z-index: 10;
	border-top: 1px solid rgba(0, 0, 0, 0.1);
	padding: 40rpx 30rpx 80rpx;
	background: #fff;

	.dispose {
		display: flex;
		justify-content: space-between;
		align-items: center;

		.price {
			flex: 1;
			font-size: 34rpx;
			font-weight: 600;
		}

		.select_number {
			display: flex;
			align-items: center;
		}

		.num {
			padding: 0 20rpx;
		}

		.cover {
			width: 46rpx;
			height: 46rpx;
		}
	}

	.attr {
		padding: 20rpx 0;
		display: flex;
		align-items: center;

		.text {
			font-size: 24rpx;
			color: #999;
			padding-right: 12rpx;
			position: relative;

			&::before {
				content: '/';
				position: absolute;
				right: 0;
				top: 50%;
				transform: translateY(-50%);
			}
		}

		.text:last-child {
			&::before {
				display: none;
			}
		}
	}

	.join_cart {
		text-align: center;
		height: 80rpx;
		line-height: 80rpx;
		font-size: 28rpx;
		font-weight: 600;
		border-radius: 12rpx;
		background: #ccc;

		.button {
			background: #999;
			color: #000;
		}
		.active {
			background: #214bd5;
			color: #fff;
		}
	}
}
</style>
