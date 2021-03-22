// 加密密钥
var publicKey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCAoo9MO9iaCT7K96J22h1udaZsX9XQtpqjHqAylPh5vH6iSxj78xJitRgs50fhheNqpkW2FjyzUkkxuWYXCv/Mnfo1f+Xnk6BuGOHfIrYQHddQ2rLFsoG2EtXdUGh3ARVEVgficcFrMmo/MDCFgp8GG5Kw2usin4q3Ke1eMtaeLwIDAQAB";
var privateKey = "MIICdQIBADANBgkqhkiG9w0BAQEFAASCAl8wggJbAgEAAoGBAICij0w72JoJPsr3onbaHW51pmxf1dC2mqMeoDKU+Hm8fqJLGPvzEmK1GCznR+GF42qmRbYWPLNSSTG5ZhcK/8yd+jV/5eeToG4Y4d8ithAd11DassWygbYS1d1QaHcBFURWB+JxwWsyaj8wMIWCnwYbkrDa6yKfircp7V4y1p4vAgMBAAECgYAv00CPyVhYvMM51yPyKFn07Yz4khD+zkVkDEjnRXe0Wx6B3IXndpIJXOcmGr8g3BSXXEZi0pWy3g8Ui6enPZGoy6cySCHM1Cxcg7vfXR1/o8IRmgvImvKwrjqtLKOdQ9MWhpqKgvPwWgspdUS0mssuOnPFOfz9mdyDuo3vaSSqEQJBAM6nQ+2vdEzfzNy2ozPX495oPa/uyAePQnA2olvdtqk6Tsjr6hK8uJTVzJsfcQHreY9IJ5a7fT5ZHOy96OFWGW0CQQCfWgaR8EyXiNVYkwFWubqDSZ2ZR2CsPHvnl9GqtycPYM6+X46Tm98pva4bdqL/EzsgfrxPJw5Z4UupHHElgBCLAkAzgg91W+kiDBpU3RT6pBIA6nyNsHedIsENlSCMw0t3DLh8bgju2KktN8kC1ShmsRmgc/yiHmNOOgnynDdCiyJVAkA500trDg5dNvRkjgQAWqmKFt6vzq0QE2rLIdad4pS0Cec8QiTU/809sm1J3gVMFshwBE2FU6DrkMwJ9B5DA3P9AkB6Ry3dnLSdpe7Cka31rWjWuU3w4jVoTtUuM1C0cl1myETAuOWXdYsrzCAl/Rf1PDi3IXLMZYuhMGj286YKOW7E";
//是否加密
var encrpytParam = false;
//是否解密
var decrpytResponse = false;

// 本地环境
var loginPath = "http://localhost/login.html";
var apiPath = "http://localhost/api";
// 测试环境
// var loginPath = "http://dq-api-test.hillapi.com:6008/login.html";
// var apiPath = "http://dq-api-test.hillapi.com:6008/api";
//正式环境
// var loginPath = "https://console.shijidaqian.com/login.html";
// var apiPath = "https://console.shijidaqian.com/api";
document.onmousemove = function () {
    top.window.mouseLastMove = new Date().getTime();
    // console.log("onmousemove---------")
    // console.log(top.window.mouseLastMove)
}
if (navigator.appName == "Microsoft Internet Explorer" && parseInt(navigator.appVersion.split(";")[1].replace(/[ ]/g, "").replace("MSIE", "")) < 9) {
    alert("您的浏览器版本过低，请下载IE9及以上版本");
}

function toLogin() {
    window.top.location.href = loginPath;
}

function getLoginUser() {
    var expires=localStorage.getItem("expires");
    if(expires){
        var expiresNum=parseInt(expires);
        if(new Date().getTime()>expiresNum){
            localStorage.removeItem("token")
            localStorage.removeItem("expires")
            window.top.location.href = loginPath;
        }
    }
    var token = localStorage.getItem("token");
    var res;
    if (token) {
        $.ajax({
            type: "get",
            url: apiPath + "/auth/userinfo",
            async: false,
            success: function (result) {
                if (result.code == 0 && result.data) {
                    res= result.data;
                }
            }
        });
    } else {
        location.href = loginPath;
    }
    return res;
}

$(document).ajaxSuccess(function (e, xhr, opt) {
    var res = JSON.parse(xhr.responseText);
    if (res && res.message && res.message == "用户未登陆") {
        window.top.location.href = loginPath;
    }
});
$(document).ajaxError(function (e, xhr, opt) {
    if (xhr.readyState == 4 && xhr.status == 401) {
        // console.log(xhr.responseText);
        // console.log(xhr.status);
        // console.log(xhr.readyState);
        // console.log(xhr.statusText);

        /*var res=JSON.parse(xhr.responseText)
        if(res.status==5000){
            window.top.location.href = "/api/user/base_info";
        }*/
        window.top.location.href = loginPath;
    }
});
//根据经纬度获取距离，单位：千米。
function space(lat1, lng1, lat2, lng2) {
    console.log(lat1, lng1, lat2, lng2)
    var radLat1 = lat1 * Math.PI / 180.0;
    var radLat2 = lat2 * Math.PI / 180.0;
    var a = radLat1 - radLat2;
    var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137;
    s = Math.round(s * 10000) / 10000;
    return s  // 单位千米
}
/**
 * 根据权限隐藏or显示按钮。
 */
