<script setup>
import require from '@/api/require';
import { shopInfo } from '@/api/api';
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';
onLaunch(async () => {
	// 版本更新api
	const updateManager = uni.getUpdateManager();

	updateManager.onCheckForUpdate(function (res) {
		// 请求完新版本信息的回调
	});

	updateManager.onUpdateReady(function (res) {
		uni.showModal({
			title: '更新提示',
			content: '新版本已经准备好，是否重启应用？',
			success(res) {
				if (res.confirm) {
					// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
					updateManager.applyUpdate();
				}
			}
		});
	});

	updateManager.onUpdateFailed(function (res) {
		// 新的版本下载失败
		console.log('新的版本下载失败', res);
	});

	// 获取胶囊坐标
	const getMenuButton = uni.getStorageSync('menuButton');
	if (!getMenuButton) {
		// 获取胶囊信息api
		const res = uni.getMenuButtonBoundingClientRect();
		uni.setStorageSync('menuButton', res);
	}

	// 获取店铺信息
	const getShopInfo = uni.getStorageSync('shopInfo');
	if (!getShopInfo) {
		const res = await require(shopInfo);
		uni.setStorageSync('shopInfo', res);
	}
});
</script>

<style lang="scss">
@import './font/iconfont.css';

view {
	padding: 0;
	margin: 0;
	box-sizing: border-box;
}

/* 搜索框公用 */
.search-input {
	background: #f7f7f7;
	border-radius: 50rpx;
	margin-left: 20rpx;
	display: flex;
	flex-direction: row;
	flex: 1;
	position: relative;
}

.search-input input {
	width: 100%;
	font-size: 28rpx;
	padding-left: 80rpx;
	padding-right: 20rpx;
}

.search-input image {
	width: 35rpx;
	height: 35rpx;
	position: absolute;
	left: 30rpx;
	align-self: center;
}

text,
image {
	display: block;
}

button::after {
	border: none;
}

button {
	line-height: inherit;
	margin: inherit;
}

.overflow-text {
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
}

/* 订单页面公用样式 */
.pay-view {
	background-color: #fefefe;
	border-radius: 15rpx;
	margin: 20rpx;
	padding: 0 20rpx;
}

.item-order {
	display: flex;
	padding: 20rpx;
}

.item-order image {
	width: 130rpx;
	height: 130rpx;
	border-radius: 10rpx;
}

.order-speci {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	padding: 0 20rpx;
}

.order-speci text:nth-child(1) {
	font-weight: bold;
}

.order-speci text:nth-child(n + 2) {
	font-size: 27rpx;
	color: #949494;
}

.order-price {
	font-weight: bold;
}

/* 选择地址公用 */
.select-address {
	padding: 20rpx 0;
}

.select-address text {
	font-weight: bold;
}

.user-detail-address {
	padding: 10rpx 0;
}

.select-user {
	display: flex;
	align-items: center;
}

.select-user text {
	font-size: 28rpx;
	font-weight: inherit;
	color: #777777;
	padding-right: 10rpx;
}

/* 底部按钮公用样式 */
.add-button {
	position: fixed;
	bottom: 86rpx;
	left: 20rpx;
	right: 20rpx;
	padding: 20rpx 0;
	background-color: #214bd5;
	color: #ffffff;
	font-size: 35rpx;
}

/* 搜索框公用 */
.search-input {
	background: #f7f7f7;
	border-radius: 50rpx;
	margin-left: 20rpx;
	display: flex;
	flex-direction: row;
	flex: 1;
	position: relative;
}

.search-input input {
	width: 100%;
	font-size: 28rpx;
	padding-left: 80rpx;
	padding-right: 20rpx;
}

.search-input image {
	width: 35rpx;
	height: 35rpx;
	position: absolute;
	left: 30rpx;
	align-self: center;
}

.input-color {
	color: #c2c2c2;
}

.over1 {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.over2 {
	display: -webkit-box;
	word-break: break-all;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
	text-overflow: ellipsis;
}

.over3 {
	display: -webkit-box;
	word-break: break-all;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 3;
	overflow: hidden;
	text-overflow: ellipsis;
}
</style>
