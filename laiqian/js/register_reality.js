$(function(){
	if($("#js_bank_list").length == 0) {
		/*processing('请稍后...');
		isBind({
			vbind:function(){
				processed();
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
							if(totalamt ==0) {
								document.location.href="./shake.html";
							}
						}
					}
				});
			},
			vunbind: function(){
				processed();
				myAlert("请先注册", function(){
					setLocal("callbackUrl", document.location.href);
					document.location.href="register.html";
				});
			}
		});*/
	}
	// 提交
	$("#js_account1_submit").on('click', function() {
		var username = $("input.name").val();
		var idCard = $("input.id_card").val();
		// 判断手机号码
		if(!username){
			myAlert("请输入真实姓名！");
			return false;
		}
		if(!isIdCard(idCard)){
			myAlert("身份证号码格式有误！");
			return false;
		}
		processing();
		$.ajax({
			url: serverUrl,
			dataType: "json",
			data: $.extend(publicOpts, {
				"cmd": "exsituser", "custname": username, "identityno": idCard, "identitytype":0
			}),
			type: "POST",
			success: function(data) {
				processed();
				if(data.resCode == 1000) {
					if(data.isexsit == 0){
						$("#js_pop_box").show();
					}else {
						setSession("name", username);
						setSession("idcard", idCard);
						document.location.href="register_reality2.html";
					}
				}else {
					myAlert(data.errmsg, function(){
						if(data.errcode == "400000") {
							document.location.href="login_reality.html";
							// document.location.href="login_virtual.html";
						}
					});
				}
			}
		});
		return false;
	});
	$("#js_cancel_btn").on('click', function() {
		$("#js_pop_box").hide();
	});
	$("#js_ok_btn").on('click', function() {
		var username = $("input.name").val();
		var idCard = $("input.id_card").val();
		var loginpwd=$("#js_login_pwd").val();
		if(loginpwd==''){
			myAlert("请输入交易密码！");
			return;
		}
		processing();
		$.ajax({
			url: serverUrl,
			dataType: "json",
			data: $.extend(publicOpts, {
				"cmd": "relationcust", "loginnumber": idCard, "loginpwd": loginpwd, "logintype":0
			}),
			type: "POST",
			success: function(data) {
				if(data.resCode == 1000) {
					// 解除绑定
					$.ajax({
						url: serverUrl,
						dataType: "json",
						data: $.extend(publicOpts, {
							"cmd": "unbindinfo",
							"custtype": 1
						}),
						type: "POST",
						success: function(data) {
							// 调用真实用户登录
							$.ajax({
								url: serverUrl,
								dataType: "json",
								data: $.extend(publicOpts, {
									"cmd": "login", "loginnumber": idCard, "loginpwd": loginpwd, "logintype": "0", "custtype": 1
								}),
								type: "POST",
								success: function(data) {
									processed();
									if(data.resCode == 1000) {
										setLocal("userSessionReality", JSON.stringify(data));
										setSession("traderBack", "false");
										if(data.userinfo.hisopened == 0) {
											document.location.href = "perfect_info.html";
										}else {
											document.location.href="./trader.html";
										}
									}else {
										myAlert(data.errmsg, function(){
											if(data.errmsg.indexOf("绑定") > -1){
												document.location.href="manage.html";
												return;
											}
											document.location.href="login_reality.html";
										});
									}
								}
							});
						}
					});
					if(data.realflag == 0){// 0:开户并转收益到真实户
						// code
					}else if(data.realflag == 1){// 1:已经是真实账户只转收益
						// code
					}
				}else {
					processed();
					myAlert(data.errmsg);
				}
			}
		});
	});


	// 第二步
	// 列举支持开户的银行卡
	if($("#js_bank_list").length>0) {
		$.ajax({
			url: serverUrl,
			dataType: "json",
			data: $.extend(publicOpts, {
				"cmd": "banksinfo"
			}),
			type: "POST",
			success: function(data) {
				
				if(data.resCode == 1000) {
					var html='<option value="0">选择银行</option>';
					$.each(data.openbanks, function(index, val) {
						if(val.isopen == 1) {
							if(val.bankserial == getSession("bankserial")){
								html+='<option value="'+val.bankserial+'" selected="selected">'+val.bankname+'</option>';
							}else {
								html+='<option value="'+val.bankserial+'">'+val.bankname+'</option>';
							}
						}
					});
					$("#js_bank_list").html(html);
				}else {
					myAlert(data.errmsg);
				}
			}
		});
		$("body").on('click', function() {
			var cardNum = $("#card_num").val();
			var telNum = $("#tel_num").val();
			var riskanswer = $("input:radio:checked").val();
			var bankserial = $("#js_bank_list option:selected").val();
			setSession("accountcard", cardNum);
			setSession("telnum", telNum);
			setSession("bankserial", bankserial);
			setSession("riskanswer", riskanswer);
		});
	}

	if(!!getSession("telnum")){
		$("#tel_num").val(getSession("telnum"));
	}
	if(!!getSession("accountcard")){
		$("#card_num").val(getSession("accountcard"));
	}
	if(!!getSession("riskanswer")){
		$("input:radio").val(getSession("riskanswer"));
	}

	// 提交
	$("#js_account2_submit").on('click', function() {
		if(!isUdid()){
			myAlert("非法访问！");
			return false;
		}
		var custname = getSession("name");
		var idcard = getSession("idcard");
		var cardNum = $("#card_num").val();
		var telNum = $("#tel_num").val();
		var codeNum = $("#code_num").val();
		var riskanswer = $("input:radio:checked").val();
		var bankserial = $("#js_bank_list option:selected").val();
		var password1 = $("#password1").val();
		var password2 = $("#password2").val();
		if(bankserial == 0) {
			myAlert("银行选择有误！");
			return;
		}
		if(!custname || !idcard) {
			myAlert("真实姓名或者身份证号有误，请重新输入！")
			document.location.href="register_reality1.html";
			return;
		}
		// 判断手机号码
		if(!isMobile(telNum)){
			myAlert("请输入正确的手机号码！");
			return;
		}
		// 判断验证码是否为空
		if($.trim(codeNum) === ''){
			myAlert("请输入验证码！");
			return;
		}
		// 判断银行卡是否为空
		if($.trim(cardNum) === ''){
			myAlert("请输入银行卡号！");
			return;
		}
		// 判断密码是否为空
		if(password1 === ''){
			myAlert("请输入密码！");
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
		// 提交
		processing();
		$.ajax({
			url: serverUrl,
			dataType: "json",
			data: $.extend(publicOpts, {
				"cmd": "yxopenvalidate",
				"custname": custname, //客户姓名
				"identitytype": 0, //证件类型
				"identityno": idcard, //证件号码
				"bankacco": cardNum, //银行账号
				"mobile": telNum, //手机号码
				"bankserial": bankserial, //银行编号
				"tradepwd": password1, //交易密码
				"riskanswer": riskanswer, //风险问卷等级
				"validatecode": codeNum, //短信验证码
				"opentype": 3, //银联验证
			}),
			type: "POST",
			success: function(data) {
				processed();
				if(data.resCode == 1000){
					if(typeof data.opentype == 'string' && data.opentype.toLowerCase() == "c"){
						setSession("accountcard", cardNum);
						setSession("telnum", telNum);
						setSession("bankserial", bankserial);
						setSession("riskanswer", riskanswer);

						setLocal("errorUrl", document.location.href);
						// 保存登录时候需要的参数
						setLocal("loginnumber", idcard);
						setLocal("loginpwd", password1);

						myAlert("将跳转至银行卡安全验证页面", function() {
							setLocal("openaccountcmd", "yxopenaccount");
							document.location.href = data.url;
						});
						/*myConfirm({
							"content":"该银行卡需要您验证，是否立即验证？",
							"okFn":function(){
								document.location.href=data.url;
							}
						});*/
					}else {
						myAlert("开户成功", function(){
							// 解除绑定
							$.ajax({
								url: serverUrl,
								dataType: "json",
								data: $.extend(publicOpts, {
									"cmd": "unbindinfo",
									"custtype": 1
								}),
								type: "POST",
								success: function(data) {
									// 调用真实用户登录
									$.ajax({
										url: serverUrl,
										dataType: "json",
										data: $.extend(publicOpts, {
											"cmd": "login", "loginnumber": idcard, "loginpwd": password1, "logintype": "0", "custtype": 1
										}),
										type: "POST",
										success: function(data) {
											if(data.resCode == 1000) {
												setLocal("userSessionReality", JSON.stringify(data));
												setSession("traderBack", "false");
												document.location.href="./trader.html";
											}else {
												myAlert(data.errmsg, function(){
													if(data.errmsg.indexOf("绑定") > -1){
														document.location.href="manage.html";
														return;
													}
													document.location.href="login_reality.html";
												});
											}
										}
									});
								}
							});
						});
					}
				}else {
					myAlert(data.errmsg);
				}
			}
		});
		return false;
	});

	$("#js_get_code").sendCode({
		"input": "#tel_num"
	});

});