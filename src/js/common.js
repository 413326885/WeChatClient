
// 预加载图片
(new Image()).src = "./images/common/checkbox_checked.png";
(new Image()).src = "./images/common/checkbox.png";

// 操作平台
var browser = {
	versions: function() {
		var u = navigator.userAgent,
			app = navigator.appVersion;
		return { //移动终端浏览器版本信息
			ios: !! u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
			android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
			iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
			iPad: u.indexOf('iPad') > -1, //是否iPad
		};
	}(),
}

// 页面初始化需要渲染的事件
$(function(){
	// 复选框
	$("input:checkbox ~ label").on('click', function() {
		var that=this;
		var node=$(that).siblings('input');
		setTimeout(function(){
			if(browser.versions.android){
				if(!$(node).prop('checked')){
					$(that).removeClass('checked');
				}else {
					$(that).addClass('checked');
				}
			}else {
				if(!$(node).prop('checked')){
					$(node).prop('checked',true);
					$(that).addClass('checked');
				}else {
					$(node).prop('checked',false);
					$(that).removeClass('checked');
				}
			}
		}, 100);
	});
	$("input:checkbox").each(function(){
		if(!$(this).prop('checked')){
			$(this).siblings('label').removeClass('checked');
		}else {
			$(this).siblings('label').addClass('checked');
		}
	});
});

/**
 * 判断手机号码是否正确
 * @param $string 需要验证的字符串
 * @return boolean
 */
function isMobile(value) {
	return /^1[3|4|5|8][0-9]\d{4,8}$/.test(value);
}

/**
 * 判断用户名是否正确
 * @param $string 需要验证的字符串
 * @return boolean
 */
function isUserNameValid(value) {
	return /^s*[.A-Za-z0-9_-]{6,60}s*$/.test(value);
}

/**
 * 判断身份证号码是否正确
 * @param $string 需要验证的字符串
 * @return boolean
 */
function isIdCard(value) {
	return /(^\d{15}$)|(^\d{17}(\d|X|x)$)/.test(value);
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
 * 弹窗
 */
function myAlert(content, callback){
	var $c=$('<div class="pop_mask" id="js_prompt" style="z-index:999999;">\
		<div class="pop">\
			<h2 class="title">微信提示</h2>\
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
 *弹窗2
 */
function myConfirm(opts){
	var defaultOpts={
		"content": "",
		"okTxt": "确定",
		"cancelTxt":" 取消",
		"okFn": function(){},
		"cancelFn": function(){}
	}
	opts=$.extend(defaultOpts, opts);


	var $c= $('<div class="pop_mask" id="js_confirm" style="z-index:999999;">\
		<div class="pop">\
			<h2 class="title">来钱提示</h2>\
			<div class="info">\
				<p class="txt">'+opts.content+'</p>\
			</div>\
			<div class="btn_box"><a class="cancel_btn js_cancel_confirm">'+opts.cancelTxt+'</a><a class="ok_btn js_ok_confirm">'+opts.okTxt+'</a></div>\
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
	var $p=$('<div id="processing"><div class="p_content">'+(content || "处理中，请稍候...")+'</div></div>');
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

function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]);
	return null;
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