function showOrHiddeBtnByPermission() {
    var permisstionCodes = top.permisstionCodes;
    var buttons = $(document.body).find("[per-code]");
    buttons.each(function () {
        var code = $(this).attr("per-code");
        if (permisstionCodes.indexOf(code) < 0) {
            $(this).hide();
        }
    })
}

function getCookie(name) {
    var cookieValue = "";
    if (top.document.cookie && top.document.cookie !== '') {
        var cookies = top.document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = $.trim(cookies[i]);
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

$(document).ajaxSend(function (event, jqxhr, settings) {
    var expires=localStorage.getItem("expires");
    if(expires){
        var expiresNum=parseInt(expires);
        if(new Date().getTime()>expiresNum){
            localStorage.removeItem("token")
            localStorage.removeItem("expires")
            window.top.location.href = loginPath;
        }
    }
    jqxhr.setRequestHeader('access_token', localStorage.getItem("token"));
})


function rsaEncrypt(data) {
    if (data == null || data == undefined || data == "") {
        return data;
    }
    var encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    var encrpytStr = encrypt.encryptLong(data);
    encrpytStr = encrpytStr.replace(/\+/g, "%2B");
    encrpytStr = encrpytStr.replace(/\&/g, "%26")
    return encrpytStr;
}

function rsaDecrypt(data) {
    if (data == null || data == undefined || data == "") {
        return data;
    }
    var encrypt = new JSEncrypt();
    encrypt.setPrivateKey(privateKey);
    return encrypt.decryptLong(data);

}

/**
 * aes加密（需要先加载aes.min.js文件）
 * @param word
 * @returns {*}
 */
function aesEncrypt(word, aesKey) {
    var key = CryptoJS.enc.Utf8.parse(aesKey);
    var srcs = CryptoJS.enc.Utf8.parse(word);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7});
    return encrypted.toString();
}

/**
 * aes解密
 * @param word
 * @returns {*}
 */
function aesDecrypt(word, aesKey) {
    var key = CryptoJS.enc.Utf8.parse(aesKey);
    var decrypt = CryptoJS.AES.decrypt(word, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7});
    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
}

/**
 * url参数格式加密，逐个将参数值采用aes加密，格式：code=abc&cryptKey=123
 * aeskey采用rsa加密传递给server
 * @param params
 * @returns {string|*}
 */
function encryptParamForUrlType(params) {
    if (params == null || params == undefined || params == "") {
        return params;
    }
    if (encrpytParam == false) {
        return params;
    }
    var aesKey = getnAESKey();
    var paramArray = params.split("&");
    var resParam = "1=1";
    var tempArr;
    for (var index = 0; index < paramArray.length; index++) {
        tempArr = paramArray[index].split("=");
        resParam += "&" + tempArr[0] + "=" + aesEncrypt(tempArr[1], aesKey);
    }
    resParam += "&cryptKey=" + rsaEncrypt(aesKey);
    return resParam;
}

/**
 * 将对象属性采用aes加密，格式如：{name:"abc",age:12}
 * aeskey采用rsa加密传递给server
 * @param params
 * @returns {*}
 */
function encryptParamForObjType(params) {
    if (params == null || params == undefined || params == "") {
        return params;
    }
    if (encrpytParam == false) {
        return params;
    }
    var aesKey = getnAESKey();
    var resObj = {};
    for (var prop in params) {
        resObj[prop] = aesEncrypt(params[prop], aesKey);
    }
    resObj.cryptKey = rsaEncrypt(aesKey);
    return resObj;
}

/**
 * 根据是否解密配置尝试ajax响应结果解密
 * @param responseData
 * @returns {any}
 */
function getAjaxData(responseData) {
    if (responseData == null || responseData == undefined || responseData == "") {
        return responseData;
    }
    if (decrpytResponse == false) {
        return responseData.data;
    }
    var cryptKey = responseData.cryptKey;
    var aesKey = rsaDecrypt(cryptKey);
    var decrpytStr = aesDecrypt(responseData.data, aesKey);
    if (decrpytStr) {
        try {
            return JSON.parse(decrpytStr);
        } catch (e) {
            return decrpytStr;
        }
    }

}

function getParam(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return "";
}

function getDisStr(str) {
    if (str == undefined || str == null) {
        return "-";
    }
    return str;
}

function getDisStr1(str) {
    if (str == undefined || str == null) {
        return "";
    }
    return str;
}

function getDisStr2(str) {
    if (str == undefined || str == null || str == "") {
        return "-";
    }
    return str;
}
function getDisNum(str) {
    if (str == undefined || str == null || str == "null") {
        return "0";
    }
    return str;
}

function getnAESKey() {
    var str = "",
        range = 16,
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    for (var i = 0; i < range; i++) {
        pos = Math.round(Math.random() * (arr.length - 1));
        str += arr[pos];
    }
    return str;
}

Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}
