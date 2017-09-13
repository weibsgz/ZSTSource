import axios from 'axios'
// axios 配置
axios.defaults.timeout = 30000;
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
axios.defaults.baseURL = '';
// const baseurl = 'http://result.eolinker.com/wTGsdEJ4170e9cb44499d99378a2adf2621dc706bee9c6f?uri='
// export const baseurl = 'http://202.106.10.250:18069'   // 正式地址
export const baseurl = 'http://192.168.16.209:8069'   // 测试

// export const baseurl = 'http://192.168.21.14:8069'   // megnhai
export const baseurlMock = 'http://result.eolinker.com/KRz5gHg929871cdf1876adcb01479a8bf638e4086dd8b2c?uri='
export const baseurlMock1 = 'http://mock.eolinker.com/KRz5gHg929871cdf1876adcb01479a8bf638e4086dd8b2c?uri='
// axios.defaults.withCredentials = true;


/*axios.interceptors.request.use(function(config) {
    // config.headers['tokenid']=top.window.tokenid
    config.headers['tokenid'] = sessionStorage.getItem('tokenid')
    // 在发送请求之前做些什么
    return config
}, function(error) {
    // 对请求错误做些什么
    return Promise.reject(error)
})*/

//axios.defaults.headers.['tokenid'] = sessionStorage.getItem('tokenid')


let instance = axios.create({
  headers: {'tokenid': sessionStorage.getItem('tokenid')}
});

let instanceMock = axios.create({

});

export function post(url, params) {
    return new Promise((resolve, reject) => {
        instance.post(baseurl + url, params)
            .then(response => {
                if (response.data.code == 1) {
                    resolve(response);
                } else if (response.data.code == 502 || response.data.code == 503) {
                    reject('notLogin')
                } else if (response.data.code == '501') {
                    instanceMock.post(baseurlMock + url, params)
                        .then(response => {
                            resolve(response);
                        })
                        .catch((error) => {
                            reject(error)
                        })
                }
            })
            .catch((error) => {
                instanceMock.post(baseurlMock + url, params)
                    .then(response => {
                        resolve(response);
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
    })
}
export function get(url, params, mock) {
    return new Promise((resolve, reject) => {
        let _baseUrl = (mock === true) ? baseurlMock1 : baseurlMock

        instance.get(baseurl + url, params, mock)
            .then(response => {
                if (response.data.code == 1) {
                    console.log('服务器正常返回数据')
                    resolve(response);
                } else if (response.data.code == 4) {
                    reject('notLogin')
                } else {
                    console.log('服务器501 or 500 ，模拟数据')
                    instanceMock.get(_baseUrl + url, params)
                        .then(response => {
                            resolve(response);
                        })
                        .catch((error) => {
                            reject(error)
                        })
                }

            })
            .catch((error) => {
                console.log('服务器错误！！ ，模拟数据')
                instanceMock.get(_baseUrl + url, params, mock)
                    .then(response => {
                        resolve(response);
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
    })
}
