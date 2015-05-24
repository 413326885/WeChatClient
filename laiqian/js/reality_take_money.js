
$(function(){

	processing('请稍后...');
	isBind({
		bind: function(){
			processed();
			$.ajax({
				url: serverUrl,
				dataType: "json",
				data: $.extend(publicOpts, {
					"cmd": "custominfo",
					"custtype": 1
				}),
				type: "POST",
				success: function(data) {
					if(data.resCode == 1000) {
						$("#js_card_num").text("**** **** **** " + data.custinfo.bankacco);
						$("#js_title").text(data.custinfo.bankname).css("background-image","url(./images/common/"+hex_md5(data.custinfo.bankname)+".png)");
					}else {
						myAlert(data.errmsg, function(){
							if(data.errcode == "400000") {
								document.location.href="login_reality.html";
								// document.location.href="login_virtual.html";
							}
							if(data.errcode == "500000") {
								document.location.href="perfect_info.html";
								// document.location.href="login_virtual.html";
							}
						});
					}
				}
			});
			$.ajax({
				url: serverUrl,
				dataType: "json",
				data: $.extend(publicOpts, {
					"cmd": "latestquery",
					"custtype": "1"
				}),
				type: "POST",
				success: function(data) {
					if(data.resCode==1000){
						$("#js_count_num").text(data.incomeinfo.currentasset);
						currentasset=data.incomeinfo.currentasset;
						setLocal("currentasset", data.incomeinfo.currentasset);
					}
				}
			});
		},
		unbind: function(){
			processed();
			myAlert("请先登录", function(){
				setLocal("callbackUrlR", document.location.href);
				document.location.href="login_reality.html";
			});
		}
	});

	var currentasset=0; // 总金额


	$("#js_take_ok").on('click', function() {
		var amount = $("#amount").val();
		if(!/^\d+$/.test(amount)){
			myAlert("请输入正确的取出金额");
			return;
		}
		if(parseInt(currentasset) - parseInt(amount) <100){
			$("#js_prompt").show();
			return;
		}
		$("#value").text(amount);
		$("#js_take_pop").show();
	});
	//" 我知道了"按钮功能
	$("#js_prompt .one_ok_btn").on('click', function() {
		$("#js_prompt").hide();
	});
	// "取消"按钮
	$("#js_cancel_btn").on('click', function() {
		$("#js_take_pop").hide();
	});;
	//  “确定”按钮
	$("#js_ok_btn").on('click', function() {
		var amount = $("#amount").val();
		var pwd = $("#password").val();
		if(!pwd) {
			myAlert("请输入交易密码");
			return;
		}
		processing();
		$.ajax({
			url: serverUrl,
			dataType: "json",
			data: $.extend(publicOpts, {
				"cmd": "hisexit",
				"type": 0,
				"amount": amount,
				"tradepwd": hex_md5(pwd),
				"custtype": 1
			}),
			type: "POST",
			success: function(data) {
				processed();
				$("#password").val('');
				$("#js_take_pop").hide();
				if(data.resCode == 1000) {
					setLocal("takeAmount", amount + '元');
					myAlert("操作成功", function(){
						document.location.href="reality_take_ok.html";
					});
				}else {
					myAlert(data.errmsg, function(){
						if(data.errcode == "400000") {
							document.location.href="login_reality.html";
							// document.location.href="login_virtual.html";
						}
						if(data.errcode == "500000") {
							document.location.href="perfect_info.html";
						}
					});
				}
			}
		});
	});

	// 一键全部取出
	$("#js_take_all").on('click', function() {
		$("#js_take_pop_all").show();
	});
	// "取消"按钮
	$("#js_cancel_btn_all").on('click', function() {
		$("#js_take_pop_all").hide();
	});;
	//  “确定”按钮
	$("#js_ok_btn_all").on('click', function() {
		var pwd = $("#password_all").val();
		if(!pwd) {
			myAlert("请输入交易密码");
			return;
		}
		processing();
		$.ajax({
			url: serverUrl,
			dataType: "json",
			data: $.extend(publicOpts, {
				"cmd": "hisexit",
				"type": 1,
				"tradepwd": hex_md5(pwd),
				"custtype": 1
			}),
			type: "POST",
			success: function(data) {
				processed();
				$("#password_all").val('');
				$("#js_take_pop_all").hide();
				if(data.resCode == 1000) {
					setLocal("takeAmount", '全部');
					myAlert("操作成功", function(){
						document.location.href="reality_profit_query.html";
					});
				}else {
					myAlert(data.errmsg, function(){
						if(data.errcode == "400000") {
							document.location.href="login_reality.html";
							// document.location.href="login_virtual.html";
						}
						if(data.errcode == "500000") {
							document.location.href="perfect_info.html";
						}
					});
				}
			}
		});
	});
});