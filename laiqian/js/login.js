$(function(){
	// 虚拟用户登录
	var isVerifyCodeFlagV=false;
	var callbackUrl = getLocal("callbackUrl");
	clearLocal("callbackUrl");
	$("#js_submit").on('click', function() {
		var username = $("input.username").val();
		var password = $("input.password").val();
		// 判断手机号码
		if(!username){
			myAlert("请输入用户名！");
			return;
		}
		if(!password){
			myAlert("密码不能为空！");
			return;
		}
		var verifyCode = '';
		if(isVerifyCodeFlagV){
			verifyCode = $("#js_verify_code .code").val();
			if(verifyCode == ''){
				myAlert("请输入验证码！");
				return;
			}
		}
		var resData= $.extend(publicOpts, {
			"cmd": "v_vlogin2", "loginnumber": username, "loginpwd": hex_md5(password)
		});
		if(isVerifyCodeFlagV){
			resData= $.extend(publicOpts, {
				"cmd": "v_vlogin2", "loginnumber": username, "loginpwd": hex_md5(password), "identitycode" : verifyCode
			});
		}
		processing();
		$.ajax({
			url: serverUrl,
			dataType: "json",
			data: resData,
			type: "POST",
			success: function(data) {
				if(data.resCode == 1000) {
					setLocal("userSessionVirtual", JSON.stringify(data));
					setLocal("username", username);
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
								if(data.assetinfo.totalamt>0){
									if(callbackUrl) {
										document.location.href= callbackUrl;
									}else {
										document.location.href="./v_trader.html";
									}
								}else {
									document.location.href="./shake.html";
								}
							}else {
								setSession("traderBack", "false");
								if(callbackUrl) {
									document.location.href= callbackUrl;
								}else {
									document.location.href="./v_trader.html";
								}
							}
						}
					});
					/*
					setLocal("userSessionVirtual", JSON.stringify(data));
					setLocal("username", username);
					if(data.userinfo.islottery == 0) {
						document.location.href="./shake.html";
					}else {
						setSession("traderBack", "false");
						document.location.href="./v_trader.html";
					}
					*/
				}else {
					processed();
					myAlert(data.errmsg, function(){
						if(data.errmsg.indexOf("绑定") > -1){
							document.location.href="manage.html";
						}
					});
					if(data.identityurl){
						isVerifyCodeFlagV=true;
						$("#js_verify_code").show().find("img").attr("src",data.identityurl);
					}
				}
			}
		});
		return false;
	});

	
	var callbackUrlR=getLocal("callbackUrlR");
	clearLocal("callbackUrlR");
	// 真实用户登录
	var isVerifyCodeFlagR=false;
	$("#js_submit_reality").on('click', function() {
		var username = $("#idcard").val();
		var password = $("#password").val();
		// 判断手机号码
		if(!isIdCard(username)){
			myAlert("请输入正确的身份证号！");
			return;
		}
		if(!password){
			myAlert("密码不能为空！");
			return;
		}
		var verifyCode = '';
		if(isVerifyCodeFlagR){
			verifyCode = $("#js_verify_code .code").val();
			if(verifyCode == ''){
				myAlert("请输入验证码！");
				return;
			}
		}
		var resData= $.extend(publicOpts, {
			"cmd": "login", "loginnumber": username, "loginpwd": password, "logintype": "0", "custtype": 1
		});
		if(isVerifyCodeFlagR){
			resData= $.extend(publicOpts, {
				"cmd": "login", "loginnumber": username, "loginpwd": password, "logintype": "0", "custtype": 1, "identitycode" : verifyCode
			});
		}
		processing();
		$.ajax({
			url: serverUrl,
			dataType: "json",
			data: resData,
			type: "POST",
			success: function(data) {
				processed();
				// console.log(data.userinfo.custname);
				if(data.resCode == 1000) {
					// setLocal("username", username);
					setLocal("userSessionReality", JSON.stringify(data));
					setSession("traderBack", "false");
					// history.back();
					if(data.userinfo.hisopened == 0) {
						document.location.href = "perfect_info.html";
					}else {
						if(callbackUrlR) {
							document.location.href=callbackUrlR;
						}else {
							document.location.href="./trader.html";
						}
					}
				}else {
					myAlert(data.errmsg, function(){
						if(data.errmsg.indexOf("绑定") > -1){
							document.location.href="manage.html";
						}
					});
					if(data.identityurl){
						isVerifyCodeFlagR=true;
						$("#js_verify_code").show().find("img").attr("src",data.identityurl);
					}
				}
			}
		});
		return false;
	});

	// 真实用户找回密码
	$("#reality_forget").on('click', function() {
		myAlert("请拨打客服电话（400-600-8800）找回密码");
	});

});