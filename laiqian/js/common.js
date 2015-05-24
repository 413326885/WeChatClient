// 服务端地址
var serverUrl = "https://trade.jsfund.cn/etrading/hiswemobile/hiswemobileservice.jsp";

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


// 传递的唯一标识符
var udid = getQueryString('openid');
if(!udid) {
	// 868331010419141
	// udid=86833101041914;
	udid=getLocal('udid');
	/*if(!udid) {
		udid=86833101041914;
	}*/
}else {
	setLocal('udid', udid);
}

var token=null;
if(getLocal("userSessionVirtual")) {
	token=JSON.parse(getLocal("userSessionVirtual")).token; //获取token
}

// 接口公有参数
var publicOpts = {
	"agent": "yixin", //终端类型
	"udid": udid, //终端唯一标识
	"token":  udid, //令牌号
	"appversion": "", //程序版本号
	"cmd": "", //业务命令
	"osversion": "", //终端操作系统版本号
	"appid": "treasure", //应用编号
	"publishchannel": "yixin", //发布平台
	"custtype": "0" //虚拟真实客户类型（易信使用）
}

/**
 * 判断唯一参数是否存在
 * @param null 
 * @return boolean
 */
function isUdid (){
	return !!publicOpts.udid;
}

/**
 * 判断是否登录
 * @param null 
 * @return boolean
 */
function isLogin (){
	return !!token;
}
// 真实用户
function isLoginReality (){
	return !!getLocal("userSessionReality");
}

/**
 * 判断手机号码是否正确
 * @param $string 需要验证的字符串
 * @return boolean
 */
function isMobile(value) {
	return /^1[3|4|5|8][0-9]\d{4,8}$/.test(value);
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
			<h2 class="title">来钱提示</h2>\
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
 * 判断是否已经绑定帐号
 * @param opts 需要执行的事件对象
 */
function isBind(opts){
	var defaultOpts={
		// 虚拟绑定
		vbind: function(){},
		// 虚拟未绑定
		vunbind: function(){},
		// 真实绑定
		bind: function(){},
		// 真实未绑定
		unbind: function(){}
	}
	opts=$.extend(defaultOpts, opts);
	
	$.ajax({
		url: serverUrl,
		dataType: "json",
		data: $.extend(publicOpts, {
			"cmd": "isbind"
		}),
		type: "POST",
		success: function(data) {
			if(data.resCode == 1000){
				// 虚拟是否绑定 0：未绑定  1：已绑定
				if(data.vismbind == 1){
					opts.vbind();
				}else {
					opts.vunbind();
				}
				// 真实是否绑定 0：未绑定  1：已绑定
				if(data.realbind == 1){
					opts.bind();
				}else {
					opts.unbind();
				}
			}
		}
	});
}


// 保存页面滚动条
var myScroll=null;
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
	// 单选按钮组
	$("input:radio ~ label").on('click', function() {
		var node=$(this).siblings('input');
		var name=$(node).attr('name');
		if(name){
			$("input[name='"+name+"'] ~ label").removeClass('checked');
			$("input[name='"+name+"']").prop('checked', false);
		}
		$(this).addClass('checked');
		$(this).siblings('input').prop('checked', true);
	});
	$("input:radio").each(function() {
		if($(this).prop('checked')){
			$(this).siblings('label').addClass('checked');
		}
	}).on('click', function(e) {
		// 阻止冒泡，防止二次点击
		e.stopPropagation();
	});

	// 滚动条
	if($("#wrapper").length>0){
		if(browser.versions.android){
			myScroll = new IScroll("#wrapper",{
				scrollbars: 'custom'
			});
		}else {
			myScroll = new IScroll("#wrapper",{
				scrollbars: 'custom',
				click: true
			});
		}
	}

	$(".back_icon").on('click', function() {
		history.back();
	});
});


// 封装发送验证码
;(function($){
	$.fn.sendCode=function(options){
		var defaultOptions={
			"input": "input.username" //电话号码输入框
		}
		options=$.extend(defaultOptions,options);
		
		this.each(function(index, el) {
			// 获取验证码
			var init=null;//保存定时器
			var timeNum=60;//执行时间
			// 重置验证码按钮
			function resetGetCode(){
				clearInterval(init);
				timeNum=60;
				$(el).text("获取验证码").removeClass('disabled');
			}
			$(el).on('click', function() {
				var that = this;
				if($(that).hasClass('disabled')){
					return;
				}
				if(!isUdid()){
					myAlert("非法访问！");
					return false;
				}
				var username = $(options['input']).val();
				// 判断手机号码
				if(!isMobile(username)){
					myAlert("请输入正确的手机号码！");
					return;
				}
				// 启动定时器
				$(that).text(--timeNum + '秒').addClass('disabled');
				init=setInterval(function(){
					$(that).text(--timeNum + '秒');
					if(timeNum <= 0){
						resetGetCode();
					}
				}, 1000);
				$.ajax({
					url: serverUrl,
					dataType: "json",
					data: $.extend(publicOpts, {
						"cmd": "sendsmscode", "mobile": username, "busintype": 3
					}),
					type: "POST",
					success: function(data) {
						if(data.resCode == 1000){
							myAlert("验证码发送成功！");
						}else {
							resetGetCode();
							myAlert(data.errmsg);
						}
					}
				});
				return false;
			});
		});
	}
})(jQuery);