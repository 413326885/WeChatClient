$(function(){
	
	// 提交注册
	$("#js_submit").on('click', function() {
		if(!isUdid()){
			myAlert("非法访问！");
			return false;
		}
		var username = $("input.username").val();
		var code = $("input.code").val();
		var password1 = $("input.password1").val();
		var password2 = $("input.password2").val();
		// 判断手机号码
		if(!isMobile(username)){
			myAlert("请输入正确的手机号码！");
			return;
		}
		// 判断验证码是否为空
		if($.trim(code) === ''){
			myAlert("请输入验证码！");
			return;
		}
		// 判断密码输入是否一致
		if(password1 !== password2){
			myAlert("两次密码输入不一致！");
			return;
		}
		if(!$("#agree").prop('checked')){
			myAlert("请阅读并同意用户协议！");
			return;
		}
		// 判断验证码是否正确
		processing();
		$.ajax({
			url: serverUrl,
			dataType: "json",
			data: $.extend(publicOpts, {
				"cmd": "validatesmscode", "mobile": username, "validatecode": code
			}),
			type: "POST",
			success: function(data) {
				clearLocal("callbackUrl");
				if(data.resCode == 1000){
					// 验证成功
					$.ajax({
						url: serverUrl,
						dataType: "json",
						data: $.extend(publicOpts, {
							"cmd": "v_register2", "mobile": username, "loginpwd": hex_md5(password1), "validatecode": code
						}),
						type: "POST",
						success: function(data) {
							processed();
							if(data.resCode == 1000){
								clearLocal("shaketimes");
								myAlert("注册成功！", function(){
									$.ajax({
										url: serverUrl,
										dataType: "json",
										data: $.extend(publicOpts, {
											"cmd": "v_vlogin2", "loginnumber": username, "loginpwd": hex_md5(password1)
										}),
										type: "POST",
										success: function(data) {
											if(data.resCode == 1000) {
												setLocal("userSessionVirtual", JSON.stringify(data));
												setLocal("username", username);
												document.location.href="shake.html";
											}else {
												myAlert(data.errmsg, function(){
													if(data.errmsg.indexOf("绑定") > -1){
														document.location.href="manage.html";
														return;
													}
													document.location.href="login_virtual.html";
												});
											}
										}
									});
								});
							}else {
								myAlert(data.errmsg);
							}
						}
					});
				}else {
					processed();
					myAlert("验证码错误！");
				}
			}
		});
		return false;
	});
	// 获取验证码
	$("#js_get_code").sendCode({
		"input": "input.username"
	});



	// 忘记密码提交
	$("#js_forgetPW_submit").on('click', function() {
		if(!isUdid()){
			myAlert("非法访问！");
			return false;
		}
		var username = $("input.username").val();
		var code = $("input.code").val();
		var password1 = $("input.password1").val();
		var password2 = $("input.password2").val();
		// 判断手机号码
		if(!isMobile(username)){
			myAlert("请输入正确的手机号码！");
			return;
		}
		// 判断验证码是否为空
		if($.trim(code) === ''){
			myAlert("请输入验证码！");
			return;
		}
		// 判断密码输入是否一致
		if(password1 !== password2){
			myAlert("两次密码输入不一致！");
			return;
		}
		// 提交
		processing();
		$.ajax({
			url: serverUrl,
			dataType: "json",
			data: $.extend(publicOpts, {
				"cmd": "validatesmscode", "mobile": username, "validatecode": code
			}),
			type: "POST",
			success: function(data) {
				processed();
				if(data.resCode == 1000){
					// 验证成功
					$.ajax({
						url: serverUrl,
						dataType: "json",
						data: $.extend(publicOpts, {
							"cmd": "forgetchangepwd", "mobile": username, "newpwd": hex_md5(password1), "confnewpwd": hex_md5(password1)
						}),
						type: "POST",
						success: function(data) {
							if(data.resCode == 1000){
								myAlert("修改成功！", function(){
									document.location.href="login_virtual.html";
								});
							}else {
								myAlert(data.errmsg);
							}
						}
					});
				}else {
					myAlert(data.errmsg);
				}
			}
		});
		return false;
	});
	
	// 修改密码
	$("#js_changePW_submit").on('click', function() {
		if(!isUdid()){
			myAlert("非法访问！");
			return false;
		}
		var oldpwd = $("input.oldpwd").val();
		var password1 = $("input.password1").val();
		var password2 = $("input.password2").val();
		// 判断密码输入是否一致
		if(password1 !== password2){
			myAlert("两次密码输入不一致！");
			return;
		}
		processing();
		$.ajax({
			url: serverUrl,
			dataType: "json",
			data: $.extend(publicOpts, {
				"cmd": "v_updatepwd", "oldpwd": hex_md5(oldpwd), "newpwd": hex_md5(password1), "confnewpwd": hex_md5(password1)
			}),
			type: "POST",
			success: function(data) {
				processed();
				if(data.resCode == 1000){
					myAlert("修改成功！", function(){
						document.location.href="v_trader.html";
					});
				}else {
					myAlert(data.errmsg);
				}
			}
		});
	});
});