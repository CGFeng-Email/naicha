// 店铺信息
const useShopInfo = function () {
    const res = uni.getStorageSync('shopInfo');
    return res
}

export {
    useShopInfo
}