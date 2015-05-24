
$(function(){

	processing('请稍后...');
	isBind({
		bind: function(){
			$.ajax({
				url: serverUrl,
				dataType: "json",
				data: $.extend(publicOpts, {
					"cmd": "custominfo",
					"custtype": 1
				}),
				type: "POST",
				success: function(data) {
					processed();
					if(data.resCode == 1000) {
						$("#js_title").html(data.custinfo.bankname + '<i class="num">**** **** **** '+data.custinfo.bankacco+'</i>').css("background-image","url(./images/common/"+hex_md5(data.custinfo.bankname)+".png)");
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
		},
		unbind: function(){
			processed();
			myAlert("请先登录", function(){
				setLocal("callbackUrlR", document.location.href);
				document.location.href="login_reality.html";
			});
		}
	});

	// 开始来钱
	$("#js_put_submit").on('click', function() {
		var amount = $("#amount").val();
		if(!/^\d+\.?\d{0,2}$/.test(amount)){
			myAlert("请输入正确的投入金额");
			return;
		}
		if(!$("#agree").prop('checked')){
			myAlert("请阅读并同意用户协议！");
			return;
		}
		$("#value").text(amount);
		$("#js_take_pop").show();
	});
	// "取消"按钮
	$("#js_cancel_btn").on('click', function() {
		$("#js_take_pop").hide();
	});
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
				"cmd": "declare",
				"requestbala": amount,
				"tradepwd": hex_md5(pwd),
				"custtype": 1
			}),
			type: "POST",
			success: function(data) {
				processed();
				$("#password").val('');
				$("#js_take_pop").hide();
				if(data.resCode == 1000) {
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