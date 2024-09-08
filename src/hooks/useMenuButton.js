// 获取小程序顶部胶囊数据，存储到缓存里
const useMenuButton = function () {
    const getMenuButton = uni.getStorageSync('menuButton');
    const top = getMenuButton.top + 'px';
    const bottom = getMenuButton.bottom + 'px';
    const left = (getMenuButton.left - 20) + 'px';
    const width = getMenuButton.width + 'px';
    const height = getMenuButton.height + 'px';
    // 占位符高度
    const topView = getMenuButton.height + getMenuButton.top + 'px';

    return {
        top,
        bottom,
        left,
        width,
        height,
        topView
    }
}

export default useMenuButton