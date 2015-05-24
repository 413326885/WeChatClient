
$(function(){

	// 判断是否绑定
	processing('请稍后...');
	isBind({
		vbind: function(){
			$.ajax({
				url: serverUrl,
				dataType: "json",
				data: $.extend(publicOpts, {
					"cmd": "v_latestquery"
				}),
				type: "POST",
				success: function(data) {
					processed();
					if(data.resCode==1000){
						$("#js_yestincome").text(data.incomeinfo.yestincome);
						$("#js_stockincome").text(data.incomeinfo.stockincome);
						$("#js_bondincome").text(data.incomeinfo.bondincome);
						$("#js_moneyincome").text(data.incomeinfo.moneyincome);
						$("#js_currentasset").text(data.incomeinfo.currentasset);
						$("#js_remaindays").text(data.incomeinfo.remaindays);
						$("#js_period").text(data.incomeinfo.period);
						$("#js_totalincome").text(data.incomeinfo.totalincome);
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
	});

	$("#js_account_btn").on('click', function() {
		if(JSON.parse(getLocal("userSessionVirtual")).userinfo.bunded - 0  === 0) {
			$("#js_pop").show();
			return false;
		}
	});
	$("#js_cancel_btn").on('click', function() {
		$("#js_pop").hide();
	});
	$("#js_ok_btn").on('click', function() {
		document.location.href="login_reality.html";
	});
});