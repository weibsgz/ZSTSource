export function hasClass(el, className) {
    let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
    if (el) {
        return reg.test(el.className)
    }
}

export function addClass(el, className) {
    if (hasClass(el, className)) {
        return
    }
    if (!el) {
        return
    }
    let newClass = el.className.split(' ')
    newClass.push(className)
    el.className = newClass.join(' ')
}

export function removeClass(el, className) {
    if (!hasClass(el, className)) {
        return
    }
    if (!el) {
        return
    }
    let newClass = el.className.replace(className, '')
    // newClass = newClass.split(' ')
    // newClass.forEach((item, index) => {
    //     if (!item) {
    //         newClass.splice(index, 1)
    //     }
    // })
    // newClass.splice(className, 1)
    // el.className = newClass.join(' ')
    el.className = newClass
}
