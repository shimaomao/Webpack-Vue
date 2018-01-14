import '../../css/common/common.less';
import $ from 'jquery';


//微信分享结果回调
exports.onWxShareSuccess = function(data) {
    //console.log(data+'wx success');
    try {
        shareSuccessCallback();
    } catch (e) {}

}
exports.onWxShareCancel = function(data) {
    //console.log(data+'wx cancel');
    try {
        shareCancelCallback();
    } catch (e) {}

}
exports.onAppShareSuccess = function(data) {
    //console.log(data+'app success');
    try {
        shareSuccessCallback();
    } catch (e) {}
}
exports.onAppShareCancel = function(data) {
    //console.log(data+'app cancel');
    try {
        shareCancelCallback();
    } catch (e) {}
}
exports.onQqShareSuccess = function(data) {
    //console.log(data+'qq success');
    try {
        shareSuccessCallback();
    } catch (e) {}
}
exports.onQqShareCancel = function(data) {
    //console.log(data+'qq cancel');
    try {
        shareCancelCallback();
    } catch (e) {}
}
exports.onQzoneShareSuccess = function(data) {
    //console.log(data+'Qzone success');
    try {
        shareSuccessCallback();
    } catch (e) {}
}
exports.onQzoneShareCancel = function(data) {
    //console.log(data+'Qzone cancel');
    try {
        shareCancelCallback();
    } catch (e) {}
}


//显示loading状态
exports.showLoading = function() {
    var load = '<img src="http://static.cblive.tv/dist/mobile/img/common/loading.png" class="alertLoding">';
    if ($('body').find($('.alertLoding')).length !== 0) {
        $('.alertLoading').show();
    } else {
        $('body').append(load);
    }
}
exports.hideLoading = function() {
    $('.alertLoding').hide();
}

//跳到直播间
//packageId: 默认果酱,  2 =>土豪
// exports.goRoom = function(rid, price, packageId) {
//     if (/guojiang_android/i.test(navigator.userAgent)) {
//         layer.open({
//             content: '快去app直播列表页围观主播的精彩表演吧'
//         });

//         try {
//             recharge.roomDetail(rid.toString()); //进入直播间
//         } catch (e) {}

//     } else if (/guojiang_iphone/i.test(navigator.userAgent)) {
//         try {
//             gBridge.roomDetail(rid, price); //进入直播间
//         } catch (e) {}
//     } else {
//         location.href = '/room/' + rid + '?packageId=' + packageId;
//     }
// }

//调起分享
exports.goShare = function() {

    if (/guojiang_android/i.test(navigator.userAgent)) {
        recharge.onShare();
    } else if (/guojiang_iphone/i.test(navigator.userAgent)) {
        gBridge.share(); //果酱
    } else {

        var shareBg;
        if (/iPhone.*Safari/i.test(navigator.userAgent)) {
            shareBg =
                '<img src="http://static.cblive.tv/dist/mobile/img/common/shareBgSafari.png?v=1" id="mShareBg"/>';
        } else {
            shareBg =
                '<img src="http://static.cblive.tv/dist/mobile/img/common/shareBgWechat.png?v=1" id="mShareBg"/>';
        }

        //share
        if ($('#mShareBg').length == 0) {

            $('body').append(shareBg);

            $('#mShareBg').on('click', function() {
                $(this).hide();
            })
        } else {
            $('#mShareBg').show();
        }

    }
}
//跳到指定帖子
exports.goPost = function(id) {
    if (/guojiang_android/i.test(navigator.userAgent)) {
        recharge.goPostDetail(id);
    } else if (/guojiang_iphone/i.test(navigator.userAgent)) {
        gBridge.postDetail(id);
    } else {
        location.href = '/download';
    }
}

//跳到饭圈详情
exports.goGroup = function(id) {
    if (/guojiang_android/i.test(navigator.userAgent)) {
        recharge.goGroupDetail(id);
    } else if (/guojiang_iphone/i.test(navigator.userAgent)) {
        gBridge.groupDetail(id);
    } else {
        location.href = '/download';
    }
}


