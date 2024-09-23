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
			console.log('payload', payload);
			// 判断是否有重复商品，没有就直接新增，有就只计算数量和价格
			if (state.shoppingList.length <= 0) {
				return state.shoppingList.push(payload)
				console.log('shoppingList', state.shoppingList);
			}
			// 默认新商品
			for (let i = 0; i < shoppingList.length; i++) {
				// 判断商品父id和商品id是否一致
				if (shoppingList[i]._id != payload._id.value || shoppingList[i].category_id != payload
					.category_id.value) {
					console.log('商品父id和商品id不一致');

					if (JSON.stringify(shoppingList[i].shopping_spec_id) == JSON.stringify(payload
							.shopping_spec_id)) {
						shoppingList[i].quantity += payload.quantity.value;
						shoppingList[i].goods_price += payload.goods_price.value;
						shoppingList[i].total_price = Number(shoppingList[i].quantity) * Number(shoppingList[i]
							.goods_price);

						state.shoppingList = shoppingList;
						break;
					} else {
						console.log('规格不一样 - 新商品');
						state.shoppingList.push(payload)
						break;
					}
				} else {
					console.log('商品父id和商品id一致');
					// 如果有两个一模一样的规格列表就不要再往下循环了
					if (JSON.stringify(shoppingList[i].shopping_spec_id) == JSON.stringify(payload
							.shopping_spec_id)) {
						console.log('规格一样 - 累加数量价格 - 跳出循环');
						shoppingList[i].quantity += payload.quantity.value;
						shoppingList[i].goods_price += payload.goods_price.value;
						shoppingList[i].total_price = Number(shoppingList[i].quantity) * Number(shoppingList[i]
							.goods_price);

						state.shoppingList = shoppingList;
						break;
					} else {
						console.log('规格不一样 - 新商品');
						state.shoppingList.push(payload)
						break;
					}
				}
			}
			console.log('shoppingList', state.shoppingList);
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