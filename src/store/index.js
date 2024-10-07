// 页面路径：store/index.js
import {
	createStore
} from 'vuex';

const store = createStore({
	state() {
		return {
			shoppingList: [], // 商品列表

		}
	},
	// 同步，唯一修改state的途径
	// 参数1：state
	// 参数2：payload参数
	// 调用api：this.$store.commit('')
	// 辅助函数：mapMutations
	mutations: {
		// 添加商品
		addShoppingState(state, payload) {
			const shoppingList = state.shoppingList;
			console.log('shoppingList', shoppingList);
			console.log('payload', payload);

			// 仓库里没有商品 - 新增
			if (shoppingList.length <= 0) {
				state.shoppingList.push(payload)

				// 在下单页，下单才需要返回上一页
				if (payload.returnPage) {
					uni.switchTab({
						url: '/pages/ordersystem/index'
					})
				}

				console.log('更新后shoppingList', state.shoppingList);
				return;
			}

			// 先查询商品仓库数组中是否有对应商品的id
			const findIndex = shoppingList.findIndex(item => {
				return item.category_id == payload.category_id
			})

			console.log('findIndex', findIndex);

			if (findIndex != -1) {
				// 在数组中查到对应的id商品
				for (let i in shoppingList) {
					// 判断规格
					if (JSON.stringify(shoppingList[findIndex].shopping_spec_id) == JSON.stringify(payload.shopping_spec_id)) {

						// 判断是否有规格
						if (payload.goods_stats) {
							// 购买数量，有规格时，针对不同的规格商品累加数量
							shoppingList[findIndex].quantity += Number(payload.quantity.value);
						} else {
							// 购买数量，无规格赋值数量
							shoppingList[findIndex].quantity = Number(payload.quantity);
						}

						state.shoppingList = shoppingList;
						console.log('重复商品');
						break;
					} else {
						console.log('新商品');
						state.shoppingList.push(payload)
						break;
					}
				}
			} else {
				console.log('新商品');
				state.shoppingList.push(payload);
			}

			// 在下单页，下单才需要返回上一页
			if (payload.returnPage) {
				uni.switchTab({
					url: '/pages/ordersystem/index'
				})
			}

			console.log('更新后shoppingList', state.shoppingList);
			return;
		},
		// 删除商品
		delShoppingState(state, payload) {
			// 当传递的payload购买数量是0时，删除对应的商品
			// 先查询商品仓库数组中是否有对应商品的id
			const findIndex = state.shoppingList.findIndex(item => {
				// 判断是否有规格
				if (payload.goods_stats) {
					return item._id == payload._id.value && item.category_id == payload.category_id
						.value
				} else {
					return item._id == payload._id && item.category_id == payload.category_id
				}
			})
			// 删除对应的商品
			state.shoppingList.splice(findIndex, 1);
			console.log('更新后shoppingList', state.shoppingList);
		},
		// 购物车列表，商品数量 - 加
		cartShoppingQuantityAdd(state, payload) {
			// 查询对应的商品id下标
			const findIndex = state.shoppingList.findIndex(item => {
				if (item.goods_stats) {
					return item._id == payload._id && item.category_id == payload.category_id && item
						.goods_stats == payload.goods_stats
				} else {
					return item._id == payload._id && item.category_id == payload.category_id
				}
			})
			if (findIndex == -1) return;
			state.shoppingList[findIndex].quantity += 1;
		},
		// 购物车列表，商品数量 - 减
		cartShoppingQuantitydel(state, payload) {
			// 查询对应的商品id下标
			const findIndex = state.shoppingList.findIndex(item => {
				if (item.goods_stats) {
					return item._id == payload._id && item.category_id == payload.category_id && item
						.goods_stats == payload.goods_stats
				} else {
					return item._id == payload._id && item.category_id == payload.category_id
				}
			})
			if (findIndex == -1) return;
			// 数量==1，还减时，则删除对应商品
			if (payload.quantity == 1) {
				return state.shoppingList.splice(findIndex, 1);
			}
			state.shoppingList[findIndex].quantity -= 1;
		},
		// 一键清空商品列表
		emptyShoppingList(state) {
			state.shoppingList = []
		}
	},
	// 异步，任何异步axios都在这里来执行
	// 参数1：context:上下文
	// context.commit('') 调用mutations的方法
	// context.dispatch('') 调用getters的方法
	// 参数2：payload参数
	// 辅助函数：mapActions 
	actions: {},
	// 计算属性
	// 辅助函数：mapGetters
	// 参数1：state, 参数2：getters,调用其他的getters方法
	getters: {
		// 所有商品的总价格
		total_shoppingList_price(state, getters) {
			let totalPrice = 0;
			if (state.shoppingList.length > 0) {
				for (let i in state.shoppingList) {
					totalPrice += state.shoppingList[i].goods_price * state.shoppingList[i].quantity
				}
			}
			return totalPrice;
		},
		// 商品的数量
		total_shoppingList_quatity(state) {
			let quantity = 0;
			if (state.shoppingList.length > 0) {
				state.shoppingList.forEach((item, index) => {
					quantity += item.quantity
				})
			}
			return quantity
		},

	}
})

export default store