//获取平台类型
exports.getPlatformType = function() {
    if (/MicroMessenger/i.test(navigator.userAgent)) {
        //这是微信平台下浏览器
        return 'wechat';
    } else if (/guojiang_android/i.test(navigator.userAgent)) {
        return 'android_webview';
    } else if (/android/i.test(navigator.userAgent)) {
        return 'android';
    } else if (/guojiang_iphone/i.test(navigator.userAgent)) {
        return 'ios_webview';
    } else if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        return 'ios';
    } else {
        return 'pc';
    }
}

//登录
exports.goLogin = function() {

    var platform = getPlatformType();
    if (platform == 'android_webview') {
        recharge.needLogin();
    } else if (platform == 'ios_webview') {
        location.href = 'FZIphoneCommunicate://type/1';
        gBridge.needLogin();
    } else {
        location.href = '/user/login?callback=' + window.top.location.href;
    }

}
//微信授权
exports.goWechatLogin = function() {
    location.href = '/user/wxLogin?callback=' + location.href;
}

//跳到个主主页
exports.goPersonalPage = function(mid) {
    var version = getVersion();
    versionNum = version.replace(/\./g, '')

    try {
        if (typeof mid == 'string') {
            mid = parseInt(mid)
        }
        gBridge.toUserInfoViewId(mid);
    } catch (e) {
        alert(e.name + ':' + e.message)
    }
}

//控制ios右上角
exports.showIosMenu = function() {
    try {
        gBridge.showMenuButton(true);
    } catch (e) {}

}

exports.hideIosMenu = function() {

    try {
        gBridge.showMenuButton(false);
    } catch (e) {}

}
//关闭当前webview
exports.closeWebview = function() {
    var platform = getPlatformType();

    if (platform == 'android_webview') {
        try {
            recharge.goBack();
        } catch (e) {
            alert(e.name + ":" + e.message);
        }

    } else if (platform == 'ios_webview') {
        try {
            gBridge.closeWeb();
        } catch (e) {
            alert(e.name + ":" + e.message);
        }
    } else {
        alert('请移步到客户端')
    }

}
//炸房关闭webview
exports.closeActWebview = function(ele, cb) {
    var _ele = document.querySelector(ele);
    var nodes = _ele.childNodes;
    var hasEle = false;
    for (var i = 0, len = nodes.length; i < len; i++) {
        if (nodes[i].nodeType == 1) {
            hasEle = true;
            break;
        }
    };
    if (hasEle) return;
    //没有元素&关闭webwiew
    if (typeof cb === 'function') cb();
    closeWebview();
}
//获取app version
exports.getVersion = function() {
    var version;
    if (navigator.userAgent.indexOf('guojiang_version') > 0) {
        version = navigator.userAgent.split('guojiang_version/')[1].split(' ')[0];
    } else {
        version = '0';
    }
    return version;
}


/*刷新泡泡数:
 *   addCoin字符串类型toString()
 *   isAddCoin: true或者不填  增加泡泡 ； false减少泡泡
 */
exports.refreshCoin = function(addCoin, isAddCoin) {
    var platform = getPlatformType(),
        flag = (isAddCoin || isAddCoin == null) ? '-' : '+';

    if (platform == 'android_webview') {
        try {
            recharge.refreshCoin(flag + addCoin);
        } catch (err) {;
        }
    } else if (platform == 'ios_webview') {
        try {
            gBridge.refreshCoin(flag + addCoin);
        } catch (err) {;
        }
    }
}

//刷新背包
exports.refreshBackpack = function() {
    var platform = getPlatformType();
    if (platform == 'android_webview') {
        try {
            recharge.refreshPackage();
        } catch (err) {;
        }
    } else if (platform == 'ios_webview') {
        try {
            gBridge.refreshPackage();
        } catch (err) {;
        }
    }
}

//时间戳转日期
exports.formatDate = function(num, isSecond) {
    var formatNum = new Date(parseInt(num) * 1000),
        y = formatNum.getFullYear(),
        month = (parseInt(formatNum.getMonth()) + 1) < 10 ? 0 + (formatNum.getMonth() + 1).toString() : (
            parseInt(formatNum.getMonth()) + 1),
        d = parseInt(formatNum.getDate()) < 10 ? 0 + formatNum.getDate().toString() : formatNum.getDate(),
        h = parseInt(formatNum.getHours()) < 10 ? 0 + formatNum.getHours().toString() : formatNum.getHours(),
        m = parseInt(formatNum.getMinutes()) < 10 ? 0 + formatNum.getMinutes().toString() : formatNum.getMinutes(),
        i = parseInt(formatNum.getSeconds()) < 10 ? 0 + formatNum.getSeconds().toString() : formatNum.getSeconds();
    if (isSecond) {
        return y + "-" + month + "-" + d + "   " + h + ":" + m + ":" + i;
    } else {
        return y + "-" + month + "-" + d + "   " + h + ":" + m;
    }
}

