const requestUrl = 'https://naicha-1317202885.cos.ap-guangzhou.myqcloud.com/api';

const request = function(url, data = {}, method = 'GET') {
    return new Promise((resolve, reject) => {
        uni.request({
            url: requestUrl + url,
            method,
            data,
            success: res => {
                const status = res.statusCode;
                switch(status) {
                    case 200:
                        resolve(res.data)
                        break
                    case 404:
                        console.log('接口不存在');
                        reject('404')
                        break
                    case 401:
                        console.log('没有权限');
                        uni.navigateTo({url: '/pages/login/index'})
                        reject('401')
                        break
                    case 500:
                    case 501:
                    case 503:
                        console.log('接口出现异常错误:500', res.data);
                        uni.navigateTo({
                            title: '出现异常错误',
                            icon: 'none'
                        })            
                        break
                    case 400:
                        console.log('400');
                        reject('400')
                        break;
                    case 422: 
                        console.log('422');
                        reject('422')
                        break;    
                }
            },
            fail: err=> {
                uni.showToast({
                    title: err,
                    icon: 'none',
                })
                reject(err);
            }
        })
    })
}

export default request