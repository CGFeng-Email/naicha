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

// 计算时间

export {
    useDistance
}