//判断活动是否开始，结束。 日期格式：2016/1/5 00:00:00
exports.isActivitying = function(startdate, enddate) {
    var start_time = new Date(startdate).getTime(),
        end_time = new Date(enddate).getTime(),
        now_time = new Date().getTime();
    if (now_time >= start_time && now_time <= end_time) {
        return 1; //活动开始
    } else if (now_time < start_time) {
        return 0; //活动还未开始
    } else {
        return 2; //活动结束
    }
}
/*
 *   timegap: 1 为 每1ms倒计时，1000为1s，默认1s
 */
var cds;

exports.countDownS = function(time, dosomething, callback, timegap) {
    var _time = time;
    if (timegap == undefined) {
        timegap = 1000;
    }
    clearTimeout(cds);
    if (_time == 0) {
        callback();
        return;
    } else {
        _time--;
        dosomething(_time);
        cds = setTimeout(function() { countDownS(_time, dosomething, callback, timegap) }, timegap);
    }

}

//验证信息
exports.regExpTest = function(content, type) {
    var regExpMap = {
            'common': /[\s\S]*/, //匹配任何内容
            'noChinese': /^[^\u4e00-\u9fa5]{0,}$/, //非中文
            'letter': /^[a-zA-Z]+([a-zA-Z]|\s)*$/, //纯字母
            'number': /^\d+$/, //匹配数字
            'numberLimit10': /^\d{10}$/, //匹配10位数字
            'creditMonth': /^(([0][1-9])|([1][0-2]))$/,
            'creditYear': /^(\d){1,2}$/,
            'creditCvc': /^(\d){3,4}$/,
            'creditNumberUSA': /^(\d){5,19}$/,
            'email': /^\w+([-.]\w+)*@\w+([-]\\w+)*\.(\w+([-]\w+)*\.)*[a-z]{2,3}$/,
            'mobile': /^1[0-9]{10}$/, //指的是中国的手机号码
            'mobileCN': /^1[0-9]{10}$/, //中国1开头的10为数字
            'mobileHK': /^[0-9]{8}$/, //香港
            'mobileMacau': /^[0-9]{8}$/, //澳门
            'mobileTW': /^[0-9]{9,10}$/, //台湾
            'password': /^[a-zA-Z0-9]{6,22}$/,
            'registPassword': /^[0-9a-zA-Z_]{6,22}$/, //验证由数字、26个英文字母或者下划线组成的密码
            'telephone': /^[+]{0,1}(\d){1,4}[ ]{0,1}([-]{0,1}((\d)|[ ]){1,12})+$/,
            'date': /^\d{4}-\d{2}-\d{2}$/, //简单日期格式判断  1990-12-12
            'hour': /^(1|0)[0-9]|2[0-3]$/, //小时格式判断        24小时制
            'minute': /^[0-5][0-9]$/ //分钟格式判断
        },
        regExpErrMap = {
            'email': '邮箱格式错误',
            'mobile': '手机格式错误',
            'letter': '请输入英文字母',
            'noChinese': '此处不允许输入中文',
            'number': '请输入正确数字',
            'numberLimit10': '请输入正确的10位数字',
            'creditMonth': '请输入2位的月数',
            'creditYear': '请输入2位的年数',
            'creditCvc': '请输入正确的验证码',
            'creditNumberUSA': '请输入正确的卡号',
            'mobileCN': '手机格式错误(中国)',
            'mobileHK': '手机格式错误(香港)',
            'mobileMacau': '手机格式错误(澳门)',
            'mobileTW': '手机格式错误(台湾)',
            'telephone': '座机格式错误',
            'password': '密码长度必须为6-22位',
            'registPassword': '密码格式错误',
            'date': '请选择日期',
            'hour': '请输入正确的小时',
            'minute': '请输入正确的分钟'
        };

    return { errno: regExpMap[type].test(content), msg: regExpErrMap[type] };
}
