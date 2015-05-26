
/**
 * message: "只能包含字母、数字或下划线，并以字母或下划线开头"
 */
function isUsernameValid(username) {
    return /^[a-zA-Z_][a-zA-Z0-9_]{5,}$/.test(username);
}

/**
 * message: "密码必须为8位以上，并且不能为纯数字"
 */
function isPasswordValid(password) {
    return password.length >= 8 && !(/^\d+$/.test(password));
}

/**
 * message: "图形验证码为5位"
 */
function isCaptchaValid(captcha) {
    return captcha.length == 5;
}

/**
 * message: "手机号格式不正确"
 */
function isPhoneValid(phone) {
    return /^1[0-9]{10}$/.test(phone);
}

/**
 * message: "手机验证码为6位"
 */
function isSmsVerifyCodeValid(code) {
    return code.length == 6;
}

/**
 * message: "银行卡号格式不正确"
 */
function isBankCardValid(card) {
    return /^\d{0,32}$/.test(card);
}

/**
 * message: "身份证号码格式不正确"
 */
function isIdentityValid(idCard) {
    return /^\d{17}[xX0-9]$/.test(idCard);
}

/**
 * 提示框
 */
function showTips(title, content, callback) {
    var $c=$('<div class="pop_mask" id="js_prompt" style="z-index:999999;">\
        <div class="pop">\
            <h2 class="title">'+title+'</h2>\
            <div class="info">\
                <p class="txt">'+content+'</p>\
            </div>\
            <div class="btn_box"><a class="one_ok_btn">确定</a></div>\
        </div>\
    </div>');
    $c.appendTo('body');
    $c.find('.btn_box').on('click', function() {
        if(!!callback){
            callback();
        }
        $c.remove();
    });
}

/**
 *确定、取消选择框
 */
function showDialog(opts){
    var defaultOpts={
        "title": "提示",
        "content": "",
        "okTxt": "确定",
        "cancelTxt":" 取消",
        "okFn": function(){},
        "cancelFn": function(){}
    }
    opts=$.extend(defaultOpts, opts);


    var $c= $('<div class="pop_mask" id="js_confirm" style="z-index:999999;">\
        <div class="pop">\
            <h2 class="title">'+opts.title+'</h2>\
            <div class="info">\
                <p class="txt">'+opts.content+'</p>\
            </div>\
            <div class="btn_box">\
                <a class="cancel_btn js_cancel_confirm">'+opts.cancelTxt+'</a>\
                <a class="ok_btn js_ok_confirm">'+opts.okTxt+'</a>\
            </div>\
        </div>\
    </div>');

    $c.appendTo('body');

    $c.find('.js_cancel_confirm').on('click', function() {
        $c.remove();
        opts.cancelFn();
    });
    $c.find('.js_ok_confirm').on('click', function() {
        $c.remove();
        opts.okFn();
    });
}

/**
 *点击之后的处理中
 */
function processing(content){
	var $p=$('<div id="processing"><div class="p_content">'+(content || "，请稍候...")+'</div></div>');
	$p.appendTo('body');
}

/**
 *处理完成
 */
function processed(){
	$("#processing").remove();
}


/**
 * 获取url参数
 * @param $string 需要获取的url字段名字
 * @return string
 */

function getUrlParameter(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]);
	return null;
}

/**
 * 写入sessionStorage缓存
 * @param key
 * @param data
 */
function setSession(key,data){
	sessionStorage.setItem(key,data);
}

/**
 * 读取sessionStorage缓存
 * @param key
 * @returns
 */
function getSession(key){
	return sessionStorage.getItem(key);
}


/**
 * 写入localStorage缓存
 * @param key
 * @param data
 */
function setLocal(key,data){
	localStorage.setItem(key,data);
}

/**
 * 读取localStorage缓存
 * @param key
 * @returns
 */
function getLocal(key){
	return localStorage.getItem(key);
}

/**
 * 清除localStorage
 * @param key
 * @returns
 */
function clearLocal(key){
	return localStorage.removeItem(key);
}