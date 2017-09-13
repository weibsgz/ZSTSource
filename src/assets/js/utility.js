// 日期格式化函数 输出 2017/08/08
function add0(m) { return m < 10 ? '0' + m : m }
export function formatTime(shijianchuo) {
    //shijianchuo是整数，否则要parseInt转换
    var time = new Date(shijianchuo);
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return y + '/' + add0(m) + '/' + add0(d);
}

// 获取 data-id
export function getDiyData(el, name, val) {
    const prefix = 'data-'
    if (val) {
        return el.setAttribute(prefix + name, val)
    }
    return el.getAttribute(prefix + name)
}

// 为 对象 添加属性 方法
let aa = {}
let n = 0
export function getLevel(data) {
    data.some((item, index) => {
        if (!!item.active) {
            aa = item
            // n = item.level
            // debugger
            console.log('n: ' + n)
            return true
        } else {
            if (item.data instanceof Array) {
                // debugger
                item.active = false
                getLevel(item.data)
            }
        }

        // // 当 达到最后一层时仍未找到 active 返回 0
        // if (index === item.level && !item.active) {
        //     aa = data[0]
        // }
    })

    // // 当 达到最后一层时仍未找到 active 返回 0
    // if (n === 0) {
    //     aa.level = 0
    //     let content = '自己拿'
    // }
    n += 1

    console.log('函数执行次数：' + n)
    // console.log(JSON.stringify(aa))

    // if (aa.name) {
    // if (aa.data instanceof Array) {
    let content = aa.data.map((v, i) => {
        return v.name
    })
    // } else {
    //     let content = ''
    // }
    // } else {
    //     aa.level = 0
    //     let content = []
    // }



    return {
        "level": aa.level,
        "content": content
    }
}


  export const cloudEntUrl = 'http://192.168.1.6:8123/entCloudMap/#/entBase/'


