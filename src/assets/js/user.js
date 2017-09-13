import Vue from 'vue'
import { post, get } from 'assets/js/api'


// export function getUser() {
//     get('/main/login?loginName=system&password=123456&vcode=test', {
//         // params: {
//         //     trade: 'true',
//         //     page: this.currentPage,
//         //     pageSize: this.pageSize
//         // }
//     })
//     .then((response) => {
//         let res = response.data
//         console.log(res)
//         let user = {}
//         get('/investment/info', {
//         // params: {
//         //     trade: 'true',
//         //     page: this.currentPage,
//         //     pageSize: this.pageSize
//         // }
//         })
//         .then((response) => {
//             let res = response.data
//             console.log(res)
//             user.userId = res.data.userId
//             user.parkId = res.data.parkId
//         })
//         .catch((error) => {
//             console.log(error)
//         })

//     })
//     .then(() => {

//     })
//     .catch((error) => {
//         console.log(error)
//     })
// }

/**
 * 检测用户是否登录，若已登录检测 其用户id 及其 园区的id
 * Promise 方法 .then 方法回调 输出 userId & parkId
 * @return {[Object]} [{
 *                     userId: 'system',
 *                     parkId: 63
 *                     }]
 */
export function getUser() {
    return new Promise((resolve, reject) => {
        get('/investment/info')
            .then((response) => {
                let res = response.data
                // let user = {}

                // res.userId = 'system'
                // res.parkId = 63

                sessionStorage.setItem('userId', 'system')
                sessionStorage.setItem('parkId', 155)

                // sessionStorage.setItem('userId', res.data.userId)
                // sessionStorage.setItem('parkId', res.data.parkId)

                console.log('user.js' + sessionStorage.getItem('parkId'))
                resolve(sessionStorage)

                // resolve(user)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

