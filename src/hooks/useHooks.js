// 计算距离
function useDistance(distance) {
    var km = '0米';
    if (distance >= 1000) {
        km = (distance / 1000).toFixed(1) + 'km'
    } else {
        km = distance + 'm'
    }

    return km
}

// 秒转化成时间
function useTime(seconds) {
    let minutes = Math.floor(seconds / 60); // 分钟
    let remainingSeconds = seconds % 60; // 剩余秒数
    return `${minutes}分钟`
}

export {
    useDistance,
    useTime
}