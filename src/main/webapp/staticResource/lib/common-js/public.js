// 切换显示
function toggle(dom) {
    dom.toggleClass('on');
}

// 替换iframe
function updateIframe(dom, href) {
    dom.attr('src', href)
}