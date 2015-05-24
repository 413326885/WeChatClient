
var SHAKE_THRESHOLD = 3000;
var last_update = 0;
var x = y = z = last_x = last_y = last_z = 0;
var flag = true;
var glass=hongbao=null;

var shaketimes=1;//摇奖次数
if(getLocal("shaketimes")) {
	shaketimes=getLocal("shaketimes"); //获取次数
}
/*if(shaketimes > 3) {
	document.location.href="./v_trader.html";
}*/
var maxMoney=0;


function init() {
	if (window.DeviceMotionEvent) {
		window.addEventListener('devicemotion', deviceMotionHandler, false);
	} else {
		myAlert('您的手机不支持摇一摇功能！');
	}
}


function deviceMotionHandler(eventData) {
	if(glass) {
		$(glass).remove();
	}
	if(hongbao) {
		$(hongbao).remove();
	}
	var acceleration = eventData.accelerationIncludingGravity;
	var curTime = new Date().getTime();
	if ((curTime - last_update) > 100) {
		var diffTime = curTime - last_update;
		last_update = curTime;
		x = acceleration.x;
		y = acceleration.y;
		z = acceleration.z;
		var speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;

		if (speed > SHAKE_THRESHOLD) {
			if(!flag) {
				return;
			}
			flag = false;
			glass = $("<audio/>",{
				"class" : "musicBox",
				"preload" : "auto",
				"autoplay" : "autoplay",
				"src" : "./images/shake/glass.wav"
			}).appendTo('body');
			navigator.vibrate = navigator.vibrate ||
				navigator.webkitVibrate ||
				navigator.mozVibrate ||
				navigator.msVibrate;
			if(navigator.vibrate) {
				navigator.vibrate([100]);
			}
			setTimeout(function(){ // 向服务器请求数据，请求成功之后响应
				$.ajax({
					url: serverUrl,
					dataType: "json",
					data: $.extend(publicOpts, {
						"cmd": "v_lottery2", "shaketimes": shaketimes++
					}),
					type: "POST",
					success: function(data) {
						if(data.resCode==1000){
							hongbao = $("<audio/>",{
								"class" : "musicBox",
								"preload" : "auto",
								"autoplay" : "autoplay",
								"src" : "./images/shake/hongbao.wav"
							}).appendTo('body');
							var $js_shake_show = $("#js_shake_show").css("visibility","visible");
							$js_shake_show.find(".money").html(data.amount+".00<i>元</i>");
							if(data.amount > maxMoney) {
								maxMoney = data.amount;
							}
							var num = 3-(shaketimes-1);
							if(num == 0) {
								$("#js_shake_ok").html("你摇出的最高金额为"+maxMoney+"元<br>虚拟本金到手");
							}else {
								$("#js_shake_ok").html("你摇出的最高金额为"+maxMoney+"元<br>你还有"+num+"次机会");
							}
						}else {
							myAlert(data.errmsg, function(){
								if(data.errcode == "400000") {
									// document.location.href="login_reality.html";
									document.location.href="login_virtual.html";
								}
							});
						}
					}
				});
				setLocal("shaketimes", shaketimes); //保存次数
			}, 3000);
		}
		last_x = x;
		last_y = y;
		last_z = z;
	}
}
$(function(){
	processing('请稍后...');
	isBind({
		vbind: function(){
			$.ajax({
				url: serverUrl,
				dataType: "json",
				data: $.extend(publicOpts, {
					"cmd": "v_currentconfigquery"
				}),
				type: "POST",
				success: function(data) {
					processed();
					if(data.resCode==1000){
						var totalamt = data.assetinfo.totalamt;
						if(totalamt-0 != 0) {
							document.location.href="./v_trader.html";
						}else {
							// 启动摇一摇
							if(totalamt == 0) {
								// shaketimes = 1;
							}
							maxMoney = totalamt;
							init();
						}
					}else {
						myAlert(data.errmsg, function(){
							if(data.errcode == "400000") {
								// document.location.href="login_reality.html";
								document.location.href="login_virtual.html";
							}
						});
					}
				}
			});
		},
		vunbind: function(){
			processed();
			myAlert("请先注册", function(){
				document.location.href="./register.html";
			});
		}
	});
	// 点击事件
	$("#js_shake_show").on('click', function() {
		flag = true;
		if(glass) {
			$(glass).remove();
		}
		if(hongbao) {
			$(hongbao).remove();
		}

		if(shaketimes>3){
			clearLocal("shaketimes");
			document.location.href="./v_trader.html";
		}
		$("#js_shake_show").css("visibility","hidden");
	});

	var clickFlag=true;
	$(".phone_box").on('click', function() {
		if(!clickFlag) {
			return false;
		}
		clickFlag=false;
		processing();
		glass = $("<audio/>",{
			"class" : "musicBox",
			"preload" : "auto",
			"autoplay" : "autoplay",
			"src" : "./images/shake/glass.wav"
		}).appendTo('body');

		setTimeout(function(){ // 向服务器请求数据，请求成功之后响应
			$.ajax({
				url: serverUrl,
				dataType: "json",
				data: $.extend(publicOpts, {
					"cmd": "v_lottery2", "shaketimes": shaketimes++
				}),
				type: "POST",
				success: function(data) {
					clickFlag=true;
					processed();
					if(data.resCode==1000){
						hongbao = $("<audio/>",{
							"class" : "musicBox",
							"preload" : "auto",
							"autoplay" : "autoplay",
							"src" : "./images/shake/hongbao.wav"
						}).appendTo('body');
						var $js_shake_show = $("#js_shake_show").css("visibility","visible");
						$js_shake_show.find(".money").html(data.amount+".00<i>元</i>");
						if(data.amount > maxMoney) {
							maxMoney = data.amount;
						}
						var num = 3-(shaketimes-1);
						if(num == 0) {
							$("#js_shake_ok").html("你摇出的最高金额为"+maxMoney+"元<br>虚拟本金到手");
						}else {
							$("#js_shake_ok").html("你摇出的最高金额为"+maxMoney+"元<br>你还有"+num+"次机会");
						}
					}else {
						myAlert(data.errmsg, function(){
							if(data.errcode == "400000") {
								// document.location.href="login_reality.html";
								document.location.href="login_virtual.html";
							}
						});
					}
				}
			});
			setLocal("shaketimes", shaketimes); //保存次数
		}, 3000);
	});
});