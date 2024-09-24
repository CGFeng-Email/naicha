// 页面路径：store/index.js
import {
	createStore
} from 'vuex';

const store = createStore({
	state() {
		return {
			shoppingList: []
		}
	},
	// 同步，唯一修改state的途径
	// 参数1：state
	// 参数2：payload参数
	// 调用api：this.$store.commit('')
	// 辅助函数：mapMutations
	mutations: {
		addShoppingState(state, payload) {
			const shoppingList = state.shoppingList;
			console.log('shoppingList', shoppingList);
			console.log('payload', payload);

			// 仓库里没有商品 - 新增
			if (shoppingList.length <= 0) {
				state.shoppingList.push(payload)

				uni.switchTab({
					url: '/pages/ordersystem/index'
				})

				console.log('更新后shoppingList', state.shoppingList);
				return;
			}

			// 先查询商品仓库数组中是否有对应商品的id
			const findIndex = shoppingList.findIndex(item => {
				return item._id == payload._id.value && item.category_id == payload.category_id.value
			})

			console.log('findIndex', findIndex);

			if (findIndex != -1) {
				// 在数组中查到对应的id商品
				for (let i in shoppingList) {
					if (JSON.stringify(shoppingList[findIndex].shopping_spec_id) == JSON.stringify(payload
							.shopping_spec_id)) {

						const numberQuantity = Number(payload.quantity.value);
						const numberGoodsPrice = Number(payload.goods_price.value);
						
						// 购买数量
						shoppingList[findIndex].quantity += numberQuantity;
						// 商品金额
						shoppingList[findIndex].goods_price = numberGoodsPrice;
						// 商品总金额 
						shoppingList[findIndex].total_price = shoppingList[findIndex].quantity * numberGoodsPrice;
						
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

			uni.switchTab({
				url: '/pages/ordersystem/index'
			})

			console.log('更新后shoppingList', state.shoppingList);
			return;
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
	getters: {}
})

